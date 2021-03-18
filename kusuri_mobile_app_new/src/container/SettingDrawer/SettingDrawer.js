import React, { PureComponent } from "react";
import { View, Text, SafeAreaView, ScrollView, Image } from "react-native";
import {
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  APP_COLOR,
} from "../../const/Color";
import { AppImage } from "../../component/AppImage";
import {
  APP,
  isIOS,
  DEVICE_WIDTH,
  menuInApp,
  versionApp,
  managerAccount,
  versionCodePush,
} from "../../const/System";
import { STRING } from "../../const/String";
import { ItemSetting } from "./Item/ItemSetting";
import { Loading } from "../../commons";
import { CheckDataApp } from "../Launcher/util/service";
// import console = require('console');
const withHeader = isIOS ? 64 - 17 : 56 - 8.5;

export default class SettingDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadding: false,
    };
  }
  componentDidMount() {
    CheckDataApp.onChange("DRAWER", () => {
      this.setState({ loadding: true });
      if (this.timeOutReload) {
        clearTimeout(this.timeOutReload);
      }
      this.timeOutReload = setTimeout(() => {
        this.setState({ loadding: false });
      }, 1000);
    });
  }
  componentWillUnmount() {
    CheckDataApp.unChange("DRAWER");
  }
  renderIcon = () => {
    const listMenu = menuInApp.headerMenu.map((item, index) => (
      <ItemSetting
        navigation={this.props.navigation}
        data={item}
        key={`${index}`}
      />
    ));
    return (
      <View>
        {listMenu}
        {/* {managerAccount.userId && managerAccount.usingSms ? (
          <ItemSetting
            navigation={this.props.navigation}
            data={{ name: "セキュリティ設定", type: "SECURITY_SETTING" }}
          />
        ) : null} */}
      </View>
    );
  };
  render() {
    const { loadding } = this.state;
    if (loadding) {
      return <Loading />;
    }
    return (
      <View
        style={{ backgroundColor: APP_COLOR.BACKGROUND_COLOR, height: "100%" }}
      >
        <SafeAreaView>
          <View
            style={{
              borderBottomColor: COLOR_GRAY_LIGHT,
              borderBottomWidth: 1,
              alignItems: "center",
            }}
          >
            <AppImage
              url={APP.IMAGE_LOGO}
              style={{
                width: withHeader * (109 / 27),
                height: withHeader,
              }}
            />
          </View>
        </SafeAreaView>
        <View
          style={{
            backgroundColor: COLOR_GRAY_LIGHT,
            width: "100%",
            height: 50,
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 16 }}>{STRING.menu}</Text>
        </View>
        <ScrollView>{this.renderIcon()}</ScrollView>
        <SafeAreaView>
          <View
            style={{
              backgroundColor: COLOR_GRAY_LIGHT,
              width: "100%",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              {STRING.version} : {versionApp} ({versionCodePush})
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: COLOR_GRAY_LIGHT,
              borderBottomWidth: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Image
              resizeMode={"contain"}
              source={require("./images/logo.png")}
              style={{ height: 30, width: 100, marginVertical: 10 }}
            />
            <Text style={{ fontSize: DEVICE_WIDTH / 30 }}>
              {"Copyright @ KusuriNoAoki 2019"}
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
