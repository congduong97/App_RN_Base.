import React from "react";
import { Text, View } from "react-native";
import { Dimension, Colors } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function MedicalReminder(props) {
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
       {"Đã đến giờ uống thuốc. Bạn đừng quên uống thuốc nhé!"}
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
