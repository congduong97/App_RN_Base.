import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SIZE } from "../../../const/size";
import { COLOR_BORDER } from "../../../const/Color";
import RadioButton from "./RadioButton";
import { AppCheckBox, NetworkError, Loading } from "../../../commons";
import InputText from "./InputText";
import Icon from "react-native-vector-icons/AntDesign";
import ButtonConfirm from "./ButtonConfirm";
import { UserService } from "../util/UserService";
import { Api } from "../util/api";
import MaintainView from "../../../commons/MaintainView";
import {
  TYPE_USER_INFO_SPECIAL,
  COLOR_TEXT,
  TYPE_UPDATE,
} from "../util/constant";
import ReloadScreen from "../../../service/ReloadScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class InputUserInfoSpecial extends Component {
  constructor() {
    super();
    this.widthTextInput = SIZE.width(65);
    const user = UserService.getUser();
    let historySideEffect = this.checkAllergy(
      user.specialInfos,
      TYPE_USER_INFO_SPECIAL.HISTORY_SIDE_EFFECT
    );
    let historyIllness = this.checkAllergy(
      user.specialInfos,
      TYPE_USER_INFO_SPECIAL.HISTORY_ILLNESS
    );
    let other = this.checkAllergy(
      user.specialInfos,
      TYPE_USER_INFO_SPECIAL.OTHER
    );

    this.state = {
      isAllergyHistory: this.checkAllergy(
        user.specialInfos,
        TYPE_USER_INFO_SPECIAL.HISTORY_ALLERGY
      ).status,
      textAddAllergy: "",
      listDefaultAllergies: user.allergyEntitiesDefault,
      allergyEntitiesOther: user.allergyEntitiesOther,
      isSideEffectHistoryRadio: historySideEffect.status,
      isDiseaseHistoryRadio: historyIllness.status,
      isOtherRadio: other.status,
      textSideEffectHistory: historySideEffect.status
        ? historySideEffect.content
        : "",
      textDiseaseHistory: historyIllness.status ? historyIllness.content : "",
      textOther: other.status ? other.content : "",
      isLoading: false,
      error: null,
      isMaintain: false,
      isLoadingRefresh: false,
    };
  }
  checkAllergy = (array, type) => {
    if (array.length < 1) {
      return {
        status: false,
        content: "",
      };
    }
    for (let index = 0; index < array.length; index++) {
      if (array[index].patientType == type) {
        return {
          status: true,
          content: array[index].content,
        };
      }
    }
    return {
      status: false,
      content: "",
    };
  };
  componentDidMount() {
    this.getListDefaultAllergies();
  }

  getListDefaultAllergies = async (loadRefresh) => {
    const { listDefaultAllergies } = this.state;
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
      const response = await Api.getListDefaultAllergies();
      console.log("res", response);
      if (response.code === 502) {
        this.setState({
          isLoadingRefresh: false,
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
        let resData = [];
        if (!!response.res.data && response.res.data.length > 0) {
          resData = response.res.data;
          for (let index = 0; index < resData.length; index++) {
            resData[index].status = this.checkIsCheckbox(
              listDefaultAllergies,
              resData[index].id
            );
          }
        }
        this.setState({
          listDefaultAllergies: resData,
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
    console.log("user", user);
    try {
      const response = await Api.updateUserInfo(user, TYPE_UPDATE.SPECIAL);
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
        error: true,
      });
    }
  };
  createUser = async () => {
    console.log("UserService.getUser()", UserService.getUser());
    let user = UserService.getUser();
    try {
      const response = await Api.createPatientInfo(user);
      if (response.code === 502) {
        this.setState({
          isMaintain: true,
        });
        return;
      }
      console.log(response, "response");
      if (response.code == 200 && response.res.status.code == 1000) {
        this.props.scrollToPage(3);
        return;
      }
      this.setState({
        ...this.state,
        error: true,
      });
    } catch (error) {
      console.log(error, "error create createPatientInfo");
      this.setState({
        ...this.state,
        error: true,
      });
    }
  };
  checkIsCheckbox = (array, id) => {
    if (array.length < 1) {
      return false;
    }
    for (let index = 0; index < array.length; index++) {
      if (array[index].id == id) {
        return true;
      }
    }
    return false;
  };
  touchBtnRadioAllergy = async (value) => {
    // LayoutAnimation.configureNext(
    //   LayoutAnimation.update(
    //     500,
    //     LayoutAnimation.Types.keyboard,
    //     LayoutAnimation.Properties.scaleY
    //   )
    // );
    this.setState({
      isAllergyHistory: value,
    });
  };
  touchBtnRadioSideEffect = (value) => {
    this.setState({
      isSideEffectHistoryRadio: value,
    });
  };
  touchBtnRadioDisease = (value) => {
    this.setState({
      isDiseaseHistoryRadio: value,
    });
  };
  touchBtnRadioOther = (value) => {
    this.setState({
      isOtherRadio: value,
    });
  };

  onPressBtn = () => {
    const {
      isAllergyHistory,
      isSideEffectHistoryRadio,
      isDiseaseHistoryRadio,
      isOtherRadio,
      textSideEffectHistory,
      textDiseaseHistory,
      textOther,
      listDefaultAllergies,
      allergyEntitiesOther,
    } = this.state;

    // console.log("isSideEffectHistoryRadio", isSideEffectHistoryRadio);
    // console.log("isDiseaseHistoryRadio", isDiseaseHistoryRadio);
    // console.log("isOtherRadio", isOtherRadio);
    let allergyEntitiesDefault = [];
    for (let index = 0; index < listDefaultAllergies.length; index++) {
      if (listDefaultAllergies[index].status) {
        allergyEntitiesDefault.push({
          id: listDefaultAllergies[index].id,
          name: listDefaultAllergies[index].name,
        });
      }
    }
    let checkContentAllergyHistory =
      isAllergyHistory &&
      allergyEntitiesDefault.length < 1 &&
      allergyEntitiesOther.length < 1;
    // console.log("checkContentAllergyHistory",checkContentAllergyHistory);
    // console.log("allergyEntitiesDefault",allergyEntitiesDefault);
    // console.log("allergyEntitiesOther",allergyEntitiesOther);

    let checkTextSideEffectHistory =
      isSideEffectHistoryRadio && textSideEffectHistory.trim().length < 1;
    let checkTextDiseaseHistory =
      isDiseaseHistoryRadio && textDiseaseHistory.trim().length < 1;
    let checkOther = isOtherRadio && textOther.trim().length < 1;
    if (
      checkContentAllergyHistory ||
      checkTextSideEffectHistory ||
      checkTextDiseaseHistory ||
      checkOther
    ) {
      Alert.alert("副作用歴を入力カしてください");
      return;
    }
    let arrRadio = [];
    if (isAllergyHistory) {
      arrRadio.push({
        patientType: TYPE_USER_INFO_SPECIAL.HISTORY_ALLERGY,
        content: "",
      });

      UserService.setPropertyUser("allergyEntitiesOther", allergyEntitiesOther);
      UserService.setPropertyUser(
        "allergyEntitiesDefault",
        allergyEntitiesDefault
      );
    } else {
      UserService.setPropertyUser("allergyEntitiesOther", []);
      UserService.setPropertyUser("allergyEntitiesDefault", []);
    }
    if (isSideEffectHistoryRadio) {
      arrRadio.push({
        patientType: TYPE_USER_INFO_SPECIAL.HISTORY_SIDE_EFFECT,
        content: textSideEffectHistory,
      });
    }
    if (isDiseaseHistoryRadio) {
      console.log("isDiseaseHistoryRadio arrRadio", isDiseaseHistoryRadio);
      arrRadio.push({
        patientType: TYPE_USER_INFO_SPECIAL.HISTORY_ILLNESS,
        content: textDiseaseHistory,
      });
    }
    if (isOtherRadio) {
      arrRadio.push({
        patientType: TYPE_USER_INFO_SPECIAL.OTHER,
        content: textOther,
      });
    }
    console.log("arrRadio", arrRadio);
    UserService.setPropertyUser("specialInfos", arrRadio);
    !!this.props.scrollToPage && this.createUser();
    !!this.props.onPressChange && this.pressUpdate();
  };

  renderHistoryAllergy = () => {
    const {
      textAddAllergy,
      listDefaultAllergies,
      allergyEntitiesOther,
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <Text
            style={{
              fontSize: SIZE.H14,
              flex: 3,
              marginTop: 5,
              color: COLOR_TEXT,
            }}
          >
            アレルギー
          </Text>
          <View
            style={{
              flex: 6,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {listDefaultAllergies.map((item, index) => (
              <View
                key={index}
                style={{
                  height: 25,
                  flexDirection: "row",
                  alignItems: "center",
                  width: SIZE.width(23),
                  marginTop: 5,
                  marginLeft: index % 2 != 0 ? SIZE.width(3) : 0,
                }}
              >
                <AppCheckBox
                  size={24}
                  status={item.status}
                  borderColor={COLOR_BORDER}
                  onChangeData={() => {
                    listDefaultAllergies[index].status = !item.status;
                    this.setState({
                      listDefaultAllergies: [...listDefaultAllergies],
                    });
                  }}
                />
                <Text
                  style={{
                    fontSize: SIZE.H14,
                    marginLeft: SIZE.width(2.5),
                    color: COLOR_TEXT,
                  }}
                >
                  {item.name}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }} />
        </View>

        <Text style={{ fontSize: SIZE.H14, marginTop: 15, color: COLOR_TEXT }}>
          その他
        </Text>
        {allergyEntitiesOther.length > 0 &&
          allergyEntitiesOther.map((item, index) => (
            <View
              key={`${index}`}
              style={{
                flex: 1,
                flexDirection: "row",
                marginTop: 15,
                alignItems: "center",
                marginLeft: SIZE.width(5),
              }}
            >
              <View
                style={{
                  width: this.widthTextInput,
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: COLOR_BORDER,
                  height: 35,
                  paddingHorizontal: SIZE.width(3),
                  marginRight: SIZE.width(5),
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 14, color: COLOR_TEXT }}>
                  {item.name}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  width: SIZE.width(15),
                }}
                onPress={() => {
                  console.log("allergyEntitiesOther", allergyEntitiesOther);
                  let arrNew = allergyEntitiesOther.filter((it) => it !== item);
                  console.log("new", arrNew);

                  this.setState({
                    allergyEntitiesOther: arrNew,
                  });
                }}
              >
                <Icon name='closecircle' size={20} color={COLOR_BORDER} />
              </TouchableOpacity>
            </View>
          ))}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 15,
            alignItems: "center",
            marginLeft: SIZE.width(5),
          }}
        >
          <TextInput
            style={{
              width: this.widthTextInput,
              borderRadius: 5,
              borderWidth: 0.5,
              borderColor: COLOR_BORDER,
              height: 35,
              paddingHorizontal: SIZE.width(3),
              marginRight: SIZE.width(5),
              color: COLOR_TEXT,
              backgroundColor: "white",
            }}
            onChangeText={(text) => {
              // this.state.textAddAllergy = text;
              this.setState({
                textAddAllergy: text,
              });
            }}
            value={textAddAllergy}
          />
          <TouchableOpacity
            style={{
              flex: 1,
              width: SIZE.width(15),
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 0.5,
              borderColor: "#06B050",
              borderRadius: 5,
              height: 35,
            }}
            onPress={() => {
              // console.log("textAddAllergy", textAddAllergy);
              // console.log("allergyEntitiesOther", allergyEntitiesOther);
              if (textAddAllergy.trim().length > 0) {
                this.setState({
                  textAddAllergy: "",
                  allergyEntitiesOther: [
                    ...allergyEntitiesOther,
                    {
                      name: textAddAllergy,
                      position: allergyEntitiesOther.length + 1,
                    },
                  ],
                });
              }
              // console.log("allergyEntitiesOther2", allergyEntitiesOther);
            }}
          >
            <Text style={{ fontSize: SIZE.H14, color: "#06B050" }}>追加</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  renderRadioAndInputText = (name, value, stateText, onPressRadio) => {
    return (
      <View>
        <View style={[styles.viewContainerOption, { marginTop: 30 }]}>
          <Text style={{ fontSize: SIZE.H14, flex: 3, color: COLOR_TEXT }}>
            {name}
          </Text>
          <View style={{ flex: 7 }}>
            <RadioButton
              value={value}
              title1={"あり"}
              title2={"なし"}
              touchBtnRadio={onPressRadio}
            />
          </View>
        </View>
        {value && (
          <InputText
            styleInput={{
              height: 72,
              paddingVertical: 10,
              textAlignVertical: "top",
            }}
            multiline
            defaultValue={this.state[stateText]}
            onChangeText={(text) => {
              this.state[stateText] = text;
            }}
          />
        )}
      </View>
    );
  };
  render() {
    const {
      isAllergyHistory,
      isSideEffectHistoryRadio,
      isDiseaseHistoryRadio,
      isOtherRadio,
      isLoading,
      error,
      isMaintain,
      isLoadingRefresh,
    } = this.state;

    if (isMaintain) {
      return (
        <MaintainView
          onPress={() => this.getListDefaultAllergies(false)}
          timeOut={10000}
        />
      );
    }
    if (error) {
      return (
        <NetworkError
          onPress={() => {
            this.getListDefaultAllergies(false);
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
        style={{
          flex: 1,
          width: SIZE.device_width,
          paddingHorizontal: SIZE.device_width * 0.05,
        }}
        keyboardShouldPersistTaps={"handled"}
        extraHeight={60}
        extraScrollHeight={SIZE.height(20)}
        enableOnAndroid
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getListDefaultAllergies(true);
            }}
          />
        }
      >
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <View style={{ width: 2, backgroundColor: "red" }} />
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
              fontSize: 16,
              color: COLOR_TEXT,
            }}
          >
            （入力は任意です）
          </Text>
        </View>
        <View style={[styles.viewContainerOption, { marginTop: 30 }]}>
          <Text style={{ fontSize: 14, flex: 3, color: COLOR_TEXT }}>
            アレルギー歴
          </Text>
          <View style={{ flex: 7 }}>
            <RadioButton
              value={isAllergyHistory}
              title1={"あり"}
              title2={"なし"}
              touchBtnRadio={this.touchBtnRadioAllergy}
            />
          </View>
        </View>
        {isAllergyHistory && this.renderHistoryAllergy()}
        {this.renderRadioAndInputText(
          "副作用歴",
          isSideEffectHistoryRadio,
          "textSideEffectHistory",
          this.touchBtnRadioSideEffect
        )}
        {this.renderRadioAndInputText(
          "既往歴",
          isDiseaseHistoryRadio,
          "textDiseaseHistory",
          this.touchBtnRadioDisease
        )}
        {this.renderRadioAndInputText(
          "その他",
          isOtherRadio,
          "textOther",
          this.touchBtnRadioOther
        )}
        <ButtonConfirm
          textButton={this.props.onPressChange ? "変更" : "次へ"}
          styleButton={{ marginTop: 40, marginBottom: 40 }}
          onPress={this.onPressBtn}
          timeOut={1000}
        />
      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  viewContainerOption: {
    flexDirection: "row",
    marginTop: 15,
    height: 40,
    alignItems: "center",
  },
});
