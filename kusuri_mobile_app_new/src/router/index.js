import { createStackNavigator } from "react-navigation";
import HomeNavigator from "./HomeNavigator";
import PdfScreen from "../container/PDFScreen/PDFScreen";
import { LoginStack } from "../container/Account/util/navigation";
import { LauncherStack } from "../container/Launcher/util/navigation";
import { WebViewStack } from "../container/WebView/util/navigation";
import { QuestionStack } from "../container/Question/util/navigation";
import { UsingStack } from "../container/Using/util/navigation";
import { ApplyStackNoBottomMenu } from "../container/Apply/util/navigation";
import { CouponNoBottomStack } from "../container/Coupon/util/navigation";
import TermsOfUserScreen from "../container/TermsOfUser/screen/TermsOfUseScreen";
import { VideoCoupon } from "../container/VideoCouponPlayer/utils/navigation";
const stack = {
  PDF: {
    screen: PdfScreen,
  },
  HomeNavigator: {
    screen: HomeNavigator,
  },
  TermsOfUser: {
    screen: TermsOfUserScreen,
  },
};

const mutilStack = {
  ...stack,
  ...LoginStack,
  ...LauncherStack,
  ...WebViewStack,
  ...QuestionStack,
  ...UsingStack,
  ...ApplyStackNoBottomMenu,
  ...CouponNoBottomStack,
  ...VideoCoupon,
};

const RootStack = createStackNavigator(mutilStack, {
  initialRouteName: "Launcher",
  mode: "card",
  navigationOptions: {
    header: null,
  },
});

const defaultGetStateForAction = RootStack.router.getStateForAction;
RootStack.router.getStateForAction = (action, state) => {
  if (action.type === RootStack.NAVIGATE) {
    const { routeName, params } = action;
    const lastRoute = state.routes[state.routes.length - 1];

    if (routeName === lastRoute.routeName && params === lastRoute.params) {
      return { ...state };
    }
  }
  return defaultGetStateForAction(action, state);
};

export default RootStack;
