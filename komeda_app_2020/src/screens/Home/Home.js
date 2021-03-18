//Library:
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  ScrollView,
  RefreshControl,
  SafeAreaView,
  AppState,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';
import PushNotification from 'react-native-push-notification';
import {useFocusEffect} from '@react-navigation/native';
import BadgeAndroid from 'react-native-android-badge';
import {TouchableOpacity} from 'react-native-gesture-handler';

//Setup:
import {STRING} from '../../utils/constants/String';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {FetchApi, AsyncStoreKey, SIZE, COLOR, isIos} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {ShopSdk} from '../../utils/services/ShopSDK';

//Component:
import HomeSlider from './items/HomeSlider';
import HomeMenu from './items/HomeMenu';
import HomeAuth from './items/HomeAuth';
import HomeNotice from './items/HomeNotice';
import {NetworkError} from '../../elements/NetworkError';
import ExpireLoginModal from '../../elements/ExpireLoginModal';
import {ErrorView, AppHeader, AppImage, Loading, AppText} from '../../elements';

//Services:
import NotifService from '../../utils/services/NotifService';
import {AccountService} from '../../utils/services/AccountService';
import {PushNotificationService} from '../../utils/services/PushNotificationService';
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import {BottomService} from '../../navigators/services/BottomService';
import {StateUserService} from './services/StateUserService';
import ServicesUpdatePointAndMoneyHome from '../../utils/services/ServicesUpdatePointAndMoneyHome';

