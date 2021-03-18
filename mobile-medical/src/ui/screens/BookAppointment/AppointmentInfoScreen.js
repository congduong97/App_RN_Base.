import React, { useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useApp, useMergeState } from "../../../AppProvider";
import AppNavigate from "../../../navigations/AppNavigate";
import { BookAppointmentKey, getGenderName } from "../../../models";
import {
  ScreensView,
  ButtonView,
  TextView,
  InputView,
} from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import ObjectBook, { handleChooseValue } from "./ObjectBook";
import actions from "../../../redux/actions";
import {
  NavigationKey,
  ImagesUrl,
  Colors,
  Dimension,
  Fonts,
  concatenateString,

} from "../../../commons";
import {
  convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
} from "../../../commons/utils/DateTime";
import { PatientInfoView, ChoiceValueView } from "./components";
import ActionKey from "./ActionKey";
import API from "../../../networking";
import styles from "./styles";
import {
  validateImageUri,
} from "../../../commons";
// const avatar = require("../../../../assets/images/avatar.jpg");
import { TextAvatar } from '../../../ui/components/TextAvatar';
import DropShadow from "react-native-drop-shadow";
import models from "../../../models";
function HeadCardView(props) {
  const { makeAppointData, onPress, id, patientRecordId } = props;
  const {
    TimeDisPlay,
    DateChoose,
    medicalReason,
    medicalSpecialtyName,
    healthFacilityName,
  } = makeAppointData;
  // let name = makeAppointData[BookAppointmentKey.PatientRecordName];
  // let birthday = convertTimeDateVN(
  //   makeAppointData[BookAppointmentKey.PatientRecordBirthday],
  //   FORMAT_DD_MM_YYYY
  // );
  let khoaName = medicalSpecialtyName ? `Khoa ${medicalSpecialtyName}` : "";
  let addressMedical = concatenateString(", ", khoaName, healthFacilityName);
  const { avatar, relationship, name, dob } = models.getPatientRecordsInfo(patientRecordId);

  let birthday = convertTimeDateVN(
    dob,
    FORMAT_DD_MM_YYYY
  );
  let patientRecorAvatar = validateImageUri(avatar);
  return (
    <View style={myStyles.stContainHeader}>
      <View
        style={{
          flexDirection: "row",
          borderBottomColor: '#E7E5FF',
          borderBottomWidth: 1
        }}
      >
        {patientRecorAvatar ?
          <Image source={patientRecorAvatar} style={myStyles.stImageAvatar} />
          : <TextAvatar containStyle={{ margin: 12 }} name={name || "Doctor"} textColor={Colors.colorMain} size={90} borderRadius={45} backgroundColor={Colors.colorSecondary}></TextAvatar>
        }
        <View style={{ flex: 1, paddingTop: Dimension.padding2x }}>
          <Text style={myStyles.stTextName}>{name}</Text>
          <TextView
            style={styles.styleContainerDate}
            styleValue={styles.stTextValue}
            value={models.getRelationshipName(relationship)}
            styleIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-user-dot"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />

          <TextView
            style={styles.styleContainerDate}
            styleValue={styles.stTextValue}
            value={birthday}
            styleIconLeft={styles.stylesIconLeft}
            nameIconLeft={"ic-calendar"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />
        </View>

        <IconView
          id={id}
          name={"ic-edit"}
          size={20}
          color={Colors.colorMain}
          onPress={onPress}
          style={{
            height: 57,
            width: 57,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 12,
            backgroundColor: "#DBFFFA",
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        {/* <View/> */}
      </View>
      {/* <View style={{ justifyContent: "center", backgroundColor: "gray" }}>
        <View style={myStyles.stViewSemiCircleLeft} />
        <View style={myStyles.stViewLine} />
        <View style={myStyles.stViewSemiCircleRigth} />
      </View> */}

      <View
        style={{
          paddingHorizontal: Dimension.padding2x,
          paddingBottom: Dimension.padding2x,
        }}
      >
        <Text style={myStyles.stTextHead}>{"Thông tin khám bệnh"}</Text>
        <View
          style={{
            paddingHorizontal: 10
          }}
        >
          <TextView
            style={myStyles.stContainRow}
            styleValue={myStyles.stTextRow}
            value={TimeDisPlay || ""}
            nameIconLeft={"ic-time-clock"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />
          <TextView
            style={{
              ...myStyles.stContainRow,

            }}
            styleValue={myStyles.stTextRow}
            value={DateChoose || ""}
            nameIconLeft={"ic-calendar"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />

          <TextView
            style={myStyles.stContainRow}
            styleValue={myStyles.stTextRow}
            value={addressMedical || ""}
            nameIconLeft={"ic-pin"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />
          <TextView
            numberOfLines={2}
            style={myStyles.stContainRow}
            styleValue={myStyles.stTextRow}
            value={medicalReason || ""}
            nameIconLeft={"ic-report"}
            colorIconLeft={Colors.textLabel}
            sizeIconLeft={16}
          />
        </View>
      </View>
    </View>
  );
}

export default function AppointmentInfoScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [stateScreen, setStateScreen] = useMergeState({
    reRender: false,
  });
  const { reRender } = stateScreen;


  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );
  let doctorId = makeAppointData[BookAppointmentKey.DoctorId];
  let doctorName = makeAppointData[BookAppointmentKey.DoctorName];
  let doctorGender = makeAppointData[BookAppointmentKey.DoctorGender];
  let khoaName = makeAppointData[BookAppointmentKey.MedicalSpecialtyName]
    ? `${makeAppointData[BookAppointmentKey.MedicalSpecialtyName]}`
    : "";
  let doctorAvatar = validateImageUri(makeAppointData[BookAppointmentKey.DoctorAvatar]);
  // let addressMedical = concatenateString(", ", khoaName, healthFacilityName);

  useEffect(() => {
    if (isFocused) {
      getDataFitterSpecialities()
    }
  }, [isFocused]);

  const getDataFitterSpecialities = async (id) => {
    if (makeAppointData?.patientRecordId) {
      let data = models.getPatientRecordsInfo(makeAppointData?.patientRecordId)
      let paramPatient = {
        [BookAppointmentKey.HaveHealthInsurance]: data?.healthInsuranceCode ? 1 : 0,
        [BookAppointmentKey.HealthInsuranceCode]: data?.healthInsuranceCode,
      };
      dispatch(actions.saveMakeAppointData(paramPatient));
    }
    setStateScreen({ reRender: !reRender })
  }

  const navigateToCreateRecord = () => {
    AppNavigate.navigateToCreateRecord(navigation.dispatch, {
      dataInfo: models.getPatientRecordsInfo(makeAppointData?.patientRecordId),
      isEdit: true,
    });
  }



  const handleNextScreen = async () => {
    console.log("makeAppointData -------123123123 :    ", makeAppointData)
    let dataResponse = {}
    if (makeAppointData.id) {
      dataResponse = await API.requestBookByDayUpdate(dispatch, makeAppointData);
    }
    if (makeAppointData.id && dataResponse) {
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
  };

  const handleOnPress = async ({ id }) => {
    // AppNavigate.navigateToExaminationCard(navigation.dispatch, {});
    if (id === ActionKey.NextExaminationCard) {
      if(makeAppointData?.[BookAppointmentKey.MedicalServiceId] == makeAppointData?.[BookAppointmentKey.MedicalServiceIdOld]) {
        handleNextScreen()
      } else {
        AppNavigate.navigateToXacThucThanhToanScreen(navigation.dispatch, {});
      }
    } else if (id === ActionKey.NextToEditPatientRecords) {
      navigateToCreateRecord()
    } else if (id === ActionKey.NextChooseDoctor) {
      AppNavigate.navigateToDoctorSearch(navigation.dispatch, {
        typeScreen: 2,
        isBackKillClass: makeAppointData?.[BookAppointmentKey.TypeBook] === 1
      });
    }
  };
  return (
    <ScreensView
      isScroll={false}
      styleBackground={{ backgroundColor: "white" }}
      titleScreen={"Thông tin lịch khám"}
      bgColorStatusBar="transparent"
      styleContent={myStyles.styleContent}
      styleTitle={{ color: "black" }}

      renderFooter={
        <ButtonView
          id={ActionKey.NextExaminationCard}
          title={"Đặt lịch khám"}
          onPress={handleOnPress}
          style={{ marginBottom: 20, marginHorizontal: 15, marginTop: 20 }}
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
        <HeadCardView
          id={ActionKey.NextToEditPatientRecords}
          makeAppointData={makeAppointData}
          onPress={handleOnPress}
          patientRecordId={makeAppointData?.patientRecordId}
        />
      </DropShadow>
      {doctorId ? (
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
          <Text style={myStyles.stTextHead}>{"Bác sỹ khám và tư vấn"}</Text>
          <View style={myStyles.stContainDoctor}>
            {doctorAvatar ?
              <Image
                source={doctorAvatar}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  margin: 12,
                }}
              /> :
              <TextAvatar containStyle={{ margin: 12 }} name={doctorName || "Doctor"} textColor={Colors.colorMain} size={90} borderRadius={45} backgroundColor={Colors.colorSecondary}></TextAvatar>
            }
            <View style={{ flex: 1, justifyContent: "center", paddingRight: 12 }}>
              <Text style={myStyles.stTextName}>{doctorName || ""}</Text>


              <View style={[styles.styleContainerDate, { flexDirection: "row", alignItems: 'center' }]}>
                <Image
                  source={ImagesUrl.iconDoctor}
                  style={{ width: 14, height: 14, resizeMode: "contain", tintColor: Colors.textLabel }}
                />
                <Text style={{ ...styles.stTextValue, marginLeft: 8 }}>{khoaName || ""}</Text>
              </View>
              {/* <TextView
                style={styles.styleContainerDate}
                styleValue={styles.stTextValue}
                value={khoaName || ""}
                styleIconLeft={styles.stylesIconLeft}
                nameIconLeft={"ic-user-dot"}
                colorIconLeft={Colors.colorIcon}
                sizeIconLeft={14}
              /> */}
              <TextView
                style={styles.styleContainerDate}
                styleValue={styles.stTextValue}
                value={getGenderName(doctorGender)}
                styleIconLeft={styles.stylesIconLeft}
                nameIconLeft={"ic-gender"}
                colorIconLeft={Colors.textLabel}
                sizeIconLeft={14}
              />
            </View>

            <IconView
              id={ActionKey.NextChooseDoctor}
              onPress={handleOnPress}
              name={"ic-arrow-right"}
              size={24}
              color={Colors.colorMain}
            />
          </View>
        </DropShadow>
      ) : <View />}

    </ScreensView>
  );
}

const myStyles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    // justifyContent: 'flex-end',
    // marginTop: 180,
    // elevation: 5,
    // shadowOpacity: 1,
  },
  stContainHeader: {
    borderRadius: 12,
    backgroundColor: "white",
    // marginHorizontal: Dimension.margin2x,

    // alignSelf: "center",
    // position: "absolute",
    // top: Platform.OS === "ios" ? 90 : 70,
    // marginTop: "8%",
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
    // zIndex: 999,
    overflow: "visible",
  },
  stImageAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    margin: 12,
  },
  stTextName: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplaySemibold,

    marginBottom: Dimension.margin,
  },
  stTextHead: {
    fontSize: Dimension.fontSize16,
    color: Colors.colorTextMenu,
    fontFamily: Fonts.SFProDisplayRegular,
    textAlign: "center",
    marginVertical: Dimension.margin2x,
    // backgroundColor: "#345",
  },
  stContainRow: {
    minHeight: Dimension.minHeight22,
    alignItems: "center",
    paddingVertical: 3,
  },
  stTextRow: {
    fontWeight: "500",
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
    color: Colors.colorTextMenu,
  },

  stViewSemiCircleLeft: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: "absolute",
    backgroundColor: "#FFFFFF",
    left: -15,
    borderRightColor: "gray",
    borderRightWidth: 0.5,
  },

  stViewSemiCircleRigth: {
    height: 30,
    width: 30,
    borderRadius: 15,
    position: "absolute",
    right: -15,
    backgroundColor: "#FFFFFF",
    borderLeftColor: "gray",
    borderLeftWidth: 0.5,
  },
  stViewLine: {
    borderWidth: 0.5,
    borderColor: "#f2f2f2",
    borderStyle: "dashed",
    zIndex: 0,
  },

  stContainDoctor: {
    borderRadius: 12,
    backgroundColor: "white",
    flexDirection: "row",
    maxHeight: 120,
    alignItems: "center",
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
    marginBottom: 12,
    marginHorizontal: 1
  },
});
