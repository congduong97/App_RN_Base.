import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  COLOR_GRAY,
  COLOR_RED,
  COLOR_WHITE,
  COLOR_BLACK,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import {
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
  DEVICE_HEIGHT,
} from "../../../const/System";
import { Api } from "../util/api";
import { InputLogin } from "../item/InputLogin";
import { STRING } from "../util/string";
import { pushResetScreen } from "../../../util";
import AsyncStorage from "@react-native-community/async-storage";
import { AlertService } from "../../../service/AlertService";
import { SIZE } from "../../../const/size";
import ImageCertificate from "./ImageCertificate";

export class InputOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: "",
      listTextInput: ["", "", "", "", "", ""],
      resendOtp: false,
    };
  }

  checkOpt = async () => {
    try {
      const { listTextInput } = this.state;
      const { phone, addBirthDay, validateBirthDay, disableModal } = this.props;

      let check = true;
      let otp = "";

      listTextInput.map((value) => {
        if (value && value.length === 1 && !isNaN(value)) {
          otp = `${otp}${value}`;
        } else {
          check = false;
        }
      });
      if (!check) {
        this.setState({ textError: "認証コードを入力してください" });
        return;
      }
      this.setState({ loading: true, textError: "" });
      const response = await Api.validateOTPCode(phone, otp);

      if (response.code === 200) {
        if (
          response.res.status.code === 1022 ||
          response.res.status.code === 1021 ||
          response.res.status.code === 1023 ||
          response.res.status.code === 1024
        ) {
          managerAccount.phoneNumber = phone;
          managerAccount.validatePhoneNumberSuccess = true;
          await AsyncStorage.setItem(
            keyAsyncStorage.managerAccount,
            JSON.stringify(managerAccount)
          );

          if (response.res.status.code === 1022) {
            validateBirthDay && validateBirthDay();
            managerAccount.needValidateBirthDay = true;
            AsyncStorage.setItem(
              keyAsyncStorage.managerAccount,
              JSON.stringify(managerAccount)
            );

            return;
          }
          if (response.res.status.code === 1024) {
            if (disableModal) {
              disableModal();
              setTimeout(() => {
                Alert.alert(STRING.validate_success);
                managerAccount.needAddPassword = true;
                pushResetScreen(this.props.navigation, "HomeNavigator");
              }, 500);
            } else {
              // Alert.alert(STRING.validate_success)
              AlertService.ableModal();
              //ToastService.showToast(STRING.validate_success,"【ご注意】カード番号・PINコードはログイン時に必要です。必ずご自身で控えておくようお願いします。※紛失、破棄によるポイント、残高の補償は対応できません。", 10000);
              managerAccount.needAddPassword = true;
              setTimeout(() => {
                pushResetScreen(this.props.navigation, "HomeNavigator");
              }, 300);
            }

            return;
          }
          if (
            response.res.status.code === 1021 ||
            response.res.status.code === 1023
          ) {
            addBirthDay && addBirthDay();
            managerAccount.needAddBirthDay = true;
            AsyncStorage.setItem(
              keyAsyncStorage.managerAccount,
              JSON.stringify(managerAccount)
            );

            return;
          }
        }

        if (response.res.status.code === 4) {
          this.setState({ textError: STRING.wrong_otp_code }); // pushResetScreen(this.props.navigation, 'HomeNavigator');
          return;
        }

        // susscessOtp()
      } else {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      }
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.setState({ loading: false });
    }
  };
  resendOtp = async () => {
    const { resendOtp } = this.props;
    if (resendOtp) {
      resendOtp();
      return;
    }
    if (this.state.resendOtp) {
      return;
    }
    this.state.resendOtp = true;

    try {
      // this.setState({ loading: true })

      const response = await Api.validatePhoneNumber(this.props.phone);
      if (response.code === 200 && response.res.status.code === 1000) {
        Alert.alert("認証コードを再送信しました");
        return;
      }
      if (response.code === 200 && response.res.status.code === 1028) {
        Alert.alert(
          STRING.notification,
          "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
        );
        return;
      }
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.state.resendOtp = false;
    }
  };
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;
  };
  changeDataParentFillOtp = (otp) => {
    if (otp && otp.length == 6) {
      let array = [otp[0], otp[1], otp[2], otp[3], otp[4], otp[5]];
      this.setState({ listTextInput: array });
    }
  };
  renderInput = () => {
    const { listTextInput } = this.state;
    const listInput = listTextInput.map((value, index) => (
      <InputLogin
        nameScreen={"InputOtpNumber"}
        widthInput={20}
        changeDataParentFillOtp={this.changeDataParentFillOtp}
        changeDataParent={this.changeDataParent}
        autoFocus={index === 0}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextInput.length - 1}
        customViewInputStyle={{ marginLeft: 20 }}
      />
    ));
    return (
      <View
        style={{
          flexDirection: "row",
          // justifyContent: "space-between",
          // width: "100%",
        }}
      >
        {listInput}
      </View>
    );
  };

  render() {
    const { loading, textError } = this.state;
    const { canChangePhone, phone, newPhoneChangeNumber } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"handled"}
        extraHeight={150}
        extraScrollHeight={150}
        enableOnAndroid
        style={{ minHeight: DEVICE_HEIGHT }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <ImageCertificate />
          <View style={styles.viewInputOtp}>
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              SMS認証コード入力
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 10,
                marginHorizontal: 15,
                color: "#1D1D1D",
                lineHeight: 14,
                marginBottom: 20,
              }}
            >
              末尾が *
              {newPhoneChangeNumber
                ? newPhoneChangeNumber.slice(-3)
                : managerAccount.phoneNumber.slice(-3)}{" "}
              の携帯電話番号に通知された認証コードを入力してください。
            </Text>
            {this.renderInput()}
            {textError ? (
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  style={{ color: COLOR_RED, textAlign: "center", margin: 10 }}
                >
                  {textError}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.viewText}>
            <Text
              style={{
                fontSize: 13,
                color: COLOR_RED,
                textAlign: "center",
                marginHorizontal: 20,
                fontWeight: "bold",
              }}
            >
              【ご注意】{"\n"}
              SMS（ショートメッセージサービス）が受信できない場合、キャリアまたは端末のSMS受信拒否設定を解除
              <Text style={{ color: COLOR_BLACK }}>
                たうえで再度お試しください。{"\n"} また、
              </Text>
              SMS送信は1日8通までが上限
              <Text style={{ color: COLOR_BLACK }}>
                となります。{"\n"}{" "}
                上限を超えてしまった場合は翌日以降に再度お試しください。
              </Text>
            </Text>
          </View>

          <ButtonTypeOne
            loading={loading}
            style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
            name={"認証"}
            onPress={this.checkOpt}
          />

          <ButtonTypeTwo
            loading={loading}
            style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
            name={"SMS認証コードを再送する"}
            onPress={this.resendOtp}
          />

          <Text
            style={{
              color: COLOR_GRAY,
              lineHeight: 25,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            SMS認証コードが届かない場合は、再送をお試しください
          </Text>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  viewInputOtp: {
    backgroundColor: COLOR_WHITE,
    paddingTop: 15,
    paddingBottom: 30,
    borderRadius: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  viewText: {
    width: "100%",
    padding: 8,
    backgroundColor: COLOR_WHITE,
    marginVertical: 18,
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
