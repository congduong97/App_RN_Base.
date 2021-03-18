import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
  ScrollView,
  Image,
} from "react-native";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "../../../const/System";
import {
  COLOR_ORANGE,
  COLOR_BLUE,
  COLOR_RED,
  COLOR_BLACK,
  APP_COLOR,
  COLOR_WHITE,
  COLOR_GRAY,
} from "../../../const/Color";
import HeaderIconLeft from "../../../commons/HeaderIconLeft";
import { ButtonTypeOne } from "../../../commons";
import { Api } from "../util/api";
import { couponService, MenuCouponAddPointHasNew } from "../util/service";

export default class CouponAddPointScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  openPDF = (linkPDF) => () => {
    this.props.navigation.navigate("PDF", {
      linkPDF,
    });
  };

  openLinkWeb = () => {
    this.addCouponPlus();
  };

  onPressNavigationPage = () => {
    const { navigation } = this.props;
    navigation.navigate("WEB_VIEW", {
      url: "https://app.kusuri-aoki.co.jp/html/TermsOfService.php",
    });
    // Linking.openURL("https://app.kusuri-aoki.co.jp/html/TermsOfService.php");
  };

  addCouponPlus = async () => {
    Linking.openURL(
      "https://app.kusuri-aoki.co.jp/html/Index.php?id=apl"
    ).catch((e) => {
      // console.log("addCouponPlus", e);
    });
    let res = await Api.addCouponPlus();
    // console.log("addCouponPlus", res);
    if (res.code === 200 && res.res.status.code === 1000) {
      couponService.setIsAddPlusCoupon(true);
      //call api success
      MenuCouponAddPointHasNew.set();
    }
    // else {
    //   alert("クーポンを追加できません");
    // }
  };
  // onPressCheckBox = () => {
  //   this.setState({
  //     isChecked: !this.state.isChecked
  //   });
  // };

  render() {
    const { isChecked } = this.state;
    return (
      <View style={styles.container}>
        <HeaderIconLeft goBack={this.goBack} />
        <ScrollView
        //  contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={{ alignItems: "center" }}>
            <ImageBackground
              imageStyle={{
                resizeMode: "cover",
                borderRadius: 4,
                padding: 16,
                width: "100%",
                height: "100%",
              }}
              source={{
                uri: "https://app.kusuri-aoki.co.jp/img/headerBG.jpg",
              }}
              style={styles.imageHeaderCoupon}
            >
              <View style={styles.blurImage}>
                <Text
                  style={{ fontSize: 13, width: "100%", textAlign: "center" }}
                >
                  クスリのアオキ処方せん受付
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 16, marginVertical: 16 }}>
              ご利用にあたり
            </Text>
            <Text>1. お薬を受け取る際は処方せん原本が必要です。</Text>
            <Text>
              2.
              処方せんが発行されてから4日以内に受け取りにきてください。発行日から5日以上経った処方せんは無効となります。
            </Text>
            <Text>
              3.
              処方せん送信はいつでも可能ですが、受け取りは各調剤店の受付時間内となります。
            </Text>
          </View>
          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-start",
              left: 16,
            }}
          >
            <TouchableWithoutFeedback
              onPress={this.openPDF(
                "https://app.kusuri-aoki.co.jp/pdf/howto.pdf"
              )}
            >
              <View style={[styles.exportPdf, { color: APP_COLOR.COLOR_TEXT }]}>
                <Text
                  style={{
                    color: COLOR_BLUE,
                    textDecorationLine: "underline",
                    textDecorationColor: COLOR_BLUE,
                  }}
                >
                  ご利用の流れ
                </Text>
                <Image
                  style={{ width: 20, height: 20, marginLeft: 5 }}
                  source={{
                    uri:
                      "https://www.muprint.com/wp-content/uploads/2018/03/pdf-icon-png-pdf-zum-download-2.png",
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {/* <Text
            style={{
              marginLeft: 18,
              fontSize: 14,
              fontWeight: "bold",
              marginTop: 8
            }}
          >
            利用規約の同意いただいた上でご利用ください。
          </Text> */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 11,
            }}
          >
            <Text
              style={{
                color: COLOR_BLUE,
                textDecorationLine: "underline",
                textDecorationColor: COLOR_BLUE,
                fontSize: 16,
                paddingVertical: 16,
              }}
              onPress={this.onPressNavigationPage}
            >
              利用規約はこちら
            </Text>
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 14,
            }}
          >
             <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                borderWidth: 2,
                borderColor: COLOR_BLACK,
                justifyContent: "center",
                alignItems: "center"
              }}
              onPress={this.onPressCheckBox}
            >
              {isChecked ? (
                <Image
                  source={require("../images/checkTrue.png")}
                  style={{ width: 15, height: 15 }}
                />
              ) : null}
            </TouchableOpacity> 
             <Text style={{ paddingLeft: 5, fontWeight: "bold" }}>
              利用規約に同意する
            </Text> 
          </View> */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 13,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              // disabled={isChecked ? false : true}
              style={{
                justifyContent: "center",
                backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                alignItems: "center",
                width: "80%",
              }}
              onPress={this.openLinkWeb}
            >
              <Text
                style={{
                  paddingVertical: 16,
                  color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1,
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                利用規約に同意して送信する
              </Text>
            </TouchableOpacity>
          </View>
          {/* <ButtonTypeOne
            onPress={this.openLinkWeb}
            name={"同意して処方せんを送信する"}
            style={styles.openCoupon}
          ></ButtonTypeOne> */}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageHeaderCoupon: {
    width: DEVICE_WIDTH - 32,
    height: DEVICE_HEIGHT / 4.5,
  },
  blurImage: {
    // backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  exportPdf: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#EA9999",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  openCoupon: {
    marginTop: 30,
    width: DEVICE_WIDTH / 1.4,
    padding: 10,
    borderRadius: null,
  },
});
