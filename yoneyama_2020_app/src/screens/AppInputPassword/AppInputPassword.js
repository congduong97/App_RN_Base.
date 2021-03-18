//Library:
import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import {SafeAreaView} from 'react-native-safe-area-context';

//Setup:
import {SIZE, AsyncStoreKey, ToastService, isIos, isAndroid} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import OtpInput from '../../elements/OtpInput';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import {AppText} from '../../elements/AppText';
import {Loading} from '../../elements';

const AppInputPassword = ({navigation, route}) => {
  const timeCount = useRef(0);
  const timer = useRef(null);
  const modalFotgot = useRef(null);
  const [loading, setStateLoading] = useState(true);

  useEffect(() => {
    checkSecureApp();
    timeCount.current = setTimeout(() => {
      setStateLoading(false);
    }, 1500);
    return () => {
      clearTimeout(timeCount.current);
      clearTimeout(timer.current);
    };
  }, []);

  //Quên mật khẩu:
  const navigateToForgotPass = () => {
    modalFotgot.current.setShowModal('');
  };

  //Lấy khóa key kiểm tra đặt mật mã:
  const checkSecureApp = async () => {
    let onSecure = false;
    const toggleSecure = JSON.parse(
      await AsyncStorage.getItem(AsyncStoreKey.setup_secu_and_certy),
    );
    const secure = await AsyncStorage.getItem(AsyncStoreKey.app_secure);
    if (toggleSecure) {
      if (
        (isIos && toggleSecure.usingSecurityIos) ||
        (isAndroid && toggleSecure.usingSecurityAndroid)
      ) {
        onSecure = true;
      }
    }
    if ((route.params === undefined && secure !== 'secure') || !onSecure) {
      navigation.reset({
        routes: [{name: keyNavigation.APP_INTRO}],
      });
    } else {
      if (isIos) {
        try {
          RNBootSplash.hide({duration: 1000});
        } catch (error) {}
      } else {
        RNBootSplash.hide({duration: 1000});
      }
    }
  };

  //Nhập mật khẩu:
  const onChangeValue = async (value) => {
    if (value.length === 4) {
      const pass = await AsyncStorage.getItem(AsyncStoreKey.app_password);
      if (value === pass) {
        if (!!route.params && route.params.mode === 'memmber') {
          navigation.navigate(keyNavigation.CERTIFICATE_MEMBER);
        } else {
          if (!!route.params && route.params.in_app) {
            navigation.goBack();
            return;
          } else {
            navigation.reset({
              routes: [{name: keyNavigation.APP_INTRO}],
            });
          }
        }
      } else {
        ToastService.showToast('パスワードは正しくないです');
      }
    }
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: 'transparent'}} />
      <AppText
        style={{
          fontSize: SIZE.H5 * 1.2,
          marginVertical: 20,
          alignSelf: 'center',
        }}>
        現在パスワードを入力してください
      </AppText>
      <OtpInput
        style={{width: SIZE.width(70), alignSelf: 'center'}}
        maxLength={1}
        numberInput={4}
        onChangeValue={onChangeValue}
      />
      <AppText
        style={{
          color: 'blue',
          marginVertical: 20,
          textDecorationLine: 'underline',
          alignSelf: 'flex-end',
          fontSize: SIZE.H5,
          marginRight: 20,
        }}
        onPress={navigateToForgotPass}>
        パスワードをお忘れの場合はこちら
      </AppText>
      <ForgotPassword ref={modalFotgot} />
    </View>
  );
};

export default React.memo(AppInputPassword);
