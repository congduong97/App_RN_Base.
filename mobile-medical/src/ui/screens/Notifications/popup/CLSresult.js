import React from "react";
import { Text, View, useWindowDimensions } from "react-native";
import { Dimension, Colors } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import HTML from "react-native-render-html";

export default function CLSresult(props) {
  const { refDialog, navigation, notifiData } = props;
  const { body } = notifiData;
  const contentWidth = useWindowDimensions().width;
  const handleOnPress = ({ id }) => {
    if (id === "NaviDetail") {
      AppNavigate.navigateToWaitingApproval(navigation.dispatch, {});
    }
    refDialog.hideDialog();
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <View style={styles.stTextContent}>
        <HTML tagsStyles={{p: styles.stHtml}}  source={{ html: body }} contentWidth={contentWidth} />
      </View>
      <View style={styles.stFooterButton}>
        <ButtonView
          id={"Closed"}
          title={"Đóng"}
          onPress={handleOnPress}
          bgColor={"white"}
          textColor={Colors.colorMain}
          style={{
            ...styles.stButtonConfirm,
            borderColor: Colors.colorMain,
            borderWidth: 1,
            marginBottom: 0,
          }}
        />
      </View>
    </View>
  );
}
