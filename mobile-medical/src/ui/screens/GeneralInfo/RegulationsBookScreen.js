import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, ScrollView } from "react-native";
import { useDispatch } from 'react-redux'
import { useNavigation, useRoute } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { Colors, Dimension } from "../../../commons";
import { ScreensView, ButtonView } from "../../../components";
import models from "../../../models";
import API from "../../../networking";
import HTML from "react-native-render-html";

// const textQuyDinh =
//   "1. Thời gian đăng ký khám chữa bệnh trong vòng 05 ngày đến 16h30\nTrước ngày đăng ký khám Phiếu khám bệnh được gửi đến Quý khách qua Email gay sau khi đăng ký khám bệnh thành công\n2.  Đến ngày khám bệnh, bệnh nhân vui lòng có mặt trước  15 - 30 phút\n- Người bệnh đủ điều kiện hưởng BHYT đến quay đăng ký\n3.  Khám chữa bệnh để xác nhận BHYT\n- Người bệnh không có BHYT đến quầy đăng ký khám làm thủ tục.\n4. Trường hợp hủy hoặc đổi lịch khám\n- Chỉ thực hiện đến 16h30 trước ngày khám\n- Quý khách thực hiện việc hủy phiếu, hoặc đổi lịch khám trên ứng dụng App.\n- Nếu đổi và hủy lịch khám quá 03 lần /ngày hoặc 5 lần/ tuần thì tài khoản sẽ bị khóa trong vòng 15 ngày.";

export default function RegulationsBookScreen(props) {
  const navigation = useNavigation();
  const [textQuyDinh, setTextQuyDinh] = useState("<div></div>")
  const contentWidth = useWindowDimensions().width;
  const dispatch = useDispatch()

  useEffect(() => {
    requestData();
  }, []);

  const requestData = async () => {
    let data = await API.requestTermOfUse(dispatch)
    setTextQuyDinh(data?.propertyValue)
  }

  // const getData = async () => {
  //   let data = API
  // }

  // const isExistPatient = models.isExistPatient();
  const handleAgree = () => {
    // if (isExistPatient) {
    //   AppNavigate.navigateToPatientRecords(navigation.dispatch, {
    //     typeScreen: 2,
    //   });
    // } else {
    //   AppNavigate.navigateToCreateRecord(navigation.dispatch);
    // }

    navigation.pop()
    AppNavigate.navigateToChooseHealthFacilities(navigation.dispatch)
  };
  return (
    <ScreensView
      titleScreen={"Quy định đặt lịch khám"}
      renderFooter={
        <ButtonView
          title={"Tôi đồng ý"}
          onPress={handleAgree}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
        />
      }
    >
      {/* <Text style={styles.styleTextContent}>{textQuyDinh}</Text> */}

      <ScrollView style={{ flex: 1, margin: 12 }}>
        {/* <Text style={styles.styleTextContent}>{textQuyDinh}</Text> */}
        <HTML style={{
        }} source={{ html: textQuyDinh }} contentWidth={contentWidth} />
      </ScrollView>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleTextContent: {
    marginTop: 32,
    marginHorizontal: 24,
    color: Colors.colorTitleScreen,
    lineHeight: 24,
    fontSize: Dimension.fontSizeButton16,
  },
});
