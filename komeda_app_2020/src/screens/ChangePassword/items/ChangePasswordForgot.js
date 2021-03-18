//Library:
import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

//Setup:
import {SIZE, COLOR, FetchApi, Validate} from '../../../utils';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import AppTextInput from '../../../elements/AppTextInput';
import {STRING} from '../../../utils/constants/String';
import {AccountService} from '../../../utils/services/AccountService';

const sizeText = SIZE.H5;

//Thay đổi mật khẩu khi quên:
const ChangePasswordForgot = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {email, otp} = route.params;
  const password = useRef({
    pass1: '',
    pass2: '',
  });
  const error = useRef(null);
  const submitBtn = useRef(null);
  const forceUpdate = useForceUpdate();

  //Nhập thông tin:
  const onChangeText = (field) => (value) => {
    password.current[field] = value;
  };

  //Kiểm tra validate:
  const onValidate = () => {
    error.current = null;
    const {pass1, pass2} = password.current;
    const pass1Validate = Validate.password(pass1);
    if (pass1 === '') {
      error.current = '新しいパスワードをご入力ください。';
    } else if (pass2 === '') {
      error.current = '確認パスワードを入力してください。';
    } else if (!pass1Validate.status) {
      error.current = pass1Validate.message;
    } else if (pass1 !== pass2) {
      error.current = 'パスワード、確認パスワードが一致していません。'; // moi fix
    }
    forceUpdate();
    if (error.current === null) {
      return true;
    }
    return false;
  };

  //Gọi API thay đổi mật khẩu:
  const onSubmit = async () => {
    submitBtn.current.setLoadingValue(true);
    const validate = onValidate();
    if (validate) {
      const response = await FetchApi.setPasswordForApp(
        password.current.pass1,
        email,
        otp,
      );
      if (response.success) {
        const accountLogin = AccountService.getAccount();
        if (accountLogin && accountLogin.password) {
          accountLogin.password = password.current.pass1;
          AccountService.updateAccount(accountLogin);
        }
        navigation.navigate(keyNavigation.CONFIRM_MESS, {
          key: 'FORGOT_PASSWORD',
        });
      }
      if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        error.current = STRING.network_error_try_again_later;
      } else {
        error.current = STRING.can_not_change_pass_happy_waiting;
      }
    }
    submitBtn.current.setLoadingValue(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'パスワードを忘れた方'} leftGoBack />
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: COLOR.white,
            paddingTop: 25,
            paddingBottom: 40,
          }}>
          <AppText
            style={{
              marginHorizontal: 20,
              fontSize: 1.1 * sizeText,
              color: '#4D4D4D',
              fontFamily: 'irohamaru-Medium',
              marginBottom: 10,
            }}>
            再登録するパスワードを入力してください。
          </AppText>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              backgroundColor: '#47362B',
              fontFamily: 'irohamaru-Medium',
              marginVertical: 16,
            }}>
            <AppText
              style={{
                fontSize: 0.9 * sizeText,
                color: COLOR.white,
                fontFamily: 'irohamaru-Medium',
              }}>
              新しいパスワード
            </AppText>
          </View>
          <AppTextInput
            keyboardType={'ascii-capable'}
            textContentType={'password'}
            secureTextEntry
            onChangeText={onChangeText('pass1')}
            styleWrap={styles.input}
            styleInput={styles.textInput}
            maxLength={32}
          />

          <AppText
            style={{
              color: '#4D4D4D',
              fontSize: sizeText * 0.8,
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 6,
              opacity: 0.5,
            }}>
            ※確認のためもう一度入力してください
          </AppText>
          <AppTextInput
            keyboardType={'ascii-capable'}
            textContentType={'password'}
            secureTextEntry
            onChangeText={onChangeText('pass2')}
            styleWrap={styles.input}
            styleInput={styles.textInput}
            maxLength={32}
          />
        </View>
        <View style={{marginHorizontal: 40, paddingVertical: 40}}>
          {error.current !== null && (
            <AppText
              style={{
                fontSize: sizeText * 0.9,
                color: '#EF6572',
                marginBottom: 16,
                textAlign: 'center',
              }}>
              {error.current}
            </AppText>
          )}
          <AppTextButton
            onPress={onSubmit}
            ref={submitBtn}
            title={'パスワードを変更する'}
            style={styles.submitBtn}
            textStyle={styles.submitTextBtn}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(112,112,112,0.5)',
    borderRadius: 2,
    height: 50,
    marginHorizontal: 20,
  },
  textInput: {
    fontSize: SIZE.H3,
    padding: 10,
    color: '#4D4D4D',
  },
  submitBtn: {
    height: SIZE.height(7.5),
    backgroundColor: '#FF9A27',
  },
  submitTextBtn: {
    color: COLOR.white,
    fontSize: sizeText * 1.15,
    fontFamily: 'irohamaru-Medium',
  },
  errorText: {
    color: 'red',
    marginHorizontal: 20,
    marginVertical: 5,
    fontSize: sizeText,
  },
});

export default ChangePasswordForgot;
