import React, { PureComponent } from "react";
import {
  View,
  findNodeHandle,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import HTML from "react-native-render-html";

import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { HeaderIconLeft, ButtonTypeOne } from "../../../commons";
import ModalUse from "../item/ModalUse";
import ItemCouponDetail from "../item/ItemCouponDetail";
import { couponService } from "../util/service";
import { Api } from "../util/api";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../../../const/System";
import { Clock } from "../item/Clock";
import MaintainView from "../../../commons/MaintainView";

export default class DetailCoupon extends PureComponent {
  constructor(props) {
    super(props);
    let coupon = props.navigation.getParam("coupon");

    this.state = {
      coupon,
      isModalVisible: false,
      isMaintain: false,
    };
    this.active = true;
  }

  goBack = () => {
    this.props.navigation.goBack(null);
  };

  showModal = () => {
    this.modalRef.showModal("");
  };
  getMaintain = (isMaintain) => {
    console.log(isMaintain, "this.modalRef.getMainTain()");
    this.setState({
      isMaintain: isMaintain,
    });
  };
  onCloseModal = async () => {
    this.setState({ isModalVisible: false });
    const { navigation } = this.props;
    navigation.navigate("NEW_COUPON");
  };

  componentDidMount() {
    const { coupon } = this.state;
    //set max brightness when showing barcode
    const { countDownStart, barCodeUrl, usagePolicy } = coupon;
    if (
      barCodeUrl &&
      ((usagePolicy === "COUNTLESS_TIME" && coupon.usedCountlessTime) ||
        countDownStart)
    ) {
      this.setMaxBrightness();
    }

    Api.countTimeDetail(coupon.id);
  }
  componentWillUnmount() {
    this.active = false;
    // if (this.brightnessTimeOut) clearTimeout(this.brightnessTimeOut);
  }
  setMaxBrightness = () => {
    //set max brightness when showing barcode
    const { navigation } = this.props;
    navigation.getScreenProps().setMaxBrightness();
  };
  onUse = () => {
    this.setMaxBrightness();
    const { navigation } = this.props;

    //make callback to hide using one time coupon button at CouponScreen
    const { coupon } = this.state;
    if (coupon.usagePolicy !== "COUNTLESS_TIME") {
      const onUseCoupon = navigation.getParam("onUseCoupon");
      if (onUseCoupon) onUseCoupon();
    }

    coupon.countDownStart = new Date();
    coupon.usedTime = new Date();
    // coupon.used = true;

    this.setState(
      {
        coupon: { ...coupon },
      },
      //scroll to barcode element
      () => {
        this.scrollView.scrollTo(findNodeHandle(this.barcodeTaget));
      }
    );
  };

  onCountDownDone = () => {
    if (this.active) {
      if (!this.state.isModalVisible) {
        this.setState({ isModalVisible: true });
      }
    }
  };
  onPressBackToCoupon = () => {
    const { navigation } = this.props;
    navigation.navigate("NEW_COUPON");
  };
  onBarcodeLayout = (e) => {
    //save tagget of element above bacode
    this.barcodeTaget = e.target;
  };

  onUseFailed = () => {
    this.useCouponFailedTimeout = setTimeout(() => {
      this.setState({ isModalUseFailedVisible: true });
    }, 1000);
  };
  onCloseModalUseFailed = () => {
    this.setState({ isModalUseFailedVisible: false });
    const { navigation } = this.props;
    navigation.navigate("NEW_COUPON");
  };
  renderFooter = () => {
    const { coupon } = this.state;
    if (coupon.used || coupon.countDownStart) {
      return (
        <ButtonTypeOne
          name={"クーポン一覧へ戻る"}
          style={{
            marginBottom: 20,
            // marginHorizontal: 10,
            width: DEVICE_WIDTH * 0.9,
            alignSelf: "center",
            marginTop: 4,
          }}
          onPress={this.onPressBackToCoupon}
        />
      );
    }
    return (
      <ButtonTypeOne
        name={"クーポンを利用する"}
        style={{
          marginBottom: 20,
          width: DEVICE_WIDTH * 0.9,
          alignSelf: "center",
          marginTop: 4,
        }}
        onPress={this.showModal}
      />
    );
  };
  renderClock = () => {
    const { coupon } = this.state;
    if (coupon.countDownStart) {
      return <Clock style={{ marginVertical: 8 }} />;
    }
    return null;
  };
  renderContent() {
    const { coupon, isModalUseFailedVisible } = this.state;
    const limitTime = couponService.getConfig().limitTime;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={(ref) => {
            this.scrollView = ref;
          }}
        >
          <ItemCouponDetail
            coupon={coupon}
            onCountDownDone={this.onCountDownDone}
            onBarcodeLayout={this.onBarcodeLayout}
          />
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
        </ScrollView>
        {this.renderClock()}
        {this.renderFooter()}

        <ModalUse
          onUseFailed={this.onUseFailed}
          onUse={this.onUse}
          coupons={[coupon]}
          onRef={(elem) => (this.modalRef = elem)}
          limitTime={limitTime}
          getMaintain={this.getMaintain}
        />
        {/* when used coupon failed */}
        <Modal
          isVisible={isModalUseFailedVisible}
          // isVisible
          backdropOpacity={0.6}
          onBackdropPress={this.onCloseModal}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              minHeight: DEVICE_HEIGHT * 0.3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <TouchableWithoutFeedback onPress={this.onCloseModalUseFailed}>
                <AntDesign name={"close"} size={30} />
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                // flex: 1,
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "red"
              }}
            >
              <Text
                style={{
                  // textAlign: "center",
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
                onPress={this.onCloseModalUseFailed}
              />
            </View>
          </View>
        </Modal>
        {/* when countdown done */}
        <Modal
          isVisible={this.state.isModalVisible}
          // isVisible
          backdropOpacity={0.6}
          onBackdropPress={this.onCloseModal}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 16,
              // alignItems: "center",
              // justifyContent: "center",
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
                クーポン利用可能時間を経過しました。
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  render() {
    if (this.state.isMaintain) {
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
        <HeaderIconLeft goBack={this.goBack} />
        {this.renderContent()}
      </View>
    );
  }
}
