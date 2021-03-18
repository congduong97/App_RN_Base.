import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Colors, Fonts } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function ChangeAppointmentSuccess(props) {
  const { refDialog, navigation, notifiData } = props;
  const { objectId } = notifiData;
  const handleOnPress = ({ id }) => {
    if (id === "Closed") {
      refDialog.hideDialog();
    }
    if (id === "NaviDetail") {
      AppNavigate.navigateToExaminationCard(navigation.dispatch, {
        idCard: objectId
      });
      refDialog.hideDialog();
    }
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>
        {"Thông báo"}
      </Text>
      <Text style={styles.stTextContent}>
        {
          "Đã thay đổi lịch khám thành công, xem chi tiết phiếu khám bệnh?"
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
          }}
        />
        <ButtonView
          id={"NaviDetail"}
          title={"Xem chi tiết"}
          onPress={handleOnPress}
          bgColor={Colors.colorMain}
          style={styles.stButtonConfirm}
        />
      </View>
    </View>
  );
}
