//Library:
import React, {Fragment, useEffect, useState, useContext} from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {COLOR} from '../utils';
import {keyNavigation} from './utils/KeyNavigation';

//Component:
import BottomMenu from './BottomMenu';
import MyPage from '../screens/MyPage/MyPage';
import Stamps from '../screens/Stamps/Stamps';
import QrCode from '../screens/QrCode/QrCode';
import Question from '../screens/Question/Question';
import QuestionDetail from '../screens/QuestionDetail/QuestionDetail';
import MypagePassConfirm from '../screens/MypagePassConfirm/MypagePassConfirm';
import CertificateMember from '../screens/CertificateMember/CertificateMember';
import Store from '../screens/Store/Store';
import StoreDetail from '../screens/StoreDetail/StoreDetail';
import StoreFilter from '../screens/StoreFilter/StoreFilter';
import StoreBookmark from '../screens/StoreBookmark/StoreBookmark';
import SubMenu from '../screens/SubMenu/SubMenu';
import HowToUse from '../screens/HowToUse/HowToUse';
import EmailInput from '../screens/EmailInput/EmailInput';
import NewsList from '../screens/NewsList/NewsList';
import ActiveOtp from '../screens/ActiveOTP/ActiveOtp';
import Policy from '../screens/Policy/Policy';
import ConfirmMessage from '../screens/ConfirmMessage/ConfirmMessage';
import ChangePassword from '../screens/ChangePassword/ChangePassword';
import ChangePersonalInfo from '../screens/ChangePersonalInfo/ChangePersonalInfo';
import LinkingCard from '../screens/LinkingCard/LinkingCard';
import PushNotification from '../screens/PushNotification/PushNotification';
import PushNotiDetail from '../screens/PushNotiDetail/PushNotiDetail';
import WebViewScreen from '../screens/WebView/WebViewScreen';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import Video from '../screens/Video/Video';
import DisableAccount from '../screens/DisableAccount/DisableAccount';

//Services:
import {BottomService} from './services/BottomService';
import Home from '../screens/Home/Home';

const MainStack = createStackNavigator();

const MainNavigator = () => {
  const [bottom, setBottom] = useState(true);

  useEffect(() => {
    BottomService.onChange('set-bottom', (value) => {
      setBottom(value);
    });
    return () => {
      BottomService.deleteKey('set-bottom');
    };
  }, []);
  return (
    <Fragment>
      <SafeAreaView style={{backgroundColor: COLOR.white}} />
      <StatusBar backgroundColor={COLOR.grey_300} barStyle='dark-content' />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
        }}>
        <MainStack.Navigator
          headerMode={'none'}
          initialRouteName={keyNavigation.HOME}
          screenOptions={{
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <MainStack.Screen name={keyNavigation.HOME} component={Home} />
          <MainStack.Screen name={keyNavigation.LOGIN} component={Login} />
          <MainStack.Screen
            name={keyNavigation.REGISTER}
            component={Register}
          />
          <MainStack.Screen name={keyNavigation.MY_PAGE} component={MyPage} />
          <MainStack.Screen
            name={keyNavigation.CHANGE_PASSWORD}
            component={ChangePassword}
          />
          <MainStack.Screen
            name={keyNavigation.QUESTION}
            component={Question}
          />
          <MainStack.Screen name={keyNavigation.POLICY} component={Policy} />
          <MainStack.Screen
            name={keyNavigation.CHANGE_PERSONAL_INFO}
            component={ChangePersonalInfo}
          />
          <MainStack.Screen
            options={{gestureEnabled: false}}
            name={keyNavigation.CONFIRM_MESS}
            component={ConfirmMessage}
          />
          <MainStack.Screen
            name={keyNavigation.CERTIFICATE_MEMBER}
            component={CertificateMember}
          />
          <MainStack.Screen
            name={keyNavigation.QUESTION_DETAIL}
            component={QuestionDetail}
          />
          <MainStack.Screen
            name={keyNavigation.MY_PAGE_PASS_CONFIRM}
            component={MypagePassConfirm}
          />
          <MainStack.Screen name={keyNavigation.USING} component={HowToUse} />
          <MainStack.Screen name={keyNavigation.SUB_MENU} component={SubMenu} />
          <MainStack.Screen name={keyNavigation.STORE} component={Store} />
          <MainStack.Screen
            name={keyNavigation.STORE_DETAIL}
            component={StoreDetail}
          />
          <MainStack.Screen name={keyNavigation.QR} component={QrCode} />
          <MainStack.Screen
            name={keyNavigation.STORE_FILTER}
            component={StoreFilter}
          />
          <MainStack.Screen
            name={keyNavigation.BOOKMARK_STORE}
            component={StoreBookmark}
          />
          <MainStack.Screen
            name={keyNavigation.NEWS_LIST}
            component={NewsList}
          />
          <MainStack.Screen
            name={keyNavigation.NOTIFICATION}
            component={Stamps}
          />
          <MainStack.Screen
            name={keyNavigation.ACTIVE_OTP}
            component={ActiveOtp}
          />
          <MainStack.Screen
            name={keyNavigation.PUSH_NOTIFICATION}
            component={PushNotification}
          />
          <MainStack.Screen
            name={keyNavigation.DETAIL_PUSH}
            component={PushNotiDetail}
          />
          <MainStack.Screen
            name={keyNavigation.EMAIL_INPUT}
            component={EmailInput}
          />
          <MainStack.Screen
            name={keyNavigation.LINKING_CARD}
            component={LinkingCard}
          />
          <MainStack.Screen
            name={keyNavigation.WEBVIEW}
            component={WebViewScreen}
          />
          <MainStack.Screen name={keyNavigation.VIDEO} component={Video} />
          <MainStack.Screen
            options={{gestureEnabled: false}}
            name={keyNavigation.DISABLE_ACCOUNT}
            component={DisableAccount}
          />
        </MainStack.Navigator>
        {bottom && <BottomMenu />}
      </View>
      {bottom && <SafeAreaView style={{backgroundColor: '#47362B'}} />}
    </Fragment>
  );
};

export default MainNavigator;
