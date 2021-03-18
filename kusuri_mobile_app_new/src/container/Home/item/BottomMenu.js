import React, { PureComponent } from "react";
import {
  Image,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import {
  tab,
  DEVICE_WIDTH,
  menuInApp,
  isIOS,
  managerAccount,
} from "../../../const/System";
import {
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
  COLOR_BLACK,
} from "../../../const/Color";
import CurrentScreen from "../../../service/CurrentScreen";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { AppImage } from "../../../component/AppImage";
import { CheckDataApp } from "../../Launcher/util/service";
import { NumberNewNofitification } from "../util/service";
import { BottomService } from "../../../service/BottomService";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default class BottomMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      namTabActive: "",
      visible: true,
      menu: menuInApp.bottomMenu,
      show: menuInApp.showBottomMenu,
      count: NumberNewNofitification.get(),
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
    BottomService.onChange("DISPLAY-BOTTOM", (value) => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          200,
          LayoutAnimation.Types.linear,
          LayoutAnimation.Properties.opacity
        )
      );
      this.setState({ show: value });
    });
    this.listenerChangeScreenAndChangeActiveBottomMenu();
    CheckDataApp.onChange("BOTTOM_MENU", () => {
      const { menu, show } = this.state;
      if (
        show !== menuInApp.showBottomMenu ||
        JSON.stringify(menu) !== JSON.stringify(menuInApp.bottomMenu)
      ) {
        this.setState({
          show: menuInApp.showBottomMenu,
          menu: menuInApp.bottomMenu,
          active: 0,
        });
      }
    });
    NumberNewNofitification.onChange("BOTTOM_MENU", (count) => {
      this.setState({ count });
    });
  }
  componentWillUnmount() {
    CheckDataApp.unChange("BOTTOM_MENU");
    NumberNewNofitification.unChange("BOTTOM_MENU");
  }
  setActive = (key) => {
    let indexs = -1;
    this.state.menu.map((item, index) => {
      if (item.function == key) {
        indexs = index;
      }
    });
    if (indexs == -1 && indexs !== this.state.active) {
      this.setState({ active: indexs });
    } else if (indexs !== this.state.active) {
      this.setState({ active: indexs });
    }
  };

  listenerChangeScreenAndChangeActiveBottomMenu = () => {
    CurrentScreen.onChange("BottomMenu", (sreenName) => {
      if (sreenName == "QR" && sreenName == "WEB_VIEW") {
        return;
      }
      let screenNameConvert = sreenName;
      switch (sreenName) {
        case "SearchCoupon":
          screenNameConvert = "COUPON";
          break;
        case "CouponDetail":
          screenNameConvert = "COUPON";
          break;
        case "ConfirmCoupon":
          screenNameConvert = "COUPON";
          break;
        case "DetailNotification":
          screenNameConvert = "COMPANY_NOTIFICATION";
          break;
        case "DetailPushNotification":
          screenNameConvert = "PUSH_NOTIFICATION";
          break;
        case "IntroducingWaca":
          screenNameConvert = "MY_PAGE";
          break;
        case "Rule":
          screenNameConvert = "SETTING";
          break;
        case "TERM":
          screenNameConvert = "SETTING";
          break;
        case "Over":
          screenNameConvert = "SETTING";
          break;
        case "HISTORY_COUPON":
          screenNameConvert = "SETTING";
          break;
        case "INTRODUCE_IMAGE":
          screenNameConvert = "SETTING";
          break;
        case "POLICY":
          screenNameConvert = "SETTING";
          break;
        case "USING":
          screenNameConvert = "SETTING";
          break;
        case "QUESTION":
          screenNameConvert = "SETTING";
          break;

        default:
          screenNameConvert = sreenName;
      }
      this.setActive(screenNameConvert);
    });
  };
  componentWillUnmount() {
    CurrentScreen.unChange("BottomMenu");
  }

  onPressBottomMenu = (item, index) => {
    console.log(item);
    const { navigation } = this.props;
    if (item.function !== "WEB_VIEW" && item.function !== "LINK_APP") {
      if (item.function === "STORE" || item.function === "MY_PAGE") {
        if (managerAccount.userId) {
          this.setState({ active: index });
        }
      } else {
        this.setState({ active: index });
      }
    }
    OpenMenu(item, navigation, true);
  };
  renderIcon3 = (item, isActive) => {
    if (item.typeDisplay === "NONE") {
      return;
    }
    return (
      <View style={{ position: "absolute" }}>
        <View
          style={{
            backgroundColor: "red",
            width: DEVICE_WIDTH / 2 - 90,
            marginTop: 30,
            position: "relative",
            height: 64,
            justifyContent: "center",
            borderRadius: 9,
            alignItems: "center",
            bottom: 20,
            shadowOffset: {
              width: 0,
              height: 0.5,
            },
            shadowRadius: 3,
            shadowOpacity: 0.3,
            elevation: 1,
            borderColor: COLOR_GRAY_LIGHT,
          }}
        >
          <AppImage
            resizeMode={"contain"}
            url={item.iconUrl}
            style={{
              width: 100,
              height: 30,
              marginBottom: 19,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <Text
            style={{
              bottom: 8,
              fontSize: DEVICE_WIDTH / 40,
              color: COLOR_WHITE,
              elevation: 2,
              textAlign: "center",
            }}
          >
            {item.name}
          </Text>
          {this.renderCountNotification(item, 14)}
        </View>
      </View>
    );
  };
  renderCountNotification = (item, fontSize) => {
    // console.log('item', item)
    const { count } = this.state;
    if (item.function === "PUSH_NOTIFICATION") {
      if (count) {
        return (
          <Text
            style={[styles.textBabel, { fontSize: fontSize ? fontSize : 10 }]}
          >
            {count}
          </Text>
        );
      }
    }

    return null;
  };

  renderIcon = (item, isActive) => {
    if (item.typeDisplay === "NONE") {
      return;
    }
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Image
          resizeMode={"contain"}
          source={{ uri: item.iconUrl }}
          style={{
            width: 25,
            height: 25,
            marginBottom: 10,
            marginTop: 5,
            tintColor: isActive ? APP_COLOR.COLOR_TEXT : COLOR_GRAY,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            bottom: 5,
            fontSize: DEVICE_WIDTH / 40,
            color: isActive ? APP_COLOR.COLOR_TEXT : COLOR_GRAY,
          }}
        >
          {item.name}
        </Text>
        {this.renderCountNotification(item)}
      </View>
    );
  };

  render() {
    const { menu, show } = this.state;
    if (!show) {
      return null;
    }
    const renderMenu = menu.map((item, index) => {
      const isActive = index === this.state.active;
      return (
        <TouchableOpacity
          key={`${index}a`}
          vertical
          style={{
            paddingTop: 0,
            justifyContent: "center",
            alignItems: "center",
            flex: index === 2 ? 1.5 : 1,
            height: 55,
          }}
          onPress={() => {
            if (!tab.block) {
              this.onPressBottomMenu(item, index);
            }
          }}
        >
          {index === 2
            ? this.renderIcon3(item, isActive)
            : this.renderIcon(item, isActive)}
        </TouchableOpacity>
      );
    });
    return (
      <View style={{ backgroundColor: COLOR_WHITE }}>
        <View
          style={{
            backgroundColor: COLOR_WHITE,
            padding: 0,
            height: 55,
            flexDirection: "row",
            justifyContent: "center",
            width: DEVICE_WIDTH,
            borderColor: COLOR_GRAY_LIGHT,
            borderTopWidth: 1,
          }}
        >
          {renderMenu}
        </View>
        <SafeAreaView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textBabel: {
    fontFamily: "SegoeUI",
    top: 0,
    right: 0,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
    padding: 8,
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 10,
    color: COLOR_WHITE,
    backgroundColor: "red",
  },
});
