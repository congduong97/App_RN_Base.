import React, { PureComponent } from "react";
import {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  COLOR_RED_LIGHT,
  APP_COLOR,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  isIOS,
  API_KEY_YOUTUBE,
  styleInApp,
  managerAccount,
} from "../../../const/System";
import { getTimeFomartDDMMYY } from "../../../util";
import {
  getImageWithLinkYouTube,
  getIDWithLinkYouTube,
} from "../util/youtubeService";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppImage } from "../../../component/AppImage";
import Icon from "react-native-vector-icons/Ionicons";
import { Api } from "../util/api";

import {
  YouTubeStandaloneIOS,
  YouTubeStandaloneAndroid,
} from "react-native-youtube";
import Orientation from "react-native-orientation";
import { TextTime } from "../../../component/TextTime/TextTime";
import NavigationService from "../../../service/NavigationService";
// import console = require('console');
import { Api as ApiHome } from "../../Home/util/api";
export class ItemVideo extends PureComponent {
  checkAvailable = async (pKikakuId) => {
    const res = await ApiHome.getListPkikakuHasCoupon();
    console.log("ress ApiHome.getListPkikakuHasCoupon()",res)
    if (res.code === 200 && res.res.status.code === 1000) {
      const arrKikaku = [...res.res.data];
      console.log(arrKikaku.includes(pKikakuId),"arrKikaku.includes(pKikakuId)"); 
      return arrKikaku.includes(pKikakuId);
    }
  };
  onPressVideo = async () => {
    const { data } = this.props;
    // if (managerAccount.userId && video.hasCoupon) {
    // } else {
    try {
      const response = await Api.countVideoClicked(data.id);
    } catch (error) {}
    if (data.pKikakuId == null) {
        this.playVideoNormal(data.url)

    } else {
      this.openVideoCoupon();
    }
  };
  openVideoCoupon = async() => {
    var { data, showAlertNotLogin, isVisibleModal } = this.props;
    if (managerAccount.userId) {
      if (await this.checkAvailable(data.pKikakuId)) {
        console.log("DAsdsadsdasdadsadsa")
        isVisibleModal(data);
      } else {
        this.playVideoNormal(data.url)
      }
    } else {
      showAlertNotLogin();
    }
  };
  //chay video bt
  playVideoNormal = (link) => {
    if (isIOS) {
      Orientation.unlockAllOrientations();
      YouTubeStandaloneIOS.playVideo(getIDWithLinkYouTube(link));
      try {
        Orientation.lockToPortrait();
      } catch (errorMessage) {}
    } else {
      YouTubeStandaloneAndroid.playVideo({
        apiKey: API_KEY_YOUTUBE, // Your YouTube Developer API Key
        videoId: getIDWithLinkYouTube(link), // YouTube video ID
        autoplay: true, // Autoplay the video
        startTime: 0, // Starting point of video (in seconds)
      });
    }
  };
  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onPressVideo}
        activeOpacity={0.8}
        style={[
          styles.wrapperCard,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <View style={styles.wrapperImageAvatarVideo}>
          <AppImage
            url={getImageWithLinkYouTube(data.url)}
            style={styles.imageAvatarVideo}
            resizeMode={"cover"}
            notDomain
          />
          <View
            style={[
              styles.wrapperImageAvatarVideo,
              {
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Icon
              name={"logo-youtube"}
              size={70}
              style={{}}
              color={COLOR_RED_LIGHT}
            />
          </View>
        </View>
        <View style={styles.wrapperTextVideo}>
          <Text style={styleInApp.title}>{data.newName}</Text>
          {/* <TextTime time={getTimeFomartDDMMYY(data.createdTime)} /> */}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
  },
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  textDescriptionCard: {
    fontFamily: "SegoeUI",
    fontSize: 14,
  },
  textTitleCard: {
    color: COLOR_BLACK,
    fontSize: 14,
    fontWeight: "bold",
  },
  textTimeCard: {
    fontSize: 12,
    color: COLOR_BLUE,
    fontFamily: "SegoeUI",
  },
  wrapperTextVideo: {
    marginTop: 10,
    width: "100%",
  },
  wrapperCard: {
    alignItems: "center",
    padding: 16,
    backgroundColor: COLOR_WHITE,
    borderWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
  },
  wrapperImageAvatarVideo: {
    width: DEVICE_WIDTH - 32,
    height: 200,
  },
  imageAvatarVideo: {
    width: DEVICE_WIDTH - 32,
    height: 200,
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
      }
    : {
        elevation: 2,
      },
  wrapperSpace: {
    height: 50,
  },
});
