import React, { Component } from "react";
import { AppState } from "react-native";

import { Root } from "native-base";
// import App from './App';
import Notification from "./src/liberyCustom/react-native-in-app-notification";

import RootScreen from "./src/router";
import { COLOR_WHITE } from "./src/const/Color";
import { isIOS } from "./src/const/System";
import { STRING } from "./src/const/String";
import CurrentScreen from "./src/service/CurrentScreen";
import SystemSetting from "react-native-system-setting";
import NavigationService from "./src/service/NavigationService";
import UpdateScreen from "./src/container/Launcher/screen/UpdateAppScreen";
import analytics from "@react-native-firebase/analytics";
// import { Toast } from "./src/commons/Toast";
// import { ToastService } from "./src/service/ToastService";
import { AlertService } from "./src/service/AlertService";
import AlertModal from "./src/commons/AlertModal";
import codePush from "react-native-code-push";


let brightness = 0;
let brightnessOppenApp = 0;

class AppContainer extends Component {
  constructor(props) {
    super(props);
    //init sdk before run any function
    this.showLocalNotification = this.showLocalNotification.bind(this);
    this.hasMaxBrightness = false;
  }
  componentDidMount() {
    SystemSetting.getBrightness().then((brightnesss) => {
      brightnessOppenApp = brightnesss;
    });
    AppState.addEventListener("change", this.handleAppStateChange);
  }
  componentWillUnmount() {
    this.hasMaxBrightness = false;
  }
  trackScreenView = async (screen) => {
    // Set & override the MainActivity screen name
    await analytics().setCurrentScreen(screen, screen);
  };
  handleAppStateChange = (nextAppState) => {
    if (isIOS) {
      if (nextAppState !== "active" && CurrentScreen.get() === "MY_PAGE") {
        SystemSetting.setBrightnessForce(brightnessOppenApp).then((success) => {
          if (!success) {
            SystemSetting.setAppBrightness(brightnessOppenApp);
          }
        });
      } else if (
        nextAppState === "active" &&
        CurrentScreen.get() === "MY_PAGE"
      ) {
        this.setMaxBrightness();
      }
    }
  };
  setActive = (key) => {
    this.tab.setActive(key);
  };

  getActiveRouteName = (navigationState) => {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getActiveRouteName(route);
    }
    return route.routeName;
  };

  showLocalNotification(config) {
    this.notification.show({
      title: config.title || STRING.Notification,
      message: config.message,
      onPress: config.onPress,
    });
  }

  setMaxBrightness = () => {
    if (this.hasMaxBrightness) return;
    SystemSetting.getBrightness().then((brightnesss) => {
      // firebase.analytics().setCurrentScreen('currentScreen')
      brightnessOppenApp = brightnesss;
      if (brightnesss !== 1) {
        SystemSetting.setBrightnessForce(1)
          .then((success) => {
            if (!success) {
              SystemSetting.setAppBrightness(1);
            }
            this.hasMaxBrightness = true;
          })
          .catch((e) => {
            this.hasMaxBrightness = false;
          });
      }
    });
    brightness = 1;
  };

  setBrightness = (currentScreen) => {
    if (currentScreen === "MY_PAGE") {
      this.setMaxBrightness();
    } else if (
      currentScreen === "DetailCoupon" ||
      currentScreen === "CouponsSelect"
    ) {
      return;
    } else if (brightness !== 0) {
      // SystemSetting.setBrightnessForce(brightnessOppenApp).then((success) => {
      //   // console.log('success', success);
      // });
      this.hasMaxBrightness = false;

      SystemSetting.getBrightness().then((brightnesss) => {
        // console.log('anmhsangsau', parseFloat(brightnesss.toFixed(2)));
        if (
          parseFloat(brightnesss.toFixed(2)) !== 0.99 &&
          parseFloat(brightnesss.toFixed(2)) !== 1
        ) {
          brightnessOppenApp = brightnesss;
          // console.log('setbrightnesss', parseFloat(brightnesss.toFixed(2)));
        }
        SystemSetting.setBrightnessForce(brightnessOppenApp).then((success) => {
          if (!success) {
            SystemSetting.setAppBrightness(brightnessOppenApp);
          }
        });
      });

      brightness = 0;
    }
  };

  render() {
    return (
      <Root>
        <RootScreen
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState);
            const prevScreen = this.getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {
              // the line below uses the Google Analytics tracker
              this.setBrightness(currentScreen);
              this.trackScreenView(currentScreen);
              CurrentScreen.set(currentScreen);
              // tracker.trackScreenView(currentScreen);
            }
          }}
          screenProps={{
            showLocalNotification: this.showLocalNotification,
            setActive: this.setActive,
            setMaxBrightness: this.setMaxBrightness,
          }}
        />
        <UpdateScreen />

        <Notification
          iconApp={require("./src/images/Noti.png")}
          backgroundColour={COLOR_WHITE}
          ref={(ref) => {
            this.notification = ref;
          }}
        />
        {/* <Toast ref={ref=> ToastService.setTopLevelToast(ref) }/> */}
        <AlertModal ref={(ref) => AlertService.setTopLevelAlert(ref)} />
        
      </Root>
    );
  }
}
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
};
export default codePush(codePushOptions)(AppContainer);
