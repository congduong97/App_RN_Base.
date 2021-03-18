import React, {useEffect, createRef} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import OneSignal from 'react-native-onesignal';
import AppNavigate from './AppNavigate';
import CollaborerTabNavigator from './CollaborerTabNavigator';
import SplashScreen from '../screens/Splash';
import LoginScreen from '../screens/Account/LoginScreen';
import SignUpScreen from '../screens/Account/SignUpScreen';
import UpdateUserScreen from '../screens/Account/UpdateUserScreen';
import NotificationScreen from '../screens/Notifications';
import NotificationDetailScreen from '../screens/Notifications/NotificationDetailScreen';
import SearchGuideScreen from '../screens/Search/SearchGuideScreen';
import SearchScreen from '../screens/Search';
import SimCategoriesScreen from '../screens/Search/SimCategoriesScreen';
import IntroductionScreen from '../screens/Introduction';
import SelectTemplateDesignScreen from '../screens/SimUtilities/SelectTemplateDesignScreen';
import SimsImageDesignScreen from '../screens/SimUtilities/SimsImageDesignScreen';
import SimImageDesignScreen from '../screens/SimUtilities/SimImageDesignScreen';
import ColorPickerScreen from '../screens/SimUtilities/ColorPickerScreen';
import CartsScreen from '../screens/Orders/Cart';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
import CartDetailScreen from '../screens/Orders/Cart/CartDetailScreen';

export {AppNavigate};
const RootStack = createStackNavigator();
const navigationRef = createRef();
const isReadyRef = createRef();

export default function App() {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  const initOneSignal = () => {
    OneSignal.setLogLevel(6, 0);
    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init('31c6b7b7-e2ad-4039-953e-e8f73f0f7e1c', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    if (Platform.OS === 'android') {
      OneSignal.enableVibrate(true);
      OneSignal.enableSound(true);
    }
    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);
  };

  const removeOneSignal = () => {
    OneSignal.removeEventListener('received');
    OneSignal.removeEventListener('opened');
    OneSignal.removeEventListener('ids');
  };

  useEffect(() => {
    initOneSignal();
  }, []);

  useEffect(() => {
    return () => {
      removeOneSignal;
    };
  }, []);

  const onReceived = (notification) => {
    console.log('Notification received: ', notification);
  };

  const onOpened = (openResult) => {
    let dataNotifi = openResult.notification.payload.additionalData;
    nextToOrderDetail(dataNotifi);
  };

  const onIds = (device) => {};
  const nextToOrderDetail = (dataNotifi) => {
    if (isReadyRef.current && navigationRef.current) {
      if (dataNotifi.reservationId) {
        navigationRef.current?.navigate('OrderDetailScreen', {
          dataItem: {id: dataNotifi?.reservationId},
          isRequestData: true,
        });
      } else {
        AppNavigate.navigateToNotificationScreen(navigation.dispatch);
      }
    }else {
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      <RootStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
        <RootStack.Screen name="LoginScreen" component={LoginScreen} />
        <RootStack.Screen
          name="UpdateUserScreen"
          component={UpdateUserScreen}
        />
        <RootStack.Screen
          name="CollaborerTabNavigator"
          component={CollaborerTabNavigator}
        />
        <RootStack.Screen
          name="SearchGuideScreen"
          component={SearchGuideScreen}
        />
        <RootStack.Screen name="SearchScreen" component={SearchScreen} />
        <RootStack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <RootStack.Screen
          name="NotificationDetailScreen"
          component={NotificationDetailScreen}
        />
        <RootStack.Screen
          name="SimCategoriesScreen"
          component={SimCategoriesScreen}
        />
        <RootStack.Screen
          name="IntroductionScreen"
          component={IntroductionScreen}
        />
        <RootStack.Screen
          name="SelectTemplateDesignScreen"
          component={SelectTemplateDesignScreen}
        />
        <RootStack.Screen
          name="SimsImageDesignScreen"
          component={SimsImageDesignScreen}
        />
        <RootStack.Screen
          name="SimImageDesignScreen"
          component={SimImageDesignScreen}
        />
        <RootStack.Screen
          name="ColorPickerScreen"
          component={ColorPickerScreen}
        />
        <RootStack.Screen name="CartsScreen" component={CartsScreen} />
        <RootStack.Screen
          name="CartDetailScreen"
          component={CartDetailScreen}
        />
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen} />
        <RootStack.Screen
          name="OrderDetailScreen"
          component={OrderDetailScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function myiOSPromptCallback(permission) {
  // do something with permission value
}
