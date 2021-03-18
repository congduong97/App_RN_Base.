//Library:
import React, {useEffect, useState, useContext} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';
import hexToRgba from 'hex-to-rgba';
import RNFetchBlob from 'rn-fetch-blob';

//Setup:
import {AppText} from '../../elements/AppText';
import {
  SIZE,
  COLOR,
  FetchApi,
  isIos,
  ToastService,
  AsyncStoreKey,
} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {TouchableCo, AppContainer} from '../../elements';
import {TimeResentOTP} from './item/TimeResentOTP';
import {AccountService} from '../../utils/services/AccountService';
import {InputOTP} from './item/InputOTP';
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';

//Services:
function ActiveOTP({route}) {
  //Chú ý màn hình này dùng cho 5 chức năng bao gồm:Đăng kí,Quên mật khẩu, Quên mật khẩu ứng dụng (Security) , Đổi số điện thoại, Login
  //Mỗi chức năng tương ứng sẽ có otpType tương ứng truyền sang để đối ứng API.
  //Yêu cầu các param gửi sang màn hình OTP dùng chung gồm:
  //+ Số điện thoại: phoneNumber.
  //+Mã người dùng: memberId.
  //+Key màn hình để biết từ màn nào truyền sang :otpType.
  //Màn hình OTP này có trường hợp đặc biệt dành cho trường hợp Auto Login=> Sau khi đăng kí thành công.
  const {
    phoneNumber,
    memberId,
    otpType,
    passWord,
    accountNomalLogin,
  } = route.params;
  const navigation = useNavigation();
  const {goBack} = navigation;
  const [OTP, setStateOTP] = useState('');
  const [checkReSentOTP, setStateResentOTP] = useState(false);
  const [checkActiveOTP, setCheckAvtiveOTP] = useState(false);
  const [checkLoginAccount, setStateChecklogin] = useState(false);
  const {colorApp} = useContext(ContextContainer);

  useEffect(() => {
    saveAccountActiveOTP('NOT_ACTIVE_OTP');
    checkLogin();
    return () => {};
  }, []);

  //Kiểm tra đăng nhập:
  const checkLogin = () => {
    let accountLogin = AccountService.getAccount();
    if (accountLogin) {
      setStateChecklogin(true);
    }
  };

  //Lưu lại tài khoản login khi mà xịt thì tự động login lại sang màn hình kích hoạt OTP:
  const saveAccountActiveOTP = (keyActiveOtp) => {
    const accountActiveOTP = {
      phoneLogin: phoneNumber,
      passLogin: passWord,
      activeOTP: keyActiveOtp,
      otpType: otpType,
    };
    AsyncStorage.setItem(
      AsyncStoreKey.accountActiveOTPLogin,
      JSON.stringify(accountActiveOTP),
    );
  };

  //Lấy mã OTP:
  const getOTP = (inputOTP) => {
    if (inputOTP && inputOTP.length == 6) {
      setStateOTP(inputOTP);
      setCheckAvtiveOTP(true);
    } else {
      setCheckAvtiveOTP(false);
    }
  };

  //Sau khi kích hoạt mã OTP thành công sẽ xử lý navigate tiếp thep cho từng màn hình tương ứng:
  const onActiveScreen = () => {
    switch (otpType) {
      case 'REGISTER':
        return activeOTPRegisAutoLogin();
      case 'LOGIN':
        return activeOTPNomalLogin();
      case 'FORGOT_PASSWORD':
        return activeOTPForgotPassWord();
      case 'FORGOT_PASSCODE':
        return activeOTPForgotPassCode();
      case 'CHANGE_PHONE':
        return activeOTPChangePhone();
    }
  };

  //Sự kiện gửi lại OTP
  const onPressResentOTP = async () => {
    setStateResentOTP(true);
    const response = await FetchApi.resentOTP(otpType, phoneNumber, memberId);
    if (response && response.success) {
      setStateOTP('');
      ServicesUpdateComponent.set('RESET_FORM_INPUT_OTP');
    }
  };

  //Bộ đếm thời gian gửi lại mã OTP:
  const endWaitingTime = () => {
    setStateResentOTP(false);
  };

  //Đăng kí thành công, kích hoạt OTP thành công tự động call API login và chuyển đến Home:
  const activeOTPRegisAutoLogin = async () => {
    const typeLogin = 'AUTO_LOGIN'; //Không được phép di chuyển biến này!(Chỉ dùng trong case này!)
    const response = await FetchApi.login(phoneNumber, passWord, typeLogin);
    if (response && response.success && response.data.memberId) {
      response.data.password = passWord;
      AccountService.updateAccount(response.data);
      navigation.reset({
        routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
      });
    } else {
      ToastService.showToast('新規会員登録が完了しました。');
    }
  };

  const downLoadCertificateImageUrl = (certificateImageUrl) => {
    RNFetchBlob.config({fileCache: true})
      .fetch('GET', certificateImageUrl)
      .then(async (res) => {
        const uri = isIos ? res.path() : 'file://' + res.path();
        await AsyncStorage.setItem(AsyncStoreKey.certificateImageUrl, `${uri}`);
      })
      .catch(async (err) => {
        await AsyncStorage.setItem(AsyncStoreKey.certificateImageUrl, '');
      });
  };

  const downLoadBarcodeUrl = (barcodeUrl) => {
    RNFetchBlob.config({fileCache: true})
      .fetch('GET', barcodeUrl)
      .then(async (res) => {
        const uri = isIos ? res.path() : 'file://' + res.path();
        await AsyncStorage.setItem(AsyncStoreKey.barcodeUrl, `${uri}`);
      })
      .catch(async (err) => {
        await AsyncStorage.setItem(AsyncStoreKey.barcodeUrl, '');
      });
  };

  //Login thường thành công và kích hoạt OTP chuyển đến HOME:
  const activeOTPNomalLogin = async () => {
    if (accountNomalLogin) {
      const {certificateImageUrl, barcodeUrl} = accountNomalLogin;
      accountNomalLogin.password = passWord;
      AccountService.updateAccount(accountNomalLogin);
      if (certificateImageUrl && barcodeUrl) {
        await downLoadCertificateImageUrl(certificateImageUrl);
        await downLoadBarcodeUrl(barcodeUrl);
      }
      navigation.reset({
        routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
      });
    } else {
      ToastService.showToast('新規会員登録が完了しました。');
    }
  };

  //Quên mật khẩu:
  const activeOTPForgotPassWord = () => {};

  //Quên mật khẩu ứng dụng:
  const activeOTPForgotPassCode = () => {};

  //Thay đổi số điện thoại:
  const activeOTPChangePhone = () => {
    if (accountNomalLogin) {
      accountNomalLogin.phone = phoneNumber;
      accountNomalLogin.username = phoneNumber;
      AccountService.updateAccount(accountNomalLogin);
      navigation.reset({
        routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
      });
    }
  };

  //Kích hoạt mã OTP:
  const activeOTP = async () => {
    setCheckAvtiveOTP(false);
    if (OTP && OTP.length == 6) {
      //Nhập 6 số có gắn thêm token:
      if (otpType == 'CHANGE_PHONE') {
        const needToken = checkLoginAccount;
        const response = await FetchApi.activeOTP_SMS(
          OTP,
          phoneNumber,
          otpType,
          needToken,
        );
        if (response && response.status_code == 200 && response.code == 1000) {
          onActiveScreen();
        } else {
          ToastService.showToast('認証コードが正しくありません。');
          setCheckAvtiveOTP(true);
        }
      } else {
        const response = await FetchApi.activeOTP_SMS(
          OTP,
          phoneNumber,
          otpType,
        );
        if (response && response.status_code == 200 && response.code == 1000) {
          if (otpType == 'LOGIN') {
            saveAccountActiveOTP('ACTIVE_OTP');
          }
          onActiveScreen();
        }
        if (response && response.status_code == 200 && response.code == 1043) {
          ToastService.showToast('認証コードが正しくありません。');
          setCheckAvtiveOTP(true);
          return;
        }
        if (response && response.message == 'Network request failed') {
          setCheckAvtiveOTP(true);
          ToastService.showToast(
            'ネットワークに接続できませんでした。後でやり直してください。',
          );
        }
      }
    }
  };

  const showEndText = () => {
    return (
      <View style={{marginTop: SIZE.width(2)}}>
        <AppText style={styles.endText}>
          端末により操作方法が異なる場合があります。上記でも受信できない場合は、ご契約の携帯キャリア各店舗、または各キャリアのコールセンターへお問い合わせください。
        </AppText>
      </View>
    );
  };
  //Hiển thị dòng text chú ý cho 2 hệ điều hành:
  const renderTextImportant = () => {
    if (isIos) {
      return (
        <>
          <AppText style={styles.textPlatform}>
            「設定」→「通知」→表示されているアプリ中から「メッセージ」を選択→「通知を許可」をONにする
          </AppText>
          {showEndText()}
        </>
      );
    } else {
      return (
        <>
          <AppText style={styles.textPlatform}>
            「設定」→「音と通知」→「アプリの通知」→表示されているアプリの中から「メッセージ」を選択→「ブロック」をOFFにする
          </AppText>
          {showEndText()}
        </>
      );
    }
  };
  //Phần chú ý cửa màn hình:
  const boxImportantScreen = () => {
    return (
      <View
        style={{
          width: SIZE.width(92),
          marginLeft: SIZE.width(4),
          borderWidth: 2,
          borderColor: COLOR.red,
          marginTop: SIZE.width(5),
        }}>
        <AppText
          style={{fontSize: SIZE.H5, padding: SIZE.width(3), color: COLOR.red}}>
          ご注意
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5,
            color: COLOR.red,
            fontWeight: 'bold',
            marginLeft: SIZE.width(3),
          }}>
          SMSが受信できない場合に考えられる原因
        </AppText>
        <AppText
          style={{
            fontSize: 16,
            color: COLOR.red,
            fontWeight: 'bold',
            marginLeft: SIZE.width(3),
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.red,
            marginTop: SIZE.width(2),
          }}>
          {isIos ? '【IOSの場合】' : '【Androidの場合】'}
        </AppText>
        {renderTextImportant()}
      </View>
    );
  };

  //Sửa lỗi 1 số máy textInput nhỏ khó focus vào:
  const setOnFocusTextInputOTP = () => {
    ServicesUpdateComponent.set('ON_FOCUS_TEXT_INPUT_OTP');
  };

  //Tiêu đề màn hình:
  const renderTextSMS = () => {
    const endPhone = phoneNumber.slice(8, 11);
    return (
      <AppText
        style={{
          fontSize: SIZE.H4 * 0.9,
          marginLeft: SIZE.width(6),
          marginRight: SIZE.width(6),
          marginTop: SIZE.width(10),
        }}>
        ご登録の末尾が「{endPhone}
        」の携帯電話番号にSMSを送信しました。SMS本文の認証コードをご入力ください。
      </AppText>
    );
  };

  //Gửi lại mã OTP
  const resendOTPCodeActiveNumberPhone = () => {
    return (
      <>
        {checkReSentOTP ? (
          <TimeResentOTP endWaitingTime={endWaitingTime} />
        ) : null}
      </>
    );
  };

  //Render:
  return (
    <AppContainer
      goBackScreen
      haveTitle
      nameScreen="SMS認証"
      style={{backgroundColor: colorApp.backgroundColor}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderTextSMS()}
        <AppText
          style={{
            fontSize: SIZE.H4,
            color: COLOR.black,
            marginLeft: SIZE.width(5),
            marginTop: SIZE.width(6),
          }}>
          SMS認証コード
        </AppText>
        {/* Ô nhập mã OTP */}
        <TouchableOpacity
          hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
          onPress={setOnFocusTextInputOTP}
          style={styles.containerInputOTP}
          activeOpacity={1}>
          <InputOTP getOTP={getOTP} />
        </TouchableOpacity>
        {/* Bộ đếm thời gian cho phép gửi lại mã OTP */}
        <View
          style={{
            marginTop: SIZE.width(3),
            width: SIZE.width(90),
            alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View style={{width: isIos ? SIZE.width(42) : SIZE.width(35)}} />
          {resendOTPCodeActiveNumberPhone()}
        </View>
        {/* Nút gửi lại mã OTP */}
        <View style={styles.containerButtonResentOTP}>
          <View />
          <TouchableCo
            disabled={checkReSentOTP ? true : false}
            onPress={onPressResentOTP}>
            <AppText
              style={{
                fontSize: SIZE.H4,
                color: checkReSentOTP ? COLOR.grey_400 : COLOR.COLOR_BLUE,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: checkReSentOTP
                  ? COLOR.grey_500
                  : COLOR.COLOR_BLUE,
              }}>
              SMS認証コード再送
            </AppText>
          </TouchableCo>
        </View>
        {/* Nút xác nhận kích hoạt OTP */}
        <TouchableCo
          onPress={activeOTP}
          disabled={checkActiveOTP ? false : true}
          style={{
            height: SIZE.width(10),
            width: SIZE.width(92),
            backgroundColor: checkActiveOTP
              ? colorApp.backgroundColorButton
              : hexToRgba(colorApp.backgroundColorButton, '0.4'),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SIZE.width(3),
            borderRadius: 5,
            marginLeft: SIZE.width(4),
          }}>
          <AppText style={{padding: 3, color: COLOR.white, fontSize: 18}}>
            認証
          </AppText>
        </TouchableCo>
        {/* Nút quay lại màn hình trước */}
        <TouchableCo
          onPress={goBack}
          style={{
            height: SIZE.width(10),
            width: SIZE.width(92),
            backgroundColor: COLOR.grey_400,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SIZE.width(5),
            borderRadius: 5,
            marginLeft: SIZE.width(4),
          }}>
          <AppText style={{padding: 3, color: COLOR.white, fontSize: 18}}>
            戻る
          </AppText>
        </TouchableCo>
        {/* Phần chú ý của màn hình: */}
        {boxImportantScreen()}
        <View style={{height: SIZE.width(10)}} />
      </ScrollView>
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  containerInputOTP: {
    height: SIZE.width(10),
    width: SIZE.width(92),
    borderWidth: 1,
    borderColor: COLOR.grey_700,
    marginLeft: SIZE.width(4),
    borderRadius: 8,
    marginTop: SIZE.width(3),
    flexDirection: 'row',
    alignItems: 'center',
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.grey_400,
    color: '#519873',
    fontSize: 20,
  },
  containerButtonResentOTP: {
    height: SIZE.width(10),
    width: SIZE.width(96),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textPlatform: {
    marginLeft: SIZE.width(2),
    fontSize: isIos ? SIZE.H5 * 1.1 : SIZE.H5,
    marginTop: SIZE.width(0.5),
    marginRight: SIZE.width(2),
    color: COLOR.red,
  },
  endText: {
    marginLeft: SIZE.width(3),
    fontSize: isIos ? SIZE.H5 * 1.1 : SIZE.H5 * 0.9,
    marginTop: SIZE.width(0.5),
    marginBottom: SIZE.width(2),
    marginRight: SIZE.width(3),
    color: COLOR.red,
  },
});
export default ActiveOTP;
