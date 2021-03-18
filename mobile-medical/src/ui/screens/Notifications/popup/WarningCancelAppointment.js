import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Colors, Fonts } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";

export default function WarningCancelAppointment(props) {
  const { refDialog, navigation } = props;
  const changeAppointmentReason = "Thích thì đổi";
  const oldTime = "8:00 - 9:00 Ngày 20/01/2021";
  const newTime = "8:00 - 9:00 Ngày 21/01/2021";
  const handleOnPress = ({ id }) => {
    /* if (id === "NaviRebooking") {
      //sau chuyen lai dat lai lich
      AppNavigate.navigateToTabHome(navigation.dispatch, {});
    }
    refDialog.hideDialog(); */
  };
  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <Text style={styles.stTextContent}>
        {
          `Nếu bạn hủy quá 3 lần/ngày hoặc 5 lần/tuần, tài khoản của bạn sẽ bị khóa trong vòng 15 ngày và sẽ không được hoàn lại phí đặt khám (Nếu có). Bạn có chắc chắn muốn hủy?`
        }
      </Text>
      <View  style={styles.stFooterButton}>
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
          id={"Cancel"}
          title={"Huỷ lịch"}
          onPress={handleOnPress}
          bgColor={Colors.colorBtEdit}
          textColor={Colors.colorCancel}
          style={styles.stButtonConfirm}
        />
      </View>
    </View >
  );
}
