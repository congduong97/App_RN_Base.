import React from "react";
import { Text, View } from "react-native";
import { Dimension, Colors } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import HTML from "react-native-render-html";

export default function FeedbackHospital(props) {
  const { refDialog, navigation, notifiData } = props;
  const { body } = notifiData;
  const handleOnPress = ({ id }) => {
    refDialog.hideDialog();
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <HTML tagsStyles={{ p: styles.stHtml }} source={{ html: body }} />
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
