import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Colors, Fonts, fontsValue } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function FeedbackHospitalDone(props) {
  const { refDialog, navigation } = props;
  const handleOnPress = ({ id }) => {
    if (id === "NaviDetail") {
      AppNavigate.navigateToWaitingApproval(navigation.dispatch, {});
    }
    refDialog.hideDialog();
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <Text style={{ ...styles.stTextContent, letterSpacing: 0.1 }}>
        {
          "Ý kiến đóng góp của bạn đã được xử lý"
        }
      </Text>
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
        {/* <ButtonView
          id={"NaviDetail"}
          title={"Xem chi tiết"}
          onPress={handleOnPress}
          bgColor={Colors.colorMain}
          style={styles.stButtonConfirm}
        /> */}
      </View>
    </View>
  );
}
