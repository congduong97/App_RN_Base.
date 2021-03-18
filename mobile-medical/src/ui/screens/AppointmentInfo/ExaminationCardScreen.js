import React, { useEffect, useRef } from "react";
import { View, Image, Text, BackHandler } from "react-native";
import {
  StackActions,
  useNavigation, useRoute
} from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import { useDispatch, useSelector } from "react-redux";
import { ImagesUrl, Colors, Dimension, SCREEN_WIDTH, NavigationKey, Fonts } from "../../../commons";
import { ScreensView, TextView, ButtonView } from "../../../components";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";
import styles from "./styles";
import models, { BookAppointmentKey } from "../../../models";
import { useMergeState, useApp } from "../../../AppProvider";
import ShowAlert from './component/ShowAlert'
import Toast from 'react-native-simple-toast'
import DropShadow from "react-native-drop-shadow";

import {
  convertStringToFormatServer,
  convertTimeServerToDateVN,
  convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
  FORMAT_HH_MM,
  convertTimeDate,
  isPastWithCurrentDate,
  convertTimeServerTimeZoneToDateVN,
  FORMAT_TO_SERVER,
  isCompareTime,
  isYesterday,
  getDate16h30
} from "../../../commons/utils/DateTime";
import actions from "../../../redux/actions";

function ButtonFooterView(props) {
  const { onPress, dataCard, statusAppointment } = props;
  console.log("ButtonFooterView:      ", dataCard)
  let isDisabledCancel = false
  if (dataCard.status === 4) {
    isDisabledCancel = true
  }
  if (props.isDatLichKham) {
    return (<View style={{
      // paddingHorizontal: Dimension.margin3x,
      marginTop: Dimension.margin2x,
      marginBottom: 12,
      flexDirection: 'row'
    }}>
      <ButtonView
        id={"TypeToHome"}
        title={"Trang chủ"}
        onPress={onPress}
        textColor={Colors.colorMain}
        style={{
          flex: 1,

          backgroundColor: "#DBFFFA",

          marginHorizontal: Dimension.margin,
        }}
      />
      <ButtonView
        id={"TypeMedical"}
        title={"Khai báo ý tế"}
        onPress={onPress}
        textColor={'white'}
        style={{
          flex: 1,
          borderColor: Colors.colorMain,
          backgroundColor: Colors.colorMain,
          borderWidth: 1,
          marginHorizontal: Dimension.margin,
        }}
      />
    </View>)
  } else {
    let disabledResult = true
    let disabledDatLaiLich = false
    //1 chờ duywwtj     2 chờ khám      3 đã khám
    if (statusAppointment == 1) {
      disabledResult = true
      // isDisabledCancel = true

    }
    if (statusAppointment == 2) {
      disabledResult = true
    }
    if (dataCard?.isReExamination == 1 && dataCard?.oldAppointmentCode) {
      disabledResult = false
    }

    //so sanh ngay vs ngay hien tai
    isDisabledCancel = isPastWithCurrentDate(convertTimeServerTimeZoneToDateVN(dataCard?.startTime, FORMAT_TO_SERVER), FORMAT_TO_SERVER)
    disabledDatLaiLich = isPastWithCurrentDate(convertTimeServerTimeZoneToDateVN(dataCard?.startTime, FORMAT_TO_SERVER), FORMAT_TO_SERVER)

    //check qua 16h30 hôm qua
    if (isYesterday(new Date(), dataCard?.startTime)) {
      if (isCompareTime(new Date(), getDate16h30(new Date()))) {
        isDisabledCancel = true
        disabledDatLaiLich = true
      }
    }

    if (statusAppointment == 3) {
      disabledResult = false
      isDisabledCancel = true
      disabledDatLaiLich = true
    }

    if (statusAppointment == 4 || statusAppointment == 5) {
      disabledResult = true
      isDisabledCancel = true
      disabledDatLaiLich = true
    }

    return (

      <View style={{
        marginTop: 48
      }}>
        <ButtonView
          id={"TypeResult"}
          title={"Xem kết quả"}
          onPress={onPress}
          disabled={disabledResult}
          textColor={'white'}
          style={{
            borderColor: disabledResult ? Colors.colorBorder : Colors.colorMain,
            backgroundColor: disabledResult ? Colors.colorBorder : Colors.colorMain,
            borderWidth: 1,
            marginHorizontal: Dimension.margin,
          }}
        />
        <View style={styles.stContainButtonFooter}>
          <ButtonView
            id={"TypeCancel"}
            title={"Hủy lịch"}
            onPress={onPress}
            disabled={isDisabledCancel}
            textColor={isDisabledCancel ? 'white' : Colors.colorCancel}
            style={[styles.stButtonSendToMail, { backgroundColor: isDisabledCancel ? Colors.colorBorder : '#FFE2DE' }]}
          />
          <ButtonView
            id={"TypeDatLaiLich"}
            title={"Đặt lại lịch"}
            onPress={onPress}
            disabled={disabledDatLaiLich}
            textColor={disabledDatLaiLich ? 'white' : Colors.colorMain}
            style={[styles.stButtonSendToMail, { flex: 1, backgroundColor: disabledDatLaiLich ? Colors.colorBorder : "#DBFFFA", marginRight: 8 }]}
          />
        </View>
      </View>
    );
  }
}

