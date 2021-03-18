import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Colors, Fonts } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function WaitingApproval(props) {
  const { refDialog, navigation } = props;
  const handleOnPress = ({ id }) => {
    if (id === "NaviDetail") {
      AppNavigate.navigateToWaitingApproval(navigation.dispatch, {});
    }
    refDialog.hideDialog();
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>
        {"Cám ơn bạn đã đăng ký lịch khám"}
      </Text>
      <Text style={styles.stTextContent}>
        {
          "Lịch khám của bạn đang được bệnh viện đa khoa Yên Bái xử lý, Chúng tôi sẽ thông báo đến bạn trong thời gian sớm nhất ! Xin trân trọng cảm ơn"
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
