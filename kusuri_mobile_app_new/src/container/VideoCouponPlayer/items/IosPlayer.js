import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Dimensions,
  AppState,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import YouTube from "react-native-youtube";
import Orientation from "react-native-orientation";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  API_KEY_YOUTUBE,
  getWidthInCurrentDevice,
} from "../../../const/System";
import { Api } from "../utils/api";
import { STRING } from "../../../const/String";
import Modal from "react-native-modal";
import SliderHomeService from "../../Home/util/SliderHomeService";

const IosPlayer = ({ navigation, itemVideo }) => {
  const [end, setEnd] = useState(false);
  const [playVideo, setStatePlayVideo] = useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const youtubeRef = useRef(null);
  const timerCheck = useRef();
  const timeGoBack = useRef(0);
  const fullscreen = false;
  const timeCurrentVideoOutBackGround = useRef(0);

  React.useEffect(() => {
    Orientation.unlockAllOrientations();

    return () => {
      AppState.removeEventListener("change");
      Orientation.lockToPortrait();
      clearInterval(timerCheck.current);
    };
  }, []);

  useEffect(() => {
    if (end) {
      applyCouponEndVideoAPI();
    }
    return () => {
      clearTimeout(timeGoBack.current);
    };
  }, [end]);

  const applyCouponEndVideoAPI = async () => {
    const pKikakuId = itemVideo.pKikakuId;
    const numberDayCanUseCoupon = itemVideo.numberDayCanUseCoupon;
    console.log("pKikakuId", pKikakuId);
    console.log("numberDayCanUseCoupon", numberDayCanUseCoupon);
    try {
      console.log("Api.applyCouponEndVideo");
      const response = await Api.applyCouponEndVideo(
        pKikakuId,
        numberDayCanUseCoupon
      );
      console.log("Api.applyCouponEndVideo", response);
      if (response.code == 200 && response.res.status.code == 1000) {
        SliderHomeService.updateItem();
        setShowModal(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  //L???y m?? ID c???a Video:
  const getIDWithLinkYouTube = (link) => {
    let video_id = link.split("v=")[1];
    const ampersandPosition = video_id.indexOf("&");
    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          justifyContent: "center",
          flex: 1,
          backgroundColor: "black",
        }}
      >
        <View style={{ flexDirection: "row", margin: 10 }}>
          {end && (
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              style={{
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name={"close"} color={"white"} size={30} />
            </TouchableOpacity>
          )}
          <Text style={{ color: "white", fontSize: 18, marginLeft: 10 }}>
            ???????????????{itemVideo.timeVideo}
          </Text>
        </View>
        <YouTube
          ref={youtubeRef}
          apiKey={API_KEY_YOUTUBE}
          showinfo={false}
          controls={0}
          hidden={false}
          loop={false}
          rel={false}
          playsInline={false}
          modestbranding={true}
          showFullscreenButton={false}
          origin="https://www.youtube.com"
          videoId={getIDWithLinkYouTube(itemVideo.linkYoutube)} // The YouTube video ID
          play={playVideo} // control playback of video with true/false
          fullscreen={fullscreen} // control whether the video should play in fullscreen or inline
          onReady={async () => {
            let currentTimeInScreen = 0;
            let timeCurrent = [0];
            let timeEndVideo = 0;
            // let timeStartVideo = Math.floor(Date.now() / 1000);
            // console.log(timeNow, "timeNow");
            timeEndVideo = await youtubeRef.current.getDuration();
            timerCheck.current = setInterval(async () => {
              currentTimeInScreen++;
              if (youtubeRef.current) {
                let timeCurrentTempt = await youtubeRef.current.getCurrentTime();
                timeCurrent.push(timeCurrentTempt);

                if (timeCurrent[timeCurrent.length - 1] > currentTimeInScreen) {
                  youtubeRef.current.seekTo(
                    timeCurrent[timeCurrent.length - 2]
                  );
                }
              }
              if (
                timeCurrent[timeCurrent.length - 1] + 2 >= timeEndVideo &&
                currentTimeInScreen >= timeEndVideo
              ) {
                setEnd(true);
              }
            }, 1000);
          }}
          onError={async (e) => {
            if (e.error == "UNAUTHORIZED_OVERLAY") {
            }
          }}
          style={{
            alignSelf: "stretch",
            // height: Dimensions.get("window").height - 60,
            flex: 1,
          }}
        />
        <Modal
          deviceWidth={getWidthInCurrentDevice(375)}
          isVisible={showModal}
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                margin: 30,
                fontWeight: "bold",
                fontSize: 16,
                color: "black",
              }}
            >
              {STRING.content_popup_receiver_coupon}
            </Text>
            <View
              style={{
                flexDirection: "row",
                borderTopWidth: 0.5,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderRightWidth: 0.25,
                  borderRightColor: "gray",
                  paddingVertical: 15,
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowModal(false);
                }}
              >
                <Text style={{ color: "blue" }}>
                  {STRING.close_modal_video_coupon}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderLeftWidth: 0.25,
                  borderLeftColor: "gray",
                  paddingVertical: 15,
                  alignItems: "center",
                }}
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate("NEW_COUPON");
                }}
              >
                <Text style={{ color: "blue" }}>
                  {STRING.receiver_coupon_navigate_coupon}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default IosPlayer;
