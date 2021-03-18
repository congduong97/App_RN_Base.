//Library:
import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Setup:
import {SIZE, COLOR, FetchApi, Validate, toASCII} from '../../../utils';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {STRING} from '../../../utils/constants/String';

//Component:
import AppTextInput from '../../../elements/AppTextInput';
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import {AccountService} from '../../../utils/services/AccountService';
import {OtpService} from '../../ActiveOTP/services/OtpService';

const sizeText = SIZE.H5;
const ChangeEmailMyPage = () => {
  const emailLocal = useRef('');
  const navigation = useNavigation();
  const email = useRef('');
  const [inputEmail, setStateInputEmail] = useState('');
  const submitBtn = useRef(null);
  const error = useRef('');
  const timerSubmit = useRef(0);
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const accountLogin = AccountService.getAccount();
    if (accountLogin) {
      emailLocal.current = accountLogin.email;
    }
    return () => {
      clearTimeout(timerSubmit.current);
    };
  }, []);

  //Thay đổi nội dung email:
  const onChangeText = (value) => {
    setStateInputEmail(value);
    email.current = value;
  };
  //Quay lại màn hình Mypage:
  const comeBackMypage = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
  };

  //Chuyển đến màn hình active OTP khi nhập email thành công:
  const onSubmit = async () => {
    error.current = '';
    submitBtn.current.setLoadingValue(true);
    if (!email.current) {
      error.current = STRING.please_input_new_email;
      submitBtn.current.setLoadingValue(false);
      forceUpdate();
      return;
    }

    if (email.current && emailLocal.current) {
      const checkValidEmail = Validate.email(email.current);
      const newEmail = toASCII(email.current);
      if (checkValidEmail && !checkValidEmail.status) {
        error.current = checkValidEmail.message;
        submitBtn.current.setLoadingValue(false);
        forceUpdate();
        return;
      } else {
        if (newEmail == emailLocal.current) {
          error.current = STRING.username_already_exists_in_data;
          forceUpdate();
        } else {
          OtpService.initCount(newEmail);
          const countOtp = OtpService.getCountOtp(newEmail);
          const listEmail = OtpService.get();
          if (newEmail in listEmail || countOtp === 2) {
            OtpService.updateCount(newEmail);
            navigation.navigate(keyNavigation.ACTIVE_OTP, {
              key: 'CHANGE_EMAIL',
              email: newEmail,
            });
            submitBtn.current.setLoadingValue(false);
            return;
          }
          const response = await FetchApi.changeEmail(
            emailLocal.current,
            newEmail,
          );
          if (response.success) {
            OtpService.updateCount(newEmail);
            error.current = '';
            forceUpdate();
            navigation.navigate(keyNavigation.ACTIVE_OTP, {
              key: 'CHANGE_EMAIL',
              email: newEmail,
            });
          } else if (
            response &&
            response.message == STRING.network_error_try_again_later
          ) {
            error.current = STRING.network_error_try_again_later;
            forceUpdate();
          } else {
            error.current = STRING.username_already_exists_in_data;
            forceUpdate();
          }
        }
      }
    }
    timerSubmit.current = setTimeout(() => {
      submitBtn.current.setLoadingValue(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'メールアドレスの変更'} leftGoBack />
      <View
        style={{
          backgroundColor: COLOR.white,
          paddingTop: 25,
          paddingBottom: 40,
        }}>
        {/* Tiêu đề của màn hình */}
        <AppText
          style={{
            marginHorizontal: 20,
            fontSize: 1.1 * sizeText,
            color: '#4D4D4D',
            fontFamily: 'irohamaru-Medium',
            marginBottom: 20,
          }}>
          変更するメールアドレスを入力し、認証コードを 送信してください。
        </AppText>
        {/* Nhập địa chỉ email　mới */}
        <AppTextInput
          keyboardType={'email-address'}
          autoCapitalize={'none'}
          onChangeText={onChangeText}
          styleWrap={styles.input}
          styleInput={styles.textInput}
          defaultValue={inputEmail}
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
      {/* Phần lỗi chữ màu đỏ */}
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
        {/* Nút ấn quay lại màn hình Mpage: */}
        <View
          style={{
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
              marginTop: SIZE.width(5),
            }}>
            マイアカウントTOPにもどる
          </AppText>
        </View>
      </View>
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
    fontSize: SIZE.H5 * 1.2,
    fontFamily: 'irohamaru-Medium',
  },
  errorText: {
    color: 'red',
    marginHorizontal: 20,
    marginVertical: 5,
    fontSize: sizeText,
  },
});
export default ChangeEmailMyPage;
