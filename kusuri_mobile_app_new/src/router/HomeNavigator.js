import React, { PureComponent } from "react";
import { createStackNavigator } from "react-navigation";
import { View, SafeAreaView, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import HomeScreen from "../container/Home/screen/HomeScreen";
import {
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_BLACK,
  APP_COLOR,
} from "../const/Color";
import Drawer from "react-native-drawer";

import { DrawerControl } from "../container/Home/util/service";
import { AccountStack } from "../container/Account/util/navigation";
import { CouponStack } from "../container/Coupon/util/navigation";
import { ImageGelleryStack } from "../container/ImageGellery/util/navigation";
import { NotificationStack } from "../container/Notification/util/navigation";
import { SettingStack } from "../container/Setting/util/navigation";
import { PushNotificationStack } from "../container/PushNotification/util/navigation";
import { VideoStack } from "../container/Video/util/navigation";
import { ButtonTypeOne } from "../commons";
import { CheckDataApp } from "../container/Launcher/util/service";
import { StoreStack } from "../container/Store/until/navigation";
import { SearchResultStack } from "../container/SearchResultsStoreMoreOptions/until/navigation";
import { SearchResultStoreNameAddress } from "../container/SearchResultsStoreNameAddress/until/navigation";
import { OldCouponStack } from "../container/OldCoupon/util/navigation";
import { HistoryPricaStack } from "../container/HistoryPrica/util/navigation";
import { ChooseStoreStack } from "../container/ChooseStore/util/navigation";
import { PrescriptionStack } from "../container/Prescription/util/navigation";
import { HealthRecordsStack } from '../container/HealthRecords/util/navigation';
import { managerAccount, DEVICE_HEIGHT, DEVICE_WIDTH } from "../const/System";

import CertificateOfMemberShipScreen from "../container/CertificateOfMemberShipScreen/CertificateOfMemberShipScreen";
import ButtomMenu from "../container/Home/item/BottomMenu";
import SettingDrawer from "../container/SettingDrawer/SettingDrawer";
import SliderPhoneNumberBirthDayScreen from "../container/Account/screen/SliderPhoneNumberBirthDayScreen";
import Animated, { Easing } from "react-native-reanimated";

const stack = {
  HOME: {
    screen: HomeScreen,
  },

  CERTIFICATE_MEMBER: {
    screen: CertificateOfMemberShipScreen,
  },
};

const mutilStack = {
  ...stack,
  ...AccountStack,
  ...OldCouponStack,
  ...CouponStack,
  ...ImageGelleryStack,
  ...HistoryPricaStack,
  ...NotificationStack,
  ...SettingStack,
  ...PushNotificationStack,
  ...VideoStack,
  ...StoreStack,
  ...SearchResultStack,
  ...SearchResultStoreNameAddress,
  ...PrescriptionStack,
  ...ChooseStoreStack,
  ...HealthRecordsStack
};

const MyStack = createStackNavigator(mutilStack, {
  initialRouteName: "HOME",
  mode: "card",
  cardStyle: { backgroundColor: COLOR_WHITE },
  navigationOptions: {
    header: null,
    animationEnabled: false,
  },
});

class HomeNavigator extends PureComponent {
  static router = {
    ...MyStack.router,
    getStateForAction: (action, lastState) =>
      MyStack.router.getStateForAction(action, lastState),
  };
  state = {
    needAddPassword:
      managerAccount.needAddPassword && !managerAccount.passwordApp,
    memberCodeInBacklist: managerAccount.memberCodeInBlackList,
  };
  componentDidMount() {
    DrawerControl.onChange("HomeNavigator", (status) => {
      if (status) {
        this.drawer.open();
      } else {
        this.drawer.close();
      }
    });

    CheckDataApp.onChange("HomeNavigator", (status) => {
      if (status && status.type === "MEMBER_CODE_IN_BLACKLIST") {
        this.setState({ memberCodeInBacklist: true });
        return;
      }
    });
  }

  componentWillUnmount() {
    DrawerControl.unChange("HomeNavigator");
    CheckDataApp.unChange("HomeNavigator");
  }
  renderBottomMenu = () => {
    const { navigation } = this.props;
    return (
      <ButtomMenu navigation={navigation} onRef={(ref) => (this.tab = ref)} />
    );
  };
  onPressClose = () => {
    this.setState({ needAddPassword: false });
    managerAccount.needAddPassword = false;
  };
  onPressCloseBlackList = () => {
    this.setState({ memberCodeInBacklist: false });
  };
  renderPopupSliderAccount = () => {
    const { memberCodeInBacklist } = this.state;
    if (!managerAccount.usingSms) {
      return null;
    }
    if (memberCodeInBacklist) {
      return (
        <View
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            backgroundColor: `${COLOR_BLACK}90`,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
          }}
        >
          <View
            style={{
              borderRadius: 4,
              borderWidth: 1,
              padding: 32,
              backgroundColor: COLOR_WHITE,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              margin: 32,
            }}
          >
            <AntDesign
              onPress={this.onPressCloseBlackList}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                backgroundColor: COLOR_WHITE,
                borderRadius: 15,
              }}
              name={"closecircleo"}
              size={25}
              color={COLOR_BLACK}
            />
            <Text style={{ marginLeft: 20 }}>
              {
                "お客様のaoca会員番号はアプリでの利用停止状態となっています。 \n \n詳しくは、サブメニューお問い合わせからご確認お願いいたします。"
              }
            </Text>
          </View>
        </View>
      );
    }
    if (managerAccount.memberCodeInBlackList) {
      return null;
    }

    if (
      (!managerAccount.validatePhoneNumberSuccess ||
        managerAccount.needAddBirthDay ||
        managerAccount.needValidateBirthDay) &&
      managerAccount.usingSms &&
      managerAccount.userId
    ) {
      return (
        <View
          style={{
            position: "absolute",
            flex: 1,
            height: DEVICE_HEIGHT,
            padding: 40,
            paddingHorizontal: 20,
            backgroundColor: `${COLOR_BLACK}90`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ flex: 2 }} />
          <SliderPhoneNumberBirthDayScreen navigation={this.props.navigation} />
          <View style={{ flex: 2 }} />
        </View>
      );
    }
    if (this.state.needAddPassword && managerAccount.usingSms) {
      return (
        <View
          style={{
            position: "absolute",
            flex: 1,
            height: DEVICE_HEIGHT,
            width: DEVICE_WIDTH,
            padding: 40,
            backgroundColor: `${COLOR_BLACK}90`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: 16,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLOR_WHITE,
              borderRadius: 16,
              width: "100%",
            }}
          >
            <View>
              <Text>
                {`端末紛失や不正利用防止のためパスワード設定を行うことを推奨しております。下記よりパスワードの設定をお願いいたします。`}
              </Text>
              <Text
                style={{
                  paddingVertical: 16,
                  color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                }}
              >
                【ご注意】Aoca会員番号、PIN番号は機種変更など再ログイン時に必要となるため、カードは破棄しないようお願いします。
              </Text>
            </View>

            <AntDesign
              onPress={this.onPressClose}
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                backgroundColor: COLOR_WHITE,
                borderRadius: 15,
              }}
              name={"closecircleo"}
              size={25}
              color={COLOR_BLACK}
            />

            <ButtonTypeOne
              style={{ width: "100%", marginTop: 16 }}
              name={"セキュリティ設定へ"}
              onPress={() => {
                this.onPressClose();
                this.props.navigation.navigate("SECURITY_SETTING");
              }}
            />
          </View>
        </View>
      );
    }
    return null;
  };

  render() {
    const { navigation } = this.props;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLOR_GRAY_LIGHT,
        }}
      >
        <Drawer
          openDrawerOffset={0.1}
          type="overlay"
          tapToClose
          tweenDuration={100}
          tweenHandler={(ratio) => ({
            main: { opacity: (2 - ratio) / 2 },
          })}
          ref={(ref) => (this.drawer = ref)}
          content={
            <SettingDrawer
              drawer={this.drawer}
              navigation={this.props.navigation}
            />
          }
        >
          <MyStack
            navigation={navigation}
            screenProps={this.props.screenProps}
          />

          <SafeAreaView style={{ backgroundColor: COLOR_WHITE }}>
            {this.renderBottomMenu()}
          </SafeAreaView>
          {this.renderPopupSliderAccount()}
        </Drawer>
      </View>
    );
  }
}
export default HomeNavigator;
const defaultGetStateForAction = HomeNavigator.router.getStateForAction;
HomeNavigator.router.getStateForAction = (action, state) => {
  if (action.type === HomeNavigator.NAVIGATE) {
    const { routeName, params } = action;
    const lastRoute = state.routes[state.routes.length - 1];

    if (routeName === lastRoute.routeName && params === lastRoute.params) {
      return { ...state };
    }
  }
  return defaultGetStateForAction(action, state);
};
