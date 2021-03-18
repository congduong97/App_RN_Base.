import React, { Component } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import {
  COLOR_GRAY,
  COLOR_WHITE,
  COLOR_BLUE,
  COLOR_RED,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { Api } from "../util/api";
import DateTimePicker from "react-native-modal-datetime-picker";
import { ModalErrorBirthDay } from "../item/ModalErrorBirthDay";
import { STRING } from "../util/string";

export default class ForgotPassWord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: "",
      isDateTimePickerVisible: false,
      dateBirthDay: "生年月日をご選択",
    };
  }

  checkAddBirthDay = async () => {
    try {
      const { text, dateBirthDay } = this.state;
      this.setState({ loading: true, textError: "" });
      if (dateBirthDay == "生年月日をご選択") {
        this.setState({ textError: STRING.please_enter_birthday });

        return;
      }

      const time = dateBirthDay.replace(/[/]/g, "");

      const response = await Api.validateBirthday(time);

      if (response.code === 200 && response.res.status.code === 1000) {
        this.props.navigation.replace("ResetPasswordScreen", {
          resetPassword: true,
        });

        return;
      }
      if (
        response.code === 200 &&
        (response.res.status.code === 4 || response.res.status.code === 1029)
      ) {
        this.modalError.toggleModal();
        return;
      }

      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.setState({ loading: false });
    }
  };
  showDateTimePicker = () => {
    const { dateBirthDay, loading } = this.state;
    if (loading) {
      return;
    }
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = (timeSelect) => {
    this.hideDateTimePicker();

    const dateSelect = new Date(timeSelect);

    const year = dateSelect.getFullYear();
    const month =
      dateSelect.getMonth() + 1 < 10
        ? `0${dateSelect.getMonth() + 1}`
        : `${dateSelect.getMonth() + 1}`;
    const date =
      dateSelect.getDate() < 10
        ? `0${dateSelect.getDate()}`
        : `${dateSelect.getDate()}`;
    const time = `${year}/${month}/${date}`;
    this.setState({ dateBirthDay: time });
  };

  render() {
    const {
      loading,
      isDateTimePickerVisible,
      dateBirthDay,
      dateBirthDayConfirm,
      textError,
    } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 50 }}>
          <Text style={{ fontWeight: "bold" }}>{"パスワードリセット"}</Text>
          <Text
            style={{ color: COLOR_GRAY, lineHeight: 25, paddingVertical: 16 }}
          >
            {
              "アオキメンバーズカード作成時にご登録の生年月日をご入力することで本端末に設定のパスワードをリセットすることができます。ご登録の生年月日をご入力ください。"
            }
          </Text>

          <TouchableOpacity
            style={styles.buttonDate}
            onPress={() => this.showDateTimePicker()}
          >
            <Text>{dateBirthDay}</Text>
          </TouchableOpacity>
          <DateTimePicker
            display="spinner"
            isVisible={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            datePickerModeAndroid={"spinner"}
            date={
              dateBirthDay !== "生年月日をご選択"
                ? new Date(dateBirthDay)
                : undefined
            }
            headerTextIOS={"生年月日をご選択"}
            confirmTextIOS={"選択"}
            cancelTextIOS={"キャンセル"}
          />
          <ModalErrorBirthDay onRef={(ref) => (this.modalError = ref)} />
          <View style={{ width: "100%" }}>
            <Text style={{ color: COLOR_RED }}>{textError}</Text>
          </View>
          <ButtonTypeOne
            loading={loading}
            style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
            name={"次へ"}
            onPress={this.checkAddBirthDay}
          />

          <ButtonTypeTwo
            loading={loading}
            style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
            name={"戻る"}
            onPress={() => {
              this.props.navigation.goBack(null);
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonDate: {
    borderColor: COLOR_GRAY,
    width: "100%",
    borderWidth: 0.5,
    height: 50,
    marginVertical: 20,
    justifyContent: "center",
    paddingLeft: 10,
  },
});
