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
