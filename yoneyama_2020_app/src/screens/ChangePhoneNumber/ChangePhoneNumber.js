//Library:
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  BackHandler,
} from 'react-native';

//Setup:
import {SIZE, COLOR} from '../../utils/resource';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppContainer, AppTextButton} from '../../elements';
import {AppText} from '../../elements/AppText';
import {AccountService} from '../../utils/services/AccountService';
import {FetchApi, Validate} from '../../utils/modules';
import {ContextContainer} from '../../contexts/AppContext';

//Services:
import {ToastService} from '../../utils';
import {BottomService} from '../../navigators/services/BottomService';

const ChangePhoneNumber = (props) => {
  const {navigation, route} = props;
  const {phoneAccuracy, accountLogin} = route.params;
  const {memberId} = accountLogin;
  const optType = 'CHANGE_PHONE';
  const phoneNewInput = useRef('');
  const phoneNewConfirmInput = useRef('');
  const messPhoneRegis = useRef('入力間違い防止のため再度ご入力ください。');
  const {colorApp} = useContext(ContextContainer);
  const [phoneNumberOld, setphoneNumberOld] = useState('');
  const [phoneNumberNew, setphoneNumberNew] = useState('');
  const [isActiveButton, setStateIsActiveButton] = useState(false);
  const [messPhoneOld, setStateMegPhoneOld] = useState('');
  const [messPhoneConfirm, setStateMegPhoneConfirm] = useState('');
  const [messNumberPhone, setStateMegNumberPhone] = useState('');
  const [checkLogin, setStateCheckLogin] = useState(false);
  const [validateNumberPhone, setStateValidateNumberPhone] = useState(false);

  useEffect(() => {
    checkLoginAccount();
    //Chặn phím cứng quay lại:
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => {
      BackHandler.addEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  const backHandler = () => {
    if (!checkLogin) {
      return true;
    } else {
      return false;
    }
  };

  //Kiểm tra account đã login chưa hiển thị bottom :
  const checkLoginAccount = async () => {
    const accountLogin = await AccountService.getAccount();
    if (!accountLogin) {
      BottomService.setDisplay(false);
    } else {
      BottomService.setDisplay(true);
      setStateCheckLogin(true);
    }
  };

  //Nút quay lại màn hình trước:
  const onPressGoback = () => {
    navigation.goBack();
  };

  //Nhập số điện thoại cũ:
  const inputPhoneNumberOld = (phone) => {
    setphoneNumberOld(phone);
    checkPhoneRegisLikePhoneConfirm();
    if (phone && phone.length > 0 && phone.length < 11) {
      setStateMegPhoneOld('11桁で入力してください。');
      setStateIsActiveButton(false);
    }
    if (phone && phone.length == 11 && phoneAccuracy) {
      if (phone == phoneAccuracy) {
        setStateMegPhoneOld('');
        setStateIsActiveButton(true);
      } else {
        setStateMegPhoneOld('携帯電話番号が不正です。');
        setStateIsActiveButton(false);
      }
    }
  };

  //Nhâp số điện thoại mới:
  const inputPhoneNumberNew = (numberPhoneNew) => {
    phoneNewInput.current = numberPhoneNew.replace(/-/g, '');
    setphoneNumberNew(numberPhoneNew);
    if (phoneNewInput.current && phoneNewInput.current.length === 11) {
      checkValidPhoneUseAPI();
      checkPhoneRegisLikePhoneConfirm();
      setStateMegNumberPhone('');
    }
    if (
      phoneNewConfirmInput.current &&
      phoneNewConfirmInput.current.length == 11
    ) {
      if (numberPhoneNew == phoneNewConfirmInput.current) {
        setStateIsActiveButton(true);
      }
    }
    if (
      numberPhoneNew &&
      numberPhoneNew.length > 0 &&
      numberPhoneNew.length < 11
    ) {
      setStateMegNumberPhone('11桁で入力してください。');
      setStateIsActiveButton(false);
    }
  };

  //Nhập lại số điện thoại mới
  const inputPhoneNumberNewConfirm = (numberPhoneNewConfirm) => {
    phoneNewConfirmInput.current = numberPhoneNewConfirm.replace(/-/g, '');
    if (
      phoneNewConfirmInput.current &&
      phoneNewConfirmInput.current.length === 11
    ) {
      checkPhoneRegisLikePhoneConfirm();
    }
    if (
      numberPhoneNewConfirm &&
      numberPhoneNewConfirm.length > 0 &&
      numberPhoneNewConfirm.length < 11
    ) {
      setStateMegPhoneConfirm('11桁で入力してください。');
      setStateIsActiveButton(false);
    }
  };

  //Đối ứng số điện thoại xác thực và số đăng kí.
  const checkPhoneRegisLikePhoneConfirm = () => {
    if (phoneNewInput.current === phoneNewConfirmInput.current) {
      if (!messPhoneOld) {
        //Đẩy số điện thoại đã validate và đẩy ra ngoài:
        setStateValidateNumberPhone(true);
        setStateIsActiveButton(true);
        setStateMegPhoneConfirm('');
      } else {
        setStateMegPhoneConfirm('');
      }
    } else {
      setStateIsActiveButton(false);
      setStateMegPhoneConfirm('変更後の携帯電話番号が一致していません。 ');
    }
  };

  //Cảnh báo sai định dạng số điện thoại:
  const alertErrorNumberPhone = (checkPhoneValidate) => {
    if (!checkPhoneValidate.status) {
      setStateMegNumberPhone(checkPhoneValidate.content);
    } else {
      setStateMegNumberPhone(null);
    }
  };

  //Gọi API kiểm tra số điện thoại có tồn tại trên hệ thông chưa:
  const checkValidPhoneUseAPI = async () => {
    if (phoneNewInput.current) {
      const response = await FetchApi.isExistPhoneNumber(phoneNewInput.current);
      if (!response && !response.data) {
        setStateIsActiveButton(false);
        setStateMegNumberPhone('この電話番号はシステムに既存しました。');
      }
    }
  };

  //Cảnh báo sai validate :
  const showErrorValidate = (messError) => {
    return <AppText style={styles.messValidateInfo}>{messError}</AppText>;
  };

  //Hiển thị mess nhập số điện thoại sẽ đăng kí :
  const showMessRegis = () => {
    return (
      <AppText style={styles.megPhoneRegister}>
        {messPhoneRegis.current}
      </AppText>
    );
  };

  const onPressConfirmOPT = async () => {
    let phone = '';
    if (checkLogin) {
      const accountLogin = await AccountService.getAccount();
      phone = accountLogin.phone;
    }
    //Check số điện thoại nhập vào phải giống số cũ khi đăng nhập:
    if (phone && phone !== phoneNumberOld) {
      setStateMegPhoneOld('携帯電話番号が不正です。');
      return;
    } else {
      setStateMegPhoneOld('');
    }

    //Số điện thoại màn hình login đặc biệt truyền sang để kiểm tra số điện thoại trước có trùng số xác thực màn bên này không?
    if (phoneAccuracy && phoneNumberOld !== phoneAccuracy) {
      setStateMegPhoneOld('携帯電話番号が不正です。');
      setStateIsActiveButton(false);
      return;
    } else {
      setStateMegPhoneOld('');
    }

    //Check số điện thoai nhập mới có để trống hay không
    if (!phoneNewInput.current) {
      setStateMegNumberPhone('本項目は必須です。');
    } else {
      let checkPhoneValidate = Validate.phoneNumber(phoneNewInput.current);
      alertErrorNumberPhone(checkPhoneValidate);
    }

    //Check số điện thoai nhập lại có để trống hay không
    if (!phoneNewConfirmInput.current) {
      setStateMegPhoneConfirm('本項目は必須です。');
    } else {
      checkPhoneRegisLikePhoneConfirm();
    }

    //Check xem số điện thoại có bắt đầu bằng số 0 hay không
    if (phoneNewInput.current.slice(0, 1) !== '0') {
      setStateMegNumberPhone('携帯電話番号が不正です。');
      setStateIsActiveButton(false);
      return;
    }
    //Check xem số điện thoại có phải dạng number hay ko
    if (!Number(phoneNewInput.current)) {
      setStateMegNumberPhone('エラーが発生しました。');
      setStateIsActiveButton(false);
      return;
    }

    //Xử lý logic cho chuyển qua màn nhập otp khi đã đủ điều kiện
    if (
      (phone && phone === phoneNumberOld) ||
      (phoneAccuracy === phoneNumberOld && validateNumberPhone)
    ) {
      setStateMegPhoneOld('');
      if (phoneNewInput.current === phoneNewConfirmInput.current) {
        //Kiểm tra số điện thoại mới đã được dùng hay chưa:
        const response = await FetchApi.isExistPhoneNumber(
          phoneNewInput.current,
        );
        if (response && response.message == 'Network request failed') {
          ToastService.showToast(
            'ネットワークに接続できませんでした。後でやり直してください。',
          );
          return;
        }

        if (response && response.data) {
          const needToken = checkLogin ? true : false;
          const responseChange = await FetchApi.changePhoneNumber(
            phoneNumberOld,
            phoneNumberNew,
            needToken,
          );
          if (
            responseChange &&
            responseChange.status_code === 200 &&
            responseChange.code === 1000
          ) {
            setStateIsActiveButton(true);
            setStateMegNumberPhone('');
            navigation.navigate(keyNavigation.AUTH_NAVIGATOR, {
              screen: keyNavigation.ACTIVE_OTP,
              params: {
                phoneNumber: phoneNumberNew,
                passWord: '',
                memberId: memberId,
                otpType: optType,
                accountNomalLogin: accountLogin,
              },
            });
          }
          if (
            responseChange &&
            responseChange.status_code === 200 &&
            responseChange.code === 1045
          ) {
            setStateMegNumberPhone('この電話番号はシステムに既存しました。');
            ToastService.showToast('この電話番号はシステムに既存しました。');
          }
        } else {
          setStateIsActiveButton(false);
          setStateMegNumberPhone('この電話番号はシステムに既存しました。');
        }
      }
    }
  };

  return (
    <AppContainer
      style={{flex: 1, backgroundColor: colorApp.backgroundColor}}
      haveBottom
      goBackScreen={checkLogin}
      haveTitle
      nameScreen={'携帯電話番号の変更'}>
      <ScrollView
        style={{marginHorizontal: 10, marginVertical: 10}}
        showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: 10, marginTop: 20}}>
          <AppText style={styles.centerText}>
            下記をご入力いただき携帯電話番号のご変更が可能です。
          </AppText>
          <AppText style={[styles.centerText, {marginTop: 20}]}>
            現在の携帯電話番号
          </AppText>
          <TextInput
            style={{
              height: SIZE.width(12),
              borderWidth: 1,
              borderColor: 'grey',
              paddingLeft: SIZE.width(3),
              borderRadius: 10,
              marginBottom: messPhoneOld ? 0 : 15,
              marginTop: SIZE.width(2),
            }}
            keyboardType="numeric"
            maxLength={11}
            placeholder={'携帯電話番号をハイフンなしで入力'}
            numberOfLines={1}
            onChangeText={(text) => inputPhoneNumberOld(text)}
          />
          {messPhoneOld ? showErrorValidate(messPhoneOld) : null}
          <AppText style={[styles.centerText, {marginTop: 10}]}>
            変更後の携帯電話番号
          </AppText>
          <TextInput
            style={{
              height: SIZE.width(12),
              borderWidth: 1,
              borderColor: 'grey',
              paddingLeft: SIZE.width(3),
              borderRadius: 10,
              marginTop: SIZE.width(1),
            }}
            placeholder={'携帯電話番号をハイフンなしで入力\n'}
            numberOfLines={1}
            keyboardType="numeric"
            maxLength={11}
            onChangeText={(text) => inputPhoneNumberNew(text)}
          />
          {messNumberPhone ? showErrorValidate(messNumberPhone) : null}
          {showMessRegis()}
          <TextInput
            style={{
              height: SIZE.width(12),
              borderWidth: 1,
              borderColor: 'grey',
              paddingLeft: SIZE.width(3),
              borderRadius: 10,
              marginBottom: 0,
              marginTop: SIZE.width(1),
            }}
            placeholder={'携帯電話番号をハイフンなしで入力'}
            numberOfLines={1}
            keyboardType="numeric"
            maxLength={11}
            onChangeText={(text) => inputPhoneNumberNewConfirm(text)}
          />
          {messPhoneConfirm ? showErrorValidate(messPhoneConfirm) : null}
          <View style={{marginTop: SIZE.width(5)}}>
            <AppTextButton
              style={{
                width: SIZE.width(90),
                padding: 16,
                backgroundColor: COLOR.COLOR_GREEN,
                alignSelf: 'center',
                borderRadius: 10,
                marginBottom: SIZE.width(3),
              }}
              disabled={isActiveButton ? false : true}
              title={'携帯電話番号へSMSコードを送信'}
              textStyle={{
                color: 'white',
                fontSize: SIZE.H5,
              }}
              onPress={onPressConfirmOPT}
            />
            <AppTextButton
              style={{
                width: SIZE.width(90),
                backgroundColor: COLOR.COLOR_GRAY_300,
                padding: 16,
                alignSelf: 'center',
                borderRadius: 10,
              }}
              title={'戻る'}
              textStyle={{
                fontSize: SIZE.H5,
                color: 'white',
              }}
              onPress={onPressGoback}
            />
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};
export default ChangePhoneNumber;

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
  },
  messValidateInfo: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
  },
  megPhoneRegister: {
    color: COLOR.red,
    fontSize: 16,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
  },
});
