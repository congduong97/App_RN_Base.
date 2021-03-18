import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ScreensView,
  ButtonView,
  TouchableOpacityEx,

} from "../../../components";
import { Colors, Dimension, Fonts, fontsValue } from "../../../commons";
import {
  convertTimeServerToDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../commons/utils/DateTime";
import AppNavigate from "../../../navigations/AppNavigate";
import IconView, { IconViewType } from "../../../components/IconView";
import DropShadow from "react-native-drop-shadow";

export default function ItemView(props) {
  const { dataItem } = props;
  const { topicName, content, createdDate, status, processingUnitName } = dataItem;
  const timeFeedback = convertTimeServerToDateVN(
    createdDate,
    FORMAT_DD_MM_YYYY
  );
  const navigation = useNavigation();
  const onNavigatorDetailFeedback = () => {
    AppNavigate.navigateToFeedbackDetail(navigation.dispatch, {
      dataItem: dataItem,
    });
  };

  return (
    <DropShadow
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.025,
        shadowRadius: 10,
      }}
    >
      <TouchableOpacityEx
        onPress={onNavigatorDetailFeedback}
        style={[styles.stContain]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.stTextTitle} numberOfLines={2}>
            {topicName}
          </Text>
          <Text style={styles.styleTextProcessing} >
            {processingUnitName}
          </Text>
          <Text style={styles.styleTextContent} numberOfLines={2}>
            {content}
          </Text>
          <View style={styles.stContentFooter}>


            <Text
              style={{ color: 'black', fontSize: Dimension.fontSize12, fontFamily: Fonts.SFProDisplayRegular }}
            >
              {status === 1
                ? "Chờ xử lý"
                : status === 2
                  ? "Đang xử lý"
                  : "Đã xử lý"}
            </Text>

            <Text style={styles.styleTextTime} numberOfLines={2}>
              {timeFeedback}
            </Text>
          </View>
        </View>
        <IconView
          style={{ marginLeft: 8 }}
          name={"chevron-right"}
          type={IconViewType.MaterialCommunityIcons}
        />
      </TouchableOpacityEx>
    </DropShadow>
  );
}

const styles = StyleSheet.create({
  stContain: {
    backgroundColor: "white",
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: Dimension.margin,
    paddingHorizontal: Dimension.padding2x,
    paddingVertical: Dimension.padding,
    marginHorizontal: 16,
    borderRadius: Dimension.radiusButton,
    // shadowOpacity: 0.25,
    // marginBottom: 2,
    // shadowRadius: 3,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },
  stTextTitle: {
    textAlign: "left",
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    // lineHeight: Dimension.lineHeightPopup,
  },
  styleTextContent: {
    // marginTop: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    color: Colors.colorTitleScreen,
    fontFamily: Fonts.SFProDisplayRegular,
  },

  stContentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Dimension.margin,
    alignItems: "center",
  },
  styleTextTime: {
    // marginTop: Dimension.margin5,
    fontSize: Dimension.fontSize12,
    color: 'black',
    fontFamily: Fonts.SFProDisplayRegular,
  },
  styleTextStatus: {
    fontSize: Dimension.fontSize12,
    color: "white",
    fontFamily: Fonts.SFProDisplayRegular,
    textAlignVertical: "center",
  },
  stStatus: {
    paddingHorizontal: Dimension.padding2x,
    paddingVertical: Dimension.padding5,
    height: fontsValue(24),
    borderRadius: Dimension.radius,
  },
  styleTextProcessing: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize12,
    color: "#00C6AD",
    marginVertical: 8
  }
});
