import React, {useRef, useState, useContext, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/core';

import {ContextContainer} from '../../contexts/AppContext';
import {AppHeader, AppText, AppTextButton} from '../../elements';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {
  AccountLocal,
  COLOR,
  FetchApi,
  isIos,
  SIZE,
  Validate,
} from '../../utils';
import {AccountService} from '../../utils/services/AccountService';
import {StateUserService} from '../Home/services/StateUserService';
import {STRING} from '../../utils/constants/String';

export default function DisableAccount() {
  const {colorApp} = useContext(ContextContainer);
  const [inputUserName, setStateInputUserName] = useState('');
  const [inputPassWord, setStateInputPassWord] = useState('');
  const getEmailAndPassWord = useRef({});
  const [messValid, setStateMessValid] = useState('');
  const navigation = useNavigation();
  const timeCount = useRef(0);
  const submitBtn = useRef(null);
  const onChangeUserName = (input) => {
    setStateInputUserName(input);
  };
  const onChangePass = (input) => {
    setStateInputPassWord(input);
  };
  useEffect(() => {
    const accountLogin = AccountService.getAccount();
    const {email, password} = accountLogin;
    getEmailAndPassWord.current = {emailLocal: email, passwordLocal: password};
    return () => {
      clearTimeout(timeCount.current);
    };
  }, []);

  const [showPass, setStateShowPass] = useState(false);

  //Gọi API để xóa tài khoản:
  const checkAPIDisableAccount = async () => {
    submitBtn.current.setLoadingValue(true);
    const response = await FetchApi.disableAccount(
      inputUserName,
      inputPassWord,
    );
    if (response.status_code == 200 && response.code == 1000) {
      await AccountLocal.remove();
      await AccountService.init();
      await StateUserService.updateState();
      navigation.navigate(keyNavigation.CONFIRM_MESS, {key: 'DISABLE_ACCOUNT'});
      setStateMessValid('');
    } else {
      setStateMessValid(STRING.have_error_happy_waiting);
    }
    timeCount.current = setTimeout(() => {
      submitBtn.current.setLoadingValue(false);
    }, 2000);
  };

  //Ấn nút bắt đầu xóa tài khoản:
  const onSubmitDisableAccount = async () => {
    submitBtn.current.setLoadingValue(true);
    if (!inputUserName) {
      timeCount.current = setTimeout(() => {
        submitBtn.current.setLoadingValue(false);
      }, 2000);
      setStateMessValid(STRING.need_input_email);
    } else if (!inputPassWord) {
      timeCount.current = setTimeout(() => {
        submitBtn.current.setLoadingValue(false);
      }, 2000);
      setStateMessValid(STRING.need_input_password);
    } else {
      const checkValidEmail = Validate.email(inputUserName);
      if (!checkValidEmail.status) {
        timeCount.current = setTimeout(() => {
          submitBtn.current.setLoadingValue(false);
        }, 2000);
        setStateMessValid(checkValidEmail.message);
      } else {
        if (
          inputUserName == getEmailAndPassWord.current.emailLocal &&
          inputPassWord == getEmailAndPassWord.current.passwordLocal
        ) {
          setStateMessValid('');
          submitBtn.current.setLoadingValue(false);
          Alert.alert(
            isIos
              ? `${'\n'}${'\n'}退会します、よろしいですか?${'\n'}${'\n'}`
              : `退会します、よろしいですか?`,
            '',
            [
              {
                text: 'OK',
                style: 'destructive',
                onPress: () => {
                  checkAPIDisableAccount();
                },
              },
              {
                text: 'キャンセル',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        } else {
          setStateMessValid(STRING.pass_or_email_wrong_regis);
          timeCount.current = setTimeout(() => {
            submitBtn.current.setLoadingValue(false);
          }, 2000);
        }
      }
    }
  };

  //Tên của itcon nhập mật khẩu cũ:
  const showEye = () => {
    if (showPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };

  //Hiển thị mật khẩu rõ:
  const showPassWord = () => {
    setStateShowPass(!showPass);
  };

  //Khung nhập mật khẩu:
  const setPassword = () => {
    return (
      <View
        style={{
          height: SIZE.height(6.5),
          width: SIZE.width(88),
          marginLeft: SIZE.width(6),
          borderWidth: 1,
          borderRadius: SIZE.width(1.2),
          borderColor: COLOR.grey_400,
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: COLOR.white,
          marginTop: SIZE.height(2),
        }}>
        <TextInput
          keyboardType={'ascii-capable'}
          textContentType={'password'}
          blurOnSubmit={false}
          onSubmitEditing={() => Keyboard.dismiss()}
          secureTextEntry={showPass ? false : true}
          onChangeText={(text) => onChangePass(text)}
          style={{
            height: '100%',
            width: SIZE.width(78),
            borderColor: COLOR.grey_400,
            paddingLeft: SIZE.width(3),
            borderRadius: 8,
          }}
          placeholderTextColor={'grey'}
          value={inputPassWord}
          autoCapitalize='none'
          maxLength={32}
        />
        <TouchableOpacity
          onPress={showPassWord}
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {inputPassWord ? (
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
  const renderTitleInputAccount = (title) => {
    return (
      <View
        style={{
          backgroundColor: COLOR.COFFEE_BROWN,
          justifyContent: 'center',
        }}>
        {/* Nhập tài khoản */}
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: COLOR.white,
            paddingVertical: SIZE.height(1),
            marginLeft: SIZE.width(4),
            fontWeight: 'bold',
          }}>
          {title}
        </AppText>
      </View>
    );
  };

  //Ấn vào nút quên mật khẩu:
  const onForgotPass = () => {
    navigation.navigate(keyNavigation.EMAIL_INPUT, {
      key: 'FORGOT_PASSWORD',
    });
  };

  const renderInputAccount = () => {
    return (
      <View
        style={{
          minHeight: SIZE.height(28),
          width: SIZE.width(100),
        }}>
        {/* Phần nhập tài khoản */}
        {renderTitleInputAccount('メールアドレス')}
        <TextInput
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          onChangeText={onChangeUserName}
          style={{
            borderWidth: 1,
            borderColor: COLOR.grey_400,
            height: SIZE.height(6.5),
            width: SIZE.width(88),
            marginLeft: SIZE.width(6),
            borderRadius: SIZE.width(1.2),
            paddingLeft: SIZE.width(3),
            marginTop: SIZE.height(2),
          }}></TextInput>
        <AppText
          style={{
            textAlign: 'center',
            fontSize: SIZE.H5 * 0.8,
            color: COLOR.grey_700,
            marginTop: SIZE.height(1.5),
            marginBottom: SIZE.height(1.5),
          }}>
          ※確認のため、ご登録されているメールアドレスをご入力ください。
        </AppText>
        {/* Nhập mật khẩu*/}
        {renderTitleInputAccount('パスワード')}
        {setPassword()}
        {/* Quên mật khẩu */}
        <AppText
          onPress={onForgotPass}
          style={{
            textAlign: 'center',
            marginTop: SIZE.height(2),
            fontSize: SIZE.H5,
            color: COLOR.COFFEE_BROWN,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.COFFEE_BROWN,
            fontFamily: 'irohamaru-Medium',
            marginBottom: SIZE.height(3),
          }}>
          パスワードを忘れた方はこちら
        </AppText>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: colorApp.backgroundColor}}>
      <AppHeader title={'退会'} leftGoBack />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: '#EF6572',
            padding: SIZE.height(2),
            fontWeight: 'bold',
          }}>
          会員退会後はデータが削除され、ログインできな
          くなります。再度ご入会の場合は新規会員登録か らご登録が必要です。
        </AppText>
        {renderInputAccount()}
        <View
          style={{
            minHeight: SIZE.height(38),
            width: SIZE.width(100),
            backgroundColor: '#F0F0F0',
            alignItems: 'center',
          }}>
          {messValid ? (
            <AppText
              style={{
                textAlign: 'center',
                marginTop: SIZE.height(2),
                fontSize: SIZE.H5 * 1.1,
                color: '#EF6572',
                fontWeight: 'bold',
                padding: SIZE.width(3),
              }}>
              {messValid}
            </AppText>
          ) : null}
          <AppTextButton
            onPress={onSubmitDisableAccount}
            ref={submitBtn}
            title={'認証'}
            style={styles.submitBtn}
            textStyle={styles.submitTextBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  submitBtn: {
    marginHorizontal: 40,
    height: SIZE.height(7.5),
    backgroundColor: '#FF9A27',
    width: SIZE.width(65),
    borderRadius: 0,
    marginTop: SIZE.height(2),
  },
  submitTextBtn: {
    color: COLOR.white,
    fontSize: SIZE.H5 * 1.15,
    fontFamily: 'irohamaru-Medium',
  },
});
