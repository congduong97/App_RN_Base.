//Library:
import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  RefreshControl,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

//Setup:
import { Api } from "../util/api";
import { SIZE } from "../../../const/size";
import { APP_COLOR, COLOR_BACKGROUND_RECORDS } from "../../../const/Color";

//Component:
import {
  TYPE_USER_INFO_SPECIAL,
  COLOR_TEXT,
  TYPE_MODAL,
} from "../util/constant";
import ModalConfirm from "../item/ModalConfirm";
import { UserService } from "../util/UserService";
import MaintainView from "../../../commons/MaintainView";
import ReloadScreen from "../../../service/ReloadScreen";
import { HeaderIconLeft, NetworkError, Loading } from "../../../commons";

export default class DetailUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        infoBasic: [
          { title: "名前", value: "" },
          { title: "名前(カナ)", value: "" },
          { title: "性別", value: "" },
          { title: "生年月日", value: "" },
        ],
        infoDetail: [
          { title: "郵便番号", value: "" },
          { title: "住所1", value: "" },
          { title: "住所2", value: "" },
          { title: "電話番号", value: "" },
          { title: "血液型", value: "" },
          { title: "体重", value: "" },
        ],
        infoSpecial: [
          { title: "アレルギー歴", value: "" },
          { title: "副作用歴", value: "" },
          { title: "既往歴", value: "" },
          { title: "その他", value: "" },
        ],
      },
      isLoadingRefresh: false,
      isLoading: true,
      isMaintain: false,
      networkError: false,
    };
  }
  componentDidMount() {
    this.getDetailUser();
    const { routeName } = this.props.navigation.state;
    ReloadScreen.onChange(routeName, (currentScreen) => {
      if (currentScreen == "DETAIL_USER") {
        this.getDetailUser();
      }
    });
  }

  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }

  getDetailUser = async (loadRefresh) => {
    const user = this.props.navigation.getParam("user");
    try {
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
          networkError: false,
          isMaintain: false,
        });
      } else {
        this.setState({
          isLoading: true,
          isMaintain: false,
          networkError: false,
        });
      }
      const response = await Api.getDetailUser(user.id);
      if (response.code === 502) {
        this.setState({
          isLoadingRefresh: false,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }

      if (response.code == 200 && response.res.status.code == 1000) {
        let data = response.res.data;
        let historySideEffect =
          data.p2_patientSpecialInfos.length > 0
            ? this.checkPatientSpecialInfos(
                data.p2_patientSpecialInfos,
                TYPE_USER_INFO_SPECIAL.HISTORY_SIDE_EFFECT
              )
            : "";
        let historyIllness =
          data.p2_patientSpecialInfos.length > 0
            ? this.checkPatientSpecialInfos(
                data.p2_patientSpecialInfos,
                TYPE_USER_INFO_SPECIAL.HISTORY_ILLNESS
              )
            : "";
        let other =
          data.p2_patientSpecialInfos.length > 0
            ? this.checkPatientSpecialInfos(
                data.p2_patientSpecialInfos,
                TYPE_USER_INFO_SPECIAL.OTHER
              )
            : "";
        this.setState({
          data: {
            infoBasic: [
              { title: "名前", value: data.firstName + " " + data.lastName },
              {
                title: "名前(カナ)",
                value: data.firstNameKana + " " + data.lastNameKana,
              },
              { title: "性別", value: data.gender == "MALE" ? "男性" : "女性" },
              {
                title: "生年月日",
                value: !!data.birthday
                  ? this.convertDate(data.birthday, 1)
                  : "",
              },
            ],
            infoDetail: [
              { title: "郵便番号", value: data.zipCode },
              { title: "住所1", value: data.cityName + data.address1 },
              { title: "住所2", value: data.address2 },
              { title: "電話番号", value: data.phone },
              { title: "血液型", value: data.bloodGroup },
              {
                title: "体重",
                value: !!data.bodyWeight ? data.bodyWeight + " kg" : "",
              },
            ],
            infoSpecial: [
              {
                title: "アレルギー歴",
                value: this.stringAllergy(
                  data.allergyEntitiesDefault,
                  data.allergyEntitiesOther
                ),
              },
              {
                title: "副作用歴",
                value: historySideEffect,
              },
              {
                title: "既往歴",
                value: historyIllness,
              },
              {
                title: "その他",
                value: other,
              },
            ],
          },
          isLoading: false,
          isMaintain: false,
          isLoadingRefresh: false,
        });
        UserService.setPropertyUser("id", user.id);
        UserService.setPropertyUser(
          "birthday",
          this.convertDate(data.birthday, 2)
        );
        UserService.setPropertyUser("firstName", data.firstName);
        UserService.setPropertyUser("lastName", data.lastName);
        UserService.setPropertyUser("firstNameKana", data.firstNameKana);
        UserService.setPropertyUser("lastNameKana", data.lastNameKana);
        UserService.setPropertyUser("gender", data.gender);
        UserService.setPropertyUser("zipCode", data.zipCode);
        UserService.setPropertyUser("cityId", data.cityId);
        UserService.setPropertyUser("cityName", data.cityName);
        UserService.setPropertyUser("address1", data.address1);
        UserService.setPropertyUser("address2", data.address2);
        UserService.setPropertyUser("phone", data.phone);
        UserService.setPropertyUser("bloodGroup", data.bloodGroup);
        UserService.setPropertyUser("bloodGroupId", data.bloodGroupId);
        UserService.setPropertyUser("bodyWeight", data.bodyWeight);
        UserService.setPropertyUser(
          "allergyEntitiesDefault",
          data.allergyEntitiesDefault
        );
        UserService.setPropertyUser(
          "allergyEntitiesOther",
          data.allergyEntitiesOther
        );
        UserService.setPropertyUser(
          "specialInfos",
          data.p2_patientSpecialInfos
        );
        return;
      }
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
        isMaintain: false,
        isLoadingRefresh: false,
      });
    }
  };
  deleteUser = async () => {
    const user = this.props.navigation.getParam("user");
    try {
      this.setState({
        isLoading: true,
      });
      const response = await Api.deleteUser(user.id);
      if (response.code === 502) {
        this.setState({
          isLoadingRefresh: false,
          isLoading: false,
          isMaintain: true,
        });
        return;
      }

      if (response.code == 200 && response.res.status.code == 1000) {
        ReloadScreen.set("LIST_USER_OF_MEMBER");
        this.setState({
          isLoading: false,
        });
        this.props.navigation.goBack();
        return;
      }
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
        networkError: true,
      });
    }
  };

  checkPatientSpecialInfos = (array, type) => {
    for (let index = 0; index < array.length; index++) {
      if (array[index].patientType == type) {
        return array[index].content;
      }
    }
    return "";
  };

  stringAllergy = (allergyDefault, allergyOther) => {
    let result = "";
    if (allergyDefault.length > 0) {
      allergyDefault.forEach((element) => {
        if (result.length == 0) {
          result = element.name;
        } else {
          result = result + ", " + element.name;
        }
      });
    }
    if (allergyOther.length > 0) {
      allergyOther.forEach((element) => {
        if (result.length == 0) {
          result = element.name;
        } else {
          result = result + ", " + element.name;
        }
      });
    }
    return result;
  };

  convertDate = (date, type) => {
    var getDate = new Date(date);
    let day =
      getDate.getDate() < 10 ? "0" + getDate.getDate() : getDate.getDate();
    let month = getDate.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let year = getDate.getFullYear();
    if (type == 1) {
      return year + "." + month + "." + day;
    } else {
      return year + "/" + month + "/" + day;
    }
  };

  onPressChange = (type) => {
    const { navigation } = this.props;
    switch (type) {
      case 1:
        navigation.navigate("CHANGE_BASIC_INFO");
        break;
      case 2:
        navigation.navigate("CHANGE_DETAIL_INFO");
        break;
      case 3:
        navigation.navigate("CHANGE_SPECIAL_INFO");
        break;
      default:
        break;
    }
  };

  renderItemInfoUser = (title, type, data) => {
    return (
      <View
        style={{
          marginHorizontal: SIZE.width(4),
          paddingVertical: 20,
          paddingHorizontal: SIZE.width(4),
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          borderRadius: 6,
          marginTop: 15,
          marginBottom: type == 3 ? 50 : 0,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 2, backgroundColor: "red" }} />
            <Text
              style={{
                paddingLeft: 10,
                fontSize: SIZE.H16,
                fontWeight: "bold",
                color: COLOR_TEXT,
              }}
            >
              {title}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.onPressChange(type)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Text style={{ color: "#06B050", fontSize: SIZE.H14 }}>編集</Text>
          </TouchableOpacity>
        </View>
        {data.length > 0 &&
          data.map((item, index) => (
            <View
              key={`${index}`}
              style={{ flexDirection: "row", marginTop: 25 }}
            >
              <Text
                style={{
                  fontSize: SIZE.H14,
                  fontWeight: "700",
                  flex: 1,
                  color: COLOR_TEXT,
                }}
              >
                {item.title}
              </Text>
              <Text style={{ fontSize: SIZE.H14, flex: 2, color: COLOR_TEXT }}>
                {item.value}
              </Text>
            </View>
          ))}
      </View>
    );
  };
  renderContent = () => {
    const {
      isLoadingRefresh,
      data,
      isMaintain,
      isLoading,
      networkError,
    } = this.state;

    if (networkError) {
      return (
        <NetworkError
          onPress={() => {
            this.getDetailUser(false);
          }}
        />
      );
    }

    if (isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Loading />
        </View>
      );
    }
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: COLOR_BACKGROUND_RECORDS }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getDetailUser(true);
            }}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: APP_COLOR.BACKGROUND_COLOR,
            paddingHorizontal: SIZE.width(4),
            paddingVertical: SIZE.width(3),
          }}
        >
          <Image
            style={{
              height: 40,
              width: 40,
            }}
            source={require("../../../images/icon_user.png")}
            resizeMode={"contain"}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              flex: 1,
              marginRight: 15,
            }}
          >
            <Text
              style={{
                fontSize: SIZE.H16,
                marginLeft: 15,
                color: COLOR_TEXT,
              }}
              numberOfLines={1}
            >
              {data.infoBasic[0].value}
            </Text>
            <Text
              style={{ fontSize: SIZE.H12, marginLeft: 4, color: COLOR_TEXT }}
            >
              さん
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: "red", height: 1, width: "100%" }} />
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 15,
            paddingRight: SIZE.width(4),
          }}
          onPress={() => {
            this.refModalConfirm.handleVisible();
          }}
        >
          <Icon name='delete' size={18} color={"red"} />
          <Text
            style={{
              color: "red",
              fontSize: SIZE.H14,
              marginLeft: 4,
              fontWeight: "bold",
            }}
          >
            ユーザーを削除
          </Text>
        </TouchableOpacity>
        <ModalConfirm
          onRef={(ref) => {
            this.refModalConfirm = ref;
          }}
          type={TYPE_MODAL.DELETE}
          title={"ユーザー"}
          onPressConfirm={this.deleteUser}
        />
        {this.renderItemInfoUser("ユーザー基本情報", 1, data.infoBasic)}
        {this.renderItemInfoUser("詳細情報", 2, data.infoDetail)}
        {this.renderItemInfoUser("特記事項", 3, data.infoSpecial)}
      </ScrollView>
    );
  };

  render() {
    const { goBack } = this.props.navigation;
    if (this.state.isMaintain) {
      return (
        <MaintainView
          onPress={() => this.getDetailUser(false)}
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
          goBack={goBack}
        />
        {this.renderContent()}
      </View>
    );
  }
}
