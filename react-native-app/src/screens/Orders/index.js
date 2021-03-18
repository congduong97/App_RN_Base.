import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Color, Dimension} from '../../commons/constants';
import {ScreensView} from '../../components';
import {OrderStatusRequest} from '../../models/ConfigsData';
import TabBarIcon from '../../navigations/TabBarIcon';
import CartsScreen from './Cart';
import OrdersView from './OrdersView';

export default function OrderScreen(props) {
  const {} = props;
  const Tab = createMaterialTopTabNavigator();
  return (
    <ScreensView isScroll={false} isShowBack={false} titleScreen={'Đơn hàng'}>
      <Tab.Navigator
        lazy={true}
        tabBarOptions={{
          inactiveTintColor: Color.borderColor,
          activeTintColor: Color.MayaBlue,
          pressColor: Color.MayaBlue,
          showIcon: true,
          indicatorStyle: {backgroundColor: Color.MayaBlue},
          scrollEnabled: true,
          tabStyle: {flexDirection: 'row', width: 120, height: 45},
          labelStyle: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: Dimension.fontSize12,
          },
        }}>
        <Tab.Screen
          name={'Order'}
          options={{
            tabBarLabel: 'Giỏ hàng',
            color: 'red',
            tabBarIcon: ({color}) => {
              return (
                <TabBarIcon
                  color={color}
                  name="cart-outline"
                  size={18}
                  style={styles.stIconTab}
                />
              );
            },
          }}
          component={CartsScreen}
          initialParams={{isTabarOrder: true}}
        />
        <Tab.Screen
          name={'OrderWaiting'}
          component={OrdersView}
          initialParams={{typeOrder: OrderStatusRequest.NEW}}
          options={{
            tabBarLabel: 'Đơn chờ',
            tabBarIcon: ({color}) => {
              return (
                <TabBarIcon
                  color={color}
                  name="clock-circular-outline"
                  size={18}
                  style={styles.stIconTab}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name={'OrderSuccess'}
          component={OrdersView}
          initialParams={{typeOrder: OrderStatusRequest.DONE}}
          options={{
            tabBarLabel: 'Đơn hoàn thành',
            tabBarIcon: ({color}) => {
              return (
                <TabBarIcon
                  color={color}
                  name="tick-inside-circle"
                  size={18}
                  style={styles.stIconTab}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name={'OrderCancel'}
          component={OrdersView}
          initialParams={{typeOrder: OrderStatusRequest.CANCELLED}}
          options={{
            tabBarLabel: 'Đơn huỷ',
            tabBarIcon: ({color}) => {
              return (
                <TabBarIcon
                  color={color}
                  name="cancel"
                  size={18}
                  style={styles.stIconTab}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  stIconTab: {
    width: 24,
    height: 24,
  },
  containsInputView: {
    marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },
  styleInputSearch: {
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Color.Border,
  },
  titleScreenContainer: {},
  titleScreenHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textHeader: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
  },
});
