//Lybrari:
import React, {useContext, useState, useRef, useLayoutEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import PushNotification from 'react-native-push-notification';

//Setup:
import {AsyncStoreKey, FetchApi, APP_ID2, isIos} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {CheckUpdateVersionApp} from './utils/CheckUpdateVersionApp';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import SliderAppIntro from './items/SliderAppIntro';
import ModalUpdateAppStore from '../../elements/ModalUpdateAppStore';
import {ErrorView, Loading} from '../../elements';
import {UpdateAppStore} from '../../elements/UpdateAppStore';
import {NetworkError} from '../../elements/NetworkError';

//Services:
import {ShopSdk} from '../../utils/services/ShopSDK';
import {AccountService} from '../../utils/services/AccountService';
import {AppIdService} from '../../utils/services/AppIdService';

//Lấy account từ Async nếu có
AccountService.init();
//Lấy appID từ Async chưa có khởi tạo
AppIdService.init();
//Init shopsdk;
ShopSdk.init();

const AppIntro = ({navigation}) => {
  let checkError = false;
  const {setAppData, setAppData2, appIntroImage} = useContext(ContextContainer);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const linkStore = useRef('');
  const messUpdate = useRef('');
  const versionAppStore = useRef('');
  const compulsoryUpdate = useRef(false);
  const accountActiveOTP = useRef({});
  const timeCountSplash = useRef(0);

  useLayoutEffect(() => {
    onDidMount();
    return () => {
      clearTimeout(timeCountSplash.current);
    };
  }, []);

  //Kiểm tra các cấu hình lần lượt theo thứ tự:
  const onDidMount = async () => {
    setLoading(true);
    if (error !== null) {
      setError(null);
    }
    await RegistrationDeviceID();
    await checVersionUpdate();
    await setUpApp();
    if (isIos) {
      try {
        RNBootSplash.hide({duration: 1000});
      } catch (error) {}
    } else {
      RNBootSplash.hide({duration: 1000});
    }
    setLoading(false);
  };

  //Kiểm tra tài khoản login đang active OTP lần trước đang xịt hay không để tự động sang màn Active OTP:
  const checkAccountLoginActiveOTP = async () => {
    const checkLoginActiveOTP = JSON.parse(
      await AsyncStorage.getItem(AsyncStoreKey.accountActiveOTPLogin),
    );
    accountActiveOTP.current = checkLoginActiveOTP;
    if (!checkLoginActiveOTP) {
      return 'NOT_LOGIN';
    }
    if (
      checkLoginActiveOTP &&
      checkLoginActiveOTP.activeOTP === 'NOT_ACTIVE_OTP' &&
      checkLoginActiveOTP.otpType === 'LOGIN'
    ) {
      return 'NOT_ACTIVE_OTP';
    } else {
      return 'ACTIVE_OTP';
    }
  };

  //API đăng kí ID của thiết bị:
  const RegistrationDeviceID = async () => {
    const registration = await AsyncStorage.getItem(
      AsyncStoreKey.registration_deviceID,
    );
    if (registration == null) {
      const response = await FetchApi.registrationDeviceId();
      if (response && response.success) {
        await AsyncStorage.setItem(
          AsyncStoreKey.registration_deviceID,
          'DEVICE_ID_SUCCESS',
        );
      } else if (response.status_code >= 500) {
        checkError = 'server_maintain';
      } else {
        checkError = 'network';
      }
    }
  };

  //API kiểm tra server có đang bảo trì và version app cần phải update:
  const checVersionUpdate = async () => {
    if (checkError) {
      return;
    }
    const response = await FetchApi.checkVerionUpdate();
    if (response && response.success) {
      const checkResult = await CheckUpdateVersionApp(response);
      //Bắt buộc phải update App:
      if (checkResult.needUpdate === true) {
        checkError = 'APP_NEED_UPDATE';
        linkStore.current = checkResult.linkUpdateStore;
        messUpdate.current = checkResult.messenge;
        compulsoryUpdate.current = checkResult.needUpdate;
        versionAppStore.current = checkResult.versionAppInStore;
      }
      //Nên update App:
      if (checkResult.needUpdate == false) {
        //Case nên update App:
        if (checkResult.shouldUpdate == 'SHOULD_UPDATE_APP') {
          checkError = 'SHOULD_UPDATE_APP';
          linkStore.current = checkResult.linkUpdateStore;
          messUpdate.current = checkResult.messenge;
          compulsoryUpdate.current = checkResult.needUpdate;
          versionAppStore.current = checkResult.versionAppInStore;
        }
        //Case dùng app bình thường
        if (checkResult.shouldUpdate == 'NO_UPDATE') {
          checkError = '';
          linkStore.current = checkResult.linkUpdateStore;
          messUpdate.current = checkResult.messenge;
          compulsoryUpdate.current = checkResult.needUpdate;
          versionAppStore.current = checkResult.versionAppInStore;
        }
      }
    } else if (response.status_code >= 500) {
      checkError = 'server_maintain';
    } else {
      checkError = 'network';
    }
  };

  //API lấy dữ liệu và các cấu hình app :
  const setUpApp = async () => {
    if (checkError) {
      setError(checkError);
      return;
    }
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    //Nếu lần đầu gỡ đi cài lại App thì set badge vể 0 tránh lưu cache.
    if (isIos && hasLaunched !== 'hasLaunched') {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
    const userLoggined = await AsyncStorage.getItem(AsyncStoreKey.account);
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const checkAccountIsActiveOTP = await checkAccountLoginActiveOTP();
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      await setAppData(response.data);
      const appId = await AsyncStorage.getItem(AsyncStoreKey.appId);
      if (appId === APP_ID2) {
        await AppIdService.update(APP_ID2);
        const currentVersion = await AsyncStorage.getItem(
          AsyncStoreKey.currentVersion2,
        );
        const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
        const response = await FetchApi.getAppData(versionAPI);
        if (response && response.success) {
          setAppData2(response.data);
        }
      }
      if (
        checkAccountIsActiveOTP &&
        checkAccountIsActiveOTP === 'NOT_ACTIVE_OTP'
      ) {
        navigation.navigate(keyNavigation.AUTH_NAVIGATOR, {
          screen: keyNavigation.LOGIN,
          params: {
            activeOTP: 'NOT_ACTIVE_OTP',
            account: accountActiveOTP.current,
          },
        });
        return;
      }
      const alwaysDisplayIntroducingImage = await AsyncStorage.getItem(
        AsyncStoreKey.alwaysDisplayIntroducingImage,
      );

      if (userLoggined && alwaysDisplayIntroducingImage === 'one') {
        navigation.reset({
          routes: [
            {
              name: keyNavigation.MAIN_NAVIGATOR,
            },
          ],
        });

        return;
      } else if (
        hasLaunched === 'hasLaunched' &&
        alwaysDisplayIntroducingImage === 'one'
      ) {
        navigation.reset({
          routes: [{name: keyNavigation.GUIDE}],
        });
        return;
      }
    } else if (response.status_code >= 500) {
      checkError = 'server_maintain';
    } else {
      checkError = 'network';
      setError(checkError);
    }
  };

  //Loading:
  if (loading) {
    return <Loading />;
  }

  //Mất mạng
  if (error === 'network') {
    return (
      <NetworkError
        title={
          'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
        }
        onPress={() => onDidMount()}
      />
    );
  }

  //Server đang bảo trì:
  if (error == 'server_maintain') {
    return (
      <ErrorView
        icon={{name: 'ios-settings'}}
        errorName="只今、システムメンテナンス中です。"
        onPress={onDidMount}
      />
    );
  }

  //App nên update :
  if (error == 'SHOULD_UPDATE_APP') {
    return (
      <ModalUpdateAppStore
        onDidMount={onDidMount}
        linkStore={linkStore.current}
        versionAppStore={versionAppStore.current}
        messUpdate={messUpdate.current}
      />
    );
  }

  //App cần update:
  if (error == 'APP_NEED_UPDATE') {
    return (
      <UpdateAppStore
        showLogo
        linkStore={linkStore.current}
        messUpdate={messUpdate.current}
        versionAppStore={versionAppStore.current}
      />
    );
  }

  return <SliderAppIntro appIntroImage={appIntroImage} />;
};

export default React.memo(AppIntro);
