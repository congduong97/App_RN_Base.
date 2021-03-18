import React, { Component } from "react";
import { Text, View, Alert, Linking, TouchableOpacity } from "react-native";
import {
  managerAccount,
  isIOS,
  DEVICE_WIDTH,
  getWidthInCurrentDevice,
  API_KEY_YOUTUBE,
} from "../../../const/System";
import { STRING } from "../../../const/String";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { AppImage } from "../../../component/AppImage";
import { Api } from "../util/api";
import SliderHomeService from "../util/SliderHomeService";
import Modal from "react-native-modal";
import Orientation from "react-native-orientation";
import {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from "react-native-youtube";
import { getIDWithLinkYouTube } from "../../Video/util/youtubeService";
export default class SliderItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listPkikakuHasCoupon: this.props.listPkikakuHasCoupon,
      isModalVisible: false,
    };
  }
  componentDidMount() {
    // SliderHomeService.onChange("slider", (idKikaku) => {
    //   this.deleteIdKikakuInListPkikakuHasCoupon(idKikaku);
    // });
  }
  // deleteIdKikakuInListPkikakuHasCoupon = (idKikaku) => {
  //   const { listPkikakuHasCoupon } = this.state;
  //   console.log("listPkikakuHasCoupon", listPkikakuHasCoupon);
  //   let index = listPkikakuHasCoupon.indexOf(idKikaku);
  //   if (index > -1) {
  //     console.log(" idKikaku", idKikaku);
  //     console.log(" listPkikakuHasCoupon.splice(index, 1);", index);
  //     const arr = listPkikakuHasCoupon.splice(index, 1);
  //     console.log(arr, "arr");
  //     console.log([...listPkikakuHasCoupon], "[...listPkikakuHasCoupon]");

  //     this.setState({
  //       listPkikakuHasCoupon: [...listPkikakuHasCoupon],
  //     });
  //   }
  // };
  componentDidUpdate(prevProps) {
    if (
      this.props.listPkikakuHasCoupon.join("") !==
      prevProps.listPkikakuHasCoupon.join("")
    ) {
      this.setState({
        listPkikakuHasCoupon: this.props.listPkikakuHasCoupon,
      });
    }
  }

  clickSlider = async (id) => {
    try {
      const response = await Api.sliderImage(id);
    } catch (error) {}
  };
  checkAvailable = async (pKikakuId) => {
    const res = await Api.getListPkikakuHasCoupon();
    console.log("pi.getListPkikakuHasCoupon", res);
    if (res.code === 200 && res.res.status.code === 1000) {
      const arrKikaku = [...res.res.data];
      return arrKikaku.includes(pKikakuId);
    }
  };

  onPressSlider = async () => {
    const { item } = this.props;

    const { isVisibleModal, navigation } = this.props;
    const { listPkikakuHasCoupon } = this.state;
    this.clickSlider(item.id);
    if (item.typeOpen === 1 && item.link) {
      if (item.typeOpenLink == 1) {
        if (item.link.includes(".pdf") && !isIOS) {
          navigation.navigate("PDF", { linkPDF: `${item.link}` });
        } else {
          navigation.navigate("WEB_VIEW", { url: item.link });
        }
      } else {
        Linking.openURL(item.link);
      }
    } else if (item.typeOpen === 2) {
      OpenMenu(item.menuEntity, navigation);
    } else if (item.typeOpen === 4) {
      //Loại video có coupon:
      if (item.pKikakuId) {
        //Kiểm tra Login:
        if (managerAccount.userId) {
          // Xem hết nhận được coupon:
          if (listPkikakuHasCoupon.includes(item.pKikakuId)) {
            if (await this.checkAvailable(item.pKikakuId)) {
              SliderHomeService.setId(item.pKikakuId);
              const itemVideo = {
                linkYoutube: item.linkYoutube,
                timeVideo: item.duration,
                pKikakuId: item.pKikakuId,
                numberDayCanUseCoupon: item.numberDayCanUseCoupon,
              };
              isVisibleModal(itemVideo);
            } else {
              SliderHomeService.updateItem();
              this.visibleModal();
            }
          } else {
            this.playVideoNormal(item.linkYoutube);
          }
        } else {
          Alert.alert(
            STRING.notification,
            STRING.please_login_to_use,
            [
              {
                text: STRING.cancel,
                onPress: () => {},
                style: "cancel",
              },
              {
                text: STRING.ok,
                onPress: () => {
                  navigation.navigate("EnterMemberCodeScreen");
                },
              },
            ],
            { cancelable: false }
          );
        }
      } else {
        this.playVideoNormal(item.linkYoutube);
      }
    }
  };
  //chay video bt
  playVideoNormal = (link) => {
    if (isIOS) {
      console.log(link, "link IOS");
      Orientation.unlockAllOrientations();
      YouTubeStandaloneIOS.playVideo(getIDWithLinkYouTube(link));
      try {
        Orientation.lockToPortrait();
      } catch (errorMessage) {}
    } else {
      console.log(link, "link android");
      YouTubeStandaloneAndroid.playVideo({
        apiKey: API_KEY_YOUTUBE, // Your YouTube Developer API Key
        videoId: getIDWithLinkYouTube(link), // YouTube video ID
        autoplay: true, // Autoplay the video
        startTime: 0, // Starting point of video (in seconds)
      });
    }
  };
  //Hiển thị Modal:
  visibleModal = () => {
    this.setState({
      isModalVisible: true,
    });
  };
  // Ẩn Modal
  unVisibleModal = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  playVideo = () => {
    const { item } = this.props;
    this.unVisibleModal();
    setTimeout(() => {
      this.playVideoNormal(item.linkYoutube);
    }, 1000);
  };
  setUpUrlImage = () => {
    const { item } = this.props;
    const { listPkikakuHasCoupon } = this.state;

    if (item.typeOpen !== 4) {
      return item.url;
    } else {
      if (listPkikakuHasCoupon.includes(item.pKikakuId)) {
        return item.url;
      } else {
        return item.thumbnailWhenNotRemainCoupon;
      }
    }
  };
  renderModalCouponReceived = () => {
    const { isModalVisible } = this.state;
    return (
      <Modal
        deviceWidth={getWidthInCurrentDevice(375)}
        isVisible={isModalVisible}
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            alignItems: "center",
            borderRadius: 2,
            paddingTop: 20,
            paddingBottom: 50,
          }}
        >
          <Text
            style={{
              marginHorizontal: getWidthInCurrentDevice(22),
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
            }}
          >
            {STRING.play_video_again}
          </Text>
          <Text
            style={{
              marginHorizontal: getWidthInCurrentDevice(22),
              fontSize: 18,
              marginTop: 30,
              color: "black",
            }}
          >
            {STRING.content_not_has_coupon}
          </Text>

          <TouchableOpacity
            onPress={this.unVisibleModal}
            style={{
              height: 50,
              width: "90%",
              marginTop: 10,
              backgroundColor: "white",
              borderWidth: 2,
              borderColor: "red",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <Text
              style={{
                margin: getWidthInCurrentDevice(6),
                fontSize: 18,
                color: "black",
              }}
            >
              {STRING.close_modal_video_coupon}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };
  render() {
    const { item } = this.props;
    const { listPkikakuHasCoupon } = this.state;

    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => this.onPressSlider()}
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_WIDTH * (9 / 16),
          }}
        >
          <AppImage
            url={this.setUpUrlImage()}
            style={{ width: "100%", height: "100%" }}
            resizeMode={"cover"}
          />
        </TouchableOpacity>
        {this.renderModalCouponReceived()}
      </View>
    );
  }
}
