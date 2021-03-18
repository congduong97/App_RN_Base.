import React, { PureComponent } from "react";
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";
import Icon from "react-native-vector-icons/AntDesign";
import {
  HeaderIconLeft,
  ButtonTypeOne,
  ButtonTypeTwo,
  ModalDialog,
} from "../../../commons";
import { COLOR_BLACK, COLOR_GRAY, COLOR_WHITE } from "../../../const/Color";
import { SIZE } from "../../../const/size";
import { STRING } from "../../../const/String";
import { DEVICE_WIDTH } from "../../../const/System";
import { InputLogin } from "../item/InputLogin";
import { Api } from "../util/api";
import { STRING as STRING_LOGIN } from "../util/string";
import ImageCertificate from "../item/ImageCertificate";
import { ServiceActiveFocusPhoneInLoginByPhone } from "../util/service";

export class LoginWithPhoneNumber extends PureComponent {
  constructor(props) {
    super(props);
    console.log("[membercode-param]", this.props.navigation.state);
    this.state = {
      listMemberCode: this.props.navigation.state.params
        ? this.props.navigation.state.params.memberCode.split("")
        : new Array(16).fill(""),
      listTextPhone: new Array(11).fill(""),
      isDateTimePickerVisible: false,
      dateBirthDay: "生年月日をご選択",
      isLoading: false,
      isVisibleModalErrorInfo: true,
    };
    this.textSize = 0.032 * DEVICE_WIDTH;
    this.textButtonSize = 0.037 * DEVICE_WIDTH;
  }
  changeDataMemberCode = (index, value) => {
    const { listMemberCode } = this.state;
    listMemberCode[index] = value;
    let memberCode = listMemberCode.join("");
    console.log("memberCode", memberCode);

    if (index == 15 && memberCode.length == 16) {
      ServiceActiveFocusPhoneInLoginByPhone.set("ACTIVE_PHONE");
    }
  };
  changeDataPhone = (index, value) => {
    this.state.listTextPhone[index] = value;
  };
  renderInputMemberCode = () => {
    const { listMemberCode } = this.state;
    const listInput = listMemberCode.map((value, index) => (
      <InputLogin
        nameScreen={"EnterMemberCodeInLoginPhoneNumber"}
        widthInput={SIZE.width(3.6)}
        changeDataParent={this.changeDataMemberCode}
        // autoFocus={index === 0}
        editable={false}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listMemberCode.length - 1}
      />
    ));
    return (
      <View
        style={{
          flexDirection: "row",
          marginLeft: -2,
        }}
      >
        {listInput}
      </View>
    );
  };
  renderInputPhone = () => {
    const { listTextPhone } = this.state;
    const listInput = listTextPhone.map((value, index) => (
      <InputLogin
        nameScreen={"EnterPhoneScreenLoginWithPhone"}
        widthInput={SIZE.width(3.6)}
        changeDataParent={this.changeDataPhone}
        autoFocus={index === 0}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextPhone.length - 1}
        customViewInputStyle={{
          marginLeft: index === 3 || index === 7 ? 15 : 2,
        }}
      />
    ));
    return <View style={{ flexDirection: "row" }}>{listInput}</View>;
  };

  showDateTimePicker = () => {
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

  onLogin = (typeLogin) => async () => {
    const { listMemberCode, listTextPhone, dateBirthDay } = this.state;
    let memberCode = listMemberCode.join("");
    let phoneNumber = listTextPhone.join("");

    if (
      memberCode.length === 16 &&
      phoneNumber.length === 11 &&
      dateBirthDay !== "生年月日をご選択"
    ) {
      try {
        this.setState({
          isLoading: true,
        });

        const response = await Api.loginWithPhoneNumber(
          memberCode,
          phoneNumber,
          dateBirthDay,
          typeLogin
        );

        if (response.code === 200 && response.res.status.code === 1028) {
          Alert.alert(
            STRING.notification,
            "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
          );
          return;
        }
        if (response.code === 200 && response.res.status.code === 1000) {
          if (typeLogin == STRING_LOGIN.login_by_Phone_number) {
            this.props.navigation.navigate("OtpLoginWithPhoneNumber", {
              memberCode,
              phoneNumber,
              dateBirthDay,
              newPhone: null,
              type: typeLogin,
            });
          } else {
            this.props.navigation.navigate("UpdatePhoneWhenLoginByPhone", {
              memberCode,
              phoneNumber,
              dateBirthDay,
              type: typeLogin,
            });
          }
          return;
        }
        Alert.alert("ご入力の情報が正しくありません。");
        // this.handleVisibleModalErrorInfo();
      } catch (error) {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    } else {
      Alert.alert("全項目の入力が必要です。");
    }
  };
  handleVisibleModalErrorInfo = () => {
    this.modalErrorInfo.handleVisible();
  };
  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    const { isDateTimePickerVisible, dateBirthDay } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar backgroundColor={"#FFFFFF"} barStyle="dark-content" />
        <HeaderIconLeft goBack={goBack} navigation={navigation} />
        <ScrollView
          style={{
            paddingHorizontal: SIZE.width(6),
            backgroundColor: "#F6F6F6",
          }}
          contentContainerStyle={{
            paddingBottom: SIZE.width(6),
          }}
        >
          <ImageCertificate />
          <View
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 10,
              paddingVertical: 25,
              borderRadius: 3,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.18,
              shadowRadius: 1.0,
              elevation: 1,
            }}
          >
            <Text
              style={{
                color: COLOR_BLACK,
                fontSize: this.textSize,
                marginBottom: 15,
                fontWeight: "700",
              }}
            >
              Aoca会員番号
            </Text>
            {this.renderInputMemberCode()}
            <Text
              style={{
                color: COLOR_BLACK,
                fontSize: this.textSize,
                marginTop: 20,
                marginBottom: 15,
                fontWeight: "700",
              }}
            >
              Aoca連携時にご登録した携帯電話番号
            </Text>
            {this.renderInputPhone()}
            <Text
              style={{
                fontSize: this.textSize,
                color: "#1D1D1D",
                marginTop: 20,
                marginBottom: 10,
                fontWeight: "700",
              }}
            >
              ご登録の生年月日
            </Text>

            <TouchableOpacity
              style={{
                borderColor: "#C1C1C1",
                borderWidth: 1,
                borderRadius: 3,
                justifyContent: "center",
                padding: 14,
              }}
              onPress={this.showDateTimePicker}
            >
              <Text
                style={{
                  fontSize: this.textButtonSize,
                  color:
                    dateBirthDay === "生年月日をご選択" ? "#C1C1C1" : "#1D1D1D",
                }}
              >
                {dateBirthDay === "生年月日をご選択"
                  ? "生年月日をご選択"
                  : dateBirthDay}
              </Text>
              <View style={{ position: "absolute", right: 10 }}>
                <Icon name="down" size={26} color={"#C1C1C1"} />
              </View>
            </TouchableOpacity>
            <DateTimePicker
              display="spinner"
              headerTextIOS={"生年月日をご選択"}
              isVisible={isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              datePickerModeAndroid={"spinner"}
              date={
                dateBirthDay !== "生年月日をご選択"
                  ? new Date(dateBirthDay)
                  : undefined
              }
              confirmTextIOS={"選択"}
              cancelTextIOS={"キャンセル"}
            />
          </View>
          <ButtonTypeOne
            loading={this.state.isLoading}
            style={{ marginTop: 16 }}
            name={"認証（携帯電話番号に変更のない方）"}
            onPress={this.onLogin(STRING_LOGIN.login_by_Phone_number)}
          />

          <Text
            style={{
              color: "#1D1D1D",
              opacity: 0.5,
              fontSize: this.textSize,
              marginTop: 9,
            }}
          >
            現在Aocaにご登録の携帯電話番号へ認証コードを送信し、本人確認を行うことでAocaカード連携が可能になります
          </Text>
          <ButtonTypeTwo
            loading={this.state.isLoading}
            style={{ marginTop: 30 }}
            name={"認証（携帯電話番号に変更のある方）"}
            onPress={this.onLogin(STRING_LOGIN.login_by_other_phone)}
          />
        </ScrollView>
      </View>
    );
  }
}

export default LoginWithPhoneNumber;
