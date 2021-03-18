import React, {Component} from 'react';
import {AppState} from 'react-native';

import {Root} from 'native-base';
// import App from './App';
import Notification from './src/liberyCustom/react-native-in-app-notification';
import {ReactBanner} from 'react-native-shop-sdk';

import RootScreen from './src/router';
import {COLOR_WHITE, COLOR_BLACK} from './src/const/Color';
import {isIOS, DEVICE_HEIGHT, DEVICE_WIDTH} from './src/const/System';
import {STRING} from './src/const/String';
import CurrentScreen from './src/service/CurrentScreen';
import SystemSetting from 'react-native-system-setting';
import NavigationService from './src/service/NavigationService';
import ReloadScreen from './src/service/ReloadScreen';
import UpdateScreen from './src/container/LauncherScreen/UpdateAppScreen';
import {firebase} from '@react-native-firebase/analytics';
import {SetUpDeeplink} from './src/container/HomeScreen/SetUpDeepLink';
import {SetUpNotification} from './src/container/HomeScreen/SetUpNotifications';
import codePush from "react-native-code-push";
import AlertModal from './src/commons/AlertModal';
import { AlertService } from './src/service/AlertService';
let brightness = 0;
let brightnessOppenApp = 0;
let countActive = 0;
 class AppContainer extends Component {
  constructor(props) {
    super(props);
    //init sdk before run any function
    this.showLocalNotification = this.showLocalNotification.bind(this);
  }
  componentDidMount() {
    SystemSetting.getBrightness().then(brightnesss => {
      brightnessOppenApp = brightnesss;
    });
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {}
  trackScreenView = async screen => {
    // Set & override the MainActivity screen name
    await firebase.analytics().setCurrentScreen(screen, screen);
    // await analytics().setCurrentScreen(screen, screen);
  };
  handleAppStateChange = nextAppState => {
    if (nextAppState === 'active') {
      countActive++;
      if (countActive > 1) {
        // console.log('CurrentScreen.get()',CurrentScreen.get())
        ReloadScreen.set(CurrentScreen.get());
      }
    }
  };
  setActive = key => {
    this.tab.setActive(key);
  };

  getActiveRouteName = navigationState => {
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

  render() {
    return (
      <Root>
        <RootScreen
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = this.getActiveRouteName(currentState);
            const prevScreen = this.getActiveRouteName(prevState);

            if (prevScreen !== currentScreen) {
              this.trackScreenView(currentScreen);
              CurrentScreen.set(currentScreen);

              // tracker.trackScreenView(currentScreen);
            }
          }}
          screenProps={{
            showLocalNotification: this.showLocalNotification,
            setActive: this.setActive,
          }}
        />
        <UpdateScreen />

        {!isIOS && <ReactBanner />}
        <SetUpDeeplink
          navigation={this.props.navigation}
          // getUserDetail={this.getUserDetail}
        />
        <SetUpNotification
          screenProps={{
            showLocalNotification: this.showLocalNotification,
            setActive: this.setActive,
          }}
        />

        <Notification
          iconApp={require('./src/images/Noti.png')}
          backgroundColour={COLOR_WHITE}
          ref={ref => {
            this.notification = ref;
          }}
        />
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