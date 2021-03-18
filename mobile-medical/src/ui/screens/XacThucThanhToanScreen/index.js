import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  BaseView,
  IconView,
  TextView,
  InputView,
  ButtonView,
  ScreensView,
} from "../../../components";
import { Colors, Dimension, Fonts } from "../../../commons";
import styles from "./styles";
import DialogSelectItem from "./component/DialogSelectItem";
import AppNavigate from "../../../navigations/AppNavigate";
import { useMergeState, useApp } from "../../../AppProvider";
import ChoicePaymentsType from "./ChoicePaymentsType";
import { ApiUrl } from "../../../networking";
import API from "../../../networking";
import { array } from "prop-types";
import actions from "../../../redux/actions";
import DropShadow from "react-native-drop-shadow";

export default function XacThucThanhToanScreen(props) {
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [stateScreen, setStateScreen] = useMergeState({
    dataSelect: {},
    dataPaymentMethod: []
  });
  const { dataSelect, dataPaymentMethod } = stateScreen;
  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );

  const onChangeValue = ({ data }) => {
    setStateScreen({ dataSelect: data });
  };

  useEffect(() => {
    getDataServer()
  }, []);

  const getDataServer = async () => {
    //makeAppointData?.prepaymentMedicalService === 2 : csyt k cho pheps thanh toan online
    var dataPayment = []
    if (makeAppointData?.prepaymentMedicalService == 2) {
      dataPayment.push({
        id: 1,
        title: "Thanh toán trực tiếp tại CSYT",
        icon: "ic-pay",
        value: "CASH",
      })
    } else {
      let data = await API.requestPaymentMethod(dispatch, { healthFacilityId: makeAppointData.healthFacilityId })
      for (let i = 0; i < data.length; i++) {
        dataPayment.push({
          id: i,
          title: data[i].value,
          icon: "ic-pay",
          value: data[i].code,
        })
      }
      dataPayment.push({
        id: dataPayment.length,
        title: "VN PAY",
        icon: "ic-pay",
        value: "VN_PAY",
      })
    }

    // console.log(dataPayment)
    // for (let i = 0; i < 3; i++) {
    //   dataPayment.push({
    //     id: i,
    //     title: "VN Pay"+ i,
    //     icon: "ic-pay",
    //     value: "1234",
    //   })
    // }

    setStateScreen({
      dataPaymentMethod: dataPayment
    })
  }


  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <ChoicePaymentsType
            typeDialog={1}
            refDialog={refDialog.current}
            dataSelected={dataSelect}
            // onPress={handleSelected}
            // navigation={navigationRef.current}
            onChangeValue={onChangeValue}
            dataPayments={dataPaymentMethod}
          />
        )
        .visibleDialog();
  };

  const handleNextScreen = async () => {
    if (dataSelect.value === "CASH") {
      console.log("makeAppointData -------123123123 :    ", makeAppointData)
      let dataResponse = {}
      if (makeAppointData.id) {
        dataResponse = await API.requestBookByDayUpdate(dispatch, makeAppointData);
      } else {
        dataResponse = await API.requestBookByDay(dispatch, makeAppointData);
      }
      console.log("dataResponse:    ", dataResponse)
      if (dataResponse.id) {
        // alert("Đặt lịch khám thành công");
        let message = ''
        if (makeAppointData.connectWithHis == 3 || makeAppointData.connectWithHis == 1) {
          message = "Cảm ơn bạn đã đăng kí lịch khám, lịch khám của bạn đang được " + makeAppointData.healthFacilityName + " xử lý, chúng tôi sẽ thông báo kết quả cho bạn trong thời gian sớm nhất"
        } else if (dataResponse.type === 1) {
          message = "Chúc mừng bạn đã đặt lịch khám ngày " + dataResponse.appointmentDate + " thành công"
        } else if (dataResponse.type === 2) {
          message = "Chúc mừng bạn đã đặt lịch khám " + makeAppointData.AcademicCode + '.' + dataResponse.doctorName + " thành công"
        }
        Alert.alert("Đặt lịch khám", message, [{ text: "Đồng ý" }]);
        dispatch(actions.resetMakeAppointData({}));
        AppNavigate.navigateToExaminationCard(navigation.dispatch, {
          idCard: dataResponse?.id,
          isDatLichKham: true
        });
      } else if (makeAppointData.id && dataResponse) {
        Alert.alert("Đặt lịch khám", "Sửa phiếu khám thành công", [{ text: "Đồng ý" }]);
        dispatch(actions.resetMakeAppointData());
        AppNavigate.navigateToExaminationCard(navigation.dispatch, {
          idCard: makeAppointData?.id,
          isDatLichKham: true
        });
      } else {
        if (dataResponse && dataResponse.errorKey === 'appointmentcode.notexist') {
          Alert.alert("Đặt lịch khám", "Mã lần tái khám không tồn tại", [{ text: "Đồng ý" }]);
        } else if (dataResponse && dataResponse.errorKey === 'appointment.over_time_allowed_create_tomorrow') {
          Alert.alert("Đặt lịch khám", "Đã hết giờ đặt lịch khám ngày mai", [{ text: "Đồng ý" }]);
        } else if (dataResponse && dataResponse.errorKey === 'doctor_appointment.user_is_blocked') {
          Alert.alert("Đặt lịch khám", "Người dùng hiện tại đã bị chặn - không thể tạo cuộc hẹn bác sĩ mới", [{ text: "Đồng ý" }]);
        } else if (dataResponse && dataResponse.errorKey === 'appointment.maxAvailableDaily') {
          Alert.alert("Đặt lịch khám", dataResponse?.title, [{ text: "Đồng ý" }]);
        } else if (dataResponse && dataResponse.errorKey === 'doctor_appointment.not_available_appointment') {
          Alert.alert("Đặt lịch khám", "Khung giờ bạn chọn đã hết lượt đặt khám, vui lòng chọn lại khung giờ khác", [{ text: "Đồng ý" }]);
        } else {
          Alert.alert("Đặt lịch khám", "Đặt lịch khám thất bại", [{ text: "Đồng ý" }]);
        }
      }
    } else if (dataSelect.value === undefined) {
      alert("Vui lòng chọn phương thức thanh toán")
    }
    else if (dataSelect.value === "VN_PAY") {
      AppNavigate.navigateToConfirmBankCard(navigation.dispatch, {});
    }
    else {
      alert("Chưa hỗ trợ phương thức thanh toán này")
      // Alert.alert("Chưa hỗ trợ phương thức thanh toán này", [{ text: "Đồng ý" }]);
    }


  };

  return (
    <ScreensView
      titleScreen={"Xác nhận thanh toán"}
      styleContent={styles.styleContent}
      renderFooter={
        <ButtonView
          title={"Xác nhận"}
          onPress={handleNextScreen}
          style={{ marginBottom: 20, marginHorizontal: 15 }}
          disabled={!dataSelect.value}
        />
      }
    >
      <DropShadow
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}
      >
        <View style={styles.stContainBox}>

          <InputView
            onPress={showDialog}
            isShowLabel={true}
            editable={false}
            isShowClean={false}
            iconRightName={"ic-arrow-down"}
            iconRighSize={Dimension.sizeIcon20}
            iconRightColor={Colors.colorMain}
            label={<Text style={{ fontFamily: Fonts.SFProDisplayRegular, fontSize: 13 }}>{"Phương thức thanh toán"}</Text>}
            placeholder={"Chọn Phương thức thanh toán..."}
            placeholderTextColor={Colors.textLabel}
            style={styles.stInputTime}
            multiline
            styleInput={styles.stInput}
            textDisable={styles.textDisable}
            value={dataSelect?.title}
          // onChangeText={onChangeText}
          // value={refDataBook.current[BookAppointmentKey.DateChoose]}
          />
        </View>
      </DropShadow>
      <DropShadow
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        }}
      >
        <View style={styles.stContainContent}>

          <TextView
            style={{ ...styles.styleViewTextView, marginBottom: 10 }}
            styleContainerText={styles.styleContentTextView}
            styleTitle={[styles.styleLabel]}
            styleValue={[styles.styleValue]}
            value={makeAppointData.medicalServicePrice && makeAppointData.medicalServicePrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + "đ"}
            title={"Tiền khám"}
            iconColor={Colors.colorMain}
            iconSize={14}
          />
          <TextView
            style={[styles.styleViewTextView, { marginTop: -4 }]}
            styleContainerText={styles.styleContentTextView}
            styleTitle={[styles.styleLabel]}
            styleValue={[styles.styleValue]}
            value={"0đ"}
            title={"Phí dịch vụ"}
            iconColor={Colors.colorMain}
            iconSize={14}
          />
          <TextView
            style={{ ...styles.styleViewTextView, marginTop: 14 }}
            styleContainerText={styles.styleContentTextView}
            styleTitle={[
              styles.styleLabel,
              { fontSize: 18, color: "black", fontFamily: Fonts.SFProDisplayRegular },
            ]}
            styleValue={[styles.styleValue, { fontSize: Dimension.fontSize20, color: "#00C6AD" }]}
            value={makeAppointData.medicalServicePrice && makeAppointData.medicalServicePrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ"}
            title={"Tổng tiền"}
            iconColor={Colors.colorMain}
            iconSize={14}
          />

          {makeAppointData.medicalServicePriceOld ? <Text style={[
            styles.styleLabel,
            { marginTop: 12 },
          ]}>{'Chú ý: Số tiền hoàn lại khi cập nhật lịch khám là ' + makeAppointData?.medicalServicePriceOld?.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ" + ' sẽ được nhận tại csyt'}</Text> : null}
        </View>
      </DropShadow>
    </ScreensView>
  );
}
