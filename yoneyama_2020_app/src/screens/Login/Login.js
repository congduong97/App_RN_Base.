//Lybrary:
import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  YellowBox,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
YellowBox.ignoreWarnings(['Remote debugger']);

//Setup:
import {AppContainer, AppTextButton} from '../../elements';
import {SIZE, COLOR, FetchApi, isIos, ToastService} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {AppText} from '../../elements/AppText';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import {STRING} from '../../utils/constants/String';

//Màn hình Login này dành cho trường hợp duy nhất là người dùng có tài khoản rồi và đăng nhập.
//Với trường hợp này thì tyleLogin tương ứng sẽ là : NORMAL_LOGIN;
//Chuyển sang màn hình Login có otpType = 'LOGIN';
//Tài khoản demo: 09622949999 pass: xuannam12 12/01/1996

const Login = ({navigation, route}) => {
  const {activeOTP, account} = route.params;
  const nameScreen = 'ログイン';
  const typeLogin = 'NORMAL_LOGIN';
  const otpType = 'LOGIN';
  const loginBtnRef = useRef(null);
  const phone = useRef('');
  const password = useRef('');
  const [userName, setStateUserName] = useState('');
  const [passWord, setStatePassWord] = useState('');
  const [megUserName, setStateMegUserName] = useState('');
  const [megPass, setStateMegPass] = useState('');
  const [showPass, setStateShowPass] = useState(false);
  const {colorApp} = useContext(ContextContainer);
  const {goBack} = navigation;

  useEffect(() => {
    checkAccountNotActiveOtp();
    return () => {};
  }, []);

  //Quay lại màn hình trước:
  const goBackScreen = () => {
    goBack();
  };
  const modalForgot = useRef(null);
  //Kiểm tra tài khoản:
  const checkValidAccount = () => {
    if (!phone.current) {
      setStateMegUserName('本項目は必須です。');
    }
    if (phone.current && phone.current.length < 11) {
      setStateMegUserName('11桁で入力してください。');
    }
    if (!password.current) {
      setStateMegPass('本項目は必須です。');
    }
  };

  //Kiểm tra lần trước đăng nhập mà chưa Ative mã OTP thành công tự động login lại:
  const checkAccountNotActiveOtp = async () => {
    setStateUserName(account.phoneLogin);
    setStatePassWord(account.passLogin);
    phone.current = account.phoneLogin;
    password.current = account.passLogin;
    if (activeOTP && activeOTP == 'NOT_ACTIVE_OTP') {
      const response = await FetchApi.login(
        account.phoneLogin,
        account.passLogin,
        typeLogin,
      );
      if (response.success) {
        navigation.navigate(keyNavigation.ACTIVE_OTP, {
          phoneNumber: account.phoneLogin,
          memberId: response.data.memberId,
          passWord: account.passLogin,
          otpType: otpType,
          accountNomalLogin: response.data,
        });
      } else {
        ToastService.showToast(STRING.wrong_phone_or_pass);
      }
    }
  };

  //Đăng nhập:
  const pressLogin = async () => {
    checkValidAccount();
    if (phone.current && password.current && phone.current.length == 11) {
      loginBtnRef.current.setLoadingValue(true);
      const response = await FetchApi.login(
        phone.current,
        password.current,
        typeLogin,
      );
      if (response && response.success && response.data.memberId) {
        navigation.replace(keyNavigation.ACTIVE_OTP, {
          phoneNumber: phone.current,
          memberId: response.data.memberId,
          passWord: password.current,
          otpType: otpType,
          accountNomalLogin: response.data,
        });
        return;
      } else {
        ToastService.showToast(STRING.wrong_phone_or_pass);
      }
      loginBtnRef.current.setLoadingValue(false);
    }
  };

  //Đăng nhập kèm theo ngày sinh:
  const loginSpecial = () => {
    navigation.navigate(keyNavigation.LOGIN_SPECIAL);
  };

  //Quên mật khẩu:
  const fogotPass = () => {
    modalForgot.current.setShowModal('app');
  };

  //Đăng kí:
  const regisAccount = () => {
    navigation.navigate(keyNavigation.REGISTER);
  };

  //Nhập tài khoản:
  const onChangeUserName = (value) => {
    phone.current = value;
    setStateUserName(value);
    setStateMegUserName('');
  };

  //Nhập mật khẩu:
  const onChangePass = (value) => {
    password.current = value;
    setStatePassWord(value);
    setStateMegPass('');
  };

  //Phần chữ màu đỏ cảnh báo cuối màn hình:
  const renderTextImportant = () => {
    return (
      //Khung chữ chú ý:
      <View style={styles.containerImpotent}>
        <AppText
          style={{
            marginTop: SIZE.width(3),
            marginLeft: SIZE.width(4),
            marginBottom: SIZE.width(1),
            color: COLOR.red,
          }}>
          ご注意
        </AppText>
        <AppText style={styles.textImpotent}>
          「携帯電話番号を変更された方はこちら」は、端末紛失などで電話番号が変わってしまい、ログイン時にご登録の携帯電話番号に送信されるSMSが受け取れない方向けの機能です。
        </AppText>
      </View>
    );
  };
  //Thông báo lỗi nhập tài khoản:
  const megValid = (mess) => {
    return <AppText style={styles.megValid}>{mess}</AppText>;
  };

  //Hiển thị mật khẩu rõ:
  const showPassWord = () => {
    setStateShowPass(!showPass);
  };

  //Tên của itcon nhập mật khẩu cũ:
  const showEye = () => {
    if (showPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };

  //Khung nhập mật khẩu:
  const inputPassWord = () => {
    return (
      <View
        style={{
          height: SIZE.width(13),
          width: SIZE.width(92),
          borderWidth: 1,
          borderColor: COLOR.grey_700,
          marginLeft: SIZE.width(4),
          borderRadius: 8,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TextInput
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          secureTextEntry={showPass ? false : true}
          onChangeText={(text) => onChangePass(text)}
          style={{
            height: SIZE.width(13),
            width: SIZE.width(78),
            borderColor: COLOR.grey_700,
            paddingLeft: SIZE.width(2),
            borderRadius: 8,
          }}
          placeholder="パスワードを半角英数で入力"
          placeholderTextColor={'grey'}
          value={passWord}
        />
        <TouchableOpacity
          onPress={showPassWord}
          style={{
            width: SIZE.width(13),
            height: SIZE.width(12),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {passWord ? (
            <Entypo name={showEye()} color="black" size={18} />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <AppContainer
      haveBottom
      goBackScreen
      haveTitle
      nameScreen={nameScreen}
      style={{backgroundColor: colorApp.backgroundColor}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          marginTop: SIZE.width(5),
        }}>
        <View>
          <AppText style={styles.textScreen}>
            ご登録の携帯電話番号、パスワードをご入
          </AppText>
          <AppText style={styles.textScreen}>力ください。</AppText>
          {/* Tiêu đề của useName */}
          <AppText style={styles.textTitleInput}>携帯電話番号</AppText>
          {/* Khung nhập useName */}
          <TextInput
            maxLength={11}
            placeholder="携帯電話番号をハイフンなしで入力"
            keyboardType="numeric"
            placeholderTextColor={'grey'}
            value={userName}
            style={styles.input}
            onChangeText={(text) => onChangeUserName(text)}
          />
          {megUserName ? megValid(megUserName) : null}
          {/* Tiêu đề của khung nhập mật khẩu */}
          <AppText style={styles.textTitleInput}>パスワード</AppText>
          {/* Khung nhập mật khẩu */}
          {inputPassWord()}
          {megPass ? megValid(megPass) : null}
          {/* Đăng kí */}
          <View
            style={{
              width: SIZE.width(100),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}} />
            <AppText
              style={{
                ...styles.textButton,
                marginTop: SIZE.width(3.5),
                marginBottom: SIZE.width(1.5),
              }}
              onPress={regisAccount}>
              新規会員登録はこちら
            </AppText>
          </View>
          {/* Quên mật khẩu */}
          <View
            style={{
              width: SIZE.width(100),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}} />
            <AppText style={styles.textButton} onPress={fogotPass}>
              パスワードをお忘れの方はこちら
            </AppText>
          </View>
          {/* Login đặc biệt */}
          <View
            style={{
              width: SIZE.width(100),
              flexDirection: 'row',
            }}>
            <View style={{flex: 1}} />
            <AppText
              style={{
                ...styles.textButton,
                marginTop: SIZE.width(0.5),
              }}
              onPress={loginSpecial}>
              携帯電話番号を変更された方はこちら
            </AppText>
          </View>

          {/* Kẻ ngang: */}
          <View style={styles.holiView} />
          {/* Nút Login */}
          <AppTextButton
            ref={loginBtnRef}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(92),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(4),
              borderRadius: 8,
              marginLeft: SIZE.width(4),
              backgroundColor: colorApp.backgroundColorButton,
            }}
            title={'ログイン'}
            textStyle={{
              color: colorApp.textColorButton,
              fontSize: SIZE.H4 * 0.9,
            }}
            onPress={pressLogin}
          />
          {/* Nút quay lại màn hình trước */}
          <AppTextButton
            style={styles.buttonGoback}
            title={'戻る'}
            textStyle={{
              color: COLOR.black,
              fontSize: SIZE.H4 * 0.9,
            }}
            onPress={goBackScreen}
          />
          {/* Chú ý quan trọng */}
          {renderTextImportant()}
        </View>
        <View style={{height: SIZE.width(10)}} />
      </ScrollView>
      <ForgotPassword ref={modalForgot} />
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  containerImpotent: {
    borderColor: COLOR.red,
    borderWidth: 1,
    marginTop: SIZE.width(4),
    marginLeft: SIZE.width(3),
    marginRight: SIZE.width(3),
  },
  textImpotent: {
    padding: SIZE.width(0.6),
    color: COLOR.red,
    fontSize: SIZE.H5,
    marginLeft: SIZE.width(3),
    marginRight: SIZE.width(3),
    marginBottom: SIZE.width(2),
  },
  textScreen: {
    fontSize: isIos ? SIZE.H4 : SIZE.H5 * 1.2,
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
  },
  textTitleInput: {
    fontSize: SIZE.H5 * 1.2,
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    marginTop: SIZE.width(3),
    marginBottom: SIZE.width(2),
  },
  input: {
    height: SIZE.width(13),
    width: SIZE.width(92),
    borderWidth: 1,
    borderColor: COLOR.grey_700,
    marginLeft: SIZE.width(4),
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: SIZE.width(3),
    fontSize: SIZE.H5,
  },
  textButton: {
    fontSize: SIZE.H5 * 1.2,
    textAlign: 'right',
    color: COLOR.COLOR_BLUE,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLOR.COLOR_BLUE,
    marginTop: SIZE.width(3),
    marginBottom: 15,
    fontWeight: '400',
    marginRight: SIZE.width(4),
  },
  button: {
    textAlign: 'right',
    width: SIZE.width(96),
    color: COLOR.COLOR_BLUE,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: COLOR.COLOR_BLUE,
    fontSize: SIZE.H5 * 1.2,
    marginBottom: 15,
  },
  megValid: {
    fontSize: 14,
    color: COLOR.red,
    marginLeft: SIZE.width(5),
    marginTop: SIZE.width(1.5),
  },
  holiView: {
    height: 1,
    width: SIZE.width(93),
    marginLeft: SIZE.width(3),
    backgroundColor: COLOR.grey_500,
  },
  buttonGoback: {
    height: SIZE.width(12),
    width: SIZE.width(92),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    marginLeft: SIZE.width(4),
    backgroundColor: '#D9D9D9',
  },
});

//Màn hình Login này dành cho trường hợp duy nhất là người dùng có tài khoản rồi và đăng nhập.
//Với trường hợp này thì tyleLogin tương ứng sẽ là : NORMAL_LOGIN;
//Chuyển sang màn hình Login có otpType = 'LOGIN';

export default Login;
