//Library:
import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  ScrollView,
  RefreshControl,
  AppState,
  ActivityIndicator,
  View,
} from 'react-native';
import BadgeAndroid from 'react-native-android-badge';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  APP_ID1,
  FetchApi,
  AsyncStoreKey,
  APP_ID2,
  SIZE,
  COLOR,
  APP_ID,
  isIos,
  isAndroid,
  NavigationService,
} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';

//Component:
import HomeTabView from './item/HomeTabView';
import HomeSlider from './item/HomeSlider';
import {AppContainer, ErrorView} from '../../elements';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {AppText} from '../../elements/AppText';
import {NetworkError} from '../../elements/NetworkError';
import ExpireLoginModal from '../../elements/ExpireLoginModal';

//Services:
import {ShopSdk} from '../../utils/services/ShopSDK';
import {AppService} from '../../utils/services/AppServices';
import {BottomService} from '../../navigators/services/BottomService';
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import {AccountService} from '../../utils/services/AccountService';
import ServicesChangeIconBagger from '../../utils/services/ServicesChangeIconBagger';
import NotifServiceInApp from '../../utils/services/NotiServiceInApp';
import {AppIdService} from '../../utils/services/AppIdService';

const Home = ({navigation, route}) => {
  const [refreshing, setRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);
  const {colorApp, setAppData2, setAppData} = useContext(ContextContainer);
  const [index, setIndex] = useState(0);
  const [slider, setSlider] = useState([]);
  const [notice, setNotice] = useState(null);
  const [checkStatusNotiNew, setStateCheckStatusNotiNew] = useState(0);
  const [hasCoupon, setStateHasCoupon] = useState(0);
  const [countPushNoti, setStateCountPushNoti] = useState(0);
  const [checkLogin, setStateCheckLogin] = useState(false);
  const [expireLogin, setStateModalExpireLogin] = useState(false);
  const [error, setError] = useState({
    maintain: false,
    network: false,
    updateData: false,
  });
  const onRefresh = async () => {
    console.log(AccountService.getAccount());
    if (!refreshing) {
      setRefreshing(true);
    }
    if (checkLogin) {
      checkStatusHasNewCoupon();
    }
    await onRefreshData();
    setRefreshing(false);
  };

  const checkLoginAccount = () => {
    const accountLogin = AccountService.getAccount();
    console.log('%c Account', 'color:green', accountLogin);
    if (accountLogin) {
      setStateCheckLogin(true);
    }
  };

  useLayoutEffect(() => {
    new NotifServiceInApp().configure();
    onDidMount();
    checkLoginAccount();
    AppState.addEventListener('change', handleAppStateChange);
    //Thay ?????i Badge app:
    ServicesChangeIconBagger.onChange(
      'ServicesChangeIconBaggerApp',
      (numberIconApp) => {
        if (numberIconApp && numberIconApp > 0) {
          if (isIos) {
            PushNotification.setApplicationIconBadgeNumber(numberIconApp);
          } else {
            BadgeAndroid.setBadge(numberIconApp);
          }
        } else {
          if (isIos) {
            PushNotification.setApplicationIconBadgeNumber(0);
          } else {
            BadgeAndroid.setBadge(0);
          }
        }
      },
    );
    //L???ng nghe c??c event update l???i t???ng state c???a m??n h??nh Home.
    ServicesUpdateComponent.onChange('HomeNotiUpdate', (event) => {
      switch (event) {
        case 'AUTO_LOGIN_NETWORK_ERROR':
          setError({maintain: false, network: true});
          break;
        case 'AUTO_LOGIN_CODE_500':
          setError({maintain: true, network: false});
          break;
        case 'AUTO_LOGIN_ERROR':
          setStateModalExpireLogin(true);
          break;
        case 'RELOAD_API_COUNT_PUSH_NOTI_HOME':
          checkCountPushNotiHome();
          break;
        case 'UPDATE_NOTI_HOME':
          setStateCheckStatusNotiNew(0);
          getNotice();
          break;
        case 'RELOAD_LIST_PUSH_NOTI':
          setStateCountPushNoti(0);
          ServicesChangeIconBagger.set(0);
          break;
        case 'READ_DETAIL_PUSH_NOTI':
          setStateCountPushNoti(0);
          break;
        case 'READ_LIST_PUSH_NOTI':
          setStateCountPushNoti(0);
          break;
        case 'SEEN_LIST_COUPON':
          setStateHasCoupon(0);
          break;
        case 'UPDATE_CONFIG_APP1':
        case 'UPDATE_CONFIG_APP2':
          setError({...error, updateData: true});
          BottomService.setDisplay(false);
          setTimeout(() => {
            setError({...error, updateData: false});
            BottomService.setDisplay(true);
          }, 2000);
          break;
        default:
          break;
      }
    });
    AppService.onChange('update-app', updateApp);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      ServicesUpdateComponent.remove('HomeNotiUpdate');
      ServicesChangeIconBagger.remove('ServicesChangeIconBaggerApp');
    };
  }, []);

  const onDidMount = async () => {
    const appId = await AsyncStorage.getItem(AsyncStoreKey.appId);
    if (appId === APP_ID2) {
      setIndex(1);
    }
    getSlide();
    getNotice();
    checkStatusNotiHome();
    checkCountPushNotiHome();
    const userLoggined = await AsyncStorage.getItem(AsyncStoreKey.account);
    if (userLoggined) {
      ShopSdk.collectDeviceInfo();
      checkStatusHasNewCoupon();
    }
  };

  //T??? background v??o App:
  const handleAppStateChange = async (nextAppState) => {
    const currentScreen = NavigationService.navigationRef.current.getCurrentRoute()
      .name;
    if (nextAppState == 'active') {
      checkAppStateUpdateApp();
    }
    const secure = await AsyncStorage.getItem(AsyncStoreKey.app_secure);
    const getToggleSecure = await AsyncStorage.getItem(
      AsyncStoreKey.setup_secu_and_certy,
    );
    const toggleSecure = JSON.parse(getToggleSecure);
    let onSecure = false;
    if (
      (isIos && toggleSecure.usingSecurityIos) ||
      (isAndroid && toggleSecure.usingSecurityAndroid)
    ) {
      onSecure = true;
    }
    if (
      appState.current === 'background' &&
      nextAppState === 'active' &&
      secure === 'secure' &&
      onSecure &&
      currentScreen !== 'VIDEO_DETAIL' &&
      currentScreen !== 'STORE'
    ) {
      navigation.navigate(keyNavigation.APP_INPUT_PASSWORD, {in_app: true});
    }
    appState.current = nextAppState;
  };

  //T??? background v??o app call l???i API ki???m tra xem c?? th??ng tin g?? c???n update kh??ng?
  const checkAppStateUpdateApp = async () => {
    const appId = AppIdService.get();
    const userLoggined = await AsyncStorage.getItem(AsyncStoreKey.account);
    if (userLoggined) {
      checkStatusHasNewCoupon();
    }
    if (appId === APP_ID1) {
      setUpApp1();
    } else {
      setUpApp2();
    }
    getSlide();
    getNotice();
    checkStatusNotiHome();
    checkCountPushNotiHome();
  };

  //Update App khi ch???n app ??? m??n h??nh Home:
  const updateApp = async (id) => {
    if ((id === 1 && APP_ID === APP_ID1) || (id === 2 && APP_ID === APP_ID2)) {
      return;
    } else {
      if (id === 1) {
        setIndex(0);
        await AppIdService.update(APP_ID1);
      } else {
        setIndex(1);
        await AppIdService.update(APP_ID2);
      }
      getSlide();
      setUpApp2();
      getNotice();
    }
  };

  //Ki???m tra c?? th??ng b??o m???i kh??ng ????? hi???n th??? ch??? New tr??n Menu:
  const checkStatusNotiHome = async () => {
    const response = await FetchApi.checkStatusNotificationHome();
    if (response && response.code == 1000) {
      setStateCheckStatusNotiNew(response.data);
    } else {
      setStateCheckStatusNotiNew(0);
    }
  };

  //Ki???m tra xem c?? coupon m???i kh??ng ????? hi???n th??? ch??? new tr??n Menu:
  const checkStatusHasNewCoupon = async () => {
    const response = await FetchApi.checkNewCoupon();
    if (response && response.code == 1000) {
      setStateHasCoupon(response.data);
    } else {
      setStateHasCoupon(0);
    }
  };

  //Ki???m tra xem c?? s??? ?????m push m???i ??? tr??n item menu push kh??ng?
  const checkCountPushNotiHome = async () => {
    const response = await FetchApi.checkCountPushNotiMenu();
    if (response && response.code == 1000) {
      setStateCountPushNoti(response.data);
      if (response.data > 0) {
        ServicesChangeIconBagger.set(1);
      } else {
        ServicesChangeIconBagger.set(0);
      }
    } else {
      setStateCountPushNoti(0);
    }
  };

  //Load l???i c???u h??nh App:
  const onRefreshData = async () => {
    if (error.maintain || error.network) {
      setError({maintain: false, network: false});
    }
    const appId = AppIdService.get();
    if (appId === APP_ID1) {
      setUpApp1();
    } else {
      setUpApp2();
    }
    getSlide();
    getNotice();
    checkStatusNotiHome();
    checkCountPushNotiHome();
  };

  //Thay ?????i App b???ng b???m n??t ho???c vu???t tabview:
  const onChangeApp = async (index) => {
    BottomService.setDisplay(false);
    setIndex(index);
    if (index === 0) {
      await AppIdService.update(APP_ID1);
      setUpApp1();
    } else {
      await AppIdService.update(APP_ID2);
      setUpApp2();
    }
    if (checkLogin) {
      checkStatusHasNewCoupon();
    }
    getSlide();
    getNotice();
    checkStatusNotiHome();
    checkCountPushNotiHome();
    BottomService.setDisplay(true);
  };

  //Call API thay ?????i c???u h??nh App 1:
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

  //Call API thay ?????i c???u h??nh App 2:
  const setUpApp2 = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion2,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response && response.success) {
      setAppData2(response.data);
    } else {
      if (response.status_code >= 500) {
        setError({...error, maintain: true});
      } else {
        setError({...error, network: true});
      }
    }
  }, []);

  //L???y danh s??ch Slider:
  const getSlide = async () => {
    const response = await FetchApi.getHomeSlider();
    if (response && response.success) {
      setSlider(response.data);
    } else {
      //Tr?????ng h???p n??y r??i v??o case h???t h???n refresh token nh??ng slider ch??a k???p update ho???c ch??a c?? d??? li???u hi???n th???.
      //Kh??ng ???????c x??a case n??y g??y crash app ho???c m??n h??nh home Error! (Case ?????c bi???t)
      if (response && response.status_code == 200) {
        return;
      }
      if (response && response.status_code >= 500) {
        setError({...error, maintain: true});
      } else {
        setError({...error, network: true});
      }
    }
  };

  //L???y danh s??ch th??ng b??o m??n h??nh Home:
  const getNotice = async () => {
    const typeScreen = 'HOME_PAGE';
    const response = await FetchApi.getHomeNotice(typeScreen);
    // console.log('%c Response>>>Noti', 'color:yellow', response);
    if (response && response.success) {
      setNotice(response.data);
    } else {
      setNotice([]);
    }
  };

  //Hi???n th??? n???i dung:
  const renderContent = () => {
    //T??i kho???n b??? v?? hi??u h??a ho???c kh??ng th??? t??? ?????ng login:
    if (expireLogin) {
      return <ExpireLoginModal />;
    }
    //M???t m???ng:
    if (error.network) {
      return (
        <NetworkError
          title={
            '?????????????????????????????????????????????????????????????????????????????????????????????????????????'
          }
          onPress={() => onRefreshData()}
        />
      );
    }
    //B???o tr?? m??y ch???:
    if (error.maintain) {
      return (
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName="???????????????????????????????????????????????????"
          onPress={onRefreshData}
        />
      );
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: SIZE.width(5)}}>
        <HomeSlider slider={slider} index={index} getSlide={getSlide} />
        <HomeTabView
          index={index}
          onChangeApp={onChangeApp}
          notice={notice}
          slider={slider}
          hasCoupon={hasCoupon}
          checkStatusNotification={checkStatusNotiNew}
          countPushNoti={countPushNoti}
          refreshNotiHome={getNotice}
        />
      </ScrollView>
    );
  };

  //??ang update d??? li???u m???i cho App:
  if (error.updateData) {
    return (
      <View
        style={{
          width: SIZE.width(100),
          height: SIZE.height(100),
          backgroundColor: `${COLOR.black}90`,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}>
        <View
          style={{
            borderRadius: 16,
            padding: 20,
            backgroundColor: '#FEEACA',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color={COLOR.black} />
          <AppText style={{color: COLOR.black, marginTop: 20}}>
            {'????????????'}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <AppContainer style={{flex: 1, backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
};

export default withInteractionsManaged(Home);

//L??u ??: _Kh??ng chuy???n ???????c call API v??o trong v?? li??n quan ?????n Home.
