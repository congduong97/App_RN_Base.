//Lybrari:
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import SplashScreen from 'react-native-splash-screen';

//Setup:
import {AsyncStoreKey, FetchApi, isIos} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {CheckUpdateVersion} from './utils/CheckUpdateVersion';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {ErrorView, Loading} from '../../elements';
import {AccountService} from '../../utils/services/AccountService';
import {SliderAppIntro} from './items/SliderAppIntro';
import {UpdateAppStore} from '../../elements/UpdateAppStore';
import ModalUpdateAppStore from '../../elements/ModalUpdateAppStore';
import {NetworkError} from '../../elements/NetworkError';
import {STRING} from '../../utils/constants/String';
import {ShopSdk} from '../../utils/services/ShopSDK';
import PushNotification from 'react-native-push-notification';
import {OtpService} from '../ActiveOTP/services/OtpService';

//Lấy account từ Async nếu có:
AccountService.init();
//Khởi tạo ShopSdk:
ShopSdk.init();
//
OtpService.initBlackList();

const AppIntro = ({navigation}) => {
  let checkError = false;
  const {setAppData, appIntroImage} = useContext(ContextContainer);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const linkStore = useRef('');
  const messUpdate = useRef('');
  const versionAppStore = useRef('');
  const compulsoryUpdate = useRef(false);

  useEffect(() => {
    onDidMount();
  }, []);

  //Kiểm tra các cấu hình lần lượt theo thứ tự:
  const onDidMount = async () => {
    setLoading(true);
    if (error !== null) {
      setError(null);
    }
    await RegistrationDeviceID();
    await checVersionUpdate();
    await setUpAppAPI();
    if (isIos) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    } else {
      setTimeout(() => {
        SplashScreen.hide();
      }, 800);
    }
    setLoading(false);
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
    if (response.success) {
      const checkResult = await CheckUpdateVersion(response);
      //Bắt buộc phải update App:
      if (checkResult.needUpdate === true) {
        checkError = 'APP_NEED_UPDATE';
        linkStore.current = checkResult.linkUpdateStore;
        messUpdate.current = checkResult.messenge;
        compulsoryUpdate.current = checkResult.needUpdate;
        versionAppStore.current = checkResult.versionAppInStore;
      }
      //Không bắt buộc phải update app:
      if (checkResult.needUpdate == false) {
        //Case nên update App:
        if (checkResult.shouldUpdate == 'SHOULD_UPDATE_APP') {
          checkError = 'SHOULD_UPDATE_APP';
          linkStore.current = checkResult.linkUpdateStore;
          messUpdate.current = checkResult.messenge;
          compulsoryUpdate.current = checkResult.needUpdate;
          versionAppStore.current = checkResult.versionAppInStore;
        }
        //Case dùng app bình thường:
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
  const setUpAppAPI = async () => {
    if (checkError) {
      setError(checkError);
      return;
    }
    const hasLaunched = await AsyncStorage.getItem(AsyncStoreKey.hasLaunched);
    if (hasLaunched !== 'hasLaunched') {
      PushNotification.setApplicationIconBadgeNumber(0);
    }
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      await setAppData(response.data);
      const alwaysDisplayIntroducingImage = await AsyncStorage.getItem(
        AsyncStoreKey.alwaysDisplayIntroducingImage,
      );
      if (
        hasLaunched === 'hasLaunched' &&
        alwaysDisplayIntroducingImage === 'one'
      ) {
        navigation.reset({
          routes: [
            {
              name: keyNavigation.MAIN_NAVIGATOR,
            },
          ],
        });

        return;
      }
    } else if (response.status_code >= 500) {
      checkError = 'server_maintain';
    } else {
      checkError = 'network';
      setError(checkError);
    }
    // new NotifService().configure();
  };

  //Loading:
  if (loading) {
    return <Loading />;
  }

  //Mất mạng
  if (error === 'network') {
    return (
      <NetworkError
        title={STRING.network_error_try_again_later}
        onPress={() => onDidMount()}
      />
    );
  }

  //Server đang bảo trì:
  if (error == 'server_maintain') {
    return (
      <ErrorView
        icon={{name: 'ios-settings'}}
        errorName={STRING.server_maintain}
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

export default AppIntro;
