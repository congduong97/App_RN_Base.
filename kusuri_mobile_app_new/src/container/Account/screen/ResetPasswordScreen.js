import React, { Component } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";
import {
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_RED,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  managerAccount,
  keyAsyncStorage,
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputPassword from "../item/InputPassword";
import { STRING } from "../util/string";
export const checkPassWord = (check) => {
  const lowerCaseLetters = /[a-z]/g;
  const numbers = /[0-9]/g;
  let checkError = false;
  if (check.match(lowerCaseLetters) == null) {
    checkError = true;
  }

  if (check.match(numbers) == null) {
    checkError = true;
  }

  if (checkError) {
    return false;
  }
  // this.setState({ colorPassword: false, titleErrorPass: '' })
  return true;
};

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    let resetPassword = managerAccount.passwordApp;

    const { params } = this.props.navigation.state;
    if (params && params.resetPassword) {
      resetPassword = false;
    }

    this.state = {
      loading: false,
      oldPassword: "",
      newPassword: "",
      comfirmNewPassword: "",
      textError: "",
      passwordApp: resetPassword,
    };
  }
  componentDidMount() {
    const { params } = this.props.navigation.state;
    const { passwordApp } = this.state;
    if (!passwordApp && params && params.alertPopup) {
      Alert.alert(
        STRING.notification,
        "パスワードが設定されていません。パスワード設定後に変更可能となります。"
      );
    }
  }

  checkPassword = () => {
    const {
      oldPassword,
      newPassword,
      comfirmNewPassword,
      passwordApp,
    } = this.state;
    const { navigation } = this.props;

    if (passwordApp) {
      if (!newPassword || !comfirmNewPassword || !oldPassword) {
        this.setState({
          textError: "パスワード、パスワード確認用を入力してください。",
        });
        return;
      }
      if (oldPassword !== passwordApp) {
        this.setState({
          textError:
            "入力した現在のパスワードが異なっています。再度ご入力ください。",
        });
        return;
      }

      if (newPassword !== comfirmNewPassword) {
        this.setState({
          textError:
            "パスワード、パスワード確認用が一致してません。再度ご入力をお願いします。",
        });
        return;
      }
      if (newPassword.length < 4 || newPassword.length > 8) {
        this.setState({
          textError: "パスワードは半角4桁以上（最大8桁）の設定が必要です。",
        });
        return;
      }
      if (newPassword === oldPassword) {
        this.setState({
          textError:
            "現在パスワードと新しいパスワードが同じであってはなりません。",
        });
        return;
      }
      if (oldPassword == passwordApp && newPassword === comfirmNewPassword) {
        managerAccount.passwordApp = newPassword;
        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAccount)
        );
        Alert.alert("登録が完了しました。");
        navigation.goBack(null);
      }
      return;
    }
    if (!passwordApp) {
      if (!newPassword || !comfirmNewPassword) {
        this.setState({
          textError: "パスワード、パスワード確認用を入力してください。",
        });
        return;
      }
      if (newPassword !== comfirmNewPassword) {
        this.setState({
          textError:
            "パスワード、パスワード確認用が一致してません。再度ご入力をお願いします。",
        });
        return;
      }
      if (newPassword.length < 4 || newPassword.length > 8) {
        this.setState({
          textError: "パスワードは半角4桁以上（最大8桁）の設定が必要です。",
        });
        return;
      }

      if (newPassword == comfirmNewPassword) {
        managerAccount.passwordApp = newPassword;
        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAccount)
        );
        Alert.alert("登録が完了しました。");
        navigation.goBack(null);
      }
    }
  };
  render() {
    const { loading, textError, passwordApp } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <SafeAreaView />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={"always"}
          extraHeight={150}
          extraScrollHeight={150}
          enableOnAndroid
          style={{ height: DEVICE_HEIGHT }}
        >
          <View style={styles.title}>
            <Text>{!passwordApp ? "パスワード登録" : "パスワード変更"}</Text>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={styles.description}>
              {"パスワードは以下、条件必須 \n ・4桁以上（最大8桁まで可）"}
            </Text>
            {passwordApp ? (
              <InputPassword
                placeholder={"現在のパスワードをご入力"}
                placeholderTextColor={COLOR_GRAY}
                maxLength={8}
                onChangeText={(oldPassword) =>
                  (this.state.oldPassword = oldPassword)
                }
                editable={!loading}
              />
            ) : null}

            <InputPassword
              placeholder={"新しいパスワードをご入力"}
              placeholderTextColor={COLOR_GRAY}
              maxLength={8}
              onChangeText={(newPassword) =>
                (this.state.newPassword = newPassword)
              }
              editable={!loading}
            />
            <InputPassword
              placeholder={"新しいパスワードを再度ご入力"}
              placeholderTextColor={COLOR_GRAY}
              maxLength={8}
              onChangeText={(comfirmNewPassword) =>
                (this.state.comfirmNewPassword = comfirmNewPassword)
              }
              editable={!loading}
            />
            <View style={{ width: "100%" }}>
              <Text style={styles.textError}>{textError}</Text>
            </View>
            <ButtonTypeOne
              loading={loading}
              style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
              name={!passwordApp ? "登録" : "変更を保存"}
              onPress={this.checkPassword}
            />
            <ButtonTypeTwo
              loading={loading}
              style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
              name={"戻る"}
              onPress={() => this.props.navigation.goBack(null)}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLOR_GRAY_LIGHT,
    width: "100%",
  },
  description: {
    color: COLOR_GRAY,
    marginVertical: 16,
  },

  textError: {
    color: COLOR_RED,
  },
});
