import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import {
  COLOR_GRAY,
  COLOR_BLUE,
  COLOR_RED,
  COLOR_GRAY_COUPON_USED,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_GRAY_300,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import {
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
} from "../../../const/System";
import { Api } from "../util/api";
import DateTimePicker from "react-native-modal-datetime-picker";
import { STRING } from "../util/string";
import AsyncStorage from "@react-native-community/async-storage";
import { pushResetScreen } from "../../../util";
// import console = require('console');
import Communications from "react-native-communications";
import { ModalErrorBirthDay } from "./ModalErrorBirthDay";
import { ModalSuccessBirthDayBirthDay } from "./ModalSuccesBirthDay";
import { SIZE } from "../../../const/size";
import Icon from "react-native-vector-icons/AntDesign";
import ImageCertificate from "./ImageCertificate";
import { AlertService } from "../../../service/AlertService";
export class InputBirthDay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: "",
      isDateTimePickerVisible: false,
      dateBirthDay: "生年月日をご選択",
      dateBirthDayConfirm: "生年月日を再度、ご選択",
    };
  }

  checkAddBirthDay = async () => {
    try {
      const { dateBirthDay } = this.state;

      const { vadiateBirthDay } = this.props;
      this.setState({ loading: true, textError: "" });
      if ( dateBirthDay == "生年月日をご選択") {
        this.setState({ textError: STRING.please_enter_birthday });
        return;  
      }
      const time = dateBirthDay.replace(/[/]/g, "");

      const response = await Api.addBirthday(time);
      if (response.code === 200 && response.res.status.code === 1000) {
        managerAccount.birthday = dateBirthDay;
        managerAccount.needAddBirthDay = false;
        managerAccount.needValidateBirthDay = false;

        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAccount)
        );
        if (!vadiateBirthDay) {
          this.modalSuccess.toggleModal();
          return;
        } else {
          AlertService.ableModal();
          // Alert.alert(STRING.validate_birthday_success);
          managerAccount.needAddPassword = true;
          pushResetScreen(this.props.navigation, "HomeNavigator");
        }
        return;
      }
      if (response.code === 200 && response.res.status.code === 4) {
        this.setState({ textError: "" });
        this.modalError.toggleModal();
        return;
      } else {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      }
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.setState({ loading: false });
    }
  };
  showDateTimePicker = (clickConfirm) => {
    const { dateBirthDay, loading } = this.state;
    if (clickConfirm && dateBirthDay === "生年月日をご選択") {
      this.setState({ textError: STRING.please_befor_enter_birthday });

      return;
    }
    if (loading) {
      return;
    }
    this.setState({
      isDateTimePickerVisible: true,
      clickConfirm: clickConfirm,
    });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false, clickConfirm: false });
  };

  handleDatePicked = (timeSelect) => {
    const { selectedDate, onStatusError } = this.props;
    const { clickConfirm, dateBirthDay } = this.state;
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

    if (clickConfirm) {
      this.setState({ dateBirthDayConfirm: time });
    } else {
      this.setState({ dateBirthDay: time });
    }
  };
  getDate = () => {
    const { clickConfirm, dateBirthDay, dateBirthDayConfirm } = this.state;
    if (clickConfirm && dateBirthDayConfirm !== "生年月日を再度、ご選択") {
      return new Date(dateBirthDayConfirm);
    }
    if (dateBirthDay !== "生年月日をご選択") {
      return new Date(dateBirthDay);
    }

    return undefined;
  };

  render() {
    const {
      loading,
      isDateTimePickerVisible,
      dateBirthDay,
      dateBirthDayConfirm,
      textError,
    } = this.state;
    const { vadiateBirthDay } = this.props;
    return (
      <View style={{ paddingHorizontal: 20,marginBottom:30 }}>
         <ImageCertificate />
        <View style={styles.viewInputDate}>
          <Text
            style={{
              fontSize: 12,
              color: COLOR_BLACK,
              textAlign: "center",
            }}
          >
            生年月日を入力してください。
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: COLOR_GRAY,
              marginTop: 10,
            }}
          >
            ご本人確認のため、アオキメンバーズカード作成時にご記載の生年月日のご選択をお願いいたします。
          </Text>
          <TouchableOpacity
            style={styles.buttonDate}
            onPress={() => this.showDateTimePicker()}
          >
            <Text style={{ fontSize: 14, color:  dateBirthDay === "生年月日をご選択" ? "#C1C1C1" : "#1D1D1D",marginTop:2}}>
              {dateBirthDay}
            </Text>
            <Icon
              name="down"
              size={18}
              color={"#C1C1C1"}
              style={{ marginTop: 1 }}
            />
          </TouchableOpacity>
          <DateTimePicker
            display="spinner"
            isVisible={isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            datePickerModeAndroid={"spinner"}
            // titleIOS={"生年月日をご選択"}
            headerTextIOS={"生年月日をご選択"}
            confirmTextIOS={"選択"}
            date={this.getDate()}
            cancelTextIOS={"キャンセル"}
          />
          <View style={{ width: "100%" }}>
            <Text style={styles.textError}>{textError}</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLOR_WHITE,
            padding: 15,
            marginTop: 10,
            borderRadius: 3,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
          }}
        >
          <Text
            style={{
              color: COLOR_RED,
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            【ご注意】
          </Text>
          <Text style={{ color: COLOR_GRAY, marginTop: 2 }}>
            {`アオキメンバーズカード作成時にご記載いただいた生年月日のご変更はアプリから行うことはできません。\n`}
            {` \n`}
            {"お手数ですが、コールセンター"}
            <Text
              onPress={() => Communications.phonecall("0120-212-132", true)}
              style={{ color: COLOR_BLUE, textDecorationLine: "underline" }}
            >
              {"0120-212-132"}
            </Text>
            {`（平日10時〜17時半）へお問い合わせいただくか、クスリのアオキ各店舗にて会員登録変更届のご提出をお願いいたします。その際、お手元にアオキメンバーズカードをご用意ください。 \n`}
            {` \n`}
            {"＊再登録後、反映まで1週間〜1ヶ月かかります。"}
          </Text>
        </View>
        <ButtonTypeOne
          loading={loading}
          style={{ width: DEVICE_WIDTH - 32, marginVertical: 20 }}
          name={"登録"}
          onPress={this.checkAddBirthDay}
        />

        <ModalErrorBirthDay onRef={(ref) => (this.modalError = ref)} />
        <ModalSuccessBirthDayBirthDay
          navigation={this.props.navigation}
          onRef={(ref) => (this.modalSuccess = ref)}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  buttonDate: {
    borderColor: COLOR_GRAY,
    borderWidth: 0.5,
    marginTop: 16,
    padding: 10,
    borderRadius: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleForgotPassword: {
    color: COLOR_BLUE,
    textDecorationLine: "underline",
  },
  textError: {
    color: COLOR_RED,
    marginVertical: 16,
  },
  viewInputDate: {
    backgroundColor: COLOR_WHITE,
    paddingTop: 15,
    paddingHorizontal: 15,
    // paddingBottom: 10,
    borderRadius: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },
});