const Home = ({navigation, route}) => {
  const appState = useRef(AppState.currentState);
  const [refreshing, setRefreshing] = useState(false);
  const {homeMainMenu, setAppData, isShowBottom} = useContext(ContextContainer);
  const [slider, setSlider] = useState();
  const [notice, setNotice] = useState();
  const [countNotice, setCountNotice] = useState(
    PushNotificationService.getCountNewNotification(),
  );
  const [expireLogin, setStateModalExpireLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState('NO_LOGIN');
  const [point, setPoint] = useState(0);
  const [money, setMoney] = useState(0);
  const [error, setError] = useState({
    maintain: false,
    network: false,
  });

  useEffect(() => {
    new NotifService().configure();
    StateUserService.onChange('auth', updateLogginedUser);
    onDidMount();
    PushNotificationService.onChange('resetNoti', (data) => {
      setCountNotice(data);
      setBadge(data);
    });
    AppState.addEventListener('change', handleAppStateChange);
    ServicesUpdatePointAndMoneyHome.onChange('HomeScreen', (ojb) => {
      console.log('ojb', ojb);
      setPoint(ojb.point);
      setMoney(ojb.money);
    });
    ServicesUpdateComponent.onChange('HomeNotiUpdate', (event) => {
      if (event === 'AUTO_LOGIN_ERROR') {
        setStateModalExpireLogin(true);
      }
      if (event === 'UPDATE_COUNT_PUSH_NOTICE_HOME') {
        getNumberNewNotification();
      }
    });
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      ServicesUpdateComponent.remove('HomeNotiUpdate');
      ServicesUpdatePointAndMoneyHome.remove('HomeScreen');
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (!isShowBottom) {
        BottomService.setDisplay(false);
      }
      if (isShowBottom) {
        BottomService.setDisplay(true);
      }

      return () => {
        BottomService.setDisplay(true);
      };
    }, [isShowBottom]),
  );

  //Từ background vào App:
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current === 'background' && nextAppState === 'active') {
      await onRefresh();
    }

    appState.current = nextAppState;
    console.log(nextAppState);
  };

  const onDidMount = async () => {
    if (!loading) {
      setLoading(true);
    }
    getSlide();
    getNotice();
    getNumberNewNotification();
    getAuthState();
    const userLoggined = await AsyncStorage.getItem(AsyncStoreKey.account);
    if (userLoggined) {
      ShopSdk.collectDeviceInfo();
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    if (!refreshing) {
      setRefreshing(true);
    }
    await onRefreshData();
    setRefreshing(false);
  };

  //Load lại cấu hình App:
  const onRefreshData = async () => {
    if (!loading) {
      setLoading(true);
    }
    if (error.maintain || error.network) {
      setError({maintain: false, network: false});
    }
    getAuthState();
    setUpApp();
    getSlide();
    getNotice();
    getNumberNewNotification();
    setLoading(false);
  };

  const updateLogginedUser = () => {
    setUpApp();
    getSlide();
    getNotice();
    getNumberNewNotification();
    getAuthState();
  };

  //Thay đổi App.
  const setUpApp = useCallback(async () => {
    const currentVersion = await AsyncStorage.getItem(
      AsyncStoreKey.currentVersion1,
    );
    const versionAPI = currentVersion ? JSON.parse(currentVersion) : '0';
    const response = await FetchApi.getAppData(versionAPI);
    if (response.success) {
      setAppData(response.data);
    } else if (response.status_code >= 500) {
      setError({...error, maintain: true});
    } else {
      setError({...error, network: true});
    }
  }, []);

  //Lấy số lượng point và monney nếu người dùng đã login:
  const getAuthState = async () => {
    const acc = AccountService.getAccount();
    console.log('acc>>>', acc);
    if (acc) {
      if (acc.money !== null && acc.point !== null) {
        setAuthState('LINKED_CARD');
        const response = await FetchApi.getBalanceAndPoint();
        console.log('%c getBalanceAndPoint', 'color:red', response);
        if (response.success && response.data) {
          setPoint(response.data.point || 0);
          setMoney(response.data.money || 0);
        }
        return;
      }
      setAuthState('LOGINED');
    }
  };

  //Lấy danh sách slider:
  const getSlide = async () => {
    const response = await FetchApi.getHomeSlider();
    console.log(response, 'response getSlide');

    if (response.success) {
      setSlider(response.data);
    } else if (response.status_code >= 500) {
      setError({...error, maintain: true});
    } else {
      setError({...error, network: true});
    }
  };

  //set số cho icon app:
  const setBadge = (countNoti) => {
    if (isIos) {
      PushNotification.setApplicationIconBadgeNumber(countNoti);
    } else {
      BadgeAndroid.setBadge(countNoti);
    }
  };

  //Lấy danh sách thông báo:
  const getNotice = async () => {
    const response = await FetchApi.getHomeNotice();

    if (response.success) {
      setNotice(response.data);
    } else {
      setNotice(null);
    }
  };

  //Lấy số lượng push chưa đọc:
  const getNumberNewNotification = async () => {
    const response = await FetchApi.getNumberNewNotification();

    if (response.success) {
      if (response.data > 0) {
        setCountNotice(1);
        PushNotificationService.set(1);
        setBadge(1);
      } else {
        setCountNotice(0);
        PushNotificationService.set(0);
        setBadge(0);
        new NotifService().cancelAll();
      }
    }
  };

  //Ấn vào xem chi tiết thông báo:
  const onOpenNotification = () => {
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.PUSH_NOTIFICATION,
    });
  };

  //Danh sách menu phụ:
  const onOpenSubMenu = () => {
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.SUB_MENU,
    });
  };

  //Hiển thị nội dung:
  const renderContent = () => {
    //Tài khoản bị vô hiêu hóa hoặc không thể tự động login:
    if (expireLogin) {
      return <ExpireLoginModal />;
    }
    if (loading) {
      return <Loading />;
    }
    //Mất mạng:
    if (error.network) {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={() => onRefreshData()}
        />
      );
    }
    //Bảo trì máy chủ:
    if (error.maintain) {
      return (
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName={STRING.server_maintain}
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
        <HomeNotice notice={notice} />
        <HomeSlider slider={slider} />
        <HomeAuth authState={authState} point={point} money={money} />
        <HomeMenu homeMainMenu={homeMainMenu} />
      </ScrollView>
    );
  };

  const renderTitle = () => {
    return (
      <View
        style={{
          paddingVertical: 6,
          backgroundColor: '#3D2516',
          width: SIZE.device_width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
        }}>
        <TouchableOpacity
          hitSlop={{right: 20, top: 10, left: 10, bottom: 20}}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={onOpenNotification}>
          <AppImage
            style={{
              height: SIZE.width(10),
              width: SIZE.width(10),
            }}
            resizeMode='contain'
            source={require('../../utils/images/noti.png')}
          />

          {!!countNotice && (
            <View
              style={{
                borderWidth: 1,
                marginLeft: 6,
                borderColor: COLOR.white,
                height: SIZE.width(6),
                width: SIZE.width(6),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SIZE.width(3),
              }}>
              <AppText
                style={{
                  color: COLOR.white,
                  fontWeight: 'bold',
                  fontSize: SIZE.H5 * 1.1,
                }}>
                N
              </AppText>
            </View>
          )}
        </TouchableOpacity>
        <AppImage
          style={{
            height: SIZE.width(8),
            width: SIZE.width(30),
            marginLeft: !!countNotice ? -SIZE.width(6) - 6 : 0,
          }}
          resizeMode='contain'
          source={require('../../utils/images/homelogo.png')}
        />
        <TouchableOpacity
          hitSlop={{top: 10, right: 10, left: 10, bottom: 10}}
          onPress={onOpenSubMenu}>
          <AppImage
            style={{
              height: SIZE.width(8),
              width: SIZE.width(8),
            }}
            resizeMode='contain'
            source={require('../../utils/images/setting.png')}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: '#D8BD6E', flex: 1}}>
      <SafeAreaView style={{backgroundColor: COLOR.white}} />
      <AppHeader renderTitleProp={renderTitle} />
      {renderContent()}
    </View>
  );
};

export default withInteractionsManaged(Home);

//Lưu ý: _Không chuyển được call API vào trong vì liên quan đến Home.
