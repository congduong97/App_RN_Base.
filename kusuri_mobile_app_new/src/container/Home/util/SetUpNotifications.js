import PushNotification from "react-native-push-notification";
import {
  isIOS,
  SENDER_ID,
  keyAsyncStorage,
  DEVICE_ID,
  managerAccount
} from "../../../const/System";
import { View, AppState, Alert, Linking } from "react-native";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import AsyncStorage from "@react-native-community/async-storage";
import { STRING } from "../../../const/String";
import { screen } from "../../../const/System";
import React, { PureComponent } from "react";
import { Api as ApiNotification } from "../../PushNotification/util/api";
import { Api as ApiHome } from "../util/api";
import {
  NumberNewNofitification,
  ClickWhenScreenPasswordNotification
} from "../util/service";
import { checkUpdateDataApp } from "../../Launcher/util/checkVersionAllApp";
import ReloadScreen from "../../../service/ReloadScreen";
import NavigationService from "../../../service/NavigationService";
import CurrentScreen from "../../../service/CurrentScreen";
import BackgroundTimer from "react-native-background-timer";

let loaddingPushDEVICE = false;
export const clickNotification = {
  status: false
};
export class SetUpNotification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openByNotification: false,
      notification: false
    };
  }
  componentDidMount() {
    // PushNotificationIOS.addEventListener('notification', handler=>{
    //     console.log('handler',handler)
    // });
    ClickWhenScreenPasswordNotification.onChange("SetUpNotification", () => {
      const notificationClick = this.state.notification;

      if (notificationClick) {
        this.handleNotification(notificationClick);
      }
      this.state.notification = false;
    });
    AppState.addEventListener("change", this.handleAppStateChange);

    if (isIOS) {
      this.getNotificationCenter();
    }

    const pushScreen = this.pushScreen;
    const pushDeviceTokenToServer = this.pushDeviceTokenToServer;
    const setWayToOpen = this.setWayToOpen;
    const reloadPrescriptionScreen = this.reloadPrescriptionScreen;
    this.pushTimeout = setTimeout(() => this.pushSdk(), 1000);
    PushNotification.configure({
      onNotification(notification) {
        // // alert(JSON.stringify(notification));
        clickNotification.status = true;
        setWayToOpen(notification);
        reloadPrescriptionScreen(notification);
        const data = isIOS ? notification.data.data : notification.data;

        try {
          if (data) {
            if (data.notificationContentType === "BANNER") {
              // RNShopSdkBanner.showBannerWithData(data);
            } else if (data.notificationContentType === "LINK_WEBVIEW") {
              // const deviceId = deviceId.ADV_ID;
              // RNShopSDKWebLink.openWebView(notification, DEVICE_ID, managerAccount.userId);
            } else {
              pushScreen(notification);
            }
          } else {
            pushScreen(notification);
          }
        } catch (e) {
          // alert(JSON.stringify(e));
          // alert(e);
        }
        if (isIOS) {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },
      onRegister(token) {
        if (!loaddingPushDEVICE) {
          pushDeviceTokenToServer(token);
        }
      },
      senderID: SENDER_ID,
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true
    });
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
    ClickWhenScreenPasswordNotification.unChange("SetUpNotification");
  }

  reloadPrescriptionScreen = (notification) => {
    try {
      const useData = isIOS ? notification.data.customData : notification.data;
      if (useData.function == "PRESCRIPTION") {
        ReloadScreen.set(useData.function)
      }
    } catch (error) {

    }
  }

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
  pushDeviceTokenToServer = async token => {
    // console.log('token', token);
    try {
      loaddingPushDEVICE = true;
      const deviceToken = await AsyncStorage.getItem(
        keyAsyncStorage.deviceToken
      );

      if (!deviceToken || token.token !== deviceToken) {
        const response = await ApiHome.pushDeviceToken(token.token);
        // console.log('PushdeviceToken', response);
        if (response.code === 200 && response.res.status.code === 1000) {
          // alert('oknhe');
          await AsyncStorage.setItem(keyAsyncStorage.deviceToken, token.token);
        }

        // RNShopSdkBanner.registDeviceToken(token.token, '');
      }
    } catch (error) {
    } finally {
      loaddingPushDEVICE = false;
    }
  };
  handleAppStateChange = nextAppState => {
    if (nextAppState !== "active") {
      clickNotification.status = false;
    }

    if (nextAppState === "active" && this.state.appState == "background") {
      if (isIOS) {
        if (
          this.props.header &&
          this.props.header.header &&
          this.props.header.header.getApi
        ) {
          // alert('get')
          this.getNotificationCenter();
          this.props.header.header.getApi();
        }
        // console.log('this.props.header.header.getApi',this.props)
      }
      if (managerAccount.enablePasswordOppenApp && managerAccount.usingSms) {
        this.state.appState = nextAppState;

        this.props.navigation.navigate("EnterPasswordApp", {
          upDateData: this.upDateData
        });
        return;
      }
      if (
        managerAccount.enablePasswordMyPage &&
        managerAccount.usingSms &&
        CurrentScreen.get() == "MY_PAGE"
      ) {
        this.state.appState = nextAppState;

        this.props.navigation.navigate("EnterPasswordApp", {
          upDateData: this.upDateData
        });
        return;
      }
      this.upDateData();
    }
    // console.log('addd ')
    if (!isIOS) {
      if (this.timeOutBackground) {
        BackgroundTimer.clearTimeout(this.timeOutBackground);
      }
      this.timeOutBackground = BackgroundTimer.setTimeout(() => {
        // this will be executed once after 10 seconds
        // even when app is the the background
        this.state.appState = nextAppState;
      }, 500);
    } else {
      this.state.appState = nextAppState;
    }
  };
  upDateData = () => {
    checkUpdateDataApp();
    ReloadScreen.set(CurrentScreen.get());
  };
  pushSdk = () => {
    const { openByNotification } = this.state;

    if (!openByNotification) {
      // RNShopSdkBanner.getUserAds((result) => {
      //     if (result && result.data) {
      //         RNShopSdkBanner.showBannerWithData(result.data);
      //     }
      // });
    }
  };
  setTimeUpdateNotification = () => {
    const time = new Date().getTime();
    AsyncStorage.setItem(
      keyAsyncStorage.timeUpdateNotification,
      time.toString()
    );
  };
  pushScreen = async notification => {
    try {
      const { foreground, userInteraction } = notification;
      // if(managerAccount.userId && !managerAccount.validatePhoneNumberSuccess && managerAccount.needAddBirthDay && managerAccount.needValidateBirthDay && managerAccount.usingSms){
      //     return
      // }

      if (!foreground) {
        if (userInteraction && isIOS) {
          if (this.timeOutHanderPushNotification) {
            clearTimeout(this.timeOutHanderPushNotification);
          }

          this.timeOutHanderPushNotification = setTimeout(() => {
            this.handleNotification(notification);
          }, 500);
          return;
        }
        if (userInteraction) {
          this.handleNotification(notification);
          return;
        }
        if (!isIOS && !userInteraction) {
          const countNoti = NumberNewNofitification.get() + 1;
          NumberNewNofitification.set(countNoti);
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
          const countNoti = NumberNewNofitification.get() + 1;
          NumberNewNofitification.set(countNoti);
          this.showNotification(notification);
          return;
        }
        //android OnNotification
        const countNoti = NumberNewNofitification.get() + 1;
        NumberNewNofitification.set(countNoti);
      }
    } catch (e) {
      // console.log('error,', e);
      // alert(e);
    }
  };
  showNotification = notification => {
    const { screenProps, navigation } = this.props;
    const config = {
      title:
        notification.title || notification.message.title || STRING.Notification,
      message: notification.message.body || notification.message,
      onPress: () => {
        this.handleNotification(notification);
      }
    };
    screenProps.showLocalNotification(config, navigation);
  };
  pushClick = async id => {
    try {
      ApiNotification.getPushNotificationDetail(id);
    } catch (e) { }
  };
  handleNotification = async (notification) => {
    if (CurrentScreen.get() === "EnterPasswordApp" && managerAccount.usingSms) {
      this.state.notification = notification;
      return;
    }
    clickNotification.status = false;
    NumberNewNofitification.set(0);
    this.setTimeUpdateNotification();

    const { navigation } = this.props;
    const useData = isIOS ? notification.data.customData : notification.data;

    if (useData.typeOpen !== 1) {
      this.pushClick(useData.notificationId);
    }
    if (useData.typeOpen == 2 && useData.linkWebview) {
      if (useData.linkWebview.includes(".pdf") && !isIOS) {
        NavigationService.push("WEB_VIEW", {
          url: `https://docs.google.com/gview?embedded=true&url=${useData.linkWebview}`
        });
      } else {
        NavigationService.push("WEB_VIEW", { url: useData.linkWebview });
      }

      return;
    }
    if (useData.typeOpen == 1) {
      // NavigationService.push('DetailPushNotification', { id: useData.notificationId });
      if (CurrentScreen.get() === "WEB_VIEW") {
        navigation.navigate("DetailPushNotification", {
          id: useData.notificationId
        });
      } else {
        navigation.push("DetailPushNotification", {
          id: useData.notificationId
        });
      }
      return;
    }
    if (useData.function == "PUSH_NOTIFICATION") {
      ReloadScreen.set(useData.function);
      navigation.navigate(useData.function);
      NumberNewNofitification.set(0);
      return;
    }
    if (useData.function == "LINK_APP") {
      // alert('ok');
      const urlLink = isIOS ? useData.urlIOS : useData.urlAndroid;
      const urlLinkAppStore = isIOS ? useData.urlAppstore : useData.urlCHPlay;

      Linking.canOpenURL(urlLink).then(supported => {
        if (!supported) {
          Linking.openURL(urlLinkAppStore).catch(error => {
            // alert(error.message || error);
          });
        } else {
          Linking.openURL(urlLink).catch(error => {
            // alert(error.message || error);
          });
        }
      });
      return;
    }
    if (
      useData.function === "MY_PAGE" ||
      useData.function == "COUPON" ||
      useData.function == "HISTORY_COUPON"
    ) {
      if (managerAccount.userId) {
        ReloadScreen.set(useData.function);
        if (
          managerAccount.enablePasswordMyPage &&
          CurrentScreen.get() !== "MY_PAGE" &&
          managerAccount.usingSms &&
          useData.function === "MY_PAGE"
        ) {
          navigation.navigate("EnterPasswordApp", { nameFunction: "MY_PAGE" });
        } else {
          navigation.navigate(useData.function);
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              onPress: () => { },
              style: "cancel"
            },
            {
              text: STRING.ok,
              onPress: () => {
                navigation.navigate("EnterMemberCodeScreen");
              }
            }
          ],
          { cancelable: false }
        );
      }
      return;
    }

    if (useData.function == "PRESCRIPTION") {
      if (managerAccount.userId) {
        let firstTimeOpenPrescription = await AsyncStorage.getItem(keyAsyncStorage.firstTimeOpenPrescription)
        if (firstTimeOpenPrescription) {
          navigation.navigate("PRESCRIPTION")
        } else {
          navigation.navigate("TermsOfUser");
        }
      } else {
        Alert.alert(
          STRING.notification,
          STRING.please_login_to_use,
          [
            {
              text: STRING.cancel,
              style: "cancel"
            },
            {
              text: STRING.ok,
              onPress: () => {
                navigation.navigate("EnterMemberCodeScreen");
              }
            }
          ],
          { cancelable: false }
        );
      }
      return;
    }

    if (useData.function) {
      ReloadScreen.set(useData.function);
      navigation.navigate(useData.function);
      return;
    }
  };
  render() {
    return null;
  }
}
