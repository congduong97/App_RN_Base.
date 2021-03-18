import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { HeaderIconLeft } from "../../../commons";
import { SIZE } from "../../../const/size";
import { COLOR_BLACK, COLOR_RED } from "../../../const/Color";
import { InputLogin } from "../item/InputLogin";
import { DEVICE_WIDTH } from "../../../const/System";
import { Api } from "../util/api";
import { STRING } from "../../../const/String";
import ImageCertificate from "../item/ImageCertificate";

export default class UpdatePhoneWhenLoginByPhone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTextPhone: new Array(11).fill(""),
      listTextPhoneConfirm: new Array(11).fill(""),
      textError: "",
      isLoading: false,
    };
    this.textSize = 0.032 * DEVICE_WIDTH;
    this.textButtonSize = 0.037 * DEVICE_WIDTH;
  }
  updatePhone = async () => {
    const { listTextPhone, listTextPhoneConfirm } = this.state;
    const {
      memberCode,
      phoneNumber,
      dateBirthDay,
      type,
    } = this.props.navigation.state.params;
    console.log("memberCode", memberCode);
    console.log("phoneNumber", phoneNumber);
    console.log("dateBirthDay", dateBirthDay);
    console.log("type", type);
    let phoneNumberUpdate = listTextPhone.join("");
    let phoneNumberConfirm = listTextPhoneConfirm.join("");
    console.log("phoneNumberUpdate", phoneNumberUpdate);
    console.log("phoneNumberConfirm", phoneNumberConfirm);
    try {
      // this.setState({
      //   isLoading: true,
      // });
      if (!phoneNumberUpdate) {
        this.setState({
          textError: "新しい携帯電話番号を入力してください。",
          isLoading: false,
        });
        return;
      }
      if (phoneNumberUpdate.length !== 11) {
        this.setState({
          textError: "新しい携帯電話番号を11桁の半角数値で入力してください。",
          isLoading: false,
        });
        return;
      }
      if (!phoneNumberConfirm) {
        this.setState({
          textError: "新しい携帯電話番号（確認用）を入力してください。",
          isLoading: false,
        });
        return;
      }
      if (phoneNumberConfirm.length !== 11) {
        this.setState({
          textError:
            "新しい携帯電話番号（確認用）を11桁の半角数値で入力してください。",
          isLoading: false,
        });
        return;
      }
      if (phoneNumberUpdate !== phoneNumberConfirm) {
        this.setState({
          textError:
            "入力した新しい携帯電話と再入力の新しい携帯電話が異なっています。再度ご入力ください。",
          isLoading: false,
        });
        return;
      }
      if (phoneNumberUpdate === phoneNumber) {
        this.setState({
          textError: "現在ご登録の携帯電話番号はご入力できません。",
          isLoading: false,
        });
        return;
      }
      this.setState({
        textError: "",
      });
      const response = await Api.loginByAnotherPhone(
        memberCode,
        phoneNumber,
        dateBirthDay,
        type,
        phoneNumberUpdate
      );
      console.log("Api.loginByAnotherPhone", response);

      if (response.code === 200 && response.res.status.code === 4) {
        this.setState({
          textError:
            "入力した現在の携帯電話が異なっています。再度ご入力ください。",
          isLoading: false,
        });
        return;
      }
      if (response.code === 200 && response.res.status.code === 1000) {
        this.props.navigation.navigate("OtpLoginWithPhoneNumber", {
          memberCode,
          phoneNumber,
          dateBirthDay,
          newPhone: phoneNumberUpdate,
          type,
        });
        return;
      }
      if (response.code === 200 && response.res.status.code === 1028) {
        Alert.alert(
          STRING.notification,
          "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
        );
        return;
      }
      this.setState({
        textError: "",
      });
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      console.log("error", error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
    // this.props.navigation.navigate("OtpLoginWithPhoneNumber", {
    //     // memberCode,
    //     // phoneNumber,
    //     // dateBirthDay,
    //     // type: "LOGIN_BY_PHONE",
    //   });
  };
  changeDataPhoneConfirm = (index, value) => {
    this.state.listTextPhoneConfirm[index] = value;
  };
  renderInputPhoneConfirm = () => {
    const { listTextPhoneConfirm } = this.state;
    const listInput = listTextPhoneConfirm.map((value, index) => (
      <InputLogin
        nameScreen={"EnterPhoneScreenConfirm"}
        widthInput={SIZE.width(4)}
        changeDataParent={this.changeDataPhoneConfirm}
        // autoFocus={index === 0}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextPhoneConfirm.length - 1}
        customViewInputStyle={{
          marginLeft: index === 3 || index === 7 ? 15 : 2,
        }}
      />
    ));
    return <View style={{ flexDirection: "row" }}>{listInput}</View>;
  };
  changeDataPhone = (index, value) => {
    this.state.listTextPhone[index] = value;
  };
  renderInputPhone = () => {
    const { listTextPhone } = this.state;
    const listInput = listTextPhone.map((value, index) => (
      <InputLogin
        nameScreen={"EnterPhoneScreenUpdate"}
        widthInput={SIZE.width(4)}
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

  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    console.log("textError", this.state.textError);

    // const { isDateTimePickerVisible, dateBirthDay } = this.state;
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
              Aocaに新しくご登録する電話番号
            </Text>
            {this.renderInputPhone()}
            <Text
              style={{
                color: COLOR_BLACK,
                fontSize: this.textSize,
                marginTop: 20,
                marginBottom: 15,
                fontWeight: "700",
              }}
            >
              確認用にもう一度ご入力ください
            </Text>
            {this.renderInputPhoneConfirm()}
            {this.state.textError.length > 0 && (
              <Text style={{ color: COLOR_RED, marginTop: 10 }}>
                {this.state.textError}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: "#EF1E2A",
              paddingVertical: 15,
              borderRadius: 3,
              marginTop: 30,
            }}
            disabled={this.state.isLoading}
            onPress={this.updatePhone}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: this.textButtonSize,
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              次へ
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}
