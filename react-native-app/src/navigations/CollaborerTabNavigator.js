import React, {useEffect} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {useDispatch, useSelector} from 'react-redux';
import commons from '../commons';
import {Color, Dimension} from '../commons/constants';
import HomeScreen from '../screens/Home';
import SearchGuideScreen from '../screens/Search/SearchGuideScreen';
import OrderStack from './OrderStack';
import AccountStack from './AccountStack';
import TabBarIcon from './TabBarIcon';
import OrderScreen from '../screens/Orders';

const Tab = createMaterialBottomTabNavigator();

export default function CollaborerTabNavigator() {
  const totalOrderCarts = useSelector(
    (state) => state.OrderReducer.totalOrderCarts,
  );
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      activeColor={Color.lightBlueIOS}
      barStyle={{
        backgroundColor: 'white',
        borderTopColor: commons.Color.colorBorderDisable,
        borderTopWidth: 0.2,
      }}
      keyboardHidesNavigationBar={true}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color}) => {
            return <TabBarIcon color={color} name="home" />;
          },
        }}
      />
      <Tab.Screen
        name="SearchGuideScreen"
        component={SearchGuideScreen}
        options={{
          tabBarLabel: 'Tìm kiếm',
          tabBarIcon: ({color}) => {
            return <TabBarIcon color={color} name="search-bold" />;
          },
        }}
      />
      <Tab.Screen
        name="OrderStack"
        component={OrderScreen}
        options={{
          tabBarBadge: totalOrderCarts,
          tabBarLabel: 'Đơn hàng',
          tabBarIcon: ({color}) => {
            return <TabBarIcon color={color} name="cart-filled" />;
          },
        }}
      />
      <Tab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({color}) => {
            return <TabBarIcon color={color} name="list-menu" />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
