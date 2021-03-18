import React from "react";
import { Text, View } from "react-native";
import { Colors, NavigationKey, convertTimeDateVN, convertTimeDate } from "../../../../commons";
import AppNavigate from "../../../../navigations/AppNavigate";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import actions from "../../../../redux/actions";
import API from "../../../../networking";
import models, { BookAppointmentKey } from "../../../../models";
import { useDispatch } from "react-redux";
import { FORMAT_DD_MM_YYYY, FORMAT_HH_MM } from "../../../../commons/utils/DateTime";
export default function RefuseAppointment(props) {
  const dispatch = useDispatch();
  const { refDialog, navigation, notifiData } = props;
  const { object } = notifiData;
  let dataCard = {};
  try {
    dataCard = JSON.parse(JSON.parse(object));
  } catch (error) {
    dataCard = JSON.parse(object);
  }
  let timeBookingDisplay = convertTimeDate(dataCard?.startTime, FORMAT_HH_MM) + "-" + convertTimeDate(dataCard?.endTime, FORMAT_HH_MM);
  const handleOnPress = ({ id }) => {
    if (id === "NaviRebooking") {
      //sau chuyen lai dat lai lich
      navigationDatLichKham();
    }
    refDialog.hideDialog();
  };

  const navigationDatLichKham = async () => {
    dispatch(actions.showLoading());
    var id = '';
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
          [BookAppointmentKey.TimeDisPlay]: timeBookingDisplay,
        }
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
          [BookAppointmentKey.MedicalSpecialtyId]:
            dataCard?.medicalSpecialityId,
          // [BookAppointmentKey.MedicalSpecialtyName]:
          //   itemSelected?.medicalSpecialityName,
          // [BookAppointmentKey.DoctorGender]: itemSelected?.gender,
          [BookAppointmentKey.AcademicName]: dataCard?.academicCode,
          //thời gian
          [BookAppointmentKey.DateChoose]: convertTimeDateVN(
            dataCard?.startTime,
            FORMAT_DD_MM_YYYY
          ),
          [BookAppointmentKey.StartTime]: dataCard?.startTime,
          [BookAppointmentKey.EndTime]: dataCard?.endTime,
          [BookAppointmentKey.TimeDisPlay]: timeBookingDisplay,
        };

        dispatch(actions.saveMakeAppointData(paramDoctorAndTime));
        AppNavigate.navigateToBookByDoctor(navigation.dispatch);
      }
    }
    dispatch(actions.hideLoading());
  }

  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <Text style={styles.stTextContent}>
        {
          "Đặt lịch khám không thành công. Bạn có muốn đặt lại lịch khám?"
        }
      </Text>
      <View style={styles.stFooterButton}>
        <ButtonView
          id={"Cancel"}
          title={"Huỷ"}
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
          id={"NaviRebooking"}
          title={"Đặt lại lịch"}
          onPress={handleOnPress}
          bgColor={Colors.colorMain}
          style={styles.stButtonConfirm}
        />
      </View>
    </View>
  );
}
