//Lybrary:
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {keyNavigation} from './utils/KeyNavigation';

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      headerMode={'none'}
      initialRouteName={keyNavigation.LOGIN}
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}></AuthStack.Navigator>
  );
};

export default AuthNavigator;
