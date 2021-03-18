import React, { PureComponent } from "react";
import { View, StyleSheet, StatusBar, Alert } from "react-native";
import { List, Item, Content } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import HeaderIconLeft from "../../../commons/HeaderIconLeft";
import {
  COLOR_GRAY_LIGHT,
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE,
  COLOR_YELLOW,
  COLOR_GREEN,
  COLOR_RED,
  APP_COLOR,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  tab,
  managerAccount,
  keyAsyncStorage,
  menuInApp,
  APP_ID,
} from "../../../const/System";
import { STRING } from "../../../const/String";

import { ItemSetting } from "../item/ItemSetting";
import { SubMenu } from "../item/SubMenu";
import { pushResetScreen } from "../../../util";
import CookieManager from "react-native-cookies";
import { OpenMenu } from "../../../util/module/OpenMenu";

export default class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      nameLogin: "",
      iconLogin: "",
      nameLogout: "",
      iconLogout: "",
      nameRegister: "",
      iconRegister: "",
      subMenu: [],
    };
    this.onPressLogout = this.onPressLogout.bind(this);
  }

  componentDidMount() {
    // console.log('screene', screen.activities);
    this.onMounted();
  }

  onMounted() {
    // console.log('subMenu', submenu);
    if (menuInApp.subMenu) {
      const subMenuNotLoginRegisterLogout = menuInApp.subMenu.filter((item) => {
        if (item.function == "LOGIN") {
          this.state.nameLogin = item.name;
          this.state.iconLogin = item.iconUrl;
        }
        if (item.function == "REGISTER") {
          this.state.nameRegister = item.name;
          this.state.iconRegister = item.iconUrl;
        }
        if (item.function === "LOGOUT") {
          this.state.nameLogout = item.name;
          this.state.iconLogout = item.iconUrl;
        }
        if (!managerAccount.username) {
          return (
            item.function !== "LOGIN" &&
            item.function !== "REGISTER" &&
            item.function !== "LOGOUT"
          );
        }
        return (
          item.function !== "LOGIN" &&
          item.function !== "REGISTER" &&
          item.function !== "LOGOUT"
        );
      });
      this.setState({ subMenu: subMenuNotLoginRegisterLogout });
    }
  }
  onPressLogout() {
    Alert.alert(
      STRING.log_out,
      STRING.are_you_sure_you_want_to_sign_out_of_the_app,
      [{ text: STRING.cancel }, { text: STRING.ok, onPress: this.logout }],
      { cancelable: false }
    );
  }

  render() {
    const { goBack } = this.props.navigation;
    const { iconUrlSettingScreen, nameSettingScreen } = tab.screenTab;
    const { disableBackButton, navigation } = this.props;

    return (
      <View
        style={[
          styles.wrapperBody,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameSettingScreen}
          goBack={goBack}
          navigation={navigation}
          imageUrl={iconUrlSettingScreen}
        />
        <Content>
          <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
            <List>
              <SubMenu
                data={this.state.subMenu}
                onPress={(item) => {
                  OpenMenu(item, navigation);
                }}
              />
            </List>
          </View>
        </Content>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    // height: '100%',
    paddingBottom: 0,
  },
  avatarSetting: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  wrapperIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    marginRight: 15,
    borderRadius: 15,
  },
  itemStyle: {
    backgroundColor: COLOR_WHITE,
    marginLeft: 0,
    height: 15,
    borderColor: COLOR_GRAY_LIGHT,

    // paddingLeft: 15,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  textDescriptionCard: {
    fontFamily: "SegoeUI",
    fontSize: 14,
  },
  textTitleCard: {
    fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 16,
    fontWeight: "bold",
  },
  textTimeCard: {
    fontSize: 12,
    color: COLOR_BLUE,
    fontFamily: "SegoeUI",
  },
  wrapperSpace: {
    height: 50,
  },
});
