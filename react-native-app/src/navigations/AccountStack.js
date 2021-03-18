import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PersonalScreen from '../screens/Personal';
import UpdateUserScreen from '../screens/Account/UpdateUserScreen';

const AccountStack = createStackNavigator();
const Stack = createStackNavigator();

const isTabBarVisible = (route) => {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params
    ? route.params.screen
    : 'PersonalScreen';
  return !['UpdateUserScreen'].includes(routeName);
};

export default function AccountNavigator() {

  return (
    <AccountStack.Navigator
      initialRouteName="PersonalScreen"
      screenOptions={{
        headerShown: false,
        tabBarVisible: false,
      }}
      >
      <AccountStack.Screen name="PersonalScreen" component={PersonalScreen} />
      {/* <AccountStack.Screen
        name="UpdateUserScreen"
        component={UpdateUserScreen}
        options={(navigation) => ({
          tabBarVisible: false,
        })}
      /> */}
    </AccountStack.Navigator>
  );
}
