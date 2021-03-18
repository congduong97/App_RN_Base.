import React, { Component } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import {
  COLOR_GRAY,
  COLOR_BLUE,
  COLOR_RED,
  COLOR_BLACK,
  COLOR_WHITE,
} from "../../../const/Color";
import { ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { DEVICE_WIDTH, managerAccount, keyAsyncStorage } from "../../../const/System";
import { Api } from "../util/api";
import { STRING } from "../util/string";
import InputPhone from "./InputPhone";
import { SIZE } from "../../../const/size";
import { InputLogin } from "./InputLogin";
import ImageCertificate from "./ImageCertificate";
import AsyncStorage from "@react-native-community/async-storage";

export class InputPhoneNummber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      text: "",
      listTextInput: ["", "", "", "", "", "", "", "", "", "", ""],
    };
  }

  checkPhoneNumber = async () => {
    try {
      const { listTextInput } = this.state;
      let text = "";
      listTextInput.map((value) => {
        if (value && value.length === 1 && !isNaN(value)) {
          text = `${text}${value}`;
        }
      });
      const { submitPhoneNumber } = this.props;
      if (!text) {
        this.setState({ textError: "携帯電話番号を入力してください。" });
        return;
      }
      if (text.length !== 11) {
        this.setState({
          textError: "新しい携帯電話番号を11桁の半角数値で入力してください。",
        });
        return;
      }
      this.setState({ loading: true, textError: "" });

      const response = await Api.validatePhoneNumber(text);
      if (response.code === 200 && response.res.status.code === 1000) {
        managerAccount.phoneNumber = text;
        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAccount)
        );
        submitPhoneNumber(text);
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
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, textError } = this.state;
    return (
      <View style={{ marginHorizontal: 20 }}>
         <ImageCertificate/>
        <View style={styles.viewInputPhone}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: COLOR_BLACK,
              fontSize: 14,
            }}
          >
            {"Aocaカードにご登録する携帯電話番号 \n を入力してください。"}
          </Text>
          <Text
            style={{
              marginHorizontal: 15,
              color: COLOR_GRAY,
              marginVertical: 15,
              fontSize:12
            }}
          >
            SMS（ショートメッセージサービス）にて認証コードを送信いたします。次画面にて認証コードをご入力ください。
          </Text>
          {this.renderInput()}
          {textError ? (
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text style={{ color: COLOR_RED, textAlign: "center" }}>
                {textError}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={styles.viewText}
        >
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
          style={{ width: DEVICE_WIDTH - 32, marginTop: 30 }}
          name={"SMS認証コードを送信する"}
          onPress={this.checkPhoneNumber}
        />
        {/* <ButtonTypeTwo
          loading={loading}
          style={{ width: DEVICE_WIDTH - 32, marginTop: 16 }}
          name={"戻る"}
          onPress={() => {
            const { changePhoneNumber } = this.props;
            changePhoneNumber && changePhoneNumber();
          }}
        /> */}
      </View>
    );
  }
  marginLeft = (index) => {
    if (index === 3 || index === 7) {
      return 10;
    } else {
      return 0;
    }
  };
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;
  };
  renderInput = () => {
    const { listTextInput } = this.state;
    const listInput = listTextInput.map((value, index) => (
      <InputLogin
        nameScreen={"EnterPhoneScreen"}
        widthInput={17}
        changeDataParent={this.changeDataParent}
        autoFocus={index === 0}
        key={`${index}`}
        index={index}
        value={value}
        end={index === listTextInput.length - 1}
        customViewInputStyle={{ marginLeft: this.marginLeft(index) }}
      />
    ));
    return <View style={{ flexDirection: "row" }}>{listInput}</View>;
  };
}
const styles = StyleSheet.create({
  viewInputPhone: {
    backgroundColor: COLOR_WHITE,
    paddingTop: 15,
    paddingBottom:30,
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
  viewText:{
    width: "100%",
    padding: 8,
    backgroundColor: COLOR_WHITE,
    marginTop: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  }
});
