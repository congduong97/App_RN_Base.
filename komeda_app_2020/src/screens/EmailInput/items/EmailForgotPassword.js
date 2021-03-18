//Library:
import React, {useRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Setup:
import {SIZE, COLOR, FetchApi, Validate, toASCII} from '../../../utils';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {STRING} from '../../../utils/constants/String';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
//Component:
import AppTextInput from '../../../elements/AppTextInput';
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import {OtpService} from '../../ActiveOTP/services/OtpService';

const sizeText = SIZE.H5;
const EmailForgotPassword = () => {
  const navigation = useNavigation();
  const email = useRef('');
  const submitBtn = useRef(null);
  const error = useRef('');
  const timer = useRef(0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    return () => {
      OtpService.removeCount(toASCII(email.current));
      clearTimeout(timer.current);
    };
  }, []);

  //Thay đổi nội dung email:
  const onChangeText = (value) => {
    email.current = value;
  };
  //Kiểm tra valid email đăng nhập:
  const checkValidEmail = () => {
    const checkValidEmail = Validate.email(email.current);
    if (checkValidEmail && !checkValidEmail.status) {
      error.current = checkValidEmail.message;
      submitBtn.current.setLoadingValue(false);
      forceUpdate();
      return false;
    } else {
      error.current = '';
      forceUpdate();
      return true;
    }
  };
  //Chuyển đến màn hình active OTP khi nhập email thành công:
  const onSubmit = async () => {
    error.current = '';
    submitBtn.current.setLoadingValue(true);
    if (email.current === '') {
      error.current = STRING.need_input_email;
      timer.current = setTimeout(function () {
        submitBtn.current.setLoadingValue(false);
      }, 500);
      forceUpdate();
      return;
    }

    const checkEmail = checkValidEmail();
    if (checkEmail) {
      const newEmail = toASCII(email.current);
      OtpService.initCount(newEmail);
      const countOtp = OtpService.getCountOtp(newEmail);
      const listEmail = OtpService.get();
      if (newEmail in listEmail || countOtp === 2) {
        OtpService.updateCount(newEmail);
        navigation.navigate(keyNavigation.ACTIVE_OTP, {
          key: 'FORGOT_PASSWORD',
          email: newEmail,
        });
        submitBtn.current.setLoadingValue(false);
        return;
      }
      const response = await FetchApi.forgotPasswordApp(newEmail);
      if (response.success) {
        OtpService.updateCount(newEmail);
        navigation.navigate(keyNavigation.ACTIVE_OTP, {
          key: 'FORGOT_PASSWORD',
          email: newEmail,
        });
      } else if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        error.current = STRING.network_error_try_again_later;
        forceUpdate();
      } else {
        error.current = 'メールアドレスが正しくありません。';
        forceUpdate();
      }
      timer.current = setTimeout(function () {
        submitBtn.current.setLoadingValue(false);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'パスワードを忘れた方'} leftGoBack />
      <KeyboardAwareScrollView>
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
              marginBottom: 20,
            }}>
            ご登録のメールアドレスを入力し、認証コードを送信してください。
          </AppText>
          <AppTextInput
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            onChangeText={onChangeText}
            styleWrap={styles.input}
            styleInput={styles.textInput}
          />

          <AppText
            style={{
              color: '#4D4D4D',
              fontSize: sizeText * 0.8,
              marginHorizontal: 20,
              marginTop: 15,
              marginBottom: 6,
              opacity: 0.5,
            }}>
            ※「komeda-info.com」からのドメイン受信許可設定をしてください。
          </AppText>
        </View>
        <View style={{paddingTop: 30}}>
          {error.current.length > 0 && (
            <AppText
              style={{
                fontSize: SIZE.H5,
                color: '#EF6572',
                marginHorizontal: 40,
                marginBottom: 16,
                textAlign: 'center',
                fontFamily: 'irohamaru-Medium',
              }}>
              {error.current}
            </AppText>
          )}
          <AppTextButton
            onPress={onSubmit}
            ref={submitBtn}
            title={'認証コードを送信する'}
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
  textInput: {fontSize: SIZE.H5 * 1.2, padding: 10, color: '#4D4D4D'},
  submitBtn: {
    marginHorizontal: 40,
    height: SIZE.height(7.5),
    backgroundColor: '#FF9A27',
    borderRadius: 0,
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
export default EmailForgotPassword;
