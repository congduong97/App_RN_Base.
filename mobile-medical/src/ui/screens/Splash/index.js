import React, { useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppNavigate from "evotek_navigations/AppNavigate";
import { ScreensView } from "evotek_components";
import API from "../../../networking";
import { Colors, Dimension, Fonts, ImagesUrl } from "evotek_commons";
import models from "../../../models";

export default function SplashScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isFinishedSyncData } = useSelector((state) => state.CommonsReducer);
  useEffect(() => {
    API.requestDataAppLaunch(dispatch, {});
  }, []);

  useEffect(() => {
    if (isFinishedSyncData) {
      AppNavigate.navigateWhenAppStartAndSaveAccount(navigation.dispatch);
    }
  }, [isFinishedSyncData]);

  return (
    <ScreensView
      isToolbar={false}
      titleScreen={"Đăng nhập"}
      bgColorStatusBar={Colors.colorMain}
      styleContent={styles.styleContent}
      styleTitle={{ color: "white" }}
      colorsLinearGradient={[
        Colors.colorMain,
        Colors.colorMain,
        Colors.colorMain,
      ]}
    >
      <ImageBackground
        style={styles.stImage}
        resizeMode={"contain"}
        source={ImagesUrl.LogoApp}
        onStartShouldSetResponder={() => Keyboard.dismiss()}
      />
      <Text style={styles.stText1}>{"Đăng ký lịch khám bệnh từ xa"}</Text>
      <Text style={styles.stText2}>
        {
          "Giúp bạn dễ dàng hơn trong việc đăng ký khám bệnh, tiết kiệm thời gian..."
        }
      </Text>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: Colors.colorMain,
    justifyContent: "center",
    paddingHorizontal: Dimension.padding5,
    alignItems: "center",
  },
  stImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    // backgroundColor: "white",
    position: "absolute",
  },
  stText1: {
    color: "white",
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize18,
    textTransform: "uppercase",
    // alignSelf: "center",
    textAlign: "center",
    // letterSpacing: 0.2,
    marginBottom: Dimension.margin2x,
  },
  stText2: {
    lineHeight: 35,
    color: "white",
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    alignSelf: "center",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
