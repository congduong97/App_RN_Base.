import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { ImagesUrl, SCREEN_WIDTH, SCREEN_HEIGHT } from "../commons";
import { Bounce } from "react-native-animated-spinkit";

const AppStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[styles.statusBar, { backgroundColor }]}>
    <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  </View>
);

export default function LoadingView() {
  const isShowLoading = useSelector(
    (state) => state.CommonsReducer.isShowLoading
  );
  return (
    <Modal
      transparent={true}
      // statusBarTranslucent={true}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      visible={isShowLoading}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      backdropOpacity={0.1}
      backdropColor={"#000000"}
    >
      <View style={[styles.modalBackground, {}]}>
        <SafeAreaView backgroundColor={"gray"} />
        <AppStatusBar
          backgroundColor="#00000059"
          style={{ height: StatusBar.currentHeight }}
        />
        {/* <View style={styles.activityIndicatorWrapper}> */}
        <View
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Bounce
            size={100}
            color="#F79600"
            style={{ height: 100, width: 100, position: "absolute" }}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
              backgroundColor: "white",
              borderColor: "#FFFFFF90",
              borderWidth: 1,
              position: "absolute",
            }}
          >
            <Image
              resizeMode="contain"
              sty
              style={{
                width: 80,
                height: 80,
                padding: 20,
                borderRadius: 60,
              }}
              source={ImagesUrl.LogoApp}
            />
          </View>
        </View>

        <Text
          style={[
            {
              color: "#FFFFFF",
              fontSize: 21,
              fontWeight: "700",
              marginTop: 50,
            },
          ]}
        >
          vui lòng chờ...
        </Text>
      </View>
      {/* </View> */}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
  },

  activityIndicatorWrapper: {
    backgroundColor: "transparent",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },

  statusBar: {
    height: StatusBar.currentHeight,
  },
});
