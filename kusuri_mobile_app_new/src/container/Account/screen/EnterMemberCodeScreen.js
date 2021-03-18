import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
  COLOR_BLACK,
} from "../../../const/Color";
import { DEVICE_WIDTH } from "../../../const/System";
import { STRING } from "../util/string";
import { pushResetScreen } from "../../../util";
import { InputLogin } from "../item/InputLogin";
let visibleLogin = false;
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { HeaderClose } from "../item/HeaderClose";
import { SIZE } from "../../../const/size";
import ImageCertificate from "../item/ImageCertificate";
import { Api } from "../util/api";
export default class EnterMemberCodeScreen extends Component {
  constructor(props) {
    super(props);
    const state = this.props.navigation.state;

    let params = null;
    if (state) {
      params = state.params;
    }
    this.state = {
      email: "",
      errorEmail: true,
      pass: "",
      errorPass: true,
      loading: false,
      imageUrl: "",
      checkData: false,
      setDefault: false,
      listTextInput:
        typeof params === "string"
          ? params.split("")
          : ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    };
  }
  componentDidMount = async () => {
    visibleLogin = true;
  };

  componentWillUnmount() {
    visibleLogin = false;
  }
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;
  };
  goHomeScreen = () => {
    pushResetScreen(this.props.navigation, "HomeNavigator");
  };
  checkLogin = (screenNavigate) => async () => {
    const { listTextInput } = this.state;
    if (listTextInput && listTextInput.length === 16) {
      let check = true;
      let memberCode = "";
      listTextInput.map((value) => {
        if (value && value.length === 1 && !isNaN(value)) {
          memberCode = `${memberCode}${value}`;
        } else {
          check = false;
        }
      });
      if (memberCode.length < 16) {
        Alert.alert("会員番号を入力してください。");
        return;
      }
      if (screenNavigate === "LoginWithPhoneNumber") {
        const response = await Api.checkPinCode(memberCode);

        if (response.code === 200) {
          if (response.res.status.code === 1049) {
            Alert.alert("ご入力の会員番号に誤りがあります。");
          } else if (response.res.status.code === 1050) {
            Alert.alert(
              "ご入力の会員番号は機種変更、携帯電話番号変更の機能はご利用いただけません。\n恐れ入りますが、再度、Aoca会員カード番号、PINコードのご登録をお願いいたします。"
            );
          } else if (response.res.status.code === 1000) {
            this.props.navigation.navigate(screenNavigate, { memberCode });
          } else {
            Alert.alert(STRING.an_error_occurred);
          }
        }
        return;
      }

      if (check) {
        this.props.navigation.navigate(screenNavigate, { memberCode });
      } else {
      }
    }
  };
  renderInput = () => {
    const { listTextInput } = this.state;
    const { state } = this.props.navigation;
    const { params } = state;
    let widthInput = SIZE.width(4);

    const listInput = listTextInput.map((value, index) => (
      <InputLogin
        nameScreen={"EnterMemberCodeScreen"}
        widthInput={widthInput}
        changeDataParent={this.changeDataParent}
        autoFocus={
          typeof params === "string"
            ? index === listTextInput.length - 1
            : index === 0
        }
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextInput.length - 1}
      />
    ));
    return (
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
        }}
      >
        {listInput}
      </View>
    );
  };

  render() {
    const { goBack, state } = this.props.navigation;
    const { params, routeName } = state;
    const { loading } = this.state;
    return (
      <View style={{ backgroundColor: "#F6F6F6", flex: 1 }}>
        <StatusBar backgroundColor={"#F6F6F6"} barStyle="dark-content" />
        <HeaderClose
          disableClose={
            this.props.navigation.dangerouslyGetParent().state.routes.length ==
            1
          }
          onPressClose={() => {
            goBack(null);
          }}
        />

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          // keyboardShouldPersistTaps={"always"}
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          style={{ width: DEVICE_WIDTH }}
        >
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <ImageCertificate />

            <View style={styles.viewInputMemberCode}>
              <Text
                style={{
                  marginBottom: 25,
                  lineHeight: 19,
                  fontSize: 14,
                  color: COLOR_BLACK,
                  alignSelf: "center",
                  fontWeight: "bold",
                }}
              >
                {
                  "16桁の会員カード番号を入力してください。\n(13桁の旧カードはご登録いただけません。)"
                }
              </Text>
              {this.renderInput()}
            </View>

            <View style={styles.viewTextGuide}>
              <Text
                style={{
                  fontSize: 12,
                  color: COLOR_RED,
                  textAlign: "center",
                  fontWeight: "bold",
                  lineHeight: 15,
                }}
              >
                {
                  "【ご注意】\n Aocaカードには会員番号、PIN番号とお問い合わせ時に利用する情報が印字されていますので、破棄しないようご注意ください。"
                }
              </Text>
            </View>

            {params && params.fromScreen === "FROM_MYPAGE_WITH_LOVE" ? null : (
              <>
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: COLOR_BLACK,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    機種変更や携帯電話番号を変更された方は{"  "}
                  </Text>
                  <TouchableOpacity
                    onPress={this.checkLogin("LoginWithPhoneNumber")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text
                      style={{
                        color: COLOR_RED,
                        textDecorationLine: "underline",
                        textDecorationStyle: "solid",
                        textDecorationColor: COLOR_RED,
                      }}
                    >
                      こちら
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#1D1D1D",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {
                    "以前、携帯電話番号のご登録をされたAocaの場合は上記の \n リンクよりログインすることができます"
                  }
                </Text>
              </>
            )}
            <ButtonTypeOne
              name={STRING.login}
              loading={loading}
              onPress={this.checkLogin("EnterPasswordScreen")}
            />
            <ButtonTypeTwo
              style={{ marginTop: 20 }}
              name={STRING.login_with_barcode}
              onPress={() => {
                if (!loading) {
                  this.props.navigation.navigate("LoginWithBarCode");
                }
              }}
            />
            <TouchableOpacity
              style={{ marginTop: 15 }}
              onPress={this.goHomeScreen}
            >
              <Text style={styles.textSkip}>{STRING.skipp}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewInputMemberCode: {
    backgroundColor: COLOR_WHITE,
    paddingTop: 20,
    paddingBottom: 30,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  viewTextGuide: {
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: COLOR_WHITE,
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  textSkip: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    color: COLOR_BLACK,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#000",
  },
});
