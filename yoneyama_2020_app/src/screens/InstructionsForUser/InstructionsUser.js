//Library:
import React, {useContext, useEffect, useState, useCallback} from 'react';
import {View, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {AppImage, AppTextButton, ErrorView} from '../../elements';
import {
  SIZE,
  COLOR,
  APP_ID,
  APP_ID1,
  APP_ID2,
  AsyncStoreKey,
  FetchApi,
} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {ContextContainer} from '../../contexts/AppContext';
import {AppText} from '../../elements/AppText';
import {AccountService} from '../../utils/services/AccountService';
import NotifService from '../../utils/services/NotifService';
import {AppService} from '../../utils/services/AppServices';
import {AppIdService} from '../../utils/services/AppIdService';
import {NetworkError} from '../../elements/NetworkError';

const InstructionsUser = ({navigation, route}) => {
  const {logoApp, colorApp, setAppData2, setAppData} = useContext(
    ContextContainer,
  );
  const [checkLoginAccount, setStateCheckLogin] = useState(false);
  const [error, setError] = useState({
    maintain: false,
    network: false,
  });
  useEffect(() => {
    checkLogin();
    AppService.onChange('update-app-intro', updateApp);
    return () => {
      AppService.deleteKey('update-app-intro');
    };
  }, []);

  //Đăng kí tài khoản:
  const onResisgerAccount = () => {
    navigation.navigate(keyNavigation.AUTH_NAVIGATOR, {
      screen: keyNavigation.REGISTER,
    });
  };

  //Update App khi chọn app ở màn hình Home:
  const updateApp = async (id) => {
    if ((id === 1 && APP_ID === APP_ID1) || (id === 2 && APP_ID === APP_ID2)) {
      return;
    } else {
      if (id === 1) {
        await AppIdService.update(APP_ID1);
        setUpApp1();
      } else {
        await AppIdService.update(APP_ID2);
        setUpApp2();
      }
    }
  };

  const refreshScreen = () => {
    if (error.maintain || error.network) {
      setError({maintain: false, network: false});
    }
    const appID = AppIdService.get();
    if (appID == APP_ID1) {
      setUpApp1();
    } else {
      setUpApp2();
    }
  };
  //Call API thay đổi cấu hình App 1:
  const setUpApp1 = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      setAppData(response.data);
    } else {
      if (response.status_code >= 500) {
        setError({...error, maintain: true});
      } else {
        setError({...error, network: true});
      }
    }
  }, []);

  //Call API thay đổi cấu hình App 2:
  const setUpApp2 = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion2,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response.success) {
      setAppData2(response.data);
    } else {
      if (response.status_code >= 500) {
        setError({...error, maintain: true});
      } else {
        setError({...error, network: true});
      }
    }
  }, []);

  //Kiểm tra tài khoản đã đăng nhập hay chưa:
  const checkLogin = async () => {
    const accountLogin = AccountService.getAccount();

    if (accountLogin) {
      setStateCheckLogin(true);
    } else {
      new NotifService().configure();
      setStateCheckLogin(false);
    }
  };

  //Đăng nhập:
  const onLogin = () => {
    navigation.navigate(keyNavigation.AUTH_NAVIGATOR, {
      screen: keyNavigation.LOGIN,
      params: {
        activeOTP: '',
        account: '',
      },
    });
  };

  //Vào màn hình Home mà không cần đăng kí:
  const onGoHomeWithoutLogin = () => {
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.HOME,
    });
  };

  //Chữ giới thiệu App:
  const renderTextInstruction = () => {
    return (
      <View
        style={{
          width: SIZE.width(96),
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: SIZE.width(2),
        }}>
        <AppText
          style={{
            padding: SIZE.width(0.5),
            fontSize: SIZE.H5 * 1.3,
            fontWeight: '400',
            color: colorApp.textColor,
          }}>
          新規会員登録後すぐにデジタル会員バーコードでポイントを貯めることができます。
        </AppText>
      </View>
    );
  };

  //Mất mạng:
  if (error.network) {
    return (
      <NetworkError
        title={
          'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
        }
        onPress={refreshScreen}
      />
    );
  }

  //Bảo trì máy chủ:
  if (error.maintain) {
    return (
      <ErrorView
        textStyle={{fontSize: SIZE.H4}}
        icon={{name: 'ios-settings'}}
        errorName="只今、システムメンテナンス中です。"
        onPress={refreshScreen}
      />
    );
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colorApp.backgroundColor}}>
      <StatusBar backgroundColor={COLOR.grey_300} barStyle="dark-content" />
      {/* Ảnh logo App */}
      <AppImage
        source={{uri: logoApp}}
        style={styles.logoApp}
        resizeMode="contain"
      />
      {/* Đoạn text giới thiệu app */}
      {renderTextInstruction()}
      <View
        style={{
          padding: SIZE.width(3),
          margin: SIZE.width(3),
          borderWidth: 1.5,
          borderColor: COLOR.red,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.3, color: COLOR.red}}>
          ご注意
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.18,
            color: COLOR.red,
            textDecorationLine: 'underline',
            marginTop: SIZE.width(2),
          }}>
          店舗で発行している「板ポイントカード」をアプリにご登録いただくことはできません。
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.18,
            color: COLOR.red,
            marginTop: SIZE.width(2),
          }}>
          デジタルポイントカードまたは店舗発行の板カードのどちらかをご利用ください。
        </AppText>
      </View>
      <AppTextButton
        style={styles.button}
        title={'新規会員登録'}
        textStyle={styles.textButton}
        onPress={onResisgerAccount}
      />
      <AppTextButton
        style={styles.button}
        title={'アプリ会員の方はこちら'}
        textStyle={styles.textButton}
        onPress={onLogin}
      />

      {checkLoginAccount ? null : (
        <AppText
          style={{
            textAlign: 'right',
            width: SIZE.width(90),
            color: COLOR.main_color,
            textDecorationLine: 'underline',
            fontSize: SIZE.H4 * 0.9,
            marginLeft: SIZE.width(5),
          }}
          onPress={onGoHomeWithoutLogin}>
          会員登録せずアプリを利用する
        </AppText>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoApp: {
    height: SIZE.icon_button * 3,
    width: SIZE.width(85),
    alignSelf: 'center',
    marginTop: SIZE.width(12),
  },
  button: {
    height: SIZE.width(13),
    width: SIZE.width(90),
    marginBottom: SIZE.width(3),
    borderWidth: 1,
    borderColor: COLOR.main_color,
    alignSelf: 'center',
    borderRadius: 0,
  },
  textButton: {
    color: COLOR.main_color,
    fontSize: SIZE.H4 * 0.9,
  },
});

export default InstructionsUser;
