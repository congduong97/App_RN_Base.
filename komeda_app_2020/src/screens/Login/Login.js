//Lybrary:
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

//Setup:
import {AppTextButton, AppHeader} from '../../elements';
import {SIZE, COLOR, FetchApi, isIos, Validate, toASCII} from '../../utils';
import {STRING} from '../../utils/constants/String';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {AccountService} from '../../utils/services/AccountService';

//Component:
import {AppText} from '../../elements/AppText';
import {StateUserService} from '../Home/services/StateUserService';

//Màn hình Login này dành cho trường hợp duy nhất là người dùng có tài khoản rồi và đăng nhập.
const Login = ({navigation, route}) => {
  const nameScreen = 'ログイン';
  const loginBtnRef = useRef(null);
  const userName = useRef('');
  const passWord = useRef('');
  const [userNameAccount, setStateUserNameAccount] = useState('');
  const [passWordAccount, setStatePassWord] = useState('');
  const [messValidOrErrorAPI, setStateMessValidOrErrorAPI] = useState('');
  const [showPass, setStateShowPass] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  //Đăng kí tài khoản mới:
  const registerAccount = () => {
    navigation.navigate(keyNavigation.REGISTER);
  };

  //Kiểm tra tài khoản:
  const checkValidAccount = () => {
    if (!userName.current) {
      setStateMessValidOrErrorAPI(STRING.need_input_email);
      return;
    }
    if (userName.current) {
      const checkValidUserName = Validate.email(userName.current);
      if (checkValidUserName && !checkValidUserName.status) {
        setStateMessValidOrErrorAPI(checkValidUserName.message);
        return checkValidUserName.message;
      }
    }
    if (!passWord.current) {
      setStateMessValidOrErrorAPI(STRING.need_input_password);
      return;
    }
  };

  //Đăng nhập:
  const pressLogin = async () => {
    const isValid = checkValidAccount();
    if (userName.current && passWord.current && !isValid) {
      const newUserName = toASCII(userName.current);
      loginBtnRef.current.setLoadingValue(true);
      const response = await FetchApi.login(newUserName, passWord.current);
      console.log(response, 'response');
      if (response.success) {
        setStateMessValidOrErrorAPI('');
        response.data.password = passWord.current;
        AccountService.updateAccount(response.data);
        StateUserService.updateState();
        navigation.navigate(keyNavigation.CONFIRM_MESS, {
          key: 'LOGIN',
        });
      } else {
        if (response && response.code == 502) {
          setStateMessValidOrErrorAPI(STRING.server_maintain);
        }
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          setStateMessValidOrErrorAPI(STRING.network_error_try_again_later);
        } else {
          setStateMessValidOrErrorAPI(STRING.wrong_email_or_pass);
        }
      }

      loginBtnRef.current.setLoadingValue(false);
    }
  };

  //Nhập tài khoản:
  const onChangeUserName = (value) => {
    userName.current = value;
    setStateUserNameAccount(value);
  };

  //Nhập mật khẩu:
  const onChangePass = (value) => {
    passWord.current = value;
    setStatePassWord(value);
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

  //Ấn vào nút quên mật khẩu:
  const onForgotPass = () => {
    navigation.navigate(keyNavigation.EMAIL_INPUT, {
      key: 'FORGOT_PASSWORD',
    });
  };

  //Khung nhập tài khoản:
  const setUserName = () => {
    return (
      <TextInput
        keyboardType={'email-address'}
        blurOnSubmit={false}
        onSubmitEditing={() => Keyboard.dismiss()}
        autoCapitalize={'none'}
        placeholderTextColor={'grey'}
        value={userNameAccount}
        style={styles.input}
        onChangeText={(text) => onChangeUserName(text)}
      />
    );
  };

  //Khung nhập mật khẩu:
  const setPassword = () => {
    return (
      <View
        style={{
          height: SIZE.width(12),
          width: SIZE.width(92),
          borderWidth: 1,
          borderRadius: SIZE.width(1),
          borderColor: COLOR.grey_700,
          marginLeft: SIZE.width(4),
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: COLOR.white,
        }}>
        <TextInput
          keyboardType={'ascii-capable'}
          blurOnSubmit={false}
          onSubmitEditing={() => Keyboard.dismiss()}
          secureTextEntry={showPass ? false : true}
          onChangeText={(text) => onChangePass(text)}
          style={{
            height: SIZE.width(13),
            width: SIZE.width(78),
            borderColor: COLOR.grey_700,
            paddingLeft: SIZE.width(2),
            borderRadius: 8,
          }}
          placeholderTextColor={'grey'}
          value={passWordAccount}
          autoCapitalize='none'
          maxLength={32}
        />
        <TouchableOpacity
          onPress={showPassWord}
          style={{
            width: SIZE.width(13),
            height: SIZE.width(12),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {passWordAccount ? (
            <Entypo
              name={showEye()}
              color={COLOR.COFFEE_BROWN}
              size={SIZE.H5 * 1.5}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader title={nameScreen} leftGoBack />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: COLOR.COFFEE_MILK,
        }}>
        <View>
          {/* Tiêu đề của useName */}
          <AppText style={styles.textTitleInput}>メールアドレス</AppText>
          {/* Khung nhập useName */}
          {setUserName()}
          {/* Tiêu đề của khung nhập mật khẩu */}
          <AppText style={styles.textTitleInput}>パスワード</AppText>
          {/* Khung nhập mật khẩu */}
          {setPassword()}
          {/* Dòng chữ đỏ chú ý :*/}
          <View
            style={{
              width: SIZE.width(100),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(3.5),
              paddingHorizontal: SIZE.width(4),
            }}>
            <AppText
              style={{
                fontFamily: 'irohamaru-Medium',
                fontSize: SIZE.H5,
                color: '#EF6572',
                textAlign: 'center',
              }}>
              {messValidOrErrorAPI}
            </AppText>
          </View>
          {/* Nút Login */}
          <AppTextButton
            ref={loginBtnRef}
            style={{
              height: SIZE.height(7.5),
              width: SIZE.width(72),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(3),
              borderRadius: 0,
              marginLeft: SIZE.width(14),
              backgroundColor: COLOR.COFFEE_BROWN,
            }}
            title={'ログイン'}
            textStyle={{
              color: COLOR.white,
              fontSize: SIZE.H4 * 0.9,
              fontFamily: 'irohamaru-Medium',
            }}
            onPress={pressLogin}
          />
          {/* Dòng chữ gạch chân quên mật khảu: */}
          <View
            style={{
              width: SIZE.width(100),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(7),
            }}>
            <AppText
              onPress={onForgotPass}
              style={{
                fontSize: SIZE.H5 * 1.1,
                color: COLOR.COFFEE_BROWN,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: COLOR.COFFEE_BROWN,
                fontFamily: 'irohamaru-Medium',
              }}>
              パスワードを忘れた方はこちら
            </AppText>
          </View>
          {/* Nút đăng kí tải khoản: */}
          <AppTextButton
            style={styles.buttonRegister}
            title={'新規会員登録'}
            textStyle={{
              color: COLOR.COFFEE_BROWN,
              fontSize: SIZE.H4 * 0.9,
              fontFamily: 'irohamaru-Medium',
            }}
            onPress={registerAccount}
          />
        </View>
        <View style={{height: SIZE.width(10)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
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
    fontSize: SIZE.H5 * 1.25,
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    marginTop: SIZE.width(7),
    marginBottom: SIZE.width(2),
    color: COLOR.COFFEE_BROWN,
    fontFamily: 'irohamaru-Medium',
  },
  input: {
    height: SIZE.width(12),
    width: SIZE.width(92),
    borderWidth: 1,
    borderColor: COLOR.grey_700,
    marginLeft: SIZE.width(4),
    justifyContent: 'center',
    paddingLeft: SIZE.width(3),
    fontSize: SIZE.H5,
    borderRadius: SIZE.width(1),
    backgroundColor: COLOR.white,
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
  buttonRegister: {
    height: SIZE.height(7.5),
    width: SIZE.width(72),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(7),
    borderRadius: 0,
    marginLeft: SIZE.width(14),
    backgroundColor: COLOR.white,
    borderWidth: SIZE.width(0.4),
    borderColor: '#68463A',
  },
});
export default Login;
