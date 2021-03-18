import AsyncStorage from "@react-native-community/async-storage";
import React, { PureComponent } from "react";
import { Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Loading } from "../../../commons";
import NumberWithLoading from "../../../commons/NumberWithLoading";
import { AppImage } from "../../../component/AppImage";
import {
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  keyAsyncStorage,
  managerAccount,
} from "../../../const/System";
import NavigationService from "../../../service/NavigationService";
import IconRun from "../../Account/item/IconRun";
import { Api } from "../../Account/util/api";
export class DetailUser extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      barcodeImageUrl: "",
      imageUrl: "",
      imageUrlpoint: 0,
      money: 0,
      textTimeUpdate: "",
      textDescription: "",
      setLoadingPointWhenReload: 0,
    };
  }

  componentDidMount() {
    //this.getInfoLocal();
    const { loading } = this.state;
    if (!loading) {
      this.setState({ loading: true });
    }
    this.reloadDetail();
    this.setState({ loading: false });
  }

  getInfoLocal = async () => {
    const barcodeImageUrl = await AsyncStorage.getItem(
      keyAsyncStorage.barcodeImageUrl
    );

    const imageUrl = await AsyncStorage.getItem(keyAsyncStorage.appImageUrl);
    const point = await AsyncStorage.getItem(keyAsyncStorage.pointOfUser);
    const money = await AsyncStorage.getItem(keyAsyncStorage.moneyOfUser);

    this.state.barcodeImageUrl = barcodeImageUrl != null ? barcodeImageUrl : "";
    this.state.imageUrl = imageUrl != null ? imageUrl : "";
    const numPoint = point == "null" || point == null ? 0 : parseInt(point);
    this.state.point = numPoint !== NaN ? numPoint : 0;
    const numMoney = money == "null" || money == null ? 0 : parseInt(money);
    this.state.money = numMoney !== NaN ? numMoney : 0;
  };
  reloadDetail = async () => {
    try {
      // if (!loading) {
      //   this.setState({ loading: true });
      // }

      const response = await Api.updateMyPage();
      this.state.setLoadingPointWhenReload++;
      if (response.code === 200 && response.res.status.code === 1000) {
        console.log("success new data ");
        const {
          money,
          point,
          barcodeImageUrl,
          certificateImage,
        } = response.res.data;

        this.state.point = Number.isInteger(point) ? point.toString() : "0";
        this.state.money = Number.isInteger(money) ? money.toString() : "0";
        this.state.barcodeImageUrl =
          barcodeImageUrl != null ? barcodeImageUrl : "";
        this.state.imageUrl = certificateImage != null ? certificateImage : "";

        AsyncStorage.setItem(keyAsyncStorage.moneyOfUser, this.state.money);
        AsyncStorage.setItem(keyAsyncStorage.pointOfUser, this.state.point);
        AsyncStorage.setItem(
          keyAsyncStorage.barcodeImageUrl,
          this.state.barcodeImageUrl
        );

        AsyncStorage.setItem(keyAsyncStorage.appImageUrl, this.state.imageUrl);
      } else {
        await getInfoLocal();
      }
      // this.setState({ loading: false });
    } catch (error) {
      await this.getInfoLocal();
      // this.setState({ loading: false });
    }
    this.forceUpdate();
  };

  renderLeft = () => {
    const { imageUrl } = this.state;
    return (
      <TouchableOpacity
        hitSlop={{ right: 0.3 * DEVICE_WIDTH }}
        onPress={() => {
          this.props.navigation.navigate("MY_PAGE");
        }}
        style={{ flexDirection: "row" }}
      >
        <AppImage
          resizeMode={"contain"}
          url={imageUrl}
          style={{
            width: 0.19 * DEVICE_WIDTH,
            height: 0.12 * DEVICE_WIDTH,
          }}
        />

        <View
          style={{
            height: 0.12 * DEVICE_WIDTH,
            justifyContent: "space-between",
            marginLeft: 0.04 * DEVICE_WIDTH,
          }}
        >
          <Text
            style={{
              color: "#1D1D1D",
              fontSize: 0.04 * DEVICE_WIDTH,
              fontWeight: "bold",
            }}
          >
            保有ポイント
          </Text>
          <Text style={{ color: "#636465", fontSize: 0.04 * DEVICE_WIDTH }}>
            プリカ残高
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  renderRight = () => {
    const { point, money, setLoadingPointWhenReload } = this.state;
    return (
      <View
        style={{
          height: 0.12 * DEVICE_WIDTH,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          alignContent: "space-between",
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            marginRight: 0.04 * DEVICE_WIDTH,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("MY_PAGE");
            }}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",

              justifyContent: "flex-end",
              minHeight: 0.07 * DEVICE_WIDTH,
            }}
          >
            <NumberWithLoading
              style={{
                color: "#1D1D1D",
                fontSize: 0.05 * DEVICE_WIDTH,
                fontWeight: "bold",
                marginRight: 10,
              }}
              setLoadingPointWhenReload={setLoadingPointWhenReload}
              value={point}
            />

            <Text
              style={{
                color: "#1D1D1D",
                fontSize: 0.04 * DEVICE_WIDTH,
                fontWeight: "bold",
              }}
            >
              pt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("MY_PAGE");
            }}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              minHeight: 0.07 * DEVICE_WIDTH,
            }}
          >
            <NumberWithLoading
              style={{
                color: "#636465",
                fontSize: 0.05 * DEVICE_WIDTH,
                marginRight: 10,
              }}
              setLoadingPointWhenReload={setLoadingPointWhenReload}
              value={money}
            />

            <Text style={{ color: "#636465", fontSize: 0.04 * DEVICE_WIDTH }}>
              円
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={this.reloadDetail}>
          <Image
            source={require("../images/reload.png")}
            resizeMode="contain"
            style={{
              width: 0.063 * DEVICE_WIDTH,
              height: 0.063 * DEVICE_WIDTH,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { loading, barcodeImageUrl } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (!!managerAccount.memberCode) {
      return (
        <View
          style={{
            paddingHorizontal: 0.0186 * DEVICE_WIDTH,
            paddingVertical: 0.04 * DEVICE_WIDTH,
            backgroundColor: "#FFFFFF",
            marginTop: 11,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            {this.renderLeft()}
            {this.renderRight()}
          </View>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("MY_PAGE");
            }}
            style={{
              marginTop: 18,
              alignItems: "center",
              width: "100%",
            }}
          >
            <IconRun />

            <AppImage
              resizeMode={"cover"}
              url={barcodeImageUrl}
              style={{
                width: 0.67 * DEVICE_WIDTH,
                height: 0.14 * DEVICE_WIDTH,
              }}
            />

            <Text
              style={{
                marginVertical: 6,
                color: "#1D1D1D",
                fontSize: 0.033 * DEVICE_WIDTH,
                letterSpacing: 1,
                fontWeight: "700",
              }}
            >
              {managerAccount.memberCode.substring(0, 4) +
                " " +
                managerAccount.memberCode.substring(4, 8) +
                " " +
                managerAccount.memberCode.substring(8, 12) +
                " " +
                managerAccount.memberCode.substring(12, 16)}
            </Text>
            <Text style={{ color: "#DC0E27", fontSize: 0.03 * DEVICE_WIDTH }}>
              読み取りにくい場合はバーコードをタップしてください
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View
        style={{
          paddingHorizontal: 0.053 * DEVICE_WIDTH,
          paddingVertical: 0.064 * DEVICE_WIDTH,
          backgroundColor: "#FFFFFF",
          marginTop: 11,
          alignItems: "center",
          minHeight: 0.49 * DEVICE_WIDTH,
        }}
      >
        <Text
          style={{
            fontSize: 0.043 * DEVICE_WIDTH,
            color: "#DC0E27",
            fontWeight: "700",
          }}
        >
          Aocaが未連携です
        </Text>
        <Text
          style={{
            paddingTop: 5,
            paddingBottom: 25,
            fontSize: 0.032 * DEVICE_WIDTH,
            color: "#1D1D1D",
            lineHeight: 0.045 * DEVICE_WIDTH,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Aocaを連携すると、バーコードの読み取りと保有ポイントおよびプリカの残高が確認できるようになります
        </Text>
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate("EnterMemberCodeScreen");
          }}
          style={{
            borderRadius: 3,
            justifyContent: "center",
            alignItems: "center",
            width: 0.64 * DEVICE_WIDTH,
            height: 0.12 * DEVICE_WIDTH,
            backgroundColor: "#EF1E2A",
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../images/rectangle.png")}
            resizeMode="contain"
            style={{
              height: 0.06 * DEVICE_WIDTH,
              width: 0.06 * DEVICE_WIDTH,
            }}
          />
          <Text
            style={{
              fontSize: 0.043 * DEVICE_WIDTH,
              textAlign: "center",
              color: "#FFFFFF",
            }}
          >
            {"  "}Aocaを連携する
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default DetailUser;
