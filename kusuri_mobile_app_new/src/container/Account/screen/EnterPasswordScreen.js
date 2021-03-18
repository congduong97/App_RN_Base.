import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  COLOR_WHITE,
  COLOR_BROWN,
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
  COLOR_BLACK,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
  DEVICE_HEIGHT,
  isIOS,
} from "../../../const/System";
import { STRING } from "../util/string";
import { pushResetScreen } from "../../../util";
import { Api } from "../util/api";
import { Validate } from "../../../util/module";
import { InputLogin } from "../item/InputLogin";
let visibleLogin = false;
import Barcode from "react-native-barcode-builder";
import { ButtonTypeOne } from "../../../commons";
import { HeaderClose } from "../item/HeaderClose";
import { checkMemberCodeInBlacklist } from "../../Launcher/util/checkVersionAllApp";
import RNFetchBlob from "rn-fetch-blob";
import { SIZE } from "../../../const/size";
import ImageCertificate from "../item/ImageCertificate";

export default class EnterPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTextInput: ["", "", "", ""],
    };
  }

  componentDidMount() {
    visibleLogin = true;
  }

  componentWillUnmount() {
    visibleLogin = false;
  }
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;
  };

  getFormatDate = (time) => {
    if (!time) {
      return null;
    }
    const date = new Date(time);
    return `  ${date.getFullYear()}年${date.getMonth() +
      1}月${date.getDate()}日${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒時点`;
  };

  getMyPageInfo = async () => {
    try {
      const myPageInfoResponse = await Api.getImage();
      if (
        myPageInfoResponse.code === 200 &&
        myPageInfoResponse.res.status.code === 1000
      ) {
        const {
          money,
          point,
          barcodeUrl,
          imageUrl,
          textDescription,
          accessTime,
        } = myPageInfoResponse.res.data;

        const newTimeUpdate = this.getFormatDate(accessTime);
        AsyncStorage.setItem(keyAsyncStorage.pointOfUser, `${point}`);
        AsyncStorage.setItem(keyAsyncStorage.moneyOfUser, `${money}`);
        AsyncStorage.setItem(keyAsyncStorage.textTimeUpdate, newTimeUpdate);
        AsyncStorage.setItem(keyAsyncStorage.textDescription, textDescription);
        if (barcodeUrl != null && barcodeUrl != "") {
          await RNFetchBlob.config({ fileCache: true })
            .fetch("GET", barcodeUrl)
            .then((res) => {
              const uri = isIOS ? res.path() : "file://" + res.path();
              AsyncStorage.setItem(keyAsyncStorage.barcodeImageUrl, uri);
            })
            .catch((err) => {
              AsyncStorage.setItem(keyAsyncStorage.barcodeImageUrl, "");
            });
        }

        if (imageUrl != null && imageUrl != "") {
          await RNFetchBlob.config({ fileCache: true })
            .fetch("GET", imageUrl)
            .then((res) => {
              const uri = isIOS ? res.path() : "file://" + res.path();
              AsyncStorage.setItem(keyAsyncStorage.appImageUrl, uri);
            })
            .catch((err) => {
              AsyncStorage.setItem(keyAsyncStorage.appImageUrl, "");
            });
        }
      }
    } catch (error) {
      AsyncStorage.setItem(keyAsyncStorage.barcodeImageUrl, "");
      AsyncStorage.setItem(keyAsyncStorage.appImageUrl, "");
    }
  };

  login = async () => {
    try {
      this.setState({ loading: true });
      const { listTextInput } = this.state;
      const { memberCode } = this.props.navigation.state.params;
      if (listTextInput.length === 4) {
        let check = true;
        let pass = "";
        listTextInput.map((value) => {
          if (value && value.length === 1 && !isNaN(value)) {
            pass = `${pass}${value}`;
          } else {
            check = false;
          }
        });
        if (check) {
          const response = await Api.pushSign(memberCode, pass);
          console.log("response", response);
          if (response.code === 200) {
            const {
              username,
              userId,
              accessToken,
              refreshToken,
              memberDto,
            } = response.res;

            if (userId != null) {
              managerAccount.accessToken = accessToken;
              managerAccount.username = username;
              managerAccount.memberCode = memberDto.memberCode;
              managerAccount.refreshToken = refreshToken;
              managerAccount.point = memberDto.point;
              managerAccount.money = memberDto.money;
              managerAccount.phoneNumber = memberDto.phone;
              managerAccount.birthday = memberDto.birthday;
              managerAccount.password = pass;
              managerAccount.userId = userId;
              managerAccount.validatePhoneNumberSuccess = false;
              managerAccount.needAddBirthDay = false;
              managerAccount.needValidateBirthDay = false;
              AsyncStorage.removeItem("callOnlyGetBalance");

              await AsyncStorage.setItem(
                keyAsyncStorage.managerAccount,
                JSON.stringify(managerAccount)
              );
              await checkMemberCodeInBlacklist(memberDto.memberCode);
              this.getMyPageInfo();
              pushResetScreen(this.props.navigation, "HomeNavigator");
            } else {
              Alert.alert(STRING.an_error_occurred);
            }
          } else if (response.code === 400) {
            Alert.alert(STRING.wrong_password_or_email);
          } else {
            Alert.alert(
              STRING.an_error_occurred,
              STRING.please_try_again_later
            );
          }
        }
      }
    } catch (err) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      if (visibleLogin) {
        this.setState({ loading: false });
      }
    }
  };
  renderInput = () => {
    const { listTextInput } = this.state;
    const { state } = this.props.navigation;
    const listInput = listTextInput.map((value, index) => (
      <InputLogin
        nameScreen={"EnterPasswordScreen"}
        widthInput={15}
        changeDataParent={this.changeDataParent}
        autoFocus={index === 0}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextInput.length - 1}
        customViewInputStyle={{
          marginHorizontal: 15,
        }}
      />
    ));
    return <View style={{ flexDirection: "row" }}>{listInput}</View>;
  };
  checkLogin = () => {
    const { listTextInput } = this.state;
    if (listTextInput && listTextInput.length === 16) {
      let check = true;
      let membercode = "";
      listTextInput.map((value) => {
        membercode += value;
        if (value && value.length === 1 && !isNaN(value)) {
        } else {
          check = false;
        }
      });
      if (check) {
        managerAccount.userId = membercode;
        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAccount)
        );
        this.goHomeScreen();
      } else {
      }
    }
  };
  goHomeScreen = () => {
    pushResetScreen(this.props.navigation, "HomeNavigator");

    // this.props.navigation.navigate('LoginUser');
  };

  render() {
    const { goBack, state } = this.props.navigation;
    const { params, routeName } = state;
    const { memberCode } = params;
    const { loading } = this.state;
    return (
      <View style={{ backgroundColor: COLOR_GRAY_LIGHT }}>
        <HeaderClose
          disableClose={routeName === "LOGIN_OPEN_APP"}
          onPressClose={() => {
            goBack(null);
          }}
        />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={"always"}
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          style={styles.wrapperContainer}
        >
          <View
            style={{
              backgroundColor: COLOR_GRAY_LIGHT,
              flex: 1,
              marginHorizontal: 20,
            }}
          >
            <ImageCertificate />
            <View style={styles.viewInputPass}>
              <Text
                style={{
                  marginBottom: 5,
                  lineHeight: 19,
                  fontSize: 16,
                  color: COLOR_BLACK,
                }}
              >
                {"PINコードを入力してください。"}
              </Text>
              {this.renderInput()}
            </View>

            {/* <View
              style={{
                width: "100%",
                padding: 8,
                backgroundColor: COLOR_WHITE,
                marginTop: 25,
                borderWidth: 1,
                borderColor: COLOR_RED,
              }}
            > */}
            <Text style={styles.textIntro}>
              {
                "【ご注意】\n Aocaカードには会員番号、PIN番号とお問い合わせ時に利用する情報が印字されていますので、破棄しないようご注意ください。"
              }
            </Text>
            {/* </View> */}
            <ButtonTypeOne
              loading={loading}
              name={STRING.login}
              onPress={this.login}
            />
            {/* </View> */}
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  marginLeftRight: {
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperError: {
    marginTop: 5,
    width: DEVICE_WIDTH - 50,
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperContainer: {
    backgroundColor: COLOR_GRAY_LIGHT,
    height: DEVICE_HEIGHT,
  },
  textInput: {
    color: COLOR_BROWN,
    fontSize: 14,
    fontFamily: "SegoeUI",
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapperBody: {
    width: DEVICE_WIDTH,
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  wrapperSpace: {
    height: 30,
  },
  wrapperBottomButton: {
    margin: 25,
    marginBottom: 10,
    backgroundColor: COLOR_BROWN,
    width: DEVICE_WIDTH - 50,
    height: 45,
    borderRadius: 5,
  },
  textButton: {
    color: COLOR_WHITE,
    fontSize: 16,
    fontFamily: "SegoeUI",
  },
  wrapperFooter: {
    flex: 1,
    width: DEVICE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  shadow: {
    shadowColor: COLOR_GRAY,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    elevation: 2,
  },
  viewInputPass: {
    alignItems: "center",
    backgroundColor: COLOR_WHITE,
    paddingVertical: 20,
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
  textIntro: {
    backgroundColor: COLOR_WHITE,
    fontSize: 13,
    color: COLOR_RED,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 3,
    fontWeight: "bold",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
