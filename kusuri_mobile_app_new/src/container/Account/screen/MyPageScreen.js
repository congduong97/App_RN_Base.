import React, { PureComponent } from "react";
import { View, Text, ScrollView, RefreshControl, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import RenderHtmlMypge from "../screen/RenderHtmlMypge";
import {
  HeaderIconLeft,
  ButtonTypeOne,
  ButtonTypeTwo,
  Loading,
  NetworkError,
} from "../../../commons";
import { AppImage } from "../../../component/AppImage";
import Barcode from "react-native-barcode-builder";
import { TextMyPage } from "../item/TextMyPage";
import { STRING } from "../util/string";
import { COLOR_WHITE, COLOR_GRAY_LIGHT, APP_COLOR } from "../../../const/Color";
import {
  styleInApp,
  DEVICE_WIDTH,
  managerAccount,
  keyAsyncStorage,
} from "../../../const/System";
import IconRun from "../../Account/item/IconRun";
import { Api } from "../util/api";
import {
  checkVersionAllApp,
  checkMemberCodeInBlacklist,
} from "../../Launcher/util/checkVersionAllApp";
import ReloadScreen from "../../../service/ReloadScreen";
import NetInfo from "@react-native-community/netinfo";
import MaintainView from "../../../commons/MaintainView";

const inchWithDevice = (DEVICE_WIDTH - DEVICE_WIDTH / 10) / 160;
let widthImageBarcode = 0;
if (inchWithDevice >= 2.2) {
  widthImageBarcode = 2.2 * 160;
} else {
  widthImageBarcode = DEVICE_WIDTH - DEVICE_WIDTH / 10;
}

export default class MyPageScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingRefresh: false,
      loading: true,
      error: false,
      maintain: false,
      barcodeImageUrl: "",
      imageUrl: "",
      point: 0,
      money: null,
      textTimeUpdate: "",
      textDescription: "",
    };
  }

  componentDidMount() {
    this.onDidMount();
  }

  onDidMount = async () => {
    await this.getInfoLocal();
    await this.getUserInfo();
    this.updateUser();

    const { routeName } = this.props.navigation.state;

    ReloadScreen.onChange(routeName, async () => {
      // alert('reload')
      await this.getUserInfo(true);
      this.updateUser();
    });
  };
  getInfoLocal = async () => {
    const barcodeImageUrl = await AsyncStorage.getItem(
      keyAsyncStorage.barcodeImageUrl
    );
    const imageUrl = await AsyncStorage.getItem(keyAsyncStorage.appImageUrl);
    const point = await AsyncStorage.getItem(keyAsyncStorage.pointOfUser);
    const money = await AsyncStorage.getItem(keyAsyncStorage.moneyOfUser);
    const textTimeUpdate = await AsyncStorage.getItem(
      keyAsyncStorage.textTimeUpdate
    );
    const textDescription = await AsyncStorage.getItem(
      keyAsyncStorage.textDescription
    );
    this.state.barcodeImageUrl = barcodeImageUrl != null ? barcodeImageUrl : "";
    this.state.imageUrl = imageUrl != null ? imageUrl : "";
    const numPoint = point == "null" || point == null ? 0 : parseInt(point);
    this.state.point = numPoint !== NaN ? numPoint : 0;
    const numMoney = money == "null" || money == null ? 0 : parseInt(money);
    this.state.money = numMoney !== NaN ? numMoney : 0;
    this.state.textTimeUpdate = textTimeUpdate != null ? textTimeUpdate : "";
    this.state.textDescription = textDescription != null ? textDescription : "";
    this.setState({ loading: false });
  };
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
  }

  getFormatDate = (time) => {
    if (!time) {
      return null;
    }
    const date = new Date(time);
    return `  ${date.getFullYear()}年${date.getMonth() +
      1}月${date.getDate()}日${date.getHours()}時${date.getMinutes()}分${date.getSeconds()}秒時点`;
  };

  getUserInfo = async (isLoadingRefresh, isLoadingButtonRefresh) => {
    this.state.maintain = false;
    // if (!this.state.loading) {
    //   this.setState({ loading: true });
    // }
    checkVersionAllApp();
    // const datetrc = new Date().getTime();
    try {
      const res = await checkMemberCodeInBlacklist(managerAccount.memberCode);

      if (res && managerAccount.usingSms) {
        this.props.navigation.navigate("HOME");
        return;
      }
      if (!isLoadingButtonRefresh) {
        if (isLoadingRefresh) {
          this.setState({ isLoadingRefresh: true });
        }
      } else {
        this.setState({ isLoadingButtonRefresh: true });
      }
      const callOnlyGetBalance = await AsyncStorage.getItem(
        "callOnlyGetBalance"
      );
      if (!callOnlyGetBalance) {
        const responsegetBalance = await Api.updateMyPage();

        if (
          responsegetBalance.code === 200 &&
          responsegetBalance.res.status.code === 1000
        ) {
          const { money, point, accessTime } = responsegetBalance.res.data;

          this.state.money = money;
          this.state.point = point;
          this.state.textTimeUpdate = this.getFormatDate(accessTime);
          AsyncStorage.setItem("callOnlyGetBalance", "success");
          AsyncStorage.setItem(
            keyAsyncStorage.pointOfUser,
            `${this.state.point}`
          );
          AsyncStorage.setItem(
            keyAsyncStorage.moneyOfUser,
            `${this.state.money}`
          );
          AsyncStorage.setItem(
            keyAsyncStorage.textTimeUpdate,
            this.state.textTimeUpdate
          );
        }
      }

      const response = await Api.getImage();

      if (response.code === 200 && response.res.status.code === 1000) {
        const {
          money,
          point,
          barcodeUrl,
          imageUrl,
          textDescription,
          accessTime,
        } = response.res.data;

        if (callOnlyGetBalance) {
          this.state.money = money;
          this.state.textTimeUpdate = this.getFormatDate(accessTime);
          this.state.point = point;

          AsyncStorage.setItem(
            keyAsyncStorage.pointOfUser,
            `${this.state.point}`
          );
          AsyncStorage.setItem(
            keyAsyncStorage.moneyOfUser,
            `${this.state.money}`
          );
          AsyncStorage.setItem(
            keyAsyncStorage.textTimeUpdate,
            this.state.textTimeUpdate
          );
        }

        this.state.barcodeImageUrl = barcodeUrl;
        this.state.imageUrl = imageUrl;
        this.state.textDescription = textDescription;
        this.state.error = false;
        AsyncStorage.setItem(
          keyAsyncStorage.barcodeImageUrl,
          this.state.barcodeImageUrl
        );
        AsyncStorage.setItem(keyAsyncStorage.appImageUrl, this.state.imageUrl);
        AsyncStorage.setItem(
          keyAsyncStorage.textDescription,
          this.state.textDescription
        );
      } else if (response.code === 502 && response.res !== "timeout") {
        this.setState({ maintain: true });
      } else {
        this.state.error = true;
      }
    } catch (error) {
      this.state.error = true;
      const barcodeImageUrl = await AsyncStorage.getItem(
        keyAsyncStorage.barcodeImageUrl
      );
      if (barcodeImageUrl != null && barcodeImageUrl != "") {
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (!isConnected) {
            Alert.alert(
              "ネットワークエラー",
              "インターネット接続を確認してください。"
            );
          }
        });
      }
    } finally {
      if (this.state.error) {
        const barcodeImageUrl = await AsyncStorage.getItem(
          keyAsyncStorage.barcodeImageUrl
        );
        const imageUrl = await AsyncStorage.getItem(
          keyAsyncStorage.appImageUrl
        );
        const point = await AsyncStorage.getItem(keyAsyncStorage.pointOfUser);
        const money = await AsyncStorage.getItem(keyAsyncStorage.moneyOfUser);
        const textTimeUpdate = await AsyncStorage.getItem(
          keyAsyncStorage.textTimeUpdate
        );
        const textDescription = await AsyncStorage.getItem(
          keyAsyncStorage.textDescription
        );
        this.state.barcodeImageUrl =
          barcodeImageUrl != null ? barcodeImageUrl : "";
        this.state.imageUrl = imageUrl != null ? imageUrl : "";
        const numPoint = point == "null" || point == null ? 0 : parseInt(point);
        this.state.point = numPoint !== NaN ? numPoint : 0;
        const numMoney = money == "null" || money == null ? 0 : parseInt(money);
        this.state.money = numMoney !== NaN ? numMoney : 0;
        this.state.textTimeUpdate =
          textTimeUpdate != null ? textTimeUpdate : "";
        this.state.textDescription =
          textDescription != null ? textDescription : "";
      }
      this.setState({
        loading: false,
        isLoadingRefresh: false,
        isLoadingButtonRefresh: false,
      });
    }
  };
  onReloadUpdateUser = () => {
    NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        this.updateUser();
      }
    });
  };
  updateUser = async () => {
    try {
      this.setState({ isLoadingButtonRefresh: true });
      const response = await Api.updateMyPage();
      if (response.code === 200 && response.res.status.code === 1000) {
        const { money, point, accessTime } = response.res.data;

        this.state.money = money;
        this.state.point = point;
        this.state.textTimeUpdate = this.getFormatDate(accessTime);
        // this.state.barcodeImageUrl = barcodeUrl;
        // this.state.imageUrl = imageUrl;
        const strMoney = money != null ? `${money}` : "0";
        const strPoint = point != null ? `${point}` : "0";
        AsyncStorage.setItem(keyAsyncStorage.moneyOfUser, strMoney);
        AsyncStorage.setItem(keyAsyncStorage.pointOfUser, strPoint);
        AsyncStorage.setItem(
          keyAsyncStorage.textTimeUpdate,
          this.state.textTimeUpdate
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isLoadingButtonRefresh: false });
    }
  };
  renderContent = () => {
    const {
      loading,
      isLoadingRefresh,
      error,
      barcodeImageUrl,
      imageUrl,
      point,
      money,
      isLoadingButtonRefresh,
      textTimeUpdate,
      textDescription,
      maintain,
    } = this.state;

    if (loading) {
      return <Loading />;
    }
    if (error && barcodeImageUrl == "") {
      return (
        <View style={{ padding: 16 }}>
          <NetworkError onPress={this.getUserInfo} />
          <ButtonTypeTwo
            name={STRING.change_account}
            onPress={() =>
              this.props.navigation.navigate("EnterMemberCodeScreen")
            }
          />
        </View>
      );
    }

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => {
              this.getUserInfo(true);
            }}
          />
        }
        style={{ backgroundColor: COLOR_WHITE, paddingVertical: 0 }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <AppImage
            style={[styleInApp.bigImage, { width: DEVICE_WIDTH - 32 }]}
            resizeMode={"contain"}
            url={imageUrl}
          />

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <AppImage
              style={[
                styleInApp.bigImage,
                {
                  width: widthImageBarcode,
                  height: widthImageBarcode / 4,
                  marginTop: 16,
                },
              ]}
              resizeMode={"cover"}
              url={barcodeImageUrl}
            />
            <Text style={{ marginVertical: 16 }}>
              {managerAccount.memberCode}
            </Text>
          </View>
          <IconRun />
          <View
            style={{
              paddingVertical: 8,
              marginTop: 8,
              borderTopWidth: 1,
              borderColor: COLOR_GRAY_LIGHT,
              width: "100%",
            }}
          >
            <Text style={styleInApp.shortDescription}>
              {STRING.using_my_page}
            </Text>
          </View>
          {point === null ? null : (
            <TextMyPage
              style={{
                borderTopWidth: 1,
                borderColor: COLOR_GRAY_LIGHT,
                marginTop: 0,
                paddingTop: 16,
              }}
              textLeft={"保有ポイント"}
              textRight={`${point} ポイント`}
            />
          )}

          {money === null ? null : (
            <TextMyPage
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: COLOR_GRAY_LIGHT,
                marginTop: 0,
                paddingVertical: 16,
              }}
              textLeft={"プリカ残高"}
              textRight={`${money} 円`}
            />
          )}
          <Text
            onPress={() => {
              this.props.navigation.navigate("TRANSACTION_HISTORY_PRICA");
            }}
            style={{
              fontSize: 16,
              color: "#0000FF",
              textDecorationLine: "underline",
              alignSelf: "flex-end",
            }}
          >
            プリカ利用履歴の確認はこちら
          </Text>
          {textTimeUpdate ? (
            <View
              style={{
                width: "100%",
                // borderTopWidth: 1,
                borderColor: COLOR_GRAY_LIGHT,
                paddingTop: 16,
              }}
            >
              <Text
                style={{
                  color: APP_COLOR.COLOR_TEXT,
                  fontSize: 16,
                }}
              >
                <Text
                  style={{ color: APP_COLOR.COLOR_TEXT, fontWeight: "bold" }}
                >
                  {textTimeUpdate}
                </Text>
                の残高となります。
                <Text
                  style={{ color: APP_COLOR.COLOR_TEXT, fontWeight: "bold" }}
                >
                  「最新残高を取得する」
                </Text>
                ボタンクリックで最新残高を取得できます。
              </Text>
            </View>
          ) : null}
          <ButtonTypeOne
            name={STRING.update_info_use}
            onPress={() => this.updateUser()}
            loading={isLoadingButtonRefresh}
          />
          <ButtonTypeTwo
            style={{ marginTop: 0 }}
            name={STRING.change_account}
            onPress={() =>
              this.props.navigation.navigate("EnterMemberCodeScreen", {
                fromScreen: "FROM_MYPAGE_WITH_LOVE",
              })
            }
          />
          {textDescription ? (
            <View
              style={{
                borderWidth: 1,
                width: "100%",
                borderColor: `${APP_COLOR.COLOR_TEXT}70`,
                padding: 8,
                borderRadius: 2,
                paddingLeft: 14,
                paddingRight: 14,
                flex: 1,
              }}
            >
              <RenderHtmlMypge
                navigation={this.props.navigation}
                html={textDescription}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    );
  };
  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    const { maintain } = this.state;
    if (maintain) {
      return (
        <MaintainView
          onPress={async () => {
            this.state.loading = true;
            await this.getUserInfo(true);
            this.updateUser();
            this.setState({ loading: false });
          }}
        />
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <HeaderIconLeft goBack={goBack} navigation={navigation} />
        {this.renderContent()}
      </View>
    );
  }
}
