import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import Login from '../container/LoginScreen';
import WebViewScreen from '../container/WebViewScreen';
import LauncherScreen from '../container/LauncherScreen';
import Over from '../container/OverScreen';
import Rule from '../container/RuleScreen';
import ScanScreen from '../container/QaCodeScaner';
import QuestionScreen from '../container/QuestionScreen';
import {QuestionDetail} from '../container/QuestionScreen/QuestionDetail';
import UsingScreen from '../container/UsingScreen';
import HomeNavigator from './HomeNavigator';
import PdfScreen from '../container/PdfScreen/PdfScreen';
import ConfirmApply from '../container/BannerScreen/ConfirmApply';
import UpdateScreen from '../container/LauncherScreen/UpdateScreen';
import TermsOfUseBeacon from '../container/TermsOfUseBeacon';
import {COLOR_WHITE} from '../const/Color';
import {AccountStack} from '../container/Account/util/navigation';
const RootStack = createStackNavigator(
  {
    ...{
      Launcher: {
        screen: LauncherScreen,
        navigationOptions: {
          header: null,
        },
      },

      UpdateScreen: {
        screen: UpdateScreen,
        navigationOptions: {
          header: null,
          gesturesEnabled: false,
        },
      },
      ConfirmApply: {
        screen: ConfirmApply,
        navigationOptions: {
          header: null,
        },
      },
      PDF: {
        screen: PdfScreen,
        navigationOptions: {
          header: null,
        },
      },
      QUESTION: {
        screen: QuestionScreen,
        navigationOptions: {
          header: null,
        },
      },
      USING: {
        screen: UsingScreen,
        navigationOptions: {
          header: null,
        },
      },
      POLICY: {
        screen: Rule,
        navigationOptions: {
          header: null,
        },
      },
      QuestionDetail: {
        screen: QuestionDetail,
        navigationOptions: {
          header: null,
        },
      },
      QR: {
        screen: ScanScreen,
        navigationOptions: {
          header: null,
        },
      },

      HomeNavigator: {
        screen: HomeNavigator,
        navigationOptions: {
          header: null,
        },
      },

      INTRODUCE_IMAGE: {
        screen: Over,
        navigationOptions: {
          header: null,
        },
      },
      Over: {
        screen: Over,
        navigationOptions: {
          header: null,
        },
      },
      WEB_VIEW: {
        screen: WebViewScreen,
        navigationOptions: {
          header: null,
        },
      },
      Rule: {
        screen: Rule,
        navigationOptions: {
          header: null,
        },
      },
      TERM: {
        screen: Rule,
        navigationOptions: {
          header: null,
        },
      },
      TermsOfUseBeacon: {
        screen: TermsOfUseBeacon,
        navigationOptions: {
          header: null,
        },
      }
    },
    ...AccountStack,
  },
  {
    initialRouteName: 'Launcher',
    mode: 'card',
    cardStyle: {backgroundColor: COLOR_WHITE},
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export default createAppContainer(RootStack);
