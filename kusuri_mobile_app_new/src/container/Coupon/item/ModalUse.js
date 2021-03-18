import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import Modal from "react-native-modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import { withNavigation } from "react-navigation";

import { couponService } from "../util/service";
import { ButtonTypeOne } from "../../../commons";
import { Api } from "../util/api";

class ModalUse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      listCouponSelect: [],
    };
    this.data = {
      useCouponErrorMessage: "",
    };
  }
  componentWillUnmount() {
    if (this.alertTimeOut) {
      clearTimeout(this.alertTimeOut);
    }
  }
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };

  showModal = (id) => {
    this.setState({ isModalVisible: true, listCouponSelect: id });
  };

  onUseModal = async () => {
    this.setState({ isModalVisible: false });
    await this.useCoupons();
  };
  onModalHide = () => {
    const { useCouponErrorMessage } = this.data;
    // console.log("onModalHide", useCouponErrorMessage);

    if (useCouponErrorMessage) {
      this.alertTimeOut = setTimeout(() => {
        alert(useCouponErrorMessage);
      }, 1000);
    }
  };
  onModalShow = () => {
    this.data = {
      useCouponErrorMessage: "",
    };
  };
  useCoupons = async () => {
    const { coupons, onUseFailed, onUse, getMaintain } = this.props;
    try {
      const couponIds = coupons.map((item) => {
        return item.id;
      });
      const result = await Api.useCoupon(couponIds);
      console.log("useCoupons", result);
      if (result.code !== 502 && getMaintain) {
        getMaintain(false);
      }
      if (result.code === 200 && result.res.status.code === 1000) {
        if (onUse) onUse();
        couponService.useCoupon(this.props.coupons);
      } else if (result.code === 200 && result.res.status.code === 1033) {
        if (onUseFailed) onUseFailed(result.res.data);
        couponService.removeExpiredCoupon(result.res.data);
      } else if (result.code === 502 && getMaintain) {
        getMaintain(true);
        return;
      } else {
        this.data = {
          useCouponErrorMessage: "クーポンが利用できません。",
        };
      }
      // console.log("useCoupons", result);
    } catch (error) {}
  };

  render() {
    const { isModalVisible } = this.state;
    return (
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={this.closeModal}
        onBackButtonPress={this.closeModal}
        onModalHide={this.onModalHide}
        onModalShow={this.onModalShow}
        backdropOpacity={0.6}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingHorizontal: 5,
            paddingVertical: 10,
          }}
        >
          <View style={styles.headerModal}>
            <Text style={{ color: "red", fontWeight: "bold", fontSize: 16 }}>
              ご注意
            </Text>
            <View style={{ position: "absolute", right: 8 }}>
              <TouchableWithoutFeedback onPress={this.closeModal}>
                <AntDesign name={"close"} size={30} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "red", padding: 12 }}>
            <Text style={{ fontWeight: "500" }}>
              「クーポンを利用する」をクリックから
              <Text style={{ color: "red" }}>
                {this.props.limitTime}
                分間クーポンバーコードの再表示
              </Text>
              が可能です。{"\n"}
              <Text style={{ color: "red" }}>
                ※期間中何回でも利用できるクーポンは時間制限はありません。
              </Text>
            </Text>
          </View>
          <View style={styles.footerModal}>
            <View style={{ marginTop: 15, width: "90%" }}>
              {/* <Text>クーポンを利用しますか？</Text> */}
              <Text style={{ fontWeight: "500" }}>
                クーポンを利用しますか？{`\n`}
                次画面でクーポンバーコードが表示されますのでお会計時にご提示ください。
              </Text>
            </View>
            <ButtonTypeOne
              name={"クーポンを利用する"}
              style={{ borderRadius: null, width: "90%" }}
              onPress={this.onUseModal}
            />
            <ButtonTypeOne
              onPress={this.closeModal}
              name={"キャンセル"}
              style={{
                borderRadius: null,
                width: "90%",
                backgroundColor: "white",
                borderColor: "black",
                borderWidth: 1,
                marginTop: 0,
              }}
              styleText={{ color: "black" }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  headerModal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  footerModal: {
    alignItems: "center",
  },
});

export default withNavigation(ModalUse);
