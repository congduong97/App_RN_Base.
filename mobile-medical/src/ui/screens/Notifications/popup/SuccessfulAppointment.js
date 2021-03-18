import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../../../commons";
import { ButtonView } from "../../../../components";
import AppNavigate from "../../../../navigations/AppNavigate";
import styles from "./styles";
import HTML from "react-native-render-html";

export default function SuccessfulAppointment(props) {
  const { refDialog, navigation, notifiData } = props;
  const { body, object } = notifiData;
  let data = {};
  try {
    data = JSON.parse(JSON.parse(object));
  } catch (error) {
    data = JSON.parse(object);
  }

  const handleOnPress = ({ id }) => {
    if (id === "NavHome") {
      AppNavigate.navigateToTabHome(navigation.dispatch);
    } else if (id === "NaviDetail") {
      AppNavigate.navigateToExaminationCard(navigation.dispatch, {
        idCard: data.id
      });
    }
    refDialog.hideDialog();
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>
        {"Thông báo"}
      </Text>
      <HTML tagsStyles={{ p: styles.stHtml }} source={{ html: body }} />
      <View style={styles.stFooterButton}>
        <ButtonView
          id={"NavHome"}
          title={"Trang chủ"}
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
