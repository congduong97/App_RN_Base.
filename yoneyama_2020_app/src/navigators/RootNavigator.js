//Lybrary:
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';

//Setup:
import {keyNavigation} from './utils/KeyNavigation';

//Component:
import AppIntro from '../screens/AppIntro/AppIntro';
import Policy from '../screens/Policy/Policy';
import InstructionsUser from '../screens/InstructionsForUser/InstructionsUser';
import Entry from '../screens/Entry/Entry';
import WebViewScreen from '../screens/WebView/WebViewScreen';
import VideoFullScreenAndroid from '../screens/VideoDetailAndroid/VideoFullScreenAndroid';

//Màn hình dành cho người dùng đã xác thực:
import MainNavigator from './MainNavigator';

//Màn hình dành cho người dùng chưa xác thực:
import AuthNavigator from './AuthNavigatior';

//Services:
import {NavigationService, AlertService, ToastService} from '../utils';
import AppInputPassword from '../screens/AppInputPassword/AppInputPassword';
import LockScreen from '../screens/LockSceen/LockScreen';
import AlertModal from '../elements/AlertModal';
import Toast from '../elements/Toast';
import CurrentScreenServices from './services/CurrentScreenServices';

const RootStack = createStackNavigator();

function RootNavigator() {
  return (
    <>
      <NavigationContainer
        onStateChange={(event) => {
          const currentScreen = NavigationService.navigationRef.current.getCurrentRoute()
            .name;
          CurrentScreenServices.set(currentScreen);
        }}
        ref={NavigationService.navigationRef}>
        <RootStack.Navigator
          headerMode={'none'}
          initialRouteName={keyNavigation.APP_INPUT_PASSWORD}
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <RootStack.Screen
            options={{
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
            }}
            name={keyNavigation.APP_INPUT_PASSWORD}
            component={AppInputPassword}
          />
          <RootStack.Screen
            name={keyNavigation.APP_INTRO}
            component={AppIntro}
          />
          <RootStack.Screen name={keyNavigation.TERM} component={Policy} />
          <RootStack.Screen
            name={keyNavigation.GUIDE}
            component={InstructionsUser}
          />
          <RootStack.Screen name={keyNavigation.ENTRY} component={Entry} />

          <RootStack.Screen
            name={keyNavigation.AUTH_NAVIGATOR}
            component={AuthNavigator}
          />
          <RootStack.Screen
            name={keyNavigation.MAIN_NAVIGATOR}
            component={MainNavigator}
          />
          <RootStack.Screen
            name={keyNavigation.WEBVIEW}
            component={WebViewScreen}
          />
          <RootStack.Screen
            options={{
              // ...TransitionPresets.ModalPresentationIOS,
              cardStyleInterpolator:
                CardStyleInterpolators.forRevealFromBottomAndroid,
            }}
            name={keyNavigation.VIDEO_DETAIL}
            component={VideoFullScreenAndroid}
          />
          <RootStack.Screen
            name={keyNavigation.LOCK_SCREEN}
            options={{gestureEnabled: false}}
            component={LockScreen}
          />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast ref={ToastService.toastRef} />
      <AlertModal ref={AlertService.modalRef} />
    </>
  );
}

export default RootNavigator;
