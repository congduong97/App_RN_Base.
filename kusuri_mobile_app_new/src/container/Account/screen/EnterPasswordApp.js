import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import { STRING } from "../util/string";
import {
  managerAccount,
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
} from "../../../const/System";
import {
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BLUE,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
  APP_COLOR,
  COLOR_GRAY_900,
  COLOR_BLACK,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { pushResetScreen } from "../../../util";
import Communications from "react-native-communications";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AntDesign from "react-native-vector-icons/AntDesign";
import InputPassword from "../item/InputPassword";
import { ClickWhenScreenPasswordNotification } from "../../Home/util/service";

export default class EnterPasswordApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      secureTextEntry: true,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  handleBackPress = () => {
    return true;
  };
  goBackSecurity = () => {
    const { params } = this.props.navigation.state;

    if (params && params.upDateData) {
      this.props.navigation.navigate("HOME");
      setTimeout(() => {
        params.upDateData();
      }, 500);
      return;
    }
    this.props.navigation.goBack(null);
  };

  checkPass = () => {
    const { text } = this.state;
    const { params } = this.props.navigation.state;
    if (!text) {
      this.setState({ textError: STRING.password_app_not_enter });
      return;
    }

    if (text == managerAccount.passwordApp) {
      setTimeout(() => {
        ClickWhenScreenPasswordNotification.set();
      }, 1000);
      if (params && params.upDateData) {
        this.props.navigation.goBack(null);
        setTimeout(() => {
          params.upDateData();
        }, 500);
        return;
      }

      if (params && params.enterPasswordSuccess) {
        params.enterPasswordSuccess();
        this.props.navigation.goBack(null);
        return;
      }
      if (params && params.nameFunction) {
        if (params.nameFunction === "HomeNavigator") {
          pushResetScreen(this.props.navigation, "HomeNavigator");
        } else {
          this.props.navigation.navigate(params.nameFunction);
        }
        return;
      }
    } else {
      this.setState({ textError: STRING.wrong_password_app });
    }
  };
  changeSecureTextEntry = () => {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  };
  checkVisibleGoBack = () => {
    const { params } = this.props.navigation.state;
    if (params && params.upDateData && managerAccount.enablePasswordOppenApp) {
      return false;
    }
    if (this.props.navigation.dangerouslyGetParent().state.routes.length == 1) {
      return false;
    }
    return true;
  };

  render() {
    const { loading, navigation } = this.props;
    const { secureTextEntry, textError } = this.state;
    const { params } = this.props.navigation.state;
    // console.log('navigation',navigation)
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_GRAY_LIGHT }}>
        <SafeAreaView />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={"always"}
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          style={{ height: DEVICE_HEIGHT }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: DEVICE_WIDTH,
                backgroundColor: APP_COLOR.COLOR_TEXT,
                alignItems: "center",
                height: 70,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: COLOR_WHITE, fontSize: 25 }}
              >
                {"クスリのアオキ"}
              </Text>
            </View>
            <Text style={{ fontWeight: "bold", marginTop: 32, fontSize: 18 }}>
              {"パスワード入力"}
            </Text>
            <Text
              style={{
                lineHeight: 25,
                paddingVertical: 16,
                fontSize: 18,
                paddingHorizontal: 16,
              }}
            >
              {"パスワード設定にてご登録のパスワードをご入力ください。"}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 16, paddingTop: 0 }}>
            <View style={styles.forgotPassword}>
              <Text
                onPress={() => {
                  navigation.navigate("ForgotPassWord");
                }}
                style={styles.titleForgotPassword}
              >
                {"パスワードをお忘れの場合はこちら"}
              </Text>
            </View>

            <InputPassword
              styleContainer={{ backgroundColor: COLOR_WHITE }}
              placeholder={"パスワードを入力してください。"}
              placeholderTextColor={COLOR_GRAY}
              maxLength={8}
              onChangeText={(text) => this.setState({ text })}
              editable={!loading}
              value={this.state.text}
              style={[{ height: 55, paddingLeft: 16, flex: 9, fontSize: 18 }]}
            />

            <View style={{ width: "100%" }}>
              <Text style={{ color: COLOR_RED }}>{textError}</Text>
            </View>
            <ButtonTypeOne
              loading={loading}
              style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
              name={"パスワードロック解除"}
              onPress={this.checkPass}
            />
            {this.checkVisibleGoBack() ? (
              <ButtonTypeTwo
                loading={loading}
                style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
                name={"戻る"}
                onPress={() => {
                  this.goBackSecurity();
                }}
              />
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  forgotPassword: {
    justifyContent: "flex-end",
    borderColor: COLOR_GRAY_LIGHT,
    flexDirection: "row",
    paddingTop: 16,
    marginBottom: 16,
  },
  titleForgotPassword: {
    color: COLOR_BLUE,
    textDecorationLine: "underline",
  },
});
