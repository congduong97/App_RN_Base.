import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Colors, Fonts, fontsValue } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import NotificationType from "../NotificationType";

export default function CancelAppointment(props) {
  const { refDialog, navigation, notifiData } = props;
  const { type } = notifiData;
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
        {type === NotificationType.CancelAppointmentSuccess ? "Đã hủy lịch khám thành công." : "Hủy lịch khám không thành công do đã quá thời gian quy định"}
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
      </View>
    </View>
  );
}
