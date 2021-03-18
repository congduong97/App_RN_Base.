import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import HTML from "react-native-render-html";

export default function RemindAppointment(props) {
  const { refDialog, navigation, notifiData } = props;
  const { body } = notifiData;
  const handleOnPress = ({ id }) => {
    if (id === "HealthDeclaration") {
      //sau chuyen lai dat lai lich
      AppNavigate.navigateToHealthDeclaration(navigation.dispatch);
    }
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
          }}
        />
        <ButtonView
          id={"HealthDeclaration"}
          title={"Khai báo y tế"}
          onPress={handleOnPress}
          bgColor={Colors.colorMain}
          style={styles.stButtonConfirm}
        />
      </View>
    </View>
  );
}