export default function ExaminationCardScreen(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { refDialog } = useApp();
  const idCard = route?.params?.idCard || 30;
  const isDatLichKham = route?.params?.isDatLichKham || false;
  const onPressReset = route?.params?.onPressReset
  const isExistPatient = models.isExistPatient();

  //1 chờ duywwtj     2 chờ khám      3 đã khám
  const statusAppointment = route?.params?.statusAppointment || null;
  const [stateScreen, setStateScreen] = useMergeState({
    dataCard: {},
  });
  const { dataCard } = stateScreen;
  useEffect(() => {
    getExaminationCardInfo();

    if (isDatLichKham) {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          return true;
        });

      return () => backHandler.remove();
    }

    // return () => { };
  }, []);
  console.log("new Date():    ", new Date())

  const getExaminationCardInfo = async () => {
    let dataCardResonse = await API.getExaminationCardInfo(dispatch, idCard);
    console.log("dataCardResonse:    ", dataCardResonse)
    if (dataCardResonse) {
      let dataPatient = models.getPatientRecordsInfo(
        dataCardResonse?.patientRecordId
      );
      let dataHealth = models.getHealthFacilityInfo(
        dataCardResonse?.healthFacilityId
      );
      let patientBirthday = convertTimeDateVN(
        dataPatient?.patientDob,
        FORMAT_DD_MM_YYYY
      );
      let dateBooking = convertTimeServerToDateVN(
        dataCardResonse?.startTime,
        FORMAT_DD_MM_YYYY
      );
      let timeBookingDisplay = convertTimeDate(dataCardResonse?.startTime, FORMAT_HH_MM) + "-" + convertTimeDate(dataCardResonse?.endTime, FORMAT_HH_MM);
      dataCardResonse = {
        ...dataCardResonse,
        dateBooking,
        patientAddress: dataPatient?.address,
        patientBirthday,
        timeBookingDisplay,
        healthFacilityName: dataHealth?.name,
      };
      setStateScreen({ dataCard: dataCardResonse });
    }
  };

  const cancelAppointment = async () => {
    let isDone = await API.getCancelAppointment(dispatch, dataCard.id);
    if (isDone) {
      setTimeout(() => {
        Toast.showWithGravity(
          `Hủy lịch khám thành công`,
          Toast.LONG,
          Toast.CENTER
        );
      }, 700);
      navigation.goBack();
      onPressReset()
    } else {
      if (isDone !== null) {
        setTimeout(() => {
          Toast.showWithGravity(
            `Hủy lịch khám thất bại`,
            Toast.LONG,
            Toast.CENTER
          );
        }, 700);
      }
    }
  }

  const handleSelected = (typeCancel) => {
    if (typeCancel === 'TypeCancel') {
      cancelAppointment()
    }
  }

  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          isScroll: true,
        })
        .drawContents(
          <ShowAlert
            refDialog={refDialog.current}
            onPress={handleSelected}
          />
        )
        .visibleDialog();
  };

  const navigationDatLichKham = async () => {
    dispatch(actions.showLoading());
    var id = ''
    if (dataCard?.type === 1) {
      id = NavigationKey.NextToBookByDay
    } else if (dataCard?.type === 2) {
      id = NavigationKey.NextToBookByDoctor
    }
    dispatch(actions.actionBookType(id)); // luu loai hanh dong book lich kham
    // dispatch(
    //   actions.saveMakeAppointData({
    //     [BookAppointmentKey.TypeBook]:
    //       id === dataCard?.type, ///1: Theo ngày, 2: Theo bác sĩ
    //   })
    // );
    dispatch(actions.resetMakeAppointData())

    let dataApiHeathFacilities = await API.requestDataHeathFacilities(dispatch, {
      // "appointmentOption": appointmentOption
    })
    let dataHeathFacilities = dataApiHeathFacilities.filter((item) => item?.id === dataCard?.healthFacilityId)
    dataHeathFacilities = dataHeathFacilities[0] || {}

    let isRequestDone = await API.getMedicalSpecialization(
      dispatch,
      dataCard?.healthFacilityId
    );
    if (isRequestDone) {
      let paramHeathFacilities = {
        [BookAppointmentKey.HealthFacilityId]: dataHeathFacilities.id,
        [BookAppointmentKey.HealthFacilityName]: dataHeathFacilities?.name,
        [BookAppointmentKey.HealthFacilityAddress]: dataHeathFacilities?.address,
        [BookAppointmentKey.connectWithHis]: dataHeathFacilities?.config?.connectWithHis,
        //1 cho phép thanh toán online, 2 là k
        [BookAppointmentKey.prepaymentMedicalService]: dataHeathFacilities?.config?.prepaymentMedicalService,
      };
      // dispatch(actions.saveMakeAppointData(paramHeathFacilities));

      //chọn bệnh nhân khám
      let dataRecord = models.getPatientRecordsInfo(dataCard?.patientRecordId)
      let paramPatient = {
        ...{
          [BookAppointmentKey.TypeBook]: dataCard?.type, ///1: Theo ngày, 2: Theo bác sĩ
        },
        ...paramHeathFacilities,
        ...{
          [BookAppointmentKey.PatientRecordId]: dataRecord?.id,
          [BookAppointmentKey.PatientRecordName]: dataRecord?.name,
          [BookAppointmentKey.PatientRecordCode]: dataRecord?.patientRecordCode,
          [BookAppointmentKey.PatientRecordBirthday]: dataRecord?.dob,
          [BookAppointmentKey.HealthInsuranceCode]: dataRecord?.healthInsuranceCode,
          //them ly do va id
          [BookAppointmentKey.MedicalReason]: dataCard?.medicalReason,
          [BookAppointmentKey.id]: dataCard?.id,

          //ma lan kham cu
          [BookAppointmentKey.IsReExamination]: dataCard?.isReExamination,
          [BookAppointmentKey.OldAppointmentCode]: dataCard?.oldAppointmentCode,

          //dich vu kham
          [BookAppointmentKey.MedicalServiceId]: dataCard?.medicalServiceId,
          [BookAppointmentKey.MedicalServiceIdOld]: dataCard?.medicalServiceId,
          [BookAppointmentKey.MedicalServiceName]: dataCard?.medicalServiceName,
          [BookAppointmentKey.MedicalServicePrice]: dataCard?.medicalServicePrice,
          [BookAppointmentKey.MedicalServicePriceOld]: dataCard?.medicalServicePrice,
        }
      };
      // dispatch(actions.saveMakeAppointData(paramPatient));

      if (id === NavigationKey.NextToBookByDay) {
        //chon thoi gian 
        let paramsTime = {
          ...paramPatient,
          [BookAppointmentKey.DateChoose]: convertTimeDateVN(
            dataCard?.startTime,
            FORMAT_DD_MM_YYYY
          ),
          [BookAppointmentKey.StartTime]: dataCard?.startTime,
          [BookAppointmentKey.EndTime]: dataCard?.endTime,
          [BookAppointmentKey.TimeDisPlay]: dataCard?.timeBookingDisplay,
        }

        if (dataCard?.doctorId) {
          paramsTime = {
            ...paramsTime,
            [BookAppointmentKey.DoctorId]: dataCard?.doctorId,
            [BookAppointmentKey.DoctorName]: dataCard?.doctorName,
            [BookAppointmentKey.medicalSpecialityId]:
              dataCard?.medicalSpecialityId,
            [BookAppointmentKey.MedicalSpecialtyName]:
              dataCard?.medicalSpecialityName,
            [BookAppointmentKey.DoctorGender]: dataCard?.doctorGender,
            [BookAppointmentKey.AcademicName]: dataCard?.academicCode,
            // //để kiem tra ca làm viec cua bac sy
            [BookAppointmentKey.workingTime]: dataCard?.workingTime,
            //phong khám
            [BookAppointmentKey.ClinicsId]: dataCard?.clinicId,
            [BookAppointmentKey.ClinicName]: dataCard?.clinicName,
          }
        }
        console.log("paramsTime:    ", paramsTime)
        dispatch(actions.saveMakeAppointData(paramsTime));
        AppNavigate.navigateToBookByDay(navigation.dispatch);
      } else if (id === NavigationKey.NextToBookByDoctor) {
        // AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
        //   typeScreen: 2,
        // });

        //chọn bác sỹ va thoi gian
        let paramDoctorAndTime = {
          ...paramPatient,
          [BookAppointmentKey.DoctorId]: dataCard?.doctorId,
          [BookAppointmentKey.DoctorName]: dataCard?.doctorName,
          [BookAppointmentKey.medicalSpecialityId]:
            dataCard?.medicalSpecialityId,
          [BookAppointmentKey.MedicalSpecialtyName]:
            dataCard?.medicalSpecialityName,
          [BookAppointmentKey.DoctorGender]: dataCard?.doctorGender,
          [BookAppointmentKey.AcademicName]: dataCard?.academicCode,
          // //để kiem tra ca làm viec cua bac sy
          [BookAppointmentKey.workingTime]: dataCard?.workingTime,

          //thời gian
          [BookAppointmentKey.DateChoose]: convertTimeDateVN(
            dataCard?.startTime,
            FORMAT_DD_MM_YYYY
          ),
          [BookAppointmentKey.StartTime]: dataCard?.startTime,
          [BookAppointmentKey.EndTime]: dataCard?.endTime,
          [BookAppointmentKey.TimeDisPlay]: dataCard?.timeBookingDisplay,
        };

        console.log("paramDoctorAndTime:     ", paramDoctorAndTime)

        dispatch(actions.saveMakeAppointData(paramDoctorAndTime));
        AppNavigate.navigateToBookByDoctor(navigation.dispatch);
      }
    }
    dispatch(actions.hideLoading());
  }

  const handleAgree = async ({ id }) => {
    if (id === "TypeSendToMail") {
      alert("Tính năng đang phát triển hãy test sau!");
      // API.requestExaminationCardSendToMail(dispatch, {});
    } else if (id === "TypeMedical") {
      AppNavigate.navigateToHealthDeclarationList(navigation.dispatch)
    } else if (id === "TypeToHome") {
      // AppNavigate.navigateToTabPatientRecord(navigation.dispatch);
      // AppNavigate.navigateWhenAppStart(navigation.dispatch);
      AppNavigate.navigateToTabHome1(navigation.dispatch);
      AppNavigate.navigateWhenAppStart(navigation.dispatch)
    } else if (id === "TypeCancel") {
      showDialog();
    } else if (id === "TypeDatLaiLich") {
      navigationDatLichKham()
    } else if (id === "TypeResult") {
      let params = {
        // "patientRecordCode": dataCard?.patientCode,
        "doctorAppointmentCode": statusAppointment === 3 ? dataCard?.appointmentCode : dataCard?.oldAppointmentCode,
        // "startDate": new Date(),
        // "endDate": new Date()
      }
      // console.log("params:    ", params)
      let phone = await API.getPhoneOldAppoinment(dispatch, statusAppointment === 3 ? dataCard?.appointmentCode : dataCard?.oldAppointmentCode);
      console.log("phone:   ", phone)
      let data = await API.getMedialSpecificDoctorAppintment(dispatch, params);
      // console.log(data)
      if (phone) {
        AppNavigate.navigateToVerifyPhoneScreen(navigation.dispatch, { data: data, phone: phone.phone });
      } else {
        setTimeout(() => {
          Toast.show("Phiếu khám không có số điện thoại. Vui lòng kiểm tra lại")
        }, 700);
      }
    }
  };
  return (
    <ScreensView
      isShowBack={!isDatLichKham}
      titleScreen={"Thông tin phiếu khám"}
      styleContent={styles.styleContent}

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
        <View style={styles.styelBorderContent}>
          <Text
            style={{
              fontFamily: Fonts.SFProDisplayRegular,
              color: Colors.colorMain,
              fontSize: Dimension.fontSize16,
              textAlign: 'center'

            }}
          >
            {"PHIẾU ĐẶT LỊCH KHÁM"}
          </Text>
          <Text style={{ fontSize: Dimension.fontSize20, fontFamily: Fonts.SFProDisplayRegular, color: 'black', textAlign: 'center', paddingHorizontal: Dimension.padding2x }}>
            {dataCard?.healthFacilityName?.toUpperCase() || ""}
          </Text>
          <Text style={[{ ...styles.styleTextContent }, { fontSize: 12 }]}>
            {"(Mã đặt lịch: " + (dataCard?.bookingCode || "") + ")"}
          </Text>
          <View style={styles.stImageQRCode}>
            <QRCode
              value={dataCard?.bookingCode + ""}
              size={SCREEN_WIDTH / 3}
            // logo={ImagesUrl.LogoApp}
            // logoSize={50}
            />
          </View>
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
        <View style={{ ...styles.styelBorderContent, paddingHorizontal: 16, marginTop: 22 }}>
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Bệnh nhân"}
            value={dataCard?.patientName || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Ngày sinh"}
            value={dataCard?.patientDobFormat || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Địa chỉ"}
            value={dataCard?.patientAddress || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Ngày khám"}
            value={dataCard?.dateBooking || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Giờ khám dự kiến"}
            value={dataCard?.timeBookingDisplay || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={{ ...styles.stTextValue, color: '#00C6AD' }}
            styleTitle={styles.stTextTitle}
            title={"Bác sỹ khám"}
            value={dataCard?.doctorName || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={{ ...styles.stTextValue }}
            styleTitle={styles.stTextTitle}
            title={"Dịch vụ khám"}
            value={dataCard?.medicalServiceName || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={{ ...styles.stTextValue }}
            styleTitle={styles.stTextTitle}
            title={"Giá tiền dịch vụ"}
            // value={(dataCard?.medicalServicePrice || "0") + ' đ'}
            value={dataCard?.medicalServicePrice ? dataCard?.medicalServicePrice.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + "đ" : "0 đ"}

          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={{ ...styles.stTextValue }}
            styleTitle={styles.stTextTitle}
            title={"Trạng thái thanh toán"}
            value={dataCard?.paymentStatus == 1 ? "Chờ thanh toán" : "thanh toán thành công"}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Phòng khám"}
            value={dataCard?.clinicName || ""}
          />
          <TextView
            style={styles.stContainRow}
            styleContainerText={styles.stContainTextRow}
            styleValue={styles.stTextValue}
            styleTitle={styles.stTextTitle}
            title={"Lý do khám"}
            value={dataCard?.medicalReason || ""}
          />
          <ButtonFooterView dataCard={dataCard} onPress={handleAgree} isDatLichKham={isDatLichKham} statusAppointment={statusAppointment} />
        </View>
      </DropShadow>
    </ScreensView>
  );
}
