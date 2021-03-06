import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Colors, convertTimeDateVN, convertTimeDate, NavigationKey } from "../../../../commons";
import { ButtonView } from "../../../../components";
import styles from "./styles";
import HTML from "react-native-render-html";
import { FORMAT_DD_MM_YYYY, FORMAT_HH_MM } from "../../../../commons/utils/DateTime";
import { useDispatch } from "react-redux";
import actions from "../../../../redux/actions";
import API from "../../../../networking";
import models, { BookAppointmentKey } from "../../../../models";
import AppNavigate from "../../../../navigations/AppNavigate";
import NotificationsPopup from "../popup";
import NotificationType from "../NotificationType";

export default function ChangeAppointment(props) {
  const dispatch = useDispatch();
  const { notifiData, refDialog, navigation } = props;
  const { object, body } = notifiData;
  let dataCard = {};
  try {
    dataCard = JSON.parse(JSON.parse(object));
  } catch (error) {
    dataCard = JSON.parse(object);
  }
  let timeBookingDisplay = convertTimeDate(dataCard?.startTime, FORMAT_HH_MM) + "-" + convertTimeDate(dataCard?.endTime, FORMAT_HH_MM);
  const [isConfirmed, setIsConfirmed] = useState(0);
  const handleOnPress = ({ id }) => {
    refDialog.hideDialog();
    if (id === "NaviRebooking") {
      //sau chuyen lai dat lai lich
      navigationDatLichKham();
    } else if (id === "Confirm") {
      confirmChangeAppointment();
    } else if (id === "Cancel") {
      cancelAppointment();
    }
  };

  useEffect(() => {
    getExaminationCardInfo();
    return () => { };
  }, []);

  const getExaminationCardInfo = async () => {
    let dataCardResonse = await API.getExaminationCardInfo(dispatch, dataCard.id);
    console.log("dataCardResonse:    ", dataCardResonse)
    setIsConfirmed(dataCardResonse.isConfirmed);
  }

  const confirmChangeAppointment = async () => {
    let isDone = await API.requestConfirmChangeAppointment(dispatch, { id: dataCard.id });
    if (isDone) {
      showDialog(NotificationType.ChangeAppointmentSuccess, dataCard.id);
    }
  }

  const cancelAppointment = async () => {
    let isDone = await API.getCancelAppointment(dispatch, dataCard.id);
    if (isDone) {
      showDialog(NotificationType.CancelAppointmentSuccess);
    } else {
      showDialog(NotificationType.CancelAppointmentFailed);
    }
  }

  const showDialog = (type, objectId) => {
    refDialog &&
      refDialog
        .configsDialog({
          isScroll: true,
        })
        .drawContents(
          <NotificationsPopup
            notifiData={{ type, objectId }}
            refDialog={refDialog}
            navigation={navigation}
          />
        )
        .visibleDialog();
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
    //       id === dataCard?.type, ///1: Theo ng??y, 2: Theo b??c s??
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
        //1 cho ph??p thanh to??n online, 2 l?? k
        [BookAppointmentKey.prepaymentMedicalService]: dataHeathFacilities?.config?.prepaymentMedicalService,
      };
      // dispatch(actions.saveMakeAppointData(paramHeathFacilities));

      //ch???n b???nh nh??n kh??m
      let dataRecord = models.getPatientRecordsInfo(dataCard?.patientRecordId)
      let paramPatient = {
        ...{
          [BookAppointmentKey.TypeBook]: dataCard?.type, ///1: Theo ng??y, 2: Theo b??c s??
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
        }
        dispatch(actions.saveMakeAppointData(paramsTime));
        AppNavigate.navigateToBookByDay(navigation.dispatch);
      } else if (id === NavigationKey.NextToBookByDoctor) {
        // AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
        //   typeScreen: 2,
        // });

        //ch???n b??c s??? va thoi gian
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
          //th???i gian
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
      <Text style={styles.stTextTitle}>{"Th??ng b??o"}</Text>
      <View style={styles.stTextContent}>
        <HTML tagsStyles={{ p: styles.stHtml }} source={{ html: body }} />
      </View>
      {/* <View style={styles.stFooterButton}>
        <ButtonView
          id={"Closed"}
          title={"????ng"}
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
      </View> */}
      {isConfirmed == 0 ?
        <View style={styles.stFooterButton}>
          {/* <ButtonView
            id={"Confirm"}
            title={"X??c nh???n"}
            onPress={handleOnPress}
            bgColor={Colors.colorMain}
            style={styles.stButtonConfirm}
          /> */}

          <ButtonView
            id={"NaviRebooking"}
            title={"?????t l???i l???ch"}
            onPress={handleOnPress}
            bgColor={Colors.colorMain}
            // textColor={Colors.colorTitleScreen}
            style={styles.stButtonConfirm}
          />
        </View> : <View></View>
      }
      {isConfirmed == 0 ?
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <ButtonView
            id={"Cancel"}
            title={"Hu??? l???ch"}
            onPress={handleOnPress}
            bgColor={Colors.colorBtEdit}
            textColor={Colors.colorCancel}
            style={styles.stButtonConfirm}
          />
          {/* <ButtonView
            id={"NaviRebooking"}
            title={"?????i l???ch"}
            onPress={handleOnPress}
            bgColor={Colors.backgroundSearch}
            textColor={Colors.colorTitleScreen}
            style={styles.stButtonConfirm}
          /> */}
          <ButtonView
            id={"Confirm"}
            title={"?????ng ??"}
            onPress={handleOnPress}
            bgColor={Colors.bgStatus3}
            textColor={Colors.btClosedPopup}
            style={styles.stButtonConfirm}
          />
        </View> : <View></View>
      }
    </View >
  );
}
