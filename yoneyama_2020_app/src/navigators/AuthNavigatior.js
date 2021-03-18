//Lybrary:
import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

//Setup:
import {keyNavigation} from './utils/KeyNavigation';

//Component:
import Login from '../screens/Login/Login';
import MemberRegistration from '../screens/Register/Register';
import ActiveOTP from '../screens/ActiveOTP/ActiveOtpSms';
import LoginSpecial from '../screens/LoginSpecial/LoginSpecial';

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <>
      <AuthStack.Navigator
        headerMode={'none'}
        initialRouteName={keyNavigation.LOGIN}
        screenOptions={{
          ...TransitionPresets.SlideFromRightIOS,
        }}>
        <AuthStack.Screen name={keyNavigation.LOGIN} component={Login} />
        <AuthStack.Screen
          name={keyNavigation.ACTIVE_OTP}
          component={ActiveOTP}
        />
        <AuthStack.Screen
          name={keyNavigation.REGISTER}
          component={MemberRegistration}
        />
        <AuthStack.Screen
          name={keyNavigation.LOGIN_SPECIAL}
          component={LoginSpecial}
        />
      </AuthStack.Navigator>
    </>
  );
};

export default AuthNavigator;
