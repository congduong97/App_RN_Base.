//Libarary:
import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//Setup:
import { isIOS } from "../../../const/System";
import { SIZE } from "../../../const/size";
import { COLOR_TEXT } from "../util/constant";
import InputText from "../item/InputText";
import {
  APP_COLOR,
  COLOR_GRAY_LIGHT,
  COLOR_BORDER,
} from "../../../const/Color";

//Component:
import ButtonDropdown from "../item/ButtonDropdown";
//Services:
import { HeaderIconLeft } from "../../../commons";

import PicturePicker from "../../../commons/PicturePicker";
import ButtonConfirm from "../item/ButtonConfirm";
import { Api } from "../util/api";
import { UserService } from "../util/UserService";
export default class RegisterMarketDrug extends Component {
  constructor() {
    super();
    this.currentDate = moment(new Date()).format("YYYY/MM/DD");
    this.state = {
      isDatePickerVisible: false,
      nameDrug: "",
      startDate: "",
      endDate: "",
      expiredDate: "",
      stateChange: "",
      imageDrug: {
        imgDefault: true,
        link: "",
      },
      memo: "",
      isMaintain: false,
      isLoading: false,
      error: false,
    };
  }
  compareDate = (date1, date2) => {
    return moment(new Date(date1)).isBefore(date2);
  };
  createMarketDrug = async () => {
    const {
      nameDrug,
      startDate,
      endDate,
      expiredDate,
      imageDrug,
      memo,
    } = this.state;
    const currentUser = UserService.getListUser().currentUser;
    if (nameDrug.length < 1) {
      Alert.alert("お薬名を入力してください。");
      return;
    }
    if (startDate.length < 1) {
      Alert.alert("startDate is not null");
      return;
    }
    if (endDate.length > 0 && this.compareDate(endDate, startDate)) {
      Alert.alert("endDate must be after startDate");
      return;
    }
    if (
      endDate.length > 0 &&
      expiredDate.length > 1 &&
      this.compareDate(expiredDate, endDate)
    ) {
      Alert.alert("expiredDate must be after endDate");
      return;
    }
    console.log("imageDrug.link", imageDrug.link);

    this.setState({
      isLoading: true,
    });
    const response = await Api.createMarketDrug(
      currentUser.id,
      nameDrug,
      startDate,
      endDate,
      expiredDate,
      imageDrug,
      memo
    );
    console.log("res createMarketDrug", response);

    if (response.code === 502) {
      this.setState({
        isLoading: false,
        isMaintain: true,
      });
      return;
    }
    if (
      !!response &&
      response.code == 200 &&
      response.res.status.code == 1000
    ) {
      this.setState({
        isLoading: false,
      });
      this.props.navigation.navigate("NOTIFICATION_SUCCESS");
      return;
    }
    this.setState({
      error: true,
      isLoading: false,
    });
  };
  showDatePicker = (stateChange) => {
    this.setState({ isDatePickerVisible: true, stateChange });
  };
  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false });
  };

  onChangeDate = (value) => {
    const { stateChange } = this.state;
    this.state[stateChange] = moment(new Date(value)).format("YYYY/MM/DD");
    this.hideDatePicker();
  };
  onChangeImage = (value) => {
    console.log("value", value);
    if (!value.didCancel) {
      this.setState({
        imageDrug: {
          imgDefault: false,
          link: value.uri,
        },
      });
    }
  };
  renderModalDate = (date, stateChange) => {
    const { isDatePickerVisible } = this.state;
    const dateProp = !!date ? new Date(date) : new Date();

    if (isIOS) {
      return (
        <DateTimePickerModal
          display='spinner'
          date={dateProp}
          isVisible={isDatePickerVisible}
          headerTextIOS={"生年月日をご選択"}
          confirmTextIOS={"選択"}
          cancelTextIOS={"キャンセル"}
          mode='date'
          onCancel={this.hideDatePicker}
          onConfirm={this.onChangeDate}
          //   maximumDate={new Date()}
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
        // maxDate={new Date()}
        format={"YYYY/MM/DD"}
        showIcon={false}
        onOpenModal={() => {
          this.setState({ stateChange });
        }}
        confirmBtnText='選択'
        cancelBtnText='キャンセル'
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
        onDateChange={this.onChangeDate}
      />
    );
  };
  renderInputBirthday = (title, mandatory, stateChange) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT }}>{title}</Text>
          {!!mandatory && <Text style={{ color: "red", fontSize: 16 }}>*</Text>}
        </View>

        <View style={{ flex: 4 }}>
          <ButtonDropdown
            styleContainer={{}}
            width={SIZE.width(56)}
            birthday
            text={this.state[stateChange]}
            placeholder={this.currentDate}
            onPress={() => this.showDatePicker(stateChange)}
          />
          {this.renderModalDate(this.state[stateChange], stateChange)}
        </View>
      </View>
    );
  };
  renderContent = () => {
    const { imageDrug } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={"handled"}
          extraHeight={60}
          extraScrollHeight={SIZE.height(20)}
          enableOnAndroid
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            width: SIZE.device_width,
            backgroundColor: COLOR_GRAY_LIGHT,
            paddingHorizontal: SIZE.device_width * 0.05,
          }}
          bounces={false}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View
              style={{
                height: "100%",
                width: 2,
                backgroundColor: "red",
              }}
            />
            <Text
              style={{
                marginLeft: SIZE.width(2),
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              市販薬
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT, flex: 1 }}>
              お薬名
              <Text style={{ color: "red", fontSize: 16 }}>*</Text>
            </Text>
            <View style={{ flex: 4 }}>
              <InputText
                defaultValue={this.state.nameDrug}
                onChangeText={(text) => {
                  this.state.nameDrug = text;
                }}
              />
            </View>
          </View>
          {this.renderInputBirthday("服用開始\n日", true, "startDate")}
          {this.renderInputBirthday("服用終了\n日", false, "endDate")}
          <View style={{ flexDirection: "row", marginTop: 25 }}>
            <Text style={{ fontSize: SIZE.H14, color: COLOR_TEXT, flex: 1 }}>
              お薬画像
            </Text>
            <View style={{ flex: 4 }}>
              <TouchableOpacity
                onPress={() => {
                  this.picturePickerRef.showRBSheet();
                }}
                style={{
                  backgroundColor: "white",
                  width: SIZE.width(35),
                  height: SIZE.width(35),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  borderWidth: imageDrug.imgDefault ? 0.5 : 0,
                  borderColor: COLOR_BORDER,
                }}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    imageDrug.imgDefault
                      ? require("../imgs/icon_camera.png")
                      : {
                          uri: imageDrug.link,
                        }
                  }
                  style={{
                    width: imageDrug.imgDefault
                      ? SIZE.width(16)
                      : SIZE.width(35),
                    height: imageDrug.imgDefault
                      ? SIZE.width(12)
                      : SIZE.width(35),
                    borderRadius: imageDrug.imgDefault ? 0 : 3,
                  }}
                  resizeMode={"stretch"}
                />
                {imageDrug.imgDefault && (
                  <Text
                    style={{ fontSize: 10, color: COLOR_BORDER, marginTop: 14 }}
                  >
                    登録する
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <PicturePicker
              ref={(ref) => (this.picturePickerRef = ref)}
              onChangeValue={this.onChangeImage}
            />
          </View>
          {this.renderInputBirthday("使用期限", false, "expiredDate")}
          <Text
            style={{ color: COLOR_TEXT, fontSize: SIZE.H14, marginTop: 30 }}
          >
            メモ
          </Text>
          <InputText
            multiline={true}
            styleInput={{
              marginTop: 10,
              height: 80,
              paddingVertical: 10,
              textAlignVertical: "top",
            }}
            onChangeText={(text) => {
              this.setState({
                memo: text,
              });
            }}
          />
        </KeyboardAwareScrollView>
        <ButtonConfirm
          loading={this.state.isLoading}
          textButton={"登録"}
          styleButton={{
            margin: SIZE.device_width * 0.05,
          }}
          onPress={this.createMarketDrug}
        />
      </View>
    );
  };
  render() {
    const { navigation } = this.props;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.setState({ isMaintain: false })}
          timeOut={10000}
        />
      );
    }
    return (
      <View
        style={{
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          flex: 1,
        }}
      >
        <StatusBar
          backgroundColor={APP_COLOR.BACKGROUND_COLOR}
          barStyle='dark-content'
        />
        <HeaderIconLeft
          //   title={"User Records"}
          goBack={navigation.goBack}
        />
        {this.renderContent()}
      </View>
    );
  }
}
