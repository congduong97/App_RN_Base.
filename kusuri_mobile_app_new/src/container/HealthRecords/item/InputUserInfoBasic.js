import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { isIOS } from "../../../const/System";

import InputText from "./InputText";
import { SIZE } from "../../../const/size";
import RadioButton from "./RadioButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DatePicker from "react-native-datepicker";
import ButtonDropdown from "./ButtonDropdown";
import moment from "moment";
import ButtonConfirm from "./ButtonConfirm";
import { UserService } from "../util/UserService";
import { COLOR_TEXT, TYPE_UPDATE } from "../util/constant";
import * as wanakana from "wanakana";
import ReloadScreen from "../../../service/ReloadScreen";
import MaintainView from "../../../commons/MaintainView";
import { NetworkError } from "../../../commons";
import { Api } from "../util/api";
import { COLOR_BORDER } from "../../../const/Color";
import { AlertNotifyUserDeletedService } from "../util/AlertNotifyUserDeletedService";
export default class InputUserInfoBasic extends PureComponent {
  constructor() {
    super();
    this.widthTextInput = SIZE.width(25);
    const user = UserService.getUser();
    this.state = {
      firstName: user.firstName,
      lastName: user.lastName,
      firstNameKana: user.firstNameKana,
      lastNameKana: user.lastNameKana,
      gender: user.gender == "MALE",
      isDatePickerVisible: false,
      birthday: moment(new Date(user.birthday)).format("YYYY/MM/DD"),
      isMaintain: false,
      error: false,
    };
  }
  componentWillUnmount() {
    !!this.timeOutChangeFirstName && clearTimeout(this.timeOutChangeFirstName);
    !!this.timeOutChangeLastName && clearTimeout(this.timeOutChangeLastName);
  }
  showDatePicker = () => {
    this.setState({ isDatePickerVisible: true });
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };
  //Thay đổi lựa chọn ngày tháng năm:
  onChangeData = (value) => {
    const valueFormat = moment(new Date(value)).format("YYYY/MM/DD");
    this.setState({ birthday: valueFormat, isDatePickerVisible: false });
  };
  touchBtnRadio = (value) => {
    this.setState({
      gender: value,
    });
  };
  onPressBtn = () => {
    let {
      birthday,
      firstNameKana,
      lastNameKana,
      firstName,
      lastName,
      gender,
    } = this.state;
    let strName = firstName + lastName + firstNameKana + lastNameKana;
    let nameKana = firstNameKana + lastNameKana;
    console.log("strName", strName);
    console.log("nameKana", nameKana);

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !firstNameKana.trim() ||
      !lastNameKana.trim()
    ) {
      Alert.alert("名前の項目をすべて入力してください");
      return;
    }
    if (!wanakana.isJapanese(strName)) {
      Alert.alert("全角で入力してください");
      return;
    }
    console.log(wanakana.isKatakana(nameKana), "wanakana.isKatakana(nameKana)");

    if (!wanakana.isKatakana(nameKana)) {
      Alert.alert("カタカナを入力してください");
      return;
    }
    UserService.setPropertyUser("birthday", birthday);
    UserService.setPropertyUser("firstName", firstName.trim());
    UserService.setPropertyUser("lastName", lastName.trim());
    UserService.setPropertyUser("firstNameKana", firstNameKana.trim());
    UserService.setPropertyUser("lastNameKana", lastNameKana.trim());
    UserService.setPropertyUser("gender", gender ? "MALE" : "FEMALE");

