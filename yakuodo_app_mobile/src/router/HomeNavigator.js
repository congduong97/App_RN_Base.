import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from '../container/HomeScreen';
import Setting from '../container/SettingScreen';
import PushNotificationsScreen from '../container/PushNotificationsScreen';
import NotificationsScreen from '../container/NotificationScreen';
import {DetailNotification} from '../container/NotificationScreen/DetailNotificationScreen';
import {DetailPushNotifiCation} from '../container/PushNotificationsScreen/DetailPushNotification';
import MyPage from '../container/MyPage';
import IntroducingWaca from '../container/IntroducingWaca';
import TermsOfUseBeacon from '../container/TermsOfUseBeacon'
import {COLOR_WHITE} from '../const/Color';
import React, {PureComponent} from 'react';
import {View, SafeAreaView} from 'react-native';
import ButtomMenu from '../container/HomeScreen/BottomMenu';
import BannerScreen from '../container/BannerScreen';
import {StackCoupon} from '../container/NewCoupon/util/navigation';
import {StackVideo} from '../container/NewVideo/until/navigation';
import AdvertisementPage from '../container/Advertisement/AdvertisementPage';
import AdvertisementDetail from '../container/Advertisement/AdvertisementDetail';
const MyStack = createStackNavigator(
  {
    ...StackVideo,
    ...StackCoupon,
    HOME: {
      screen: HomeScreen,
      navigationOptions: {
        header: null,
      },
    },
    LIST_BANNER: {
      screen: BannerScreen,
      navigationOptions: {
        header: null,
      },
    },

    IntroducingWaca: {
      screen: IntroducingWaca,
      navigationOptions: {
        header: null,
      },
    },
    MY_PAGE: {
      screen: MyPage,
      navigationOptions: {
        header: null,
      },
    },
    DetailNotification: {
      screen: DetailNotification,
      navigationOptions: {
        header: null,
      },
    },
    DetailPushNotification: {
      screen: DetailPushNotifiCation,
      navigationOptions: {
        header: null,
      },
    },
    PUSH_NOTIFICATION: {
      screen: PushNotificationsScreen,
      navigationOptions: {
        header: null,
      },
    },
    COMPANY_NOTIFICATION: {
      screen: NotificationsScreen,
      navigationOptions: {
        header: null,
      },
    },
    SETTING: {
      screen: Setting,
      navigationOptions: {
        header: null,
      },
    },
    TERM_USE_BEACON: {
      screen: TermsOfUseBeacon,
      navigationOptions: {
        header: null,
      },
    },
    ADVERTISING_PAGE: {
      screen: AdvertisementPage,
      navigationOptions: {
        header: null,
      },
    },
    ADVERTISING_DETAIL: {
      screen: AdvertisementDetail,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'HOME',
    mode: 'card',
    cardStyle: {backgroundColor: COLOR_WHITE},
    defaultNavigationOptions: {
      header: null,
    },
  },
);

class HomeNavigator extends PureComponent {
  static router = {
    ...MyStack.router,
    getStateForAction: (action, lastState) =>
      // check for custom actions and return a different navigation state.
      MyStack.router.getStateForAction(action, lastState),
  };
  componentDidUpdate(lastProps) {
    // Navigation state has changed from lastProps.navigation.state to this.props.navigation.state
  }

  render() {
    const {navigation} = this.props;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR_WHITE,
        }}>
        <MyStack navigation={navigation} screenProps={this.props.screenProps} />
        <SafeAreaView style={{backgroundColor: COLOR_WHITE}}>
          <ButtomMenu navigation={navigation} onRef={ref => (this.tab = ref)} />
        </SafeAreaView>
      </View>
    );
  }
}
export default HomeNavigator;
const defaultGetStateForAction = HomeNavigator.router.getStateForAction;
HomeNavigator.router.getStateForAction = (action, state) => {
  if (action.type === HomeNavigator.NAVIGATE) {
    const {routeName, params} = action;
    const lastRoute = state.routes[state.routes.length - 1];

    if (routeName === lastRoute.routeName && params === lastRoute.params) {
      return {...state};
    }
  }
  return defaultGetStateForAction(action, state);
};
