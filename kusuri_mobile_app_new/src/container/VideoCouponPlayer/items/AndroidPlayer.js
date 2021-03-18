import React, { useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  BackHandler,
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
const AndroidPlayer = ({ navigation, itemVideo }) => {
  console.log("itemVideo", itemVideo);
  const [isReady, setReady] = React.useState(0);
  const [error, setError] = React.useState(false);
  const [isShow, setShow] = React.useState(true);
  const [time, setTime] = React.useState(0);
  const [end, setEnd] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const timeGoBack = useRef(0);
  const youtubeRef = React.useRef();
  const timerCheck = React.useRef();
  const fullscreen = false;

  React.useEffect(() => {
    Orientation.unlockAllOrientations();
    BackHandler.addEventListener("hardwareBackPress", handleBackPress);
    return () => {
      Orientation.lockToPortrait();
      clearInterval(timerCheck.current);
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
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
    const response = await Api.applyCouponEndVideo(
      pKikakuId,
      numberDayCanUseCoupon
    );
    console.log("response",response)
    if (response.code == 200 && response.res.status.code == 1000) {
      SliderHomeService.updateItem();
      setShowModal(true);
    }
  };

  //Lấy mã ID của Video:
  const getIDWithLinkYouTube = (link) => {
    let video_id = link.split("v=")[1];
    const ampersandPosition = video_id.indexOf("&");
    if (ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
  };

  React.useEffect(() => {
    if (youtubeRef.current && !error && time > 0) {
      youtubeRef.current.seekTo(time);
    }

    return () => {};
  }, [error]);

  React.useEffect(() => {
    if (!isShow) {
      clearInterval(timerCheck.current);
      setTimeout(() => {
        setShow(true);
      }, 100);
    }
    return () => {};
  }, [isShow]);

  const handleBackPress = () => {
    if (end) {
      return false;
    }
    return true;
  };

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <View style={{ flexDirection: "row",margin: 10 }}>
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
        <Text style={{ color: "white", fontSize: 18,marginLeft:10 }}>
          再生時間：{itemVideo.timeVideo}
        </Text>
      </View>
      {isShow ? (
        <YouTube
          ref={youtubeRef}
          apiKey={API_KEY_YOUTUBE}
          showinfo={false}
          controls={2}
          hidden={false}
          loop={false}
          rel={false}
          playsInline={false}
          modestbranding={true}
          showFullscreenButton={false}
          videoId={getIDWithLinkYouTube(itemVideo.linkYoutube)} // The YouTube video ID
          play={true} // control playback of video with true/false
          fullscreen={fullscreen} // control whether the video should play in fullscreen or inline
          onReady={async (e) => {
            let timeCurrent = 0;
            let timeEndVideo = 0;
            timeEndVideo = await youtubeRef.current.getDuration();
            timerCheck.current = setInterval(async () => {
              if (youtubeRef.current) {
                timeCurrent = await youtubeRef.current.getCurrentTime();
              }
              if (timeCurrent >= timeEndVideo) {
                setEnd(true);
              }
            }, 1000);
            setReady(isReady + 1);
            setError(false);
          }}
          onChangeState={(e) => {}}
          onError={async (e) => {
            const timeCurrent = await youtubeRef.current.getCurrentTime();

            setTime(timeCurrent);
            if (e.error == "UNAUTHORIZED_OVERLAY") {
              setShow(false);
              setError(true);
            }
          }}
          style={{
            alignSelf: "stretch",
            // height: Dimensions.get("window").height - 100,
            flex: 1,
          }}
        />
      ) : (
        <View
          style={{
            backgroundColor: "black",
            alignSelf: "stretch",
            height: Dimensions.get("window").height,
          }}
        />
      )}
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
          <Text style={{ margin: 30, fontWeight: "bold", fontSize: 16 ,color:"black"}}>
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
              <Text style={{ color: "blue" }}> {STRING.close_modal_video_coupon}</Text>
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
                navigation.goBack();
                navigation.navigate("NEW_COUPON");
              }}
            >
              <Text style={{ color: "blue" }}>{STRING.receiver_coupon_navigate_coupon}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AndroidPlayer;
