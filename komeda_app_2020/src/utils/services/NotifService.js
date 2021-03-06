//Library:
import {Linking} from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {isIos, AsyncStoreKey, isAndroid} from '../constants';
import {FetchApi} from '../modules';
import {NavigationService} from './NavigationService';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {checkUserLogin} from '../modules/CheckLogin';
import {PushNotificationService} from '../../utils/services/PushNotificationService';
import BadgeAndroid from 'react-native-android-badge';
import {openUlrBrowser} from '../modules/OpenURL';

export default class NotifService {
  constructor() {
    this.onNoticed = false;
  }

  async handleNotification(data) {
    if (!this.onNoticed) {
      const {
        notificationId,
        typeOpen,
        linkWebview,
        linkPDF,
        functionName,
        typeOpenLink,
      } = data;
      PushNotificationService.setCountNewNotification(0);
      PushNotification.setApplicationIconBadgeNumber(0);
      if (isAndroid) {
        this.cancelAll();
        BadgeAndroid.setBadge(0);
      }

      this.onNoticed = true;
      const response = await FetchApi.openPushNotiItem(notificationId);

      if (response.code === 1019) {
        NavigationService.push(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.PUSH_NOTIFICATION,
        });
        return;
      }
      if (typeOpen.value === 1) {
        NavigationService.push(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.DETAIL_PUSH,
          params: {data: response, id: notificationId},
        });
      } else if (typeOpen.value === 2) {
        if (typeOpenLink.value === 2) {
          Linking.canOpenURL(linkWebview).then((supported) => {
            if (supported) {
              Linking.openURL(linkWebview);
            } else {
              openUlrBrowser(linkWebview);
            }
          });
          return;
        }

        NavigationService.push(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.WEBVIEW,
          params: {
            data: {url: linkWebview},
          },
        });
      } else if (typeOpen.value === 3) {
        if (checkUserLogin(data.function)) {
          if (Object.values(keyNavigation).includes(data.function)) {
            NavigationService.navigate(keyNavigation.MAIN_NAVIGATOR, {
              screen: data.function,
              params: {itemMenu: {name: functionName}},
            });
          }
        }
      } else {
        if (typeOpenLink.value === 2) {
          Linking.canOpenURL(linkPDF).then((supported) => {
            if (supported) {
              Linking.openURL(linkPDF);
            } else {
              openUlrBrowser(linkPDF);
            }
          });
          return;
        }
        NavigationService.push(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.WEBVIEW,
          params: {
            data: {url: linkPDF},
          },
        });
      }
      setTimeout(() => {
        this.onNoticed = false;
      }, 1000);
    }
  }

  configure() {
    PushNotification.configure({
      //????ng k?? token l??n server:
      onRegister: async ({token, os}) => {
        console.log('TOKEN:', token);
        AsyncStorage.setItem(AsyncStoreKey.deviceToken, token);
        const registerToken = await AsyncStorage.getItem(
          AsyncStoreKey.registration_token,
        );
        if (registerToken === null) {
          const response = await FetchApi.registrationDeviceToken(token);
          if (response.success) {
            AsyncStorage.setItem(
              AsyncStoreKey.registration_token,
              'REGISTERED',
            );
          }
        }
      },
      onAction: function (notification) {
        // process the action
      },
      //X??? l?? ???n v??o xem th??ng b??o push:
      onNotification: async (notification) => {
        //D??ng cho tr???ng th??i ng?????i d??ng ch??a ????ng nh???p v?? ??ang ??? m??n h??nh AppIntro ho???c l?? ??ang ??? m??n h??nh ??i???u h?????ng App.
        const dataPushNotification = isIos
          ? notification.data.customData
          : notification.data;
        PushNotificationService.setCountNewNotification(1);
        if (isIos) {
          //??ang ??? trong App v?? ???n v??o ?????c push:
          if (
            notification.foreground &&
            !notification.userInteraction &&
            notification.data.aps
          ) {
            this.handleNotification(dataPushNotification);
          }
          //??ang ????ng App ho???c m??? app nh??ng ????? app ??? ch??? ????? background:
          if (!notification.foreground && notification.userInteraction) {
            this.handleNotification(dataPushNotification);
          }
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        } else {
          //Case 1 :Trong tr?????ng h???p KillApp ho???c ??ang d??ng App v?? ??ang ??? tr???ng th??i background:
          if (!notification.foreground && notification.userInteraction) {
            this.handleNotification(dataPushNotification);
          }
          //Case 2 :Trong tr?????ng h???p ??ang d??ng App v?? ??ang ??? tr???ng th??i foreground:
          else if (notification.foreground && notification.userInteraction) {
            this.handleNotification(JSON.parse(dataPushNotification.data));
          }
        }
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      // senderID: '1073485189290',
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  requestPermissions() {
    PushNotification.abandonPermissions();
  }

  setBadge(number = 0) {
    if (!isIos) {
      // BadgeAndroid.setBadge(number);
    }
    PushNotification.setApplicationIconBadgeNumber(number);
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {}

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  pushLocal() {
    PushNotification.localNotification({
      title: 'Title Notification',
      message: 'It is local notificaton',
      number: 1, // set badge
      playSound: true,
      //ignoreInForeground: true,
      // visibility: 'private',
      userInfo: {data: {contentType: 'FEATURE', featureType: 'EVENT'}},
    });
  }
  pushLocalSchedule() {
    PushNotification.localNotificationSchedule({
      title: 'Title Notification',
      message: 'It is local notificaton',
      number: 100, // set badge
      userInfo: {data: {contentType: 'FEATURE', featureType: 'EVENT'}},
      date: new Date(Date.now() + 3 * 1000), // in 60 secs
    });
  }
}