    !!this.props.scrollToPage && this.props.scrollToPage(1);
    !!this.props.onPressChange && this.pressUpdate();
  };
  pressUpdate = async () => {
    const user = UserService.getUser();
    try {
      const response = await Api.updateUserInfo(user, TYPE_UPDATE.BASIC);
      console.log(response, "response");
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      // if (response.code == 200 && response.res.status.code == 1405) {
      //   AlertNotifyUserDeletedService.ableModal();
      //   return;
      // }
      if (response.code == 200 && response.res.status.code == 1000) {
        ReloadScreen.set("LIST_USER_OF_MEMBER");
        ReloadScreen.set("DETAIL_USER");
        this.props.navigation.goBack();
        return;
      }
      this.setState({
        error: true,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        error: true,
      });
    }
  };
  onChangeFirstName = async (text) => {
    console.log("text", text);
    this.setState({
      firstName: text.trim(),
    });
    if (text.trim().length < 1) {
      this.setState({
        firstNameKana: "",
      });
      return;
    }
    !!this.timeOutChangeFirstName && clearTimeout(this.timeOutChangeFirstName);
    this.timeOutChangeFirstName = setTimeout(async () => {
      let textJapanese = this.toJapanese(text.trim());
      let firstNameKana = await this.convertToKatakana(textJapanese);
      this.setState({
        firstNameKana,
      });
    }, 500);
  };
  onChangeLastName = async (text) => {
    this.setState({
      lastName: text.trim(),
    });
    if (text.trim().length < 1) {
      this.setState({
        lastNameKana: "",
      });
      return;
    }
    !!this.timeOutChangeLastName && clearTimeout(this.timeOutChangeLastName);
    this.timeOutChangeLastName = setTimeout(async () => {
      let textJapanese = this.toJapanese(text.trim());
      let lastNameKana = await this.convertToKatakana(textJapanese);
      this.setState({
        lastNameKana,
      });
    }, 500);
  };
  toJapanese = (str) => {
    let result = "";
    let textToArr = str.split("");
    for (let index = 0; index < textToArr.length; index++) {
      if (wanakana.isJapanese(textToArr[index])) {
        result = result + textToArr[index];
      }
    }
    return result;
  };
  convertToKatakana = async (text) => {
    let textKatakana = "";
    try {
      const response = await Api.convertNameToKatakana(text);
      console.log("res convertNameToKatakana", response);
      if (response.code == 200 && response.res.status.code == 1000) {
        let textResponse = !!response.res.data ? response.res.data : "";
        textKatakana = textResponse.replaceAll("*", "");
      }
    } catch (error) {
      console.log(error, "error");
    }
    return textKatakana;
  };

  renderModalDate = () => {
    const { isDatePickerVisible, birthday } = this.state;
    const dateProp = !!birthday ? new Date(birthday) : new Date();

    if (isIOS) {
      return (
        <DateTimePickerModal
          display="spinner"
          date={dateProp}
          isVisible={isDatePickerVisible}
          headerTextIOS={"生年月日をご選択"}
          confirmTextIOS={"選択"}
          cancelTextIOS={"キャンセル"}
          mode="date"
          onCancel={this.hideDatePicker}
          onConfirm={this.onChangeData}
          maximumDate={new Date()}
        />
      );
    }
    return (
      <DatePicker
        disabled={false}
        style={{
          position: "absolute",
          width: "100%",
          height: 56,
        }}
        date={dateProp}
        mode={"date"}
        androidMode={"spinner"}
        maxDate={new Date()}
        format={"YYYY/MM/DD"}
        showIcon={false}
        confirmBtnText="選択"
        cancelBtnText="キャンセル"
        customStyles={{
          btnTextConfirm: {
            color: "gray",
            height: 40,
            lineHeight: 40,
          },
          btnTextCancel: {
            color: "gray",
            height: 40,
            lineHeight: 40,
          },
        }}
        hideText
        onDateChange={this.onChangeData}
      />
    );
  };
  render() {
    const {
      gender,
      birthday,
      firstName,
      lastName,
      firstNameKana,
      lastNameKana,
      isMaintain,
      error,
    } = this.state;
    if (isMaintain) {
      return (
        <MaintainView
          onPress={() =>
            this.setState({
              isMaintain: false,
            })
          }
          timeOut={10000}
        />
      );
    }
    if (error) {
      return (
        <NetworkError
          onPress={() => {
            this.setState({
              error: false,
            });
          }}
        />
      );
    }

    return (
      <ScrollView
        style={{
          flex: 1,
          width: SIZE.device_width,
          paddingHorizontal: SIZE.device_width * 0.04,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ width: 2, backgroundColor: "red" }} />
          <Text
            style={{
              paddingLeft: 10,
              fontSize: SIZE.H16,
              fontWeight: "700",
              color: COLOR_TEXT,
            }}
          >
            ユーザー基本情報
          </Text>
        </View>

        <View style={styles.viewContainerOption}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT }}>名前</Text>
            <Text style={{ fontSize: SIZE.H14, color: "red" }}>*</Text>
          </View>
          <View style={{ flex: 3, flexDirection: "row" }}>
            <View style={styles.styleViewInputName}>
              <Text
                style={{
                  fontSize: SIZE.H14,
                  marginLeft: SIZE.width(2.5),
                  color: COLOR_TEXT,
                }}
              >
                姓
              </Text>
              <InputText
                value={firstName}
                styleInput={{ width: this.widthTextInput }}
                onChangeText={this.onChangeFirstName}
              />
            </View>
            <View style={styles.styleViewInputName}>
              <Text
                style={{
                  fontSize: SIZE.H14,
                  marginLeft: SIZE.width(2.5),
                  color: COLOR_TEXT,
                }}
              >
                名
              </Text>
              <InputText
                value={lastName}
                styleInput={{ width: this.widthTextInput }}
                onChangeText={this.onChangeLastName}
              />
            </View>
          </View>
        </View>
        <View style={styles.viewContainerOption}>
          <Text style={{ fontSize: SIZE.H14, flex: 1, color: COLOR_TEXT }}>
            名前(カナ)
          </Text>
          <View style={{ flex: 3, flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "flex-end", height: 35 }}>
              <InputText
                value={firstNameKana}
                styleInput={{ width: this.widthTextInput }}
                onChangeText={(text) => {
                  this.setState({
                    firstNameKana: text,
                  });
                }}
              />
            </View>
            <View style={{ flex: 1, alignItems: "flex-end", height: 35 }}>
              <InputText
                value={lastNameKana}
                styleInput={{ width: this.widthTextInput }}
                onChangeText={(text) => {
                  this.setState({
                    lastNameKana: text,
                  });
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.viewContainerOption}>
          <Text style={{ fontSize: SIZE.H14, flex: 1, color: COLOR_TEXT }}>
            性別
          </Text>
          <View style={{ flex: 3 }}>
            <RadioButton
              value={gender}
              title1={"男性"}
              title2={"女性"}
              styleContainer={{ marginLeft: SIZE.width(8) }}
              touchBtnRadio={this.touchBtnRadio}
            />
          </View>
        </View>
        <View style={styles.viewContainerOption}>
          <Text style={{ fontSize: 14, flex: 1, color: COLOR_TEXT }}>
            生年月日
          </Text>
          <View style={{ flex: 3 }}>
            <ButtonDropdown
              styleContainer={{
                marginLeft: SIZE.width(8),
              }}
              width={this.widthTextInput * 2}
              birthday
              text={birthday}
              onPress={this.showDatePicker}
            />
            {this.renderModalDate()}
          </View>
        </View>
        <ButtonConfirm
          textButton={this.props.onPressChange ? "変更" : "次へ"}
          styleButton={{ marginTop: 40 }}
          onPress={this.onPressBtn}
        />
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  styleViewInputName: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewContainerOption: {
    flexDirection: "row",
    marginTop: 20,
    height: 40,
    alignItems: "center",
  },
  // styleInputName: {
  //   backgroundColor: "white",
  //   borderRadius: 5,
  //   borderWidth: 0.5,
  //   borderColor: COLOR_BORDER,
  //   height: 35,
  //   fontSize: SIZE.H14,
  //   paddingHorizontal: SIZE.width(3),
  //   paddingVertical: 0,
  // },
});
