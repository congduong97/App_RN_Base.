//Lybrary:
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {keyNavigation} from './utils/KeyNavigation';
import {ToastService, COLOR} from '../utils';
import AlertModal from '../elements/AlertModal';
import Toast from '../elements/Toast';
import {NavigationService, AlertService} from '../utils';
import AppIntro from '../screens/AppIntro/AppIntro';
import Entry from '../screens/Entry/Entry';
import MainNavigator from './MainNavigator';
import {BottomService} from './services/BottomService';
import {StatusBar} from 'react-native';
import VideoFullScreenAndroid from '../screens/VideoDetailAndroid/VideoFullScreenAndroid';

const RootStack = createStackNavigator();

function RootNavigator() {
  return (
    <>
      <StatusBar backgroundColor={COLOR.grey_300} barStyle='dark-content' />
      <NavigationContainer
        onStateChange={(event) => {
          const currentScreen = NavigationService.navigationRef.current.getCurrentRoute()
            .name;
          BottomService.setActiveItem(currentScreen);
        }}
        ref={NavigationService.navigationRef}>
        <RootStack.Navigator
          headerMode={'none'}
          initialRouteName={keyNavigation.APP_INTRO}
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <RootStack.Screen
            name={keyNavigation.APP_INTRO}
            component={AppIntro}
          />

          <RootStack.Screen
            name={keyNavigation.MAIN_NAVIGATOR}
            component={MainNavigator}
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
          <RootStack.Screen name={keyNavigation.ENTRY} component={Entry} />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast ref={ToastService.toastRef} />
      <AlertModal ref={AlertService.modalRef} />
    </>
  );
}

export default RootNavigator;
