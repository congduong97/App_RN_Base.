import React, {PureComponent} from 'react';
import PushNotification from 'react-native-push-notification';
import {
  isIOS,
  SENDER_ID,
  keyAsyncStorage,
  managerAcount,
  screen,
  device,
  dataSave,
  stateSercurity,
} from '../../const/System';
import {RNShopSdkBanner, RNShopSDKWebLink} from 'react-native-shop-sdk';
import NotificationCount from '../../service/NotificationCount';
import AsyncStorage from '@react-native-community/async-storage';

import {AppState, Alert, Linking} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {STRING} from '../../const/String';
import {Api} from '../../service';
import {checkUpdateDataApp} from '../LauncherScreen/checkVersionAllApp';
import ReloadScreen from '../../service/ReloadScreen';
import CurrentScreen from '../../service/CurrentScreen';
import NavigationService from '../../service/NavigationService';
import {ServiveModal} from './util/service';
import {renderHome} from '.';
import {registerDeviceSuccess} from '../LauncherScreen';
import {serviceDeeplink} from '../HomeScreen/util/service';
import { AlertService } from '../../service/AlertService';
import EddyStoneScanner from '../../nativelib/react-native-eddystone-scanner';

export const clickNotification = {
  status: false,
};
export const notificationApp = {
  deviceToken: null,
  status: null,
  dataNotification: null,
};

