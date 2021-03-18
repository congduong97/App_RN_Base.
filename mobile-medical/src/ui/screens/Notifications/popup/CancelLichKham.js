import React from "react";
import { Text, View } from "react-native";
import { Dimension, Colors, NavigationKey, convertTimeDateVN } from "../../../../commons";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import HTML from "react-native-render-html";
import API from "../../../../networking";
import actions from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import models, { BookAppointmentKey } from "../../../../models";
import { convertTimeDate, FORMAT_DD_MM_YYYY, FORMAT_HH_MM } from "../../../../commons/utils/DateTime";
import AppNavigate from "../../../../navigations/AppNavigate";

export default function SystemNoti(props) {
  const { refDialog, notifiData, navigation } = props;
  const { object,body } = notifiData;
  let dataCard = {};
  try {
    dataCard = JSON.parse(JSON.parse(object));
  } catch (error) {
    dataCard = JSON.parse(object);
  }
  let timeBookingDisplay = convertTimeDate(dataCard?.startTime, FORMAT_HH_MM) + "-" + convertTimeDate(dataCard?.endTime, FORMAT_HH_MM);
  const dispatch = useDispatch();
  const handleOnPress = ({ }) => {
    refDialog.hideDialog();
  };
  const handleOnPress1 = ({ }) => {
    refDialog.hideDialog();
    navigationDatLichKham();
  };

  const navigationDatLichKham = async () => {
    //  dispatch(actions.showLoading());
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

          [BookAppointmentKey.MedicalServiceId]: dataCard?.medicalServiceId,
          [BookAppointmentKey.MedicalServiceName]: dataCard?.medicalServiceName,
          [BookAppointmentKey.MedicalServicePrice]: dataCard?.medicalServicePrice,
          //phong kham
          [BookAppointmentKey.ClinicsId]: dataCard?.clinicId,
          [BookAppointmentKey.ClinicName]: dataCard?.clinicName,
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

          [BookAppointmentKey.MedicalServiceId]: dataCard?.medicalServiceId,
          [BookAppointmentKey.MedicalServiceName]: dataCard?.medicalServiceName,
          [BookAppointmentKey.MedicalServicePrice]: dataCard?.medicalServicePrice,
        };

        dispatch(actions.saveMakeAppointData(paramDoctorAndTime));
        AppNavigate.navigateToBookByDoctor(navigation.dispatch);
      }
    }
    //  dispatch(actions.hideLoading());
  }

  return (
    <View style={styles.stContain}>
      <Text style={styles.stTextTitle}>{"Thông báo"}</Text>
      <HTML tagsStyles={{ p: styles.stHtml }} source={{ html: body }} />
      <View style={styles.stFooterButton}>
        <ButtonView
          title={"Đặt lại lịch"}
          onPress={handleOnPress1}
          bgColor={Colors.colorMain}
          // textColor={Colors.colorTitleScreen}
          style={styles.stButtonConfirm}
          style={{
            ...styles.stButtonConfirm,
            borderColor: Colors.colorMain,
            borderWidth: 1,
            marginBottom: 0,
          }}
        />
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
