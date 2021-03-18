import React, { PureComponent } from "react";
import { Text, TouchableWithoutFeedback, View, ScrollView } from "react-native";
import AutoHeightWebView from "react-native-autoheight-webview";
import AntDesign from "react-native-vector-icons/AntDesign";
import HTML from "react-native-render-html";

import ModalUse from "../item/ModalUse";
import Modal from "react-native-modal";

import ItemListCoupon from "../item/ItemListCoupon";
import { HeaderIconLeft, ButtonTypeOne } from "../../../commons";
import { couponService } from "../util/service";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../../../const/System";
import { Clock } from "../item/Clock";
import MaintainView from "../../../commons/MaintainView";

class CouponsSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listCoupon: [],
      isModalVisible: false,
      appState: "active",
      isMaintain: false,
    };
  }
  componentDidMount() {
    const { navigation } = this.props;
    const { used } = this.state;

    const onlyView = navigation.getParam("onlyView", false);
    if (onlyView || used) {
      navigation.getScreenProps().setMaxBrightness();
    }
    let listCoupon = navigation.getParam("coupon", []);
    if (listCoupon.length === 0) {
      listCoupon = couponService.getListCoupon();
    }

    this.setState({ listCoupon });
    couponService.regisSelectScreen(() => {
      if (couponService.getListCoupon().length === 0) {
        this.props.navigation.goBack();
      } else {
        this.setState({ listCoupon: couponService.getListCoupon() });
      }
    });
  }
  componentWillUnmount() {
    if (this.countDownTimeout) clearTimeout(this.countDownTimeout);
    if (this.useCouponFailedTimeout) clearTimeout(this.useCouponFailedTimeout);
  }
  handleAppStateChange = (nextAppState) => {
    let { limitTime } = couponService.getConfig();
    const { listCoupon, used, appState } = this.state;
    if (appState === "background" && used) {
      let coupon;
      for (let i = 0; i < listCoupon.length; i++) {
        const element = listCoupon[i];
        if (element.usagePolicy !== "COUNTLESS_TIME") {
          coupon = element;
        }
      }
    }
    this.state.appState = nextAppState;
  };

  goBack = () => {
    this.props.navigation.goBack();
  };

  onPressUseCoupon = () => {
    this.modalRef.showModal("");
  };
  onUse = () => {
    //set brightness when using coupon
    const { navigation } = this.props;
    navigation.getScreenProps().setMaxBrightness();

    let newList = this.state.listCoupon.map((coupon) => {
      const now = new Date();
      return { ...coupon, countDownStart: now };
    });

    //make callback to hide using coupon button at CouponScreen
    const onUseCoupon = navigation.getParam("onUseCoupon");
    if (onUseCoupon) onUseCoupon();
    this.setState({
      listCoupon: [...newList],
      used: true,
    });
  };
  onUseFailed = () => {
    this.useCouponFailedTimeout = setTimeout(() => {
      this.setState({ isModalVisible: true });
    }, 1000);
  };
  onCloseModal = () => {
    this.setState({ isModalVisible: false });
    this.goBack();
  };
  renderCoupon = (coupon, index) => {
    const { used } = this.state;
    const { navigation } = this.props;
    const onlyView = navigation.getParam("onlyView", false);
    console.log("[ coupon ]", coupon);
    return (
      <ItemListCoupon
        key={`${coupon.id}`}
        coupon={coupon}
        initialShowBarcode={used || onlyView}
        isSelect
        screen={"CouponSelected"}
      />
    );
  };
  renderTitle = () => {
    const { used } = this.state;
    const { navigation } = this.props;
    const onlyView = navigation.getParam("onlyView", false);
    if (onlyView) {
      return (
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
          >
            {`クーポンバーコードを\nお会計時にご提示ください`}
          </Text>
          <View
            style={{
              width: DEVICE_WIDTH * 0.7,
              marginVertical: 4,
              height: 4,
              backgroundColor: "rgb(252,13,27)",
            }}
          />
        </View>
      );
    }
    if (used) {
      return (
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
          >
            {`クーポンバーコードを\nお会計時にご提示ください`}
          </Text>
          <View
            style={{
              width: DEVICE_WIDTH * 0.7,
              marginVertical: 4,
              height: 4,
              backgroundColor: "rgb(252,13,27)",
            }}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          marginTop: 20,
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          まとめてクーポン確認
        </Text>
        <View
          style={{
            width: DEVICE_WIDTH * 0.7,
            marginVertical: 4,
            height: 4,
            backgroundColor: "rgb(252,13,27)",
          }}
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: "rgb(252,13,27)",
            padding: 5,
            marginHorizontal: 16,
          }}
        >
          <Text style={{ fontSize: 14 }}>
            まとめてバーコードを表示するクーポンをご確認ください。次の画面でバーコードが表示されます。
          </Text>
        </View>
      </View>
    );
  };
  renderDescription = () => {
    const { navigation } = this.props;
    const onlyView = navigation.getParam("onlyView", false);
    if (onlyView) {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#E0E0E0",
            width: DEVICE_WIDTH - 10,
            margin: 5,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text>
            何回でも利用可能なクーポンを本画面に表示する場合は一覧から選択してください。
          </Text>
        </View>
      );
    }
    return null;
  };
  renderNote = () => {
    const { used } = this.state;
    const { navigation } = this.props;
    const onlyView = navigation.getParam("onlyView", false);

    if (used || onlyView) {
      return (
        <HTML
          html={couponService.getConfig().note}
          //width - padding - margin
          imagesMaxWidth={DEVICE_WIDTH - 40 - 10}
          containerStyle={{
            borderWidth: 1,
            borderColor: "#E0E0E0",
            width: DEVICE_WIDTH - 10,
            margin: 5,
            paddingVertical: 5,
            paddingHorizontal: 20,
          }}
          baseFontStyle={{
            fontSize: 14,
          }}
        />
      );
    }
    return null;
  };
  getMaintain = (isMaintain) => {
    console.log(isMaintain, "this.modalRef.getMainTain()");
    this.setState({
      isMaintain: isMaintain,
    });
  };
  renderFooter = () => {
    const { used } = this.state;
    const { navigation } = this.props;
    const onlyView = navigation.getParam("onlyView", false);

    if (used || onlyView) {
      return (
        <View style={{ marginHorizontal: 20, alignItems: "center" }}>
          <Clock style={{ marginVertical: 8 }} />

          <ButtonTypeOne
            name={"クーポン一覧へ戻る"}
            style={{
              marginTop: 0,
              marginBottom: 20,
            }}
            onPress={this.goBack}
          />
        </View>
      );
    }

    return (
      <View style={{ marginHorizontal: 20 }}>
        <ButtonTypeOne
          name={"クーポンをまとめて利用する"}
          style={{
            marginTop: 0,
            marginBottom: 20,
          }}
          onPress={this.onPressUseCoupon}
        />
      </View>
    );
  };
  render() {
    let { listCoupon, isModalVisible, isMaintain } = this.state;
    if (isMaintain) {
      return (
        <MaintainView
          onPress={() => {
            this.setState({
              isMaintain: false,
            });
          }}
        />
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ModalUse
          onUse={this.onUse}
          onUseFailed={this.onUseFailed}
          coupons={listCoupon}
          onRef={(elem) => (this.modalRef = elem)}
          limitTime={couponService.getConfig().limitTime}
          getMaintain={this.getMaintain}
        />
        <HeaderIconLeft goBack={this.goBack} />
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          {this.renderTitle()}
          {listCoupon.map((coupon, index) => this.renderCoupon(coupon, index))}
          {this.renderDescription()}
          {this.renderNote()}
        </ScrollView>
        {this.renderFooter()}
        <Modal
          isVisible={isModalVisible}
          // isVisible
          backdropOpacity={0.6}
          onBackdropPress={this.onCloseModal}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              height: DEVICE_HEIGHT * 0.3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <TouchableWithoutFeedback onPress={this.onCloseModal}>
                <AntDesign name={"close"} size={30} />
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                クーポン内容に変更がありました。再度、クーポン一覧からご選択をお願いします。
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <ButtonTypeOne
                name={"クーポン一覧へ戻る"}
                style={{ borderRadius: null, width: "90%" }}
                onPress={this.onCloseModal}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default CouponsSelect;