// import console = require('console');
export class SetUpNotification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openByNotification: false,
      callRegisterDeviceToken: false,
      listNotificationChange: [],
    };
  }
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    if (isIOS) {
      this.getNotificationCenter();
    }
    NotificationCount.onChange('SetUpNotification', () => {
      const dataNoti = notificationApp.dataNotification;

      if (dataNoti) {
        try {
          this.handleNotification(dataNoti);
        } catch (error) {}
        notificationApp.dataNotification = null;
      } else {
        if (
          notificationApp.deviceToken &&
          !this.state.callRegisterDeviceToken
        ) {
          this.pushDeviceTokenToServer(notificationApp.deviceToken);
        }
      }
    });

    const pushScreen = this.pushScreen;
    const setWayToOpen = this.setWayToOpen;
    this.pushTimeout = setTimeout(() => this.pushSdk(), 1000);

    const pushDeviceTokenToServer = this.pushDeviceTokenToServer;

    PushNotification.configure({
      onNotification(notification) {
        clickNotification.status = true;
        setWayToOpen(notification);
        const data = isIOS ? notification.data.data : notification.data;

        try {
          if (data) {
            if (data.notificationContentType === 'BANNER') {
              RNShopSdkBanner.showBannerWithData(data);
            } else if (data.notificationContentType === 'LINK_WEBVIEW') {
              RNShopSDKWebLink.openWebView(
                notification,
                device.ADV_ID,
                managerAcount.memberCode,
              );
            } else {
              pushScreen(notification);
            }
          } else {
            pushScreen(notification);
          }
        } catch (e) {}
      },
      onRegister(token) {
        // console.log('onRegister', token);
        if (registerDeviceSuccess) {
          pushDeviceTokenToServer(token);
        } else {
          notificationApp.deviceToken = token;
        }
      },
      senderID: SENDER_ID,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });
  }
  pushDeviceTokenToServer = async token => {
    try {
      if (this.state.callRegisterDeviceToken) {
        return;
      }
      this.state.callRegisterDeviceToken = true;
      const deviceToken = await AsyncStorage.getItem(
        keyAsyncStorage.deviceToken,
      );
      if (!deviceToken || token.token !== deviceToken) {
        RNShopSdkBanner.registDeviceToken(token.token, '');
        const response = await Api.pushOnlyDeviceToken(token.token);
        if (response.code === 200 && response.res.status.code === 1000) {
          await AsyncStorage.setItem(keyAsyncStorage.deviceToken, token.token);
        }
      }
    } catch (error) {
    } finally {
    }
  };

  /**
   * if user open app by sdk notification set openByNotification=true
   * currently just set implement for ios
   */
  setWayToOpen = notification => {
    if (notification.userInteraction && this.state) {
      this.state.openByNotification = true;
    } else {
      this.state.openByNotification = false;
    }
  };
  getNotificationCenter = () => {
    if (PushNotificationIOS.getDeliveredNotifications) {
      PushNotificationIOS.getDeliveredNotifications(notifications => {
        // alert(JSON.stringify(notifications));
        const listNotification = [];

        if (
          notifications &&
          Array.isArray(notifications) &&
          notifications.length > 0
        ) {
          for (let i = 0; i < notifications.length; i++) {
            if (
              notifications[i].userInfo &&
              notifications[i].userInfo.customData
            ) {
              listNotification.push(notifications[i].userInfo.customData);
            }
          }
        }
        this.state.listNotificationChange = listNotification;
      });
    }
  };
  handleAppStateChange = nextAppState => {
    // console.log('nextAppState', nextAppState);
    if (nextAppState === 'active' && renderHome) {
      checkUpdateDataApp();
    }
    if (nextAppState !== 'active') {
      clickNotification.status = false;
    }

    if (isIOS) {
      if (nextAppState === 'active') {
        RNShopSdkBanner.getUserAds(result => {
          if (result && result.data) {
            RNShopSdkBanner.showBannerWithData(result.data);
          }
        });

        this.getNotificationCenter();
      }
    }
  };

  pushSdk = () => {
    const {openByNotification} = this.state;

    if (!openByNotification) {
      // console.log('RNShopSdkBanner', RNShopSdkBanner);
      RNShopSdkBanner.getUserAds(result => {
        if (result && result.data) {
          RNShopSdkBanner.showBannerWithData(result.data);
        }
      });
    }
  };

  setTimeUpdateNotification = () => {
    NotificationCount.set(0);
    const time = new Date().getTime() + 90000;
    AsyncStorage.setItem('timeUpdateNotification', time.toString());
  };

  pushScreen = async notification => {
    try {
      const {foreground, userInteraction} = notification;
      if (!foreground) {
        //ios click notifi from backgournd
        if (userInteraction && isIOS) {
          if (this.timeOutHanderPushNotification) {
            clearTimeout(this.timeOutHanderPushNotification);
          }

          this.timeOutHanderPushNotification = setTimeout(() => {
            this.handleNotification(notification);
          }, 500);
          return;
        }
        // Android click notifi from backgournd
        if (userInteraction) {
          this.handleNotification(notification);
          return;
        }
        // android backGround
        if (!isIOS && !userInteraction) {
          const countNoti = NotificationCount.get() + 1;
          NotificationCount.set(countNoti);
        }

        return;
      }
      if (foreground) {
        if (isIOS) {
          let checkStatusClickNotification = false;
          this.state.listNotificationChange.map(item => {
            if (
              item.notificationId == notification.data.customData.notificationId
            ) {
              checkStatusClickNotification = true;
            }
          });
          //ios notification center
          if (checkStatusClickNotification) {
            this.handleNotification(notification);
            return;
          }
          // ios onNotification
          const countNoti = NotificationCount.get() + 1;
          NotificationCount.set(countNoti);
          if (registerDeviceSuccess) {
            this.showNotification(notification);
          }
          return;
        }
        //android OnNotification
        const countNoti = NotificationCount.get() + 1;
        NotificationCount.set(countNoti);
      }
    } catch (e) {}
  };

  handleNotification = notification => {
    //console.log("handleNotification : ", notification);
    const screenNow = CurrentScreen.get();
    if (
      screenNow == 'Launcher' ||
      screenNow == 'UpdateScreen' ||
      screenNow == 'Rule' ||
      screenNow == 'Over' ||
      screenNow == 'EnterPassMyPageAndOppenApp' ||
      screenNow == 'EnterNewPasswordApp' ||
      screenNow == 'EnterConfirmNewPasswordApp' ||
      !screenNow ||
      !registerDeviceSuccess
    ) {
      notificationApp.dataNotification = notification;
      return;
    }

    NotificationCount.set(0);
    this.setTimeUpdateNotification();
    const {navigation} = this.props;
    const useData = isIOS ? notification.data.customData : notification.data;
    // call click notification
    if (useData.typeOpen !== 1) {
      this.pushClick(useData.notificationId);
    }
    switch (useData.typeOpen) {
      case 2:
        if (CurrentScreen.get() === 'WEB_VIEW') {
          NavigationService.push('WEB_VIEW', {url: useData.linkWebview});
        } else {
          NavigationService.navigate('WEB_VIEW', {url: useData.linkWebview});
        }
        break;
      case 1:
        if (CurrentScreen.get() === 'DetailPushNotification') {
          NavigationService.push('DetailPushNotification', {
            id: useData.notificationId,
          });
        } else {
          NavigationService.navigate('DetailPushNotification', {
            id: useData.notificationId,
          });
        }

        break;
      case 4:
        if (managerAcount.userId) {
          if (useData.typeOpenBanner === 1) {
            ReloadScreen.set('LIST_BANNER');
            NavigationService.push('LIST_BANNER');
          } else {
            if (CurrentScreen.get() === 'WEB_VIEW') {
              NavigationService.push('WEB_VIEW', {
                url: `${useData.linkApply}${managerAcount.memberCode}`,
              });
            } else {
              NavigationService.navigate('WEB_VIEW', {
                url: `${useData.linkApply}${managerAcount.memberCode}`,
              });
            }
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

        break;

      default:
        if (useData.function == 'COLUMN') {
          const link = `${useData.urlColumn}?member=${managerAcount.memberCode}`;
          NavigationService.navigate('WEB_VIEW', {url: link});
        } else if (
          useData.function === 'COUPON' ||
          useData.function === 'VIDEO' ||
          useData.function === 'QR' ||
          useData.function === 'MY_PAGE'
        ) {
          if (managerAcount.userId) {
            if (
              useData.function === 'MY_PAGE' &&
              managerAcount.enablePasswordMyPage &&
              stateSercurity.onSecurity
            ) {
              NavigationService.navigate('EnterPassMyPageAndOppenApp', {
                nameScreen: 'MY_PAGE',
              });
              return;
            }
            if (useData.function == 'COUPON' && useData.keySearchCoupon) {
              dataSave.loadCouponSuccess = false;
              ReloadScreen.set(useData.function);
              NavigationService.navigate(useData.function, {
                keyWord: decodeURIComponent(useData.keySearchCoupon),
              });
              let dataDeepLink = {
                keySeach: decodeURIComponent(useData.keySearchCoupon),
              };
              dataDeepLink.search = true;
              serviceDeeplink.set(dataDeepLink);
            } else {
              if (useData.function == 'COUPON') {
                dataSave.loadCouponSuccess = false;
                ReloadScreen.set(useData.function);
                NavigationService.navigate(useData.function);
                return;
              }

              ReloadScreen.set(useData.function);
              NavigationService.navigate(useData.function);
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
        } else if (useData.function == 'PUSH_NOTIFICATION') {
          ReloadScreen.set(useData.function);

          NavigationService.navigate(useData.function);
        } else if (useData.function == 'LINK_APP') {
          // alert('ok');
          if (managerAcount.userId) {
            const urlLink = isIOS ? useData.urlIOS : useData.urlAndroid;
            const urlLinkAppStore = isIOS
              ? useData.urlAppstore
              : useData.urlCHPlay;

            Linking.canOpenURL(urlLink).then(supported => {
              if (!supported) {
                Linking.openURL(urlLinkAppStore).catch(error => {});
              } else {
                Linking.openURL(urlLink).catch(error => {});
              }
            });
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
        } else if (useData.function == 'ADVERTISING_PAGE') {
          AlertService.ableModal("CLICK_PUSH");
          if (isIOS) {
            AsyncStorage.setItem(keyAsyncStorage.isShowListAdvertisement, "NOT_SHOW");
          } else {
            EddyStoneScanner.setShowAdvPopupState("NOT_SHOW");
          }
          ReloadScreen.set(useData.function);
          // NavigationService.navigate(useData.function, {
          //   advertisingPageId: useData.advertisingPageId,
          //   beaconTerminalId: useData.beaconTerminalId,
          // });
        } else if (useData.function) {
          ReloadScreen.set(useData.function);
          NavigationService.navigate(useData.function);
        }
    }
  };
  showNotification = notification => {
    const {screenProps} = this.props;
    const config = {
      title:
        notification.title || notification.message.title || STRING.Notification,
      message: notification.message.body || notification.message,
      onPress: () => {
        this.handleNotification(notification);
      },
    };
    screenProps.showLocalNotification(config);
  };
  pushClick = async id => {
    try {
      Api.getPushNotificationDetail(id);
    } catch (e) {}
    // Api.clickPushNotification(id);
  };
  render() {
    return null;
  }
}
