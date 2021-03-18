import React from "react";
import { ScreensView, ButtonView } from "../../../components";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Dimension, SCREEN_WIDTH, Colors } from "../../../commons";
import QRCode from "react-native-qrcode-svg";
import AppNavigate from "../../../navigations/AppNavigate";
import { useDispatch } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  FORMAT_DD_MM_YYYY,
  convertTimeDateVN,
} from "../../../commons/utils/DateTime";
import API from "../../../networking";
import Toast from "react-native-simple-toast";
export default function HealthDeclarationDetailScreen() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const id = route?.params?.id || 0;
  const createdDate = route?.params?.createdDate;
  const tomorrow = new Date();
  tomorrow.setDate(new Date(createdDate).getDate() + 1);
  const date =
    convertTimeDateVN(tomorrow.toJSON(), FORMAT_DD_MM_YYYY) ||
    convertTimeDateVN(new Date().toJSON(), FORMAT_DD_MM_YYYY);

  const onBack = () => {
    navigation.goBack();
    setTimeout(() => {
      navigation.goBack();
      AppNavigate.navigateToTabHome(navigation.dispatch);
    }, 0);
  };

  const onDelete = () => {
    let isDone = API.requestDeleteHealthDeclaration(dispatch, id);
    if (isDone) {
      Toast.showWithGravity(
        "Xóa tờ khai y tế thành công",
        Toast.LONG,
        Toast.CENTER
      );
      navigation.goBack();
    } else {
      Toast.showWithGravity(
        "Xóa tờ khai y tế thất bại",
        Toast.LONG,
        Toast.CENTER
      );
    }
  };

  return (
    <ScreensView
      isScroll={false}
      titleScreen={"Chi tiết tờ khai"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          title={"Quay lại trang chủ"}
          onPress={onBack}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      <View style={styles.stContain}>
        <Text style={styles.styleTextTitle}>{"KHAI BÁO Y TẾ THÀNH CÔNG"}</Text>
        <View style={styles.stImageQRCode}>
          <QRCode value={id.toString()} size={SCREEN_WIDTH / 3} />
        </View>
        <Text style={styles.styleTextContent}>
          {"Lưu ý: Tờ khai y tế của bạn có giá trị đến ngày"}
        </Text>
        <Text
          style={{
            ...styles.styleTextContent,
            color: Colors.colorMain,
            fontSize: Dimension.fontSize16,
            paddingTop: Dimension.padding,
          }}
        >
          {date}
        </Text>

        <ButtonView
          title={"Xóa phiếu"}
          onPress={onDelete}
          styleText={{}}
          textColor={Colors.colorCancel}
          style={{
            marginTop: 20,
            alignSelf: "center",
            backgroundColor: Colors.colorBtEdit,
            paddingHorizontal: 20,
          }}
        />
      </View>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: 20,
  },
  stImageQRCode: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
    marginTop: Dimension.margin2x,
    alignSelf: "center",
  },
  styleTextTitle: {
    lineHeight: 24,
    marginTop: 5,
    alignSelf: "center",
    color: Colors.colorMain,
    fontSize: Dimension.fontSize16,
  },
  styleTextContent: {
    paddingTop: Dimension.padding2x,
    color: Colors.textLabel,
    alignSelf: "center",
  },
  stContain: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    flexDirection: "column",
    marginTop: 30,
    alignSelf: "center",
    shadowColor: "#000000",
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    borderWidth: 0.5,
    borderColor: Colors.colorBorder,
    paddingVertical: 20,
  },
});
