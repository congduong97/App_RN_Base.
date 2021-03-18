import React, {Fragment, useEffect, useState, useContext} from 'react';
import {View, SafeAreaView} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

//Setup:
import {COLOR, ForgotModalService} from '../utils';
import {keyNavigation} from './utils/KeyNavigation';
import {ContextContainer} from '../contexts/AppContext';

//Component:
import Home from '../screens/Home/Home';
import MyPage from '../screens/MyPage/MyPage';
import CouponDetail from '../screens/CouponDetail/CouponDetail';
import BottomMenu from './BottomMenu';
import SubMenu from '../screens/SubMenu/SubMenu';
import Coupon from '../screens/Coupon/Coupon';
import Notification from '../screens/Notification/Notification';
import NotificationDetail from '../screens/NotificationDetail/NotificationDetail';
import SecureSetting from '../screens/SecureSetting/SecureSetting';
import CertificateMember from '../screens/CertificateMember/CertificateMember';
import Store from '../screens/Store/Store';
import Question from '../screens/Question/Question';
import QuestionDetail from '../screens/QuestionDetail/QuestionDetail';
import PushNotification from '../screens/PushNotification/PushNotification';
import PushNotiDetail from '../screens/PushNotiDetail/PushNotiDetail';
import AppPassword from '../screens/AppSetPassword/AppPassword';
import RePass from '../screens/AppSetPassword/RePass';
import NewPass from '../screens/AppSetPassword/NewPass';
import ChangePhoneNumber from '../screens/ChangePhoneNumber/ChangePhoneNumber';
import Video from '../screens/Video/Video';
import QrCode from '../screens/QrCode/QrCode';

//Services:
import {BottomService} from './services/BottomService';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';

const MainStack = createStackNavigator();

const MainNavigator = () => {
  const [bottom, setBottom] = useState(true);
  const {colorApp} = useContext(ContextContainer);

  useEffect(() => {
    BottomService.onChange('set-bottom', (value) => {
      setBottom(value);
    });
  }, []);
  return (
    <Fragment>
      <SafeAreaView style={{backgroundColor: COLOR.white}} />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          backgroundColor: COLOR.TRANSPARENT,
        }}>
        <MainStack.Navigator
          headerMode={'none'}
          initialRouteName={keyNavigation.HOME}
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <MainStack.Screen name={keyNavigation.HOME} component={Home} />
          <MainStack.Screen name={keyNavigation.MY_PAGE} component={MyPage} />
          <MainStack.Screen name={keyNavigation.SUB_MENU} component={SubMenu} />
          <MainStack.Screen name={keyNavigation.COUPON} component={Coupon} />
          <MainStack.Screen name={keyNavigation.STORE} component={Store} />
          <MainStack.Screen
            name={keyNavigation.NOTIFICATION}
            component={Notification}
          />

          <MainStack.Screen
            name={keyNavigation.NOTIFICATION_DETAIL}
            component={NotificationDetail}
          />
          <MainStack.Screen
            name={keyNavigation.COUPON_DETAIL}
            component={CouponDetail}
          />

          <MainStack.Screen
            name={keyNavigation.SECURE}
            component={SecureSetting}
          />
          <MainStack.Screen
            name={keyNavigation.CERTIFICATE_MEMBER}
            component={CertificateMember}
          />
          <MainStack.Screen
            name={keyNavigation.QUESTION}
            component={Question}
          />
          <MainStack.Screen
            name={keyNavigation.QUESTION_DETAIL}
            component={QuestionDetail}
          />
          <MainStack.Screen
            name={keyNavigation.PUSH_NOTIFICATION}
            component={PushNotification}
          />
          <MainStack.Screen
            name={keyNavigation.DETAIL_PUSH}
            component={PushNotiDetail}
          />
          <MainStack.Screen name={keyNavigation.VIDEO} component={Video} />

          <MainStack.Screen
            name={keyNavigation.APP_PASSWORD}
            component={AppPassword}
          />
          <MainStack.Screen name={keyNavigation.RE_PASS} component={RePass} />
          <MainStack.Screen name={keyNavigation.NEW_PASS} component={NewPass} />
          <MainStack.Screen
            name={keyNavigation.CHANGE_PHONE_NUMBER}
            component={ChangePhoneNumber}
          />
          <MainStack.Screen name={keyNavigation.QR} component={QrCode} />
        </MainStack.Navigator>
        {bottom && <BottomMenu />}
      </View>
      <ForgotPassword ref={ForgotModalService.modalForgotRef} />
      <SafeAreaView style={{backgroundColor: COLOR.dark}} />
    </Fragment>
  );
};

export default MainNavigator;
