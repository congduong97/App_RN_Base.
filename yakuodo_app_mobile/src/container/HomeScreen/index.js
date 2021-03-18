import React, {PureComponent} from 'react';
import {
  StyleSheet,
  RefreshControl,
  UIManager,
  Alert,
  View,
  TouchableOpacity,
  AppState,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import UserChange from '../../service/UserChange';
import {RNShopSdkBanner} from 'react-native-shop-sdk';
import {useDarkMode} from 'react-native-dark-mode';
import {
  isIOS,
  DEVICE_WIDTH,
  managerAcount,
  dataSave,
  stateSercurity,
  keyAsyncStorage,
  device,
  URL,
} from '../../const/System';
import {STRING} from '../../const/String';
import {COLOR_GRAY_LIGHT, COLOR_WHITE} from '../../const/Color';
import HeaderIconRight from '../../commons/HeaderIconRight';
import {ListItemMenu} from './ListItem/ListItemMenu';
import {Notification} from './Notification';
import {SliderImage} from './SliderImage';
import {BannerPoint} from '../../component/BannerPoint';
import {clickNotification} from './SetUpNotifications';
import {
  checkLocationAddSDK,
  checkPermissionNotification,
} from './CheckPemission';
import {ModalQrCoupon} from './ModalUseQrCoupon';
import {BannerImage} from './BannerImage';
import ReloadScreen from '../../service/ReloadScreen';
import {checkUpdateDataApp} from '../LauncherScreen/checkVersionAllApp';
import ModalLogin from '../Account/item/ModalLogin';
import {ServiveModal} from './util/service';
import NotificationCount from '../../service/NotificationCount';
import EddyStoneScanner from '../../nativelib/react-native-eddystone-scanner';
import {Api} from '../../service';
import AsyncStorage from '@react-native-community/async-storage';
import {BluetoothStatus} from 'react-native-bluetooth-status';
import {AlertService} from '../../service/AlertService';
import Permissions, {PERMISSIONS, RESULTS} from 'react-native-permissions';
import {IDFA} from "react-native-idfa";

let checkPermissionApp = false;
export let renderHome = false;

export default class Home extends PureComponent {
  requestBluetoothPermissionIOS = false;
  appState = '';
   
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      isLoadingRefresh: false,
      slider: [],
      dataNotification: [],
      dataNotificationImportant: [],
      columnMenu: 2,
      menu: [],
      point: managerAcount.point,
      memberCode: managerAcount.memberCode,
      listNotificationChange: [],
      openByNotification: false,
    };
    this.appState = AppState.currentState;
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  showAdvertisement = async () => {
    if (isIOS) {
      const isShow = await AsyncStorage.getItem(
        keyAsyncStorage.isShowListAdvertisement,
      );
      console.log('isShow', isShow);
      if (isShow=="SHOW") {
        AlertService.ableModal('OPEN_APP');
      }
      AsyncStorage.setItem(keyAsyncStorage.isShowListAdvertisement, "NOT_SHOW");
    } else {
      const isShow = await EddyStoneScanner.isShowAdvPopup();
      if (isShow == "SHOW") {
        AlertService.ableModal('OPEN_APP');
      }
      EddyStoneScanner.setShowAdvPopupState("NOT_SHOW");
    }
    
  };
  componentDidMount() {
    console.log('device id ', device.ADV_ID);
    this.showAdvertisement();
    UserChange.onChange('userInfoAtHome', user => {
      //change user or point
      const {
        // mile,
        point,
        memberCode,
      } = user;
      // console.log('user', user);
      if (
        this.state.memberCode == null &&
        this.state.memberCode !== memberCode
      ) {
        this.setUpForAndroid();
      }

      if (this.state.memberCode !== memberCode) {
        //change user
        ReloadScreen.set('COUPON');
        this.state.memberCode = memberCode;
        RNShopSdkBanner.saveMemberCode(`${memberCode}`);
      }
      // console.log('user', user);
      this.setState({
        // mile,
        point,
        memberCode: memberCode,
      });
    });
    const {routeName} = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      this.importantNotification.refresh();
      this.companyNotification.refresh();
      // this.getCategoryCoupon();
      // if (managerAcount.userId) {
      //   this.getUserDetail();
      // }
    });

    // if (AppState.currentState === 'active') {
    //   RNShopSdkBanner.locationUpdateBackgroundMode(true);
    // } else {
    //   RNShopSdkBanner.locationUpdateBackgroundMode(false);
    // }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      if (!checkPermissionApp) {
        checkPermissionApp = true;
        checkLocationAddSDK();
        //android not suport check permission notification
        if (isIOS) {
          checkPermissionNotification();
        }
      }
    }, 1000);

    renderHome = true;

    if (this.notificationCountTimeout) {
      clearTimeout(this.notificationCountTimeout)
    }
    this.notificationCountTimeout = setTimeout(() => {
      NotificationCount.checkNotification();
    }, 1000);

    this.didUpdateEnterListener = EddyStoneScanner.EddyStoneScannerEmitter.addListener(
      'didUpdateEnterUIDBeacon',
      data => {
        console.log('didUpdateEnterUIDBeacon : ', data);
        this.updateBeaconInfo(data);
      },
    );

    AppState.addEventListener('change', this.handleAppStateChange);

    if (this.state.memberCode) {
      this.showTermsOfBeacon();
    }
    this.setStatusAllowToGetAdvertisingId();
  }

  setStatusAllowToGetAdvertisingId = async () => {
    let permission = false;
    if (isIOS) {
      let response = await Permissions.check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      console.log("tranta idfa permission ", response, Platform.Version);
      if (response === RESULTS.GRANTED) {
        permission = true;
      } 
      if (response === RESULTS.DENIED) {
        Permissions.request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        permission = false;
      }
    } else {
      permission = true;
    }
    const idfa = await IDFA.getIDFA();
    const status = await AsyncStorage.getItem(keyAsyncStorage.isInstalledApp);
    if (permission && status != 'yes') {
      Api.setStatusAllowToGetAdvertisingId(permission, idfa)
        .then(data => {
          console.log('tranta setStatusAllowToGetAdvertisingId data : ', data);
          if (data.code == 200 && data.res.status.code == 1000) {
            AsyncStorage.setItem(keyAsyncStorage.isInstalledApp, 'yes'); 
          } 
        })
        .catch(err=> {
          AsyncStorage.setItem(keyAsyncStorage.isInstalledApp, 'no');  
        })
    }
  }

  setUpForAndroid = () => {
    if (!isIOS) {
      EddyStoneScanner.setUp(
        URL,
        managerAcount.accessToken,
        device.ADV_ID,
        stateSercurity.namespace,
        managerAcount.memberCode
      );
    }
  };

  showTermsOfBeacon = async () => {
    if (!isIOS) {
      EddyStoneScanner.setUp(
        URL,
        managerAcount.accessToken,
        device.ADV_ID,
        stateSercurity.namespace,
        managerAcount.memberCode
      );
    }
    const isShow = await AsyncStorage.getItem(
      keyAsyncStorage.firstTimeShowTermUseBeacon,
    );
    if (isShow != 'yes') {
      this.props.navigation.navigate('TermsOfUseBeacon', {
        fromTo: 'HomeScreen',
      });
    } else {
      this.startScanEddyStone();
    }
  };

  startScanEddyStone = async () => {
    let allowUseBeacon = await AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon);
    if (allowUseBeacon == 'yes') {
      if (isIOS) {
        let curState = AppState.currentState;
        console.log('tranta current state home : ', curState);
        if (curState === 'active') {
          setTimeout(() => {
            EddyStoneScanner.startScanEddyStone();
          }, 1000);
          this.requestBluetoothPermissionIOS = true;
          setTimeout(()=> {
            this.checkBluetoothPermissionIOS();
          }, 2000);
        } else {
          EddyStoneScanner.startScanEddyStone();
        }
      } else {
        const bluetoothStatus = await BluetoothStatus.state();
        console.log('tranta bluetoothStatus ', bluetoothStatus);
        if (bluetoothStatus) {
          setTimeout(() => {
            EddyStoneScanner.startScanEddyStone();
          }, 2000);
        } else {
          Alert.alert(
            'ブルートゥーススキャン',
            'Beacon機能を利用するためにブルートゥースはONにしてください。',
            [
              {
                text: 'Cancel',
                onPress: () => {},
              },
              {
                text: 'Ok',
                onPress: () => {
                  BluetoothStatus.enable(true);
                  setTimeout(() => {
                    EddyStoneScanner.startScanEddyStone();
                  }, 2000);
                },
              },
            ],
            {cancelable: false},
          );
        }
      }
    }
  };

  getBeaconInfo = async instance => {
    try {
      let beaconInfo = await AsyncStorage.getItem(keyAsyncStorage.beaconInfo);
      if (beaconInfo == null) return -1;
      let beaconJSON = JSON.parse(beaconInfo);
      if (typeof beaconJSON !== 'object') {
        return -1;
      }
      if (beaconJSON[instance] == undefined) return -1;
      let time = Number(beaconJSON[instance]);
      if (isNaN(time)) return -1;
      return time;
    } catch (error) {
      return -1;
    }
  };

  setBeaconInfo = async (instance, time) => {
    try {
      let beaconInfo = await AsyncStorage.getItem(keyAsyncStorage.beaconInfo);
      let beaconObj = {};
      if (beaconInfo == null) {
        beaconObj[instance] = time;
      } else {
        beaconObj = JSON.parse(beaconInfo);
        if (typeof beaconObj !== 'object') {
          return;
        }
        beaconObj[instance] = time;
      }
      let beaconString = JSON.stringify(beaconObj);
      AsyncStorage.setItem(keyAsyncStorage.beaconInfo, beaconString);
    } catch (error) {}
  };

  sendInBeaconEvent = beacon => {
    Api.sendInBeaconEvent(beacon.namespace, beacon.instance)
      .then(res => {
        console.log('tranta detectBeacon success ', res);
        if (res.code == 200) {
          let curTime = new Date().getTime();
          let key = beacon.instance + managerAcount.memberCode; 
          this.setBeaconInfo(key, curTime);
          if (res.res.status.code == 1000) {
            AsyncStorage.setItem(keyAsyncStorage.isShowListAdvertisement, "SHOW");
          }
        }
      })
      .catch(err => {
        console.log('tranta sendInBeaconEvent error ', err);
      });
  };

  updateBeaconInfo = async beacon => {
    if (stateSercurity.namespace == beacon.namespace) {
      let curTime = new Date().getTime();
      let key = beacon.instance + managerAcount.memberCode;
      let lastDetectedTimestamp = await this.getBeaconInfo(key);
      console.log(
        'tranta ios lastDetectedTimestamp ',
        lastDetectedTimestamp,
        curTime,
      );
      if (lastDetectedTimestamp == -1) {
        this.sendInBeaconEvent(beacon);
        //this.setBeaconInfo(beacon.instance, curTime);
      } else if (curTime - lastDetectedTimestamp > 24 * 60 * 60 * 1000) {
        this.sendInBeaconEvent(beacon);
        //this.setBeaconInfo(beacon.instance, curTime);
      }
    }
  };

  refreshPage() {
    clickNotification.status = false;
    dataSave.loadCouponSuccess = false;
    checkUpdateDataApp();
    this.importantNotification.refresh();
    this.listItemMenu.refresh();
    // this.listItemMenu.refreshApiCouponNew();
    this.companyNotification.refresh();
    this.header.getApi();
    if (managerAcount.userId) {
      // this.getUserDetail();
    }
  }

  onPressBannerPoint = () => {
    const {navigation} = this.props;
    if (managerAcount.userId) {
      if (managerAcount.enablePasswordMyPage && stateSercurity.onSecurity) {
        navigation.navigate('EnterPassMyPageAndOppenApp', {
          nameScreen: 'MY_PAGE',
        });
      } else {
        navigation.navigate('MY_PAGE');
      }
    } else {
      Alert.alert(
        STRING.notification,
        STRING.please_login_to_use,
        [
          {
            text: STRING.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {text: STRING.ok, onPress: () => ServiveModal.set()},
        ],
        {cancelable: false},
      );
    }
  };

  checkBluetoothPermissionIOS = async ()=> {
    if (isIOS) {
      console.log("tranta  x focus app ");
      if (this.requestBluetoothPermissionIOS) {
        this.requestBluetoothPermissionIOS = false;
        let status = await EddyStoneScanner.checkBluetoothPermission(); 
        console.log("tranta x focus app 2 ", status);
        if (status.status == "denied") {
          Alert.alert(
            "“Yakuodo_Dev”がBeaconを検知できるよう、Bluetoothをオンにしてください。",
            "",
            [
              {
                text: "設定",
                onPress: ()=> Permissions.openSettings()
              },
              {
                text: "閉じる"
              }
            ],
            {
              cancelable: false
            }
          )
        }
      }
    }
  }

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      //console.log("App has come to the foreground!");
      this.showAdvertisement();
    }
    //this.setState({ appState: nextAppState });
    this.appState = nextAppState;
  };

  componentWillUnmount() {
    renderHome = false;
    this.requestBluetoothPermissionIOS = false;
    AppState.removeEventListener('change', this.handleAppStateChange);
    const {routeName} = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
    //RNShopSdkBanner.locationUpdateBackgroundMode(false);
    this.didUpdateEnterListener.remove();
  }

  render() {
    const {isLoadingRefresh, point} = this.state;
    const {navigation, screenProps} = this.props;
    const isDarkMode = useDarkMode;
    const barStyle = isDarkMode ? 'dark-content' : 'dark-content';

    return (
      <View style={styles.wrapperContainer}>
        <HeaderIconRight
          onRef={ref => {
            this.header = ref;
          }}
          navigation={navigation}
        />
        <ScrollView
          style={styles.wrapperBody}
          keyboardShouldPersistTaps={'always'}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => this.refreshPage()}
            />
          }>
          <SliderImage navigation={navigation} />
          <TouchableOpacity
            onPress={() => {
              this.onPressBannerPoint();
            }}>
            <BannerPoint
              namePoint={STRING.yourPoint}
              height={50}
              topPage
              countPoint={point}
            />
          </TouchableOpacity>
          <BannerImage navigation={this.props.navigation} />
          <ModalQrCoupon navigation={this.props.navigation} />
          <ModalLogin />

          {/* notification impotant */}
          <Notification
            navigation={navigation}
            onRef={ref => {
              this.importantNotification = ref;
            }}
            title={STRING.notification_important}
          />

          <ListItemMenu
            screenProps={screenProps}
            onRef={ref => {
              this.listItemMenu = ref;
            }}
            navigation={navigation}
            style={{backgroundColor: COLOR_WHITE}}
          />
          {/* Company notification */}
          <Notification
            onRef={ref => {
              this.companyNotification = ref;
            }}
            navigation={navigation}
            title={STRING.notification}
            seeMore
          />
        </ScrollView>
        {/* <BottomMenu /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    // height: DEVICE_HEIGHT
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flex: 1,
  },

  wrapperSpace: {
    height: 10,
  },
});
