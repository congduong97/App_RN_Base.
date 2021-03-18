import React, { PureComponent } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { SIZE } from "../../../const/size";
import ButtonDropdown from "./ButtonDropdown";
import InputText from "./InputText";
import ButtonConfirm from "./ButtonConfirm";
import { UserService } from "../util/UserService";
import { Api } from "../util/api";
import { NetworkError, Loading } from "../../../commons";
import MaintainView from "../../../commons/MaintainView";
import { COLOR_TEXT, TYPE_UPDATE } from "../util/constant";
import ReloadScreen from "../../../service/ReloadScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AlertNotifyUserDeletedService } from "../util/AlertNotifyUserDeletedService";
export default class InputUserInfoDetail extends PureComponent {
  constructor() {
    super();
    const user = UserService.getUser();
    this.state = {
      zipCode: user.zipCode,
      cityId: user.cityId,
      address1: user.address1,
      address2: user.address2,
      bloodGroupId: user.bloodGroupId,
      bodyWeight: user.bodyWeight,
      cityName: user.cityName,
      bloodGroup: user.bloodGroup,
      phone: user.phone,
      listCity: [],
      listBlood: [],
      isLoading: false,
      isLoadingRefresh: false,
      isMaintain: false,
      error: false,
    };
  }
  componentDidMount() {
    this.getListCityAndBlood();
  }
  getListCityAndBlood = async (loadRefresh) => {
    // const { isLoadingRefresh, isLoading } = this.state;
    try {
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
          error: false,
          isMaintain: false,
        });
      } else {
        this.setState({
          isLoading: true,
          isMaintain: false,
          error: false,
        });
      }
      const responseCity = await Api.getListCity();
      const responseBlood = await Api.getListBlood();
      console.log(responseCity, "responseCity");
      console.log(responseBlood, "responseBlood");
      if (responseCity.code === 502 || responseBlood.code == 502) {
        this.setState({
          isLoadingRefresh: false,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }
      if (
        !!responseCity &&
        responseCity.code == 200 &&
        responseCity.res.status.code == 1000 &&
        !!responseBlood &&
        responseBlood.code == 200 &&
        responseBlood.res.status.code == 1000
      ) {
        this.setState({
          listCity: !!responseCity.res.data ? responseCity.res.data : [],
          listBlood: !!responseBlood.res.data ? responseBlood.res.data : [],
          isLoading: false,
          isMaintain: false,
          isLoadingRefresh: false,
        });
        return;
      }
      this.setState({
        ...this.state,
        isLoading: false,
        error: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        error: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    }
  };
  pressUpdate = async () => {
    const user = UserService.getUser();
    try {
      const response = await Api.updateUserInfo(user, TYPE_UPDATE.DETAIL);
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
        ReloadScreen.set("DETAIL_USER");
        this.props.navigation.goBack();
        return;
      }
      this.setState({
        ...this.state,
        error: true,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        error: true,
      });
    }
  };
  onPressBtn = () => {
    // console.log("UserService.getUser()", UserService.getUser());
    const {
      zipCode,
      cityId,
      address1,
      address2,
      bloodGroupId,
      bodyWeight,
      bloodGroup,
      cityName,
      phone,
    } = this.state;
    const reZipCode = /^([0-9]{7})$/;
    const rePhone = /^([0-9]{10,11})$/;
    let trimZipCode = zipCode.trim();
    let bodyWeightTrim = bodyWeight.trim();
    console.log("phone", phone);

    if (trimZipCode.trim().length > 0 && !reZipCode.test(trimZipCode)) {
      Alert.alert("郵便番号が正しくありません。");
      return;
    }
    if (cityId == 0) {
      Alert.alert("都道府県を選択してください。");
      return;
    }
    if (phone === null || phone.length === 0) {
      Alert.alert("本項目は必須です。");
      return;
    } else if (!rePhone.test(phone) || phone[0] != 0) {
      Alert.alert("電話番号の形式が誤っています。");
      return;
    }
    // console.log("parseFloat(bodyWeightTrim)",parseFloat(bodyWeightTrim));

    if (
      bodyWeightTrim.length > 0 &&
      (isNaN(parseFloat(bodyWeightTrim)) || parseFloat(bodyWeightTrim) < 0)
    ) {
      Alert.alert("Cân nặng lớn hơn 0 và là  số");
      return;
    }
    UserService.setPropertyUser("zipCode", zipCode);
    UserService.setPropertyUser("cityId", cityId);
    UserService.setPropertyUser("address1", address1.trim());
    UserService.setPropertyUser("address2", address2.trim());
    UserService.setPropertyUser("bloodGroupId", bloodGroupId);
    UserService.setPropertyUser("bodyWeight", bodyWeightTrim);
    UserService.setPropertyUser("bloodGroup", bloodGroup);
    UserService.setPropertyUser("cityName", cityName);
    UserService.setPropertyUser("phone", phone);
    !!this.props.scrollToPage && this.props.scrollToPage(2);
    !!this.props.onPressChange && this.pressUpdate();
  };
  choseCity = (item) => {
    this.setState({
      cityName: item.name,
      cityId: item.id,
    });
  };
  choseTypeBlood = (item) => {
    this.setState({
      bloodGroup: item.name,
      bloodGroupId: item.id,
    });
  };
  render() {
    const {
      bloodGroup,
      cityName,
      isLoading,
      isLoadingRefresh,
      isMaintain,
      error,
      listBlood,
      listCity,
      cityId,
      bloodGroupId,
      zipCode,
      address1,
      address2,
      bodyWeight,
      phone,
    } = this.state;
    if (isMaintain) {
      return (
        <MaintainView
          onPress={() => this.getListCityAndBlood(false)}
          timeOut={10000}
        />
      );
    }
    if (error) {
      return (
        <NetworkError
          onPress={() => {
            this.getListCityAndBlood(false);
          }}
        />
      );
    }
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: SIZE.device_width,
            height: SIZE.device_height,
          }}
        >
          <Loading />
        </View>
      );
    }
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"handled"}
        extraHeight={60}
        extraScrollHeight={SIZE.height(15)}
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          width: SIZE.device_width,
          // backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          paddingHorizontal: SIZE.device_width * 0.05,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getListCityAndBlood(true);
            }}
          />
        }
      >
       
          <View style={{ flexDirection: "row", marginTop: 20 }}>
            <View style={{ width: 1, backgroundColor: "red" }} />
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "700",
                fontSize: SIZE.H16,
                color: COLOR_TEXT,
              }}
            >
              詳細情報
            </Text>
            <Text
              style={{
                fontSize: SIZE.H16,
                color: COLOR_TEXT,
              }}
            >
              （入力は任意です）
            </Text>
          </View>
          <View style={[styles.viewContainerOption, { marginTop: 30 }]}>
            <Text style={{ fontSize: SIZE.H14, flex: 2, color: COLOR_TEXT }}>
              郵便番号
            </Text>
            <View style={{ flex: 5 }}>
              <InputText
                defaultValue={zipCode}
                styleInput={{ width: SIZE.width(35) }}
                placeholder={"1111111"}
                maxLength={7}
                keyboardType={"number-pad"}
                onChangeText={(text) => {
                  this.state.zipCode = text;
                }}
              />
            </View>
          </View>

          <View style={styles.viewContainerOption}>
            <Text style={{ fontSize: SIZE.H14, flex: 2, color: COLOR_TEXT }}>
              住所1<Text style={{ color: "red" ,fontSize:SIZE.H16}}>*</Text>
            </Text>
            <View style={{ flex: 5 }}>
              <ButtonDropdown
                width={SIZE.width(40)}
                placeholder={"選択してください"}
                dropdown
                onPressChose={this.choseCity}
                data={listCity}
                defaultLabel={cityName}
                defaultId={cityId}
                title={"県を選択してください"}
              />
            </View>
          </View>
          <View style={[styles.viewContainerOption, { marginTop: 15 }]}>
            <View style={{ flex: 2 }} />
            <View style={{ flex: 5 }}>
              <InputText
                defaultValue={address1}
                placeholder={"（例）渋谷区渋谷1-1-1"}
                onChangeText={(text) => {
                  this.state.address1 = text;
                }}
              />
            </View>
          </View>
          <View style={styles.viewContainerOption}>
            <Text style={{ fontSize: SIZE.H14, flex: 2,color:COLOR_TEXT }}>住所2</Text>
            <View style={{ flex: 5 }}>
              <InputText
                defaultValue={address2}
                placeholder={"（例）アオキマンション1203"}
                onChangeText={(text) => {
                  this.state.address2 = text;
                }}
              />
            </View>
          </View>
          <View style={styles.viewContainerOption}>
            <Text style={{ fontSize: SIZE.H14, flex: 2, color: COLOR_TEXT }}>
              電話番号 <Text style={{ color: "red" ,fontSize:16}}>*</Text>
            </Text>
            <View style={{ flex: 5 }}>
              <InputText
                defaultValue={phone}
                styleInput={{ flex: 5 }}
                placeholder={"例）09011112222"}
                maxLength={11}
                keyboardType={"phone-pad"}
                onChangeText={(text) => {
                  this.state.phone = text;
                }}
              />
            </View>
          </View>
          <View style={styles.viewContainerOption}>
            <Text style={{ fontSize: SIZE.H14, flex: 2, color: COLOR_TEXT }}>
              血液型
            </Text>
            <View style={{ flex: 5 }}>
              <ButtonDropdown
                width={SIZE.width(40)}
                dropdown
                placeholder={"選択してください"}
                onPressChose={this.choseTypeBlood}
                data={listBlood}
                defaultLabel={bloodGroup}
                defaultId={bloodGroupId}
                title={"血液型を選択してください"}
              />
            </View>
          </View>
          <View style={styles.viewContainerOption}>
            <Text style={{ fontSize: 14, flex: 2, color: COLOR_TEXT }}>
              体重
            </Text>
            <View
              style={{ flex: 5, flexDirection: "row", alignItems: "center" }}
            >
              <InputText
                defaultValue={bodyWeight}
                styleInput={{ width: SIZE.width(20) }}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.state.bodyWeight = text;
                }}
              />
              <Text style={{ fontSize: 14, marginLeft: 10, color: COLOR_TEXT }}>
                kg
              </Text>
            </View>
          </View>
          <ButtonConfirm
            textButton={this.props.onPressChange ? "変更" : "次へ"}
            styleButton={{ marginTop: 40, marginBottom: 40 }}
            onPress={this.onPressBtn}
          />
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  viewContainerOption: {
    flexDirection: "row",
    marginTop: 15,
    height: 35,
    alignItems: "center",
  },
});
