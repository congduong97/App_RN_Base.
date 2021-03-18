import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import OrderScreen from '../screens/Orders';
import OrderDetailScreen from '../screens/Orders/OrderDetailScreen';
const OrdersStack = createStackNavigator();

export default function OrdersNavigator() {
  return (
    <OrdersStack.Navigator
      initialRouteName="OrderScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <OrdersStack.Screen name="OrderScreen" component={OrderScreen} />
      {/* <OrdersStack.Screen
        name="OrderDetailScreen"
        component={OrderDetailScreen}
      /> */}
    </OrdersStack.Navigator>
  );
}
