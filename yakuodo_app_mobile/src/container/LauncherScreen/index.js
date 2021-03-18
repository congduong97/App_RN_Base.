import React, {PureComponent} from 'react';
import {View, StyleSheet, Alert, Linking, AppState} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {IDFA} from "react-native-idfa";
import {RNShopSdkBanner} from 'react-native-shop-sdk';
import Orientation from 'react-native-orientation-locker';
import Permissions, {
  checkNotifications,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';
import {setColor} from './setColor';
import {
  APP,
  isIOS,
  DEVICE_ID,
  SENDER_ID,
  dataSave,
  managerAcount,
  device,
  keyAsyncStorage,
  versionApp,
  SYSTEAM_VERSION,
  APP_ID,
  stateSercurity,
} from '../../const/System';
import {COLOR_WHITE} from '../../const/Color';
import {Api} from '../../service';
import {NetworkError, Loading} from '../../commons';
import {pushResetScreen} from '../../util';
import {setTabScreen} from './setTabScreen';
import {setSetting} from './setSetting';
import {STRING} from '../../const/String';
import {UpdateApp} from './UpdateApp';
import SplashScreen from 'react-native-splash-screen';
let loadRegisterDevice = false;
const loadDataCompanySuccess = false;
export let registerDeviceSuccess = false;

export default class Launcher extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      isTime: false,
      progressValue: 0.1,
      loading: true,
      firstLauching: true,
      maintain: false,
      needUpdate: false,
      messageUpdate: '',
    };
    try {
      RNShopSdkBanner.init();
      RNShopSdkBanner.saveMemberCode('');
    } catch (error) {
      // alert(error.message);
    }

    this.renderContent = this.renderContent.bind(this);
  }
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('tranta Appstate : ', AppState.currentState);
      if (!isConnected && AppState.currentState === 'active') {
        setTimeout(() => {
          Alert.alert(
            'ネットワークエラー',
            'インターネット接続を確認してください。',
          );
        }, 1000);
      }
    });
    Orientation.lockToPortrait();

    SplashScreen.hide();

    this.callApiFirtOppenApp();

    // AsyncStorage.getItem('deviceToken')
  }

  componentWillUnmount() {
    this.state.firstLauching = false;
  }

  onMounted = async () => {
    await this.getApi();
  };

  getApi = async () => {
    const firstDownload = await AsyncStorage.getItem(
      keyAsyncStorage.firstDownload,
    );
    let loadError = false;

    try {
      const resUpdateData = await Api.checkUpdateApp(0);
      if (
        resUpdateData.code === 200 &&
        resUpdateData.res.status.code === 1000
      ) {
        this.state.firstLauching = false;
        if (resUpdateData.res.data.change) {
          const {
            appInfoDto,
            colorInfoDto,
            imageInfoDto,
            menuInfoDto,
            slideInfoDto,
            termInfoDto,
            policyInfoDto,
            groupBannerDto,
            onSecurityIOS,
            onSecurityAndroid,
            onSendOTPByEmailIOS,
            onSendOTPByEmailAndroid,
            maxNumberOfConsecutiveSmsByPhone,
            namespace,
          } = resUpdateData.res.data.checkAppData;
          if (appInfoDto && appInfoDto.change) {
            await AsyncStorage.setItem(
              'mobileApp',
              JSON.stringify(appInfoDto.appDataDto),
            );
            APP.IMAGE_LOGO = appInfoDto.appDataDto.logo;
          }
          if (policyInfoDto && policyInfoDto.change) {
            await AsyncStorage.setItem(
              'policy',
              policyInfoDto.policyEntity.content,
            );
          }
          if (colorInfoDto && colorInfoDto.change) {
            await AsyncStorage.setItem(
              'appColor',
              JSON.stringify(colorInfoDto.colorDataDto.colorEntities),
            );
          }
          if (imageInfoDto && imageInfoDto.change) {
            await AsyncStorage.setItem(
              'introducing',
              JSON.stringify(imageInfoDto.imageDataDto.introducingImages),
            );
          }
          if (menuInfoDto && menuInfoDto.change) {
            await AsyncStorage.setItem(
              'menu',
              JSON.stringify(menuInfoDto.menuDataDto.parentMenuDto),
            );
            await AsyncStorage.setItem(
              'bottomMenu',
              JSON.stringify(menuInfoDto.menuDataDto.bottomMenuDto),
            );
            await AsyncStorage.setItem(
              'iconNotification',
              menuInfoDto.menuDataDto.companyNotificationIcon,
            );
            await AsyncStorage.setItem(
              'nameNotification',
              menuInfoDto.menuDataDto.nameNotification,
            );
            await AsyncStorage.setItem(
              'namePushNotification',
              menuInfoDto.menuDataDto.namePushNotification,
            );
            await AsyncStorage.setItem(
              'iconPushNotification',
              menuInfoDto.menuDataDto.pushNotificationIcon,
            );
            await AsyncStorage.setItem(
              'subMenu',
              JSON.stringify(menuInfoDto.menuDataDto.subMenuDto.menuEntities),
            );
          }
          if (slideInfoDto && slideInfoDto.change) {
            await AsyncStorage.setItem(
              'slider',
              JSON.stringify(slideInfoDto.slideDataDto.sliderImageEntities),
            );
          }
          if (termInfoDto && termInfoDto.change) {
            await AsyncStorage.setItem(
              'termInfo',
              termInfoDto.termOfUseEntity.content,
            );
          }
          if (groupBannerDto && groupBannerDto.change) {
            await AsyncStorage.setItem(
              'groupBanner',
              JSON.stringify(groupBannerDto.groupBannerEntity),
            );
          }

          stateSercurity.onSecurityIOS = onSecurityIOS;
          stateSercurity.maxNumberOfConsecutiveSmsByPhone = maxNumberOfConsecutiveSmsByPhone;
          stateSercurity.onSecurityAndroid = onSecurityAndroid;
          stateSercurity.onSendOTPByEmailIOS = onSendOTPByEmailIOS;
          stateSercurity.onSecurity = isIOS ? onSecurityIOS : onSecurityAndroid;
          stateSercurity.onSendOTPByEmail = isIOS
            ? onSendOTPByEmailIOS
            : onSendOTPByEmailAndroid;
          stateSercurity.onSendOTPByEmailAndroid = onSendOTPByEmailAndroid;
          stateSercurity.namespace = namespace;
          await AsyncStorage.setItem(
            keyAsyncStorage.stateSercurity,
            JSON.stringify(stateSercurity),
          );
        }
        if (!loadError) {
          await AsyncStorage.setItem(keyAsyncStorage.firstDownload, 'success');
        }
      } else {
        // alert('loadError');
        // alert('resUpdateData');

        loadError = true;
      }
    } catch (err) {
      // alert(JSON.stringify(err));

      loadError = true;
    } finally {
      if (firstDownload) {
        this.checkSlider();
      } else if (!loadError) {
        this.checkSlider();
      } else {
        // alert('this.state.networkError');

        this.state.networkError = true;
        // this.setState({ networkError: true });
      }
    }
  };

  requestTracking = async () => {
    const res = await Permissions.request(
      PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
    );
    if (res === 'granted') {
      return true;
    } else {
      return false;
    }
  };

  getIDFA = async () => {
    try {
      const DeviceIDFA = await AsyncStorage.getItem(keyAsyncStorage.idfa);
      console.log('DeviceIDFA', DeviceIDFA);
      const deviceTokenFake = await AsyncStorage.getItem(
        keyAsyncStorage.deviceTokenFake,
      );
      if (!DeviceIDFA && !deviceTokenFake) {
        let idfa = DEVICE_ID;
        try {
          await this.requestTracking();
          console.log('permiss');
          const check = await IDFA.getIDFA();
          console.log('oke', check);
          if (
            !check ||
            check === '' ||
            check.toLowerCase().includes('0000000')
          ) {
            idfa = DEVICE_ID;
            // console.log('erridfa');
          } else {
            idfa = check;
          }
        } catch (e) {}
        device.ADV_ID = idfa;
        AsyncStorage.setItem(keyAsyncStorage.idfa, idfa);
        // device.ADV_ID = '';
        // AsyncStorage.setItem(keyAsyncStorage.idfa, JSON.stringify(device.ADV_ID));
      } else {
        const adv = DeviceIDFA;
        device.ADV_ID = adv || '';
        // console.log('pushDeviceTokenAgain', DeviceIDFA);
        if (!adv || adv === '' || adv.toLowerCase().includes('0000000')) {
          //TODO set Item after call api

          const deviceToken = await AsyncStorage.getItem(
            keyAsyncStorage.deviceToken,
          );
          // console.log('deviceToken', deviceToken);
          const response = await Api.pushDeviceTokenAgain(
            deviceToken || '',
            DEVICE_ID,
          );
          // console.log('pushDeviceTokenAgain', response);
          if (response.code == 200 && response.res.status.code == 1000) {
            device.ADV_ID = DEVICE_ID;
            await AsyncStorage.setItem(keyAsyncStorage.idfa, DEVICE_ID);
          } else {
            device.ADV_ID = adv || '';
          }
        }
      }
    } catch (e) {}
  };
  callApiFirtOppenApp = async () => {
    // alert('callApiFirtOppenApp');
    this.setState({
      networkError: false,
      loading: true,
      maintain: false,
      needUpdate: false,
    });
    // await this.setState({ networkError: false, needUpdate: false, maintain: false });

    try {
      const maintain = await this.checkMaintain();
      if (!maintain) {
        await this.getIDFA();
        const checkPushDeviceToken = await this.pushDeviceTokenFake();
        // console.log('checkPushDeviceToken', checkPushDeviceToken);
        if (checkPushDeviceToken) {
          await this.checkVersionApp();
          registerDeviceSuccess = true;
        } else {
          this.state.networkError = true;
        }
      } else {
        this.state.maintain = true;
      }
    } catch (e) {
      this.state.networkError = true;
    } finally {
      this.setState({loading: false});
    }
  };

  checkVersionLocal = async () => {
    try {
      const resversion = await AsyncStorage.getItem(keyAsyncStorage.versionApp);
      if (resversion) {
        const {
          appId,
          osAnroid,
          osIos,
          versionAndroid,
          versionIos,
          statusIos,
          statusAndroid,
          messengerAndroid,
          messengerIos,
        } = JSON.parse(resversion);
        const version = isIOS ? versionIos : versionAndroid;
        if (
          parseFloat(version.replace(/\./g, '')) >
            parseFloat(versionApp.replace(/\./g, '')) &&
          appId == APP_ID &&
          (isIOS ? statusIos : statusAndroid)
        ) {
          this.setState({
            needUpdate: true,
            messageUpdate: isIOS ? messengerIos : messengerAndroid,
          });
        } else {
          await this.onMounted();
        }
      } else {
        await this.onMounted();
      }
    } catch (e) {
      await this.onMounted();
    }
  };

  checkVersionApp = async () => {
    try {
      const response = await Api.checkVersion();
      if (response.code == 200) {
        const {
          appId,
          osAnroid,
          osIos,
          versionAndroid,
          versionIos,
          statusIos,
          statusAndroid,
          messengerAndroid,
          messengerIos,
        } = response.res;
        const version = isIOS ? versionIos : versionAndroid;
        AsyncStorage.setItem(
          keyAsyncStorage.versionApp,
          JSON.stringify(response.res),
        );
        if (
          parseFloat(version.replace(/\./g, '')) >
            parseFloat(versionApp.replace(/\./g, '')) &&
          appId == APP_ID &&
          (isIOS ? statusIos : statusAndroid)
        ) {
          this.setState({
            needUpdate: true,
            messageUpdate: isIOS ? messengerIos : messengerAndroid,
          });
        } else {
          await this.onMounted();
        }
      } else {
        await this.onMounted();
      }
    } catch (e) {
      await this.checkVersionLocal();
      return false;
    }
  };
  checkMaintain = async () => {
    try {
      const maintain = await Api.getMaintain();
      // console.log('maintain', maintain);
      if (maintain.code == 200) {
        return false;
      }
      // ko call dc den server
      return true;
    } catch (e) {
      // alert('ee');
      return false;
    }
  };
  pushDeviceTokenFake = async () => {
    if (loadRegisterDevice) {
      return false;
    }
    loadRegisterDevice = true;
    try {
      const checkPushDevice = await AsyncStorage.getItem(
        keyAsyncStorage.deviceTokenFake,
      );
      if (!checkPushDevice) {
        const response = await Api.pushDeviceToken('');
        if (response.code == 200 && response.res.status.code == 1000) {
          // alert('deviceTokenFake');

          AsyncStorage.setItem(keyAsyncStorage.deviceTokenFake, 'success');
          return true;
        }
        // alert('errpushDeviceTokenFake');

        return false;
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      loadRegisterDevice = false;
    }
  };

  checkSlider = async () => {
    const {navigation} = this.props;

    // set AppColor
    // await setI18n();
    await setColor();
    await setTabScreen();
    await setSetting();

    const isAgree = await AsyncStorage.getItem(keyAsyncStorage.isAgree);
    //firstLauching is used to make sure that app can only call getApi one time

    if (isAgree) {
      const mobileApp = await AsyncStorage.getItem('mobileApp');
      if (JSON.parse(mobileApp).alwaysDisplayIntroducingImage === true) {
        pushResetScreen(navigation, 'Over');
      } else {
        if (managerAcount.enablePasswordOppenApp && stateSercurity.onSecurity) {
          pushResetScreen(this.props.navigation, 'EnterPassMyPageAndOppenApp', {
            nameScreen: 'HomeNavigator',
          });
        } else {
          pushResetScreen(this.props.navigation, 'HomeNavigator');
        }
      }
    } else {
      pushResetScreen(navigation, 'Over');
    }
  };

  renderContent() {
    const {networkError, maintain, needUpdate, messageUpdate} = this.state;
    if (networkError) {
      return <NetworkError onPress={this.callApiFirtOppenApp} />;
    }
    if (maintain) {
      return (
        <NetworkError
          onPress={this.callApiFirtOppenApp}
          iconName={'gears'}
          title={STRING.maintail}
        />
      );
    }
    if (needUpdate) {
      return (
        <UpdateApp
          onPress={() => {
            Linking.openURL(
              isIOS
                ? 'https://itunes.apple.com/jp/app/id1321343906?mt=8'
                : 'https://play.google.com/store/apps/details?id=jp.co.yakuodo.android.public&hl=ja',
            );
          }}
          title={messageUpdate}
        />
      );
    }
    return <Loading size={40} />;
  }
  render() {
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_WHITE,
  },
});
