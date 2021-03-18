import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_RED,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
  DEVICE_HEIGHT,
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { STRING } from "../util/string";
import { InputOtp } from "../item/InputOtp";
import { Api } from "../util/api";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputPhone from "../item/InputPhone";
export default class ChangePhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      oldPhoneNumber: "",
      newPhoneNumber: "",
      comfirmNewPhoneNumber: "",
      textError: "",
      modalVisible: false,
    };
  }
  checkPassword = () => {
    const {
      oldPhoneNumber,
      newPhoneNumber,
      comfirmNewPhoneNumber,
    } = this.state;
    const { navigation } = this.props;

    if (managerAccount.phoneNumber) {
      if (!oldPhoneNumber) {
        this.setState({ textError: "現在の携帯電話番号を入力してください。" });
        return;
      }
      if (oldPhoneNumber.length !== 11) {
        this.setState({
          textError: "現在の携帯電話番号を11桁の半角数値で入力してください。",
        });
        return;
      }
      if (!newPhoneNumber) {
        this.setState({ textError: "新しい携帯電話番号を入力してください。" });
        return;
      }
      if (newPhoneNumber.length !== 11) {
        this.setState({
          textError: "新しい携帯電話番号を11桁の半角数値で入力してください。",
        });
        return;
      }
      if (!comfirmNewPhoneNumber) {
        this.setState({
          textError: "新しい携帯電話番号（確認用）を入力してください。",
        });
        return;
      }

      if (comfirmNewPhoneNumber.length !== 11) {
        this.setState({
          textError:
            "新しい携帯電話番号（確認用）を11桁の半角数値で入力してください。",
        });
        return;
      }

      if (newPhoneNumber !== comfirmNewPhoneNumber) {
        this.setState({
          textError:
            "入力した新しい携帯電話と再入力の新しい携帯電話が異なっています。再度ご入力ください。",
        });

        return;
      }
      if (newPhoneNumber == oldPhoneNumber) {
        this.setState({
          textError: "現在ご登録の携帯電話番号はご入力できません。",
        });
        return;
      }

      if (newPhoneNumber === comfirmNewPhoneNumber) {
        this.sendOtpPhoneNumber();
        return;
      }

      return;
    }
  };
  sendOtpPhoneNumber = async () => {
    try {
      this.setState({ loading: true, textError: "" });
      const { newPhoneNumber, oldPhoneNumber } = this.state;
      const response = await Api.updatePhoneNumber(
        oldPhoneNumber,
        newPhoneNumber
      );
      if (response.code === 200 && response.res.status.code === 1000) {
        this.setState({ modalVisible: true });
        return;
      }
      if (response.code === 200 && response.res.status.code === 1028) {
        Alert.alert(
          STRING.notification,
          "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
        );
        return;
      }
      if (response.code === 200 && response.res.status.code === 4) {
        this.setState({
          textError:
            "入力した現在の携帯電話が異なっています。再度ご入力ください。",
        });
        return;
      }

      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.setState({ loading: false });
    }
  };
  disableModal = () => {
    this.setState({ modalVisible: false });
  };
  resendOtp = async () => {
    try {
      const { newPhoneNumber, oldPhoneNumber } = this.state;
      const response = await Api.updatePhoneNumber(
        oldPhoneNumber,
        newPhoneNumber
      );

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
    }
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  renderModal = () => {
    const { modalVisible, newPhoneNumber } = this.state;
    const { navigation } = this.props;
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
        }}
      >
        <SafeAreaView />
        <TouchableOpacity
          onPress={this.closeModal}
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={"chevron-back"}
            size={DEVICE_WIDTH * 0.09}
            style={{ color: "#636465", marginLeft: 8 }}
          />
        </TouchableOpacity>
        <InputOtp
          newPhoneChangeNumber={newPhoneNumber}
          resendOtp={this.resendOtp}
          canChangePhone
          changePhoneNumber={() => this.setState({ modalVisible: false })}
          navigation={navigation}
          disableModal={this.disableModal}
          phone={newPhoneNumber}
        />
      </Modal>
    );
  };

  render() {
    const { loading, textError } = this.state;

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
            <Text>{"携帯電話番号の変更"}</Text>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={styles.description}>
              {
                "ハイフンなしの携帯電話番号をご入力ください。本人認証のため変更後の携帯電話番号にSMSにて認証コードを送信いたします。次画面にて認証コードをご入力ください。"
              }
            </Text>

            <InputPhone
              placeholder={"現在の携帯電話番号をご入力"}
              placeholderTextColor={COLOR_GRAY}
              style={styles.input}
              maxLength={11}
              keyboardType={"number-pad"}
              onChangeText={(oldPhoneNumber) =>
                (this.state.oldPhoneNumber = oldPhoneNumber)
              }
              editable={!loading}
            />

            <InputPhone
              placeholder={"新しい携帯電話番号をご入力"}
              placeholderTextColor={COLOR_GRAY}
              style={styles.input}
              maxLength={11}
              keyboardType={"number-pad"}
              onChangeText={(newPhoneNumber) =>
                (this.state.newPhoneNumber = newPhoneNumber)
              }
              editable={!loading}
            />
            <InputPhone
              placeholder={"新しい携帯電話番号を再度ご入力"}
              placeholderTextColor={COLOR_GRAY}
              style={styles.input}
              maxLength={11}
              keyboardType={"number-pad"}
              onChangeText={(comfirmNewPhoneNumber) =>
                (this.state.comfirmNewPhoneNumber = comfirmNewPhoneNumber)
              }
              editable={!loading}
            />
            <View style={{ width: "100%" }}>
              <Text style={styles.textError}>{textError}</Text>
            </View>
            <ButtonTypeOne
              loading={loading}
              style={{ width: DEVICE_WIDTH - 32, marginTop: 10 }}
              name={"次へ"}
              onPress={this.checkPassword}
            />
            <ButtonTypeTwo
              loading={loading}
              style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
              name={"戻る"}
              onPress={() => this.props.navigation.goBack(null)}
            />
            {this.renderModal()}
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 16,
    marginBottom: 16,
  },
  textError: {
    color: COLOR_RED,
  },
});
