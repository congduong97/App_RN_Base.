//Library:
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-community/async-storage';
import {checkNotifications} from 'react-native-permissions';
import {Linking} from 'react-native';

//Setup:
import {isIos, AsyncStoreKey} from '../constants';
import {FetchApi} from '../modules';
import {checkUserLogin} from '../modules/CheckLogin';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Services:
import {NavigationService} from './NavigationService';
import {ForgotModalService} from './ForgotModalService';
import {AppService} from './AppServices';
import {openUlrBrowser} from '../modules/OpenURL';

export default class NotifService {
  constructor() {
    this.onNoticed = false;
  }

  cancelAllNotiAppCenter() {
    PushNotification.cancelAllLocalNotifications();
  }

  configure() {
    PushNotification.configure({
      onRegister: async ({token, os}) => {
        console.log('Token:', token);
        AsyncStorage.setItem(AsyncStoreKey.deviceToken, token);
        const registerToken = await AsyncStorage.getItem(
          AsyncStoreKey.registration_token,
        );
        if (registerToken === null) {
          const response = await FetchApi.registrationDeviceToken(token);
          if (response && response.success) {
            AsyncStorage.setItem(
              AsyncStoreKey.registration_token,
              'REGISTERED',
            );
          }
        }
        checkNotifications().then(async ({status, settings}) => {
          if (status === 'granted') {
            return;
          }
          AsyncStorage.setItem(AsyncStoreKey.homeLaunched, 'homeLaunched');
        });
      },
      onNotification: async (notification) => {
        // alert(JSON.stringify(notification));
        // console.log('%c notification ', 'color:green', notification);
        //Dùng cho trạng thái người dùng chưa đăng nhập và đang ở màn hình AppIntro hoặc là đang ở màn hình điều hướng App.
        const dataPushNotification = isIos
          ? notification.data.customData
          : notification.data;
        if (isIos) {
          //Đang ở trong App và ấn vào đọc push:
          if (
            notification.foreground &&
            !notification.userInteraction &&
            notification.data.aps
          ) {
            this.handleNotification(dataPushNotification);
          }
          //Đang đóng App hoặc mở app nhưng để app ở chế đọ background:
          if (!notification.foreground && notification.userInteraction) {
            this.handleNotification(dataPushNotification);
          }
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        } else {
          //Case 1 :Trong trường hợp KillApp hoặc đang dùng App và đang ở trạng thái background:
          if (!notification.foreground && notification.userInteraction) {
            this.handleNotification(dataPushNotification);
          }
          //Case 2 :Trong trường hợp đang dùng App và đang ở trạng thái foreground:
          else if (notification.foreground && notification.userInteraction) {
            this.handleNotification(JSON.parse(dataPushNotification.data));
          }
        }
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

  async handleNotification(data) {
    this.cancelAllNotiAppCenter();
    if (!this.onNoticed) {
      const {
        notificationId,
        typeOpen,
        linkWebview,
        linkPDF,
        functionName,
        appId,
        typeOpenLink,
      } = data;
      this.onNoticed = true;
      //Đặt services lắng nghe push từ App nào để call API setup cấu hình App đó mỗi lần đọc push có chuyển đổi cấu hình App, active App ở màn hình Home.
      await AppService.setAndBroadcast(appId);
      PushNotification.setApplicationIconBadgeNumber(0);
      if (typeOpen.value !== 1) {
        FetchApi.openPushNotiItem(notificationId);
      }
      if (typeOpen.value === 1) {
        NavigationService.push(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.DETAIL_PUSH,
          params: {id: notificationId},
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
        } else {
          NavigationService.push(keyNavigation.WEBVIEW, {
            data: {url: linkWebview},
          });
        }
      } else if (typeOpen.value === 3) {
        if (checkUserLogin(data.function)) {
          //MyPage:
          if (data.function === keyNavigation.MY_PAGE) {
            ForgotModalService.showModal('mypage');
          } else if (data.function === 'BOOKMARK_STORE') {
            NavigationService.navigate(keyNavigation.STORE, {
              keyActiveBookMark: 'BOOKMARK_STORE',
            });
            return;
          }
          //Thẻ thành viên:
          else if (data.function === keyNavigation.CERTIFICATE_MEMBER) {
            const initSecure = await AsyncStorage.getItem(
              AsyncStoreKey.memmber_secure,
            );
            if (initSecure === 'secure') {
              NavigationService.navigate(keyNavigation.APP_INPUT_PASSWORD, {
                mode: 'memmber',
              });
            } else {
              NavigationService.navigate(keyNavigation.MAIN_NAVIGATOR, {
                screen: data.function,
                params: {itemMenu: {name: functionName}},
              });
            }
          }
          //Màn hình term:
          else if (data.function === keyNavigation.TERM) {
            NavigationService.navigate(keyNavigation.TERM, {
              itemMenu: {name: functionName},
            });
          } else {
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
        } else {
          NavigationService.push(keyNavigation.WEBVIEW, {
            data: {url: linkPDF},
          });
        }
      }
      setTimeout(() => {
        this.onNoticed = false;
      }, 2000);
    }
  }
}
