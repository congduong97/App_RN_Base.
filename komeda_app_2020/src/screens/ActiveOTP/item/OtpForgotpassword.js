//Library:
import React, {useRef, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

//Setup:
import {SIZE, COLOR, FetchApi} from '../../../utils';
import {STRING} from '../../../utils/constants/String';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {useForceUpdate} from '../../../hooks/forceupdate';

//Component:
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import AppTextInput from '../../../elements/AppTextInput';
import Timer from './Timer';
import {OtpService} from '../services/OtpService';

export default function OtpForgotpassword() {
  const navigation = useNavigation();
  const forceUpdate = useForceUpdate();
  const route = useRoute();
  const {email} = route.params;
  const otp = useRef('');
  const error = useRef('');
  const submitBtn = useRef(null);
  const resendBtn = useRef(null);
  const timer = useRef();
  const timerLeft = useRef(0);
  const [disableHour, setdisableHour] = useState(false);
  const [disableResendOtp, setDisableResendOtp] = useState(false);
  const timerSubmit = useRef(0);
  const onChangeText = (value) => {
    otp.current = value;
  };

  useEffect(() => {
    checkMailInBlack();
    return () => {};
  }, []);

  useEffect(() => {
    if (disableHour) {
      timer.current = setTimeout(() => {
        error.current = '';
        setDisableResendOtp(false);
        setdisableHour(false);
        OtpService.remove(email);
        OtpService.removeCount(email);
      }, timerLeft.current);
    }

    return () => {
      clearInterval(timer.current);
      clearTimeout(timerSubmit.current);
    };
  }, [disableHour]);

  const checkMailInBlack = async () => {
    const listTime = OtpService.get();
    const countOtp = OtpService.getCountOtp(email);

    if (email in listTime) {
      timerLeft.current = listTime[email] - Date.now();

      if (timerLeft.current > 0) {
        error.current =
          '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。';
        setdisableHour(true);
        setDisableResendOtp(true);
        OtpService.updateCount(email, 3);
      } else {
        OtpService.removeCount(email);
        OtpService.remove(email);
      }
    } else if (countOtp > 2) {
      const mail0bj = {email, timeEnd: 3600000 + Math.floor(Date.now())};
      OtpService.updateBlackList(mail0bj);
      timerLeft.current = 3600000;
      error.current =
        '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。';
      setdisableHour(true);
      setDisableResendOtp(true);
    }
  };

  //Gửi lại mã OTP:
  const onResend = async () => {
    const countOtp = OtpService.getCountOtp(email);
    if (countOtp + 1 < 3) {
      resendBtn.current.setLoadingValue(true);
      OtpService.updateCount(email);
      const response = await FetchApi.resentOTP('FORGOT_PASSWORD', email);
      if (response.success) {
      } else {
        error.current.api = 'ERROR';
        forceUpdate();
      }
      resendBtn.current.setLoadingValue(false);
    } else {
      const mail0bj = {email, timeEnd: 3600000 + Math.floor(Date.now())};
      OtpService.updateBlackList(mail0bj);
      timerLeft.current = 3600000;
      error.current =
        '繰り返しの再送はできません。60分後に再度実施いただけます。メール受信設定をご確認いただくか、別のメールへの変更などご検討ください。';
      setdisableHour(true);
    }

    setDisableResendOtp(true);
  };

  //Xác thực mã OTP:
  const onSubmit = async () => {
    error.current = '';
    const needToken = false;
    submitBtn.current.setLoadingValue(true);
    if (otp.current === '') {
      error.current = STRING.need_otp;
      submitBtn.current.setLoadingValue(false);
      forceUpdate();
      return;
    }
    if (otp.current.length > 1 && otp.current.length < 6) {
      error.current = STRING.otp_wrong;
      submitBtn.current.setLoadingValue(false);
      forceUpdate();
      return;
    }
    const response = await FetchApi.activeOTP_SMS(
      otp.current,
      email,
      'FORGOT_PASSWORD',
      needToken,
    );
    if (response.success) {
      error.current == '';
      forceUpdate();
      navigation.navigate(keyNavigation.CHANGE_PASSWORD, {
        key: 'FORGOT_PASSWORD',
        email,
        otp: otp.current,
      });
    } else {
      if (response && response.code == 1043) {
        error.current = STRING.otp_wrong;
        forceUpdate();
      }
      if (response && response.code == 502) {
        error.current = STRING.network_error_try_again_later;
        forceUpdate();
      }
      if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        error.current = STRING.network_error_try_again_later;
        forceUpdate();
      }
    }
    timerSubmit.current = setTimeout(() => {
      submitBtn.current.setLoadingValue(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'パスワードを忘れた方'} leftGoBack />
      <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View
          style={{
            backgroundColor: COLOR.white,
            padding: 20,
            paddingVertical: 40,
          }}>
          <AppText
            style={{
              color: '#4D4D4D',
              fontSize: sizeText * 1.1,
              fontFamily: 'irohamaru-Medium',
            }}>
            入力されたメールアドレス宛に認証コードを送信しました。記載の認証コードを入力してください。
          </AppText>
          <AppText
            style={{
              color: '#EF6572',
              fontSize: sizeText,
              marginTop: 20,
              fontFamily: 'irohamaru-Medium',
            }}>
            ※認証コードの有効期限は10分です。
          </AppText>
          <AppText
            style={{
              color: '#EF6572',
              fontSize: sizeText,
              marginBottom: 20,
              fontFamily: 'irohamaru-Medium',
            }}>
            ※迷惑メールフィルタの設定によってはメールが届かない場合がございます。「komeda-info.com」ドメインからのEメール受信を許可するように設定をお願いいたします。
          </AppText>
          <AppText style={{opacity: 0.5, color: '#4D4D4D', marginBottom: 10}}>
            認証コードの入力欄
          </AppText>
          <AppTextInput
            keyboardType='numeric'
            maxLength={6}
            onChangeText={onChangeText}
            styleWrap={styles.input}
            styleInput={styles.textInput}
          />
        </View>
        <View style={{paddingTop: 30}}>
          {error.current.length > 0 && (
            <AppText
              style={{
                fontSize: sizeText * 0.9,
                color: '#EF6572',
                marginTop: 5,
                paddingHorizontal: 20,
                textAlign: 'center',
                paddingBottom: 5,
              }}>
              {error.current}
            </AppText>
          )}
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              alignItems: 'flex-end',
            }}>
            {!disableHour && disableResendOtp && (
              <Timer setDisableResendOtp={setDisableResendOtp} />
            )}
          </View>
          <AppTextButton
            onPress={onSubmit}
            ref={submitBtn}
            title={'認証'}
            style={styles.submitBtn}
            textStyle={styles.submitTextBtn}
          />
          <AppText
            style={{
              fontSize: sizeText,
              color: '#4D4D4D',
              marginHorizontal: 40,
              marginBottom: 20,
              marginTop: 20,
              textAlign: 'center',
            }}>
            認証コードが届かない / 有効期限が切れた場合
          </AppText>
          <AppTextButton
            disabled={disableResendOtp}
            onPress={onResend}
            ref={resendBtn}
            title={'認証コードを送信する'}
            colorSpinner={'#FF9A27'}
            style={{
              marginHorizontal: 40,
              height: SIZE.height(7.5),
              borderColor: '#FF9A27',
              backgroundColor: COLOR.white,
              borderWidth: 1,
              marginBottom: 20,
            }}
            textStyle={{color: '#FF9A27'}}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const sizeText = SIZE.H5;

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
  },
  textInput: {fontSize: SIZE.H4, padding: 10, color: '#4D4D4D'},
  submitBtn: {
    marginHorizontal: 40,
    height: SIZE.height(7.5),
    backgroundColor: '#FF9A27',
  },
  submitTextBtn: {
    color: COLOR.white,
    fontSize: sizeText * 1.15,
    fontFamily: 'irohamaru-Medium',
  },
});
