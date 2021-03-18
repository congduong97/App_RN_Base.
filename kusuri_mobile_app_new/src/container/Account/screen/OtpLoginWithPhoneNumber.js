import React, { PureComponent } from "react";
import { StatusBar, Text, View, ScrollView, Image, Alert } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { HeaderIconLeft, ButtonTypeOne, ButtonTypeTwo } from "../../../commons";
import { COLOR_BLACK, COLOR_RED, COLOR_WHITE } from "../../../const/Color";
import { SIZE } from "../../../const/size";
import {
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
  isIOS,
} from "../../../const/System";
import { InputLogin } from "../item/InputLogin";
import { Api } from "../util/api";
import { AlertService } from "../../../service/AlertService";
import { pushResetScreen } from "../../../util";
import { STRING } from "../../../const/String";
import { STRING as STRING_LOGIN } from "../util/string";
import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from "rn-fetch-blob";
import { checkMemberCodeInBlacklist } from "../../Launcher/util/checkVersionAllApp";
import ImageCertificate from "../item/ImageCertificate";
export class OtpLoginWithPhoneNumber extends PureComponent {
  constructor(props) {
    super(props);
    const {
      memberCode,
      phoneNumber,
      dateBirthDay,
      newPhone,
      type,
    } = this.props.navigation.state.params;
    this.state = {
      listTextInput: new Array(6).fill(""),
      loading: false,
      textError: "",
      lastThreeNumber: newPhone
        ? this.takeTheLast3NumberInPhone(newPhone)
        : this.takeTheLast3NumberInPhone(phoneNumber),
    };

    this.sizeText = 0.032 * DEVICE_WIDTH;
    this.textButtonSize = 0.037 * DEVICE_WIDTH;
  }
  takeTheLast3NumberInPhone = (phone) => {
    let threeNumber = "";
    let lengthPhone = phone.length;
    if (lengthPhone >= 3) {
      threeNumber = phone.slice(lengthPhone - 3, lengthPhone);
    }
    return threeNumber;
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
              console.log("bardcodes-save", uri);
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
  checkOpt = async () => {
    const { listTextInput } = this.state;
    const {
      memberCode,
      phoneNumber,
      dateBirthDay,
      newPhone,
      type,
    } = this.props.navigation.state.params;
    let otp = listTextInput.join("");
    if (otp.length !== 6) {
      this.setState({ textError: "認証コードを入力してください" });
    } else {
      try {
        this.setState({
          loading: true,
        });
        const response = await Api.validateOTPForLogin(
          memberCode,
          phoneNumber,
          newPhone,
          otp,
          type
        );
        console.log("response validateOTPForLogin", response);
        if (response.code === 200) {
          if (response.res.status.code === 1000) {
            const {
              username,
              userId,
              accessToken,
              refreshToken,
              memberDto,
              pinCode,
            } = response.res.data;
            console.log("data", response.res.data);

            if (userId != null) {
              managerAccount.accessToken = accessToken;
              managerAccount.username = username;
              managerAccount.memberCode = memberDto.memberCode;
              managerAccount.refreshToken = refreshToken;
              managerAccount.point = memberDto.point;
              managerAccount.money = memberDto.money;
              managerAccount.phoneNumber = memberDto.phone;
              managerAccount.birthday = memberDto.birthday;
              managerAccount.password = pinCode;
              managerAccount.userId = userId;
              managerAccount.validatePhoneNumberSuccess = true;
              managerAccount.needAddBirthDay = false;
              managerAccount.needValidateBirthDay = false;
              // (!managerAccount.validatePhoneNumberSuccess || managerAccount.needAddBirthDay ||managerAccount.needValidateBirthDay) &&
              // managerAccount.usingSms &&
              // managerAccount.userId
              AsyncStorage.removeItem("callOnlyGetBalance");

              await AsyncStorage.setItem(
                keyAsyncStorage.managerAccount,
                JSON.stringify(managerAccount)
              );
              await checkMemberCodeInBlacklist(memberDto.memberCode);
              await this.getMyPageInfo();
              AlertService.ableModal();
              managerAccount.needAddPassword = true;
              setTimeout(() => {
                pushResetScreen(this.props.navigation, "HomeNavigator");
              }, 300);
            } else {
              Alert.alert(STRING.an_error_occurred);
              this.setState({
                textError: "",
              });
            }
          } else {
            this.setState({
              textError: STRING_LOGIN.wrong_otp_code,
            });
          }
        } else {
          Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
          this.setState({
            textError: "",
          });
        }
      } catch (error) {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        this.setState({
          textError: "",
        });
      } finally {
        this.setState({
          loading: false,
        });
      }
    }
  };
  resendOtp = async () => {
    const {
      memberCode,
      phoneNumber,
      dateBirthDay,
      newPhone,
      type,
    } = this.props.navigation.state.params;
    try {
      this.setState({
        loading: true,
      });
      if (type == STRING_LOGIN.login_by_Phone_number) {
        const responseLoginWithPhoneNumber = await Api.loginWithPhoneNumber(
          memberCode,
          phoneNumber,
          dateBirthDay,
          type
        );

        if (
          responseLoginWithPhoneNumber.code === 200 &&
          responseLoginWithPhoneNumber.res.status.code === 1000
        ) {
          Alert.alert(STRING.notification, "認証コードを再送信しました");
          return;
        }
        if (
          responseLoginWithPhoneNumber.code === 200 &&
          responseLoginWithPhoneNumber.res.status.code === 1028
        ) {
          Alert.alert(
            STRING.notification,
            "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
          );
          return;
        }
      } else {
        const responseLoginByAnotherPhone = await Api.loginByAnotherPhone(
          memberCode,
          phoneNumber,
          dateBirthDay,
          type,
          newPhone
        );
        if (
          responseLoginByAnotherPhone.code === 200 &&
          responseLoginByAnotherPhone.res.status.code === 1000
        ) {
          Alert.alert(STRING.notification, "認証コードを再送信しました");
          return;
        }
        if (
          responseLoginByAnotherPhone.code === 200 &&
          responseLoginByAnotherPhone.res.status.code === 1028
        ) {
          Alert.alert(
            STRING.notification,
            "SMS送信上限を越えました。SMSが受信できない方は、SMS受信拒否設定をご確認いただき、翌日以降に再度実施をお願いします。"
          );
          return;
        }
      }
    } catch (error) {
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  changeDataParent = (index, value) => {
    this.state.listTextInput[index] = value;
  };

  changeDataParentFillOtp = (otp) => {
    if (otp && otp.length == 6) {
      this.setState({ listTextInput: otp.split("") });
    }
  };

  renderInput = () => {
    const { listTextInput } = this.state;
    const listInput = listTextInput.map((value, index) => (
      <InputLogin
        newPhoneChangeNumber={""}
        nameScreen={"InputOtpNumberLoginWithPhone"}
        widthInput={SIZE.width(4)}
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
        }}
      >
        {listInput}
      </View>
    );
  };
  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    const { loading, textError } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <StatusBar backgroundColor={"#FFFFFF"} barStyle='dark-content' />
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
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: this.sizeText }}>
              SMS認証コード入力
            </Text>
            <Text
              style={{
                fontSize: this.sizeText,
                marginTop: 10,
                marginHorizontal: 15,
                color: "#1D1D1D",
                lineHeight: 14,
                marginBottom: 20,
              }}
            >
              末尾が *<Text>{this.state.lastThreeNumber}</Text>{" "}
              の携帯電話番号に通知された認証コードを入力してください。
            </Text>
            {this.renderInput()}
            {textError.length > 0 ? (
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  style={{ color: COLOR_RED, textAlign: "center", margin: 10 }}
                >
                  {textError}
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              borderRadius: 3,
              width: "100%",
              paddingHorizontal: 22,
              paddingVertical: 11,
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
            }}
          >
            <Text
              style={{
                fontSize: this.sizeText,
                color: COLOR_RED,
                textAlign: "center",
                marginHorizontal: 20,
                fontWeight: "bold",
                lineHeight: 17,
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
            style={{ marginTop: 16 }}
            name={"認証"}
            onPress={this.checkOpt}
          />

          <ButtonTypeTwo
            loading={loading}
            style={{ marginTop: 16 }}
            name={"SMS認証コードを再送する"}
            onPress={this.resendOtp}
          />
        </ScrollView>
      </View>
    );
  }
}

export default OtpLoginWithPhoneNumber;
