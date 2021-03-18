//Library:
import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, COLOR, FetchApi, isIos} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {STRING} from '../../../utils/constants/String';

//Component:
import {InputOTP} from './InputOTP';
import {TimeResentOTP} from './TimeResentOTP';
import {TouchableCo, AppHeader, AppTextButton} from '../../../elements';

//Services:
import {AccountService} from '../../../utils/services/AccountService';
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';
import {OtpService} from '../services/OtpService';

//Services:
function OtpChangeEmail() {
  const otpType = 'CHANGE_EMAIL';
  const navigation = useNavigation();
  const route = useRoute();
  const {email} = route.params;
  const [OTP, setStateOTP] = useState('');
  const [checkReSentOTP, setStateResentOTP] = useState(false);
  const [messOTPAPI, setStateMessOTPAPI] = useState('');
  const submitBtn = useRef(null);
  const [disableHour, setdisableHour] = useState(false);
  const timer = useRef();
  const timerLeft = useRef(0);
  const timerConfirmOtp = useRef(0);
  useEffect(() => {
    checkMailInBlack();
    return () => {};
  }, []);

  useEffect(() => {
    if (disableHour) {
      timer.current = setTimeout(() => {
        setStateMessOTPAPI('');
        setStateResentOTP(false);
        setdisableHour(false);
        OtpService.remove(email);
        OtpService.removeCount(email);
      }, timerLeft.current);
    }

    return () => {
      clearInterval(timer.current);
      clearTimeout(timerConfirmOtp.current);
    };
  }, [disableHour]);

  const checkMailInBlack = async () => {
    const listTime = OtpService.get();
    const countOtp = OtpService.getCountOtp(email);
    if (email in listTime) {
      timerLeft.current = listTime[email] - Date.now();
      if (timerLeft.current > 0) {
        setStateMessOTPAPI(
          '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。',
        );
        setdisableHour(true);
        setStateResentOTP(true);
        OtpService.updateCount(email, 3);
      } else {
        OtpService.removeCount(email);
        OtpService.remove(email);
      }
    } else if (countOtp > 2) {
      const mail0bj = {email, timeEnd: 3600000 + Math.floor(Date.now())};
      OtpService.updateBlackList(mail0bj);
      timerLeft.current = 3600000;
      setStateMessOTPAPI(
        '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。',
      );
      setdisableHour(true);
      setStateResentOTP(true);
    }
  };

  //Lấy mã OTP:
  const getOTP = (inputOTP) => {
    setStateOTP(inputOTP);
  };

  //Quay lại màn hình Mypage:
  const comeBackMypage = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
  };

  //Gửi lại mã OTP:
  const onPressResentOTP = async () => {
    const countOtp = OtpService.getCountOtp(email);
    if (countOtp + 1 < 3) {
      const response = await FetchApi.resentOTP(otpType, email);
      if (response && response.code === 1000) {
        OtpService.updateCount(email);
        setStateOTP('');
        setStateMessOTPAPI('');
        ServicesUpdateComponent.set('RESET_FORM_INPUT_OTP');
      } else {
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          setStateMessOTPAPI(STRING.network_error_try_again_later);
        } else {
          setStateMessOTPAPI('');
        }
      }
    } else {
      const mail0bj = {email, timeEnd: 3600000 + Math.floor(Date.now())};
      OtpService.updateBlackList(mail0bj);
      timerLeft.current = 3600000;
      setStateMessOTPAPI(
        '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。',
      );
      setdisableHour(true);
    }

    setStateResentOTP(true);
  };

  //Bộ đếm thời gian gửi lại mã OTP:
  const endWaitingTime = () => {
    setStateResentOTP(false);
  };

  //Đổi email thành công:
  const activeOTPChangeEmailSuccess = async () => {
    const accountLogin = AccountService.getAccount();
    accountLogin.email = email;
    AccountService.updateAccount(accountLogin);
    navigation.navigate(keyNavigation.CONFIRM_MESS, {
      key: 'CHANGE_EMAIL',
    });
  };

  //Kích hoạt mã OTP:
  const activeOTP = async () => {
    submitBtn.current.setLoadingValue(true);
    //Không nhập mã OTP:
    if (!OTP) {
      setStateMessOTPAPI(STRING.need_otp);
      submitBtn.current.setLoadingValue(false);
      return;
    }
    //Mã OTP không đủ 6 kí tự:
    if (OTP && OTP.length != 6) {
      setStateMessOTPAPI(STRING.otp_wrong);
      submitBtn.current.setLoadingValue(false);
      return;
    }

    //OTP đủ 6 kí tự:
    if (OTP && OTP.length == 6) {
      const response = await FetchApi.activeOTP_SMS(OTP, email, otpType, true);
      if (response && response.status_code == 200 && response.code == 1000) {
        setStateMessOTPAPI('');
        setStateResentOTP(false);
        activeOTPChangeEmailSuccess();
      } else {
        if (response && response.code == 1043) {
          setStateMessOTPAPI(STRING.otp_wrong);
          console.log(STRING.otp_wrong);
        }
        if (response && response.code == 502) {
          setStateMessOTPAPI(STRING.server_maintain);
        }
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          setStateMessOTPAPI(STRING.network_error_try_again_later);
        }
      }
    }
    timerConfirmOtp.current = setTimeout(() => {
      submitBtn.current.setLoadingValue(false);
    }, 1000);
  };

  //Tiêu đề màn hình:
  const renderTextTitleSMS = () => {
    return (
      <View>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.2,
            marginLeft: SIZE.width(4),
            marginRight: SIZE.width(4),
            marginTop: SIZE.width(10),
            color: COLOR.COFFEE_BROWN_LIGHT,
          }}>
          入力された新しいメールアドレス宛に認証コード
          を送信しました。記載の認証コードを入力し、
          メールアドレスの変更を完了してください。
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.07,
            marginLeft: SIZE.width(4),
            marginRight: SIZE.width(4),
            marginTop: SIZE.width(3),
            color: COLOR.COFFEE_RED,
          }}>
          ※認証コードの有効期限は10分です。
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.07,
            marginLeft: SIZE.width(4),
            marginRight: SIZE.width(4),
            color: COLOR.COFFEE_RED,
          }}>
          ※迷惑メールフィルタの設定によってはメールが届かない場合がございます。「komeda-info.com」ドメインからのEメール受信を許可するように設定をお願いいたします。
        </AppText>
      </View>
    );
  };

  //Gửi lại mã OTP
  const resendOTPCodeActiveNumberPhone = () => {
    return (
      <>
        {!disableHour && checkReSentOTP ? (
          <TimeResentOTP endWaitingTime={endWaitingTime} />
        ) : null}
      </>
    );
  };

  //Render:
  return (
    <View style={styles.container}>
      <AppHeader title={'メールアドレスの変更'} leftGoBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}
        style={{backgroundColor: COLOR.white}}>
        {renderTextTitleSMS()}
        <AppText
          style={{
            fontSize: SIZE.H6,
            color: COLOR.COFFEE_BROWN_LIGHT,
            marginLeft: SIZE.width(5),
            marginTop: SIZE.width(6),
          }}>
          認証コードの入力欄
        </AppText>
        {/* Ô nhập mã OTP */}
        <View style={styles.containerInputOTP}>
          <InputOTP getOTP={getOTP} />
        </View>
        <View
          style={{
            backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
            marginTop: SIZE.width(10),
            height: SIZE.height(50),
          }}>
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
          {/* Đoạn text trên nút confirm OTP thông báo các lỗi sảy ra: */}
          <View style={{width: SIZE.width(100), alignItems: 'center'}}>
            <AppText
              style={{
                fontSize: SIZE.H5,
                marginLeft: SIZE.width(6),
                marginRight: SIZE.width(6),
                marginTop: SIZE.width(3),
                marginBottom: 16,
                color: COLOR.COFFEE_RED,
                fontFamily: 'irohamaru-Medium',
                textAlign: 'center',
              }}>
              {messOTPAPI}
            </AppText>
          </View>
          {/* Nút xác nhận kích hoạt OTP */}
          <AppTextButton
            ref={submitBtn}
            onPress={activeOTP}
            title={'認証'}
            style={{
              height: SIZE.width(14),
              width: SIZE.width(72),
              backgroundColor: COLOR.COFFEE_YELLOW,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: checkReSentOTP ? 0 : SIZE.width(3),
              marginLeft: SIZE.width(14),
            }}
            textStyle={{
              padding: 3,
              color: COLOR.white,
              fontSize: SIZE.H4,
              fontFamily: 'irohamaru-Medium',
            }}
          />

          {/* Đoạn text trên nút confirm OTP */}
          <View style={{width: SIZE.width(100), alignItems: 'center'}}>
            <AppText
              style={{
                fontSize: SIZE.H5,
                marginLeft: SIZE.width(6),
                marginRight: SIZE.width(6),
                marginTop: SIZE.width(5),
                color: COLOR.COFFEE_BROWN_LIGHT,
                fontFamily: 'irohamaru-Medium',
              }}>
              認証コードが届かない / 有効期限が切れた場合
            </AppText>
          </View>
          {/* Nút gửi lại mã OTP */}
          <TouchableCo
            style={{
              height: SIZE.width(14),
              width: SIZE.width(72),
              backgroundColor: checkReSentOTP ? COLOR.grey_500 : COLOR.white,
              borderWidth: SIZE.width(0.2),
              marginTop: SIZE.width(5),
              marginLeft: SIZE.width(14),
              borderWidth: SIZE.width(0.4),
              borderColor: checkReSentOTP
                ? COLOR.grey_500
                : COLOR.COFFEE_YELLOW,
            }}
            disabled={checkReSentOTP ? true : false}
            onPress={onPressResentOTP}>
            <AppText
              style={{
                fontSize: SIZE.H4,
                fontFamily: 'irohamaru-Medium',
                color: checkReSentOTP ? COLOR.white : COLOR.COFFEE_YELLOW,
                textDecorationColor: checkReSentOTP
                  ? COLOR.grey_500
                  : COLOR.COFFEE_YELLOW,
              }}>
              認証コードを再送信する
            </AppText>
          </TouchableCo>
          {/* Nút ấn quay lại màn hình trước dùng app: */}
          <View
            style={{
              marginTop: SIZE.width(7),
              alignItems: 'center',
            }}>
            <AppText
              onPress={comeBackMypage}
              style={{
                fontSize: SIZE.H5 * 1.2,
                color: COLOR.COFFEE_BROWN,
                fontFamily: 'irohamaru-Medium',
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: COLOR.COFFEE_BROWN,
              }}>
              マイアカウントTOPにもどる
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
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
export default OtpChangeEmail;
