import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ImagesUrl,
  Dimension,
  Colors,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ScreensView, ButtonView } from "../../../../components";

export default function WaitingApprovalScreen(props) {
  const { dataNotifi } = props;
  const { healthFacilitiesName = "" } = dataNotifi?.appointment || {};
  const navigation = useNavigation();
  const handleOnPress = () => {
    AppNavigate.navigateToTabHome(navigation.dispatch);
  };
  return (
    <ScreensView
      titleScreen={"Giới thiệu"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          title={"Quay về trang chủ"}
          onPress={handleOnPress}
          style={styles.stButton}
        />
      }
    >
      <View style={styles.stContent}>
        <Image source={ImagesUrl.imFeedback} style={styles.stImage} />
        <Text style={styles.stTextTitle}>
          {"Cám ơn bạn đã đăng ký lịch khám"}
        </Text>
        <Text style={styles.stTextContent}>
          {`Lịch khám của bạn đang được ${healthFacilitiesName} xử lý, Chúng tôi sẽ thông báo đến bạn trong thời gian sớm nhất ! Xin trân trọng cảm ơn!`}
        </Text>
      </View>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: Dimension.padding3x,
  },
  stContent: {
    justifyContent: "center",
    marginTop: Dimension.margin2x,
  },
  stImage: {
    // marginTop: -56,
    width: fontsValue(SCREEN_WIDTH - 100),
    height: fontsValue(SCREEN_WIDTH - 100),
    alignSelf: "center",
  },
  stTextTitle: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginVertical: Dimension.margin2x,
    // marginTop: -18,
  },
  stTextContent: {
    textAlign: "center",
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.textLabel,
    letterSpacing: 0.5,
    lineHeight: fontsValue(24),
    marginBottom: Dimension.margin2x,
  },

  stButton: {
    marginBottom: Dimension.margin3x,
    marginHorizontal: Dimension.margin2x,
  },
});
