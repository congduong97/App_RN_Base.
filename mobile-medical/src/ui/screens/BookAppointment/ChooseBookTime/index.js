import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef } from "react";
import { Image, Platform, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DropShadow from "react-native-drop-shadow";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMergeState } from "../../../../AppProvider";
import { Colors, Dimension, validateImageUri } from "../../../../commons";
import {
  convertDateFormatVN, convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
  FORMAT_YYYY_MM_DD,
  getAdd30Days, getAddDay,
  getDate16h30, getDateHolidayOfYear, getHolidaysDatesOfMonthNow,
  isCompareTime, isPastWithCurrentDate
} from "../../../../commons/utils/DateTime";
import { ButtonView, ScreensView } from "../../../../components";
import models, { BookAppointmentKey } from "../../../../models";
import AppNavigate from "../../../../navigations/AppNavigate";
import API from "../../../../networking";
import actions from "../../../../redux/actions";
import { TextAvatar } from "../../../../ui/components/TextAvatar";
import ItemSelectTime from "./ItemSelectTime";
import styles from "./styles";

LocaleConfig.locales["fr"] = models.configLocate;
LocaleConfig.defaultLocale = "fr";

const registrationDateCalendar = Colors.registrationDateCalendar;
const todayColorCalendar = Colors.todayColorCalendar;
const dayOffCalendarColor = Colors.dayOffCalendar;
const disabledDateCalendar = Colors.disabledDateCalendar;

const renderNote = (title, color) => {
  return (
    <View style={styles.stContainTextDes}>
      <View style={[styles.stDotDis, { backgroundColor: color }]} />
      <Text style={styles.stTextDes}>{title}</Text>
    </View>
  );
};

const handleDateSelected = (dateValue) => {
  let dateConvert = ""
  console.log("dateValue:    ", dateValue)
  if (dateValue) {
    dateConvert = convertTimeDateVN(dateValue, FORMAT_YYYY_MM_DD);
    // return {
    //   [dateConvert]: {
    //     customStyles: {
    //       container: { backgroundColor: registrationDateCalendar },
    //       text: { color: "white" },
    //     },
    //   },
    // };
  } else {
    dateConvert = convertTimeDateVN(getAddDay(new Date(), 1), FORMAT_YYYY_MM_DD);
    if (isCompareTime(new Date(), getDate16h30(new Date()))) {
      dateConvert = convertTimeDateVN(getAddDay(new Date(), 2), FORMAT_YYYY_MM_DD);
    }
  }
  return {
    [dateConvert]: {
      customStyles: {
        container: { backgroundColor: registrationDateCalendar },
        text: { color: "white" },
      },
    },
  };
};

export default function ChooseBookTimeScreen(props) {
  const dispatch = useDispatch();
  const route = useRoute();
  const onResponse = route?.params?.onResponse;
  const navigation = useNavigation();
  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );
  const dateSelect = makeAppointData?.startTime || "";
  const [stateScreen, setStateScreen] = useMergeState({
    isShowPickerDate: false,
    selectedDate: dateSelect, ///convertTimeServerToDateVN(dateSelect, FORMAT_YYYY_MM_DD),
    dataDateCalendar: [],
    timeWorking: [],
    monthDataChoose: getHolidaysDatesOfMonthNow(dateSelect),
    dateDataChoose: handleDateSelected(dateSelect),
    isValidate: dateSelect,
  });

  const {
    selectedDate,
    monthDataChoose,
    dateDataChoose,
    reRender,
    isValidate,
  } = stateScreen;
  const refSelectedTime = useRef({
    startTime: makeAppointData?.startTime,
    endTime: makeAppointData?.endTime,
  });

  const healthFacility = models.getHealthFacilityInfo(
    makeAppointData?.healthFacilityId
  );
  console.log(healthFacility);
  const selectedTime = useMemo(() => refSelectedTime.current, [selectedDate]);

  const onMonthChange = (dataMonth) => {
    setStateScreen({
      selectedMonth: dataMonth,
      monthDataChoose: getHolidaysDatesOfMonthNow(dataMonth?.dateString),
    });
  };

  useEffect(() => {
    if (!dateSelect) {
      let dateConvert = convertTimeDateVN(getAddDay(new Date(), 1), FORMAT_YYYY_MM_DD);
      if (isCompareTime(new Date(), getDate16h30(new Date()))) {
        dateConvert = convertTimeDateVN(getAddDay(new Date(), 2), FORMAT_YYYY_MM_DD);
      }
      onDayPress({ dateString: dateConvert })
    }
  }, []);

  const onDayPress = (selectDate) => {
    if (isPastWithCurrentDate(selectDate.dateString)) {
      Toast.showWithGravity(
        "Bạn phải chọn ngày khám bệnh lớn hơn hoặc bằng ngày hiện tại",
        Toast.LONG,
        Toast.CENTER
      );
    } else {
      selectedTime.startTime = "";
      selectedTime.endTime = "";
      setStateScreen({
        isValidate: selectedTime.startTime && selectedTime.endTime,
        selectedDate: selectDate?.dateString,
        dateDataChoose: handleDateSelected(selectDate?.dateString),
      });
    }
  };

  const onSelectedTime = (selectedItem) => {
    console.log("selectedItem:    ", selectedItem)
    selectedTime.startTime = selectedItem?.startTime;
    selectedTime.endTime = selectedItem?.endTime;
    selectedTime.isMorning = selectedItem?.isMorning;
    selectedTime.title = selectedItem?.title;
    makeAppointData[BookAppointmentKey.TimeDisPlay] = selectedItem?.title;
    setStateScreen({
      isValidate: selectedTime.startTime && selectedTime.endTime,
    });
  };

  const handleAgree = async () => {
    makeAppointData[BookAppointmentKey.DateChoose] = convertTimeDateVN(
      selectedTime.startTime,
      FORMAT_DD_MM_YYYY
    );
    makeAppointData[BookAppointmentKey.StartTime] = selectedTime.startTime;
    makeAppointData[BookAppointmentKey.EndTime] = selectedTime.endTime;

    //check bs vs khung gio nay
    if (makeAppointData[BookAppointmentKey.DoctorId]) {
      console.log('ádadsadsadsad:      ', {
        doctorId: makeAppointData[BookAppointmentKey.DoctorId],
        date: convertTimeDateVN(
          selectedTime.startTime,
          FORMAT_YYYY_MM_DD
        ),
      })
      let dataWorkingBS = await API.requestDoctorWorkingTime(dispatch, {
        doctorId: makeAppointData[BookAppointmentKey.DoctorId],
        date: convertTimeDateVN(
          selectedTime.startTime,
          FORMAT_YYYY_MM_DD
        ),
      })
      let isResetDoctor = false
      if (dataWorkingBS) {
        let dataSelect = dataWorkingBS.filter((item) => item.time == selectedTime.title)
        if (dataSelect && dataSelect.length == 0) {
          isResetDoctor = true
        }
      } else {
        isResetDoctor = true
      }
      if (isResetDoctor) {
        makeAppointData[BookAppointmentKey.DoctorId] = ''
        makeAppointData[BookAppointmentKey.DoctorName] = ''
        makeAppointData[BookAppointmentKey.DoctorGender] = ''
        makeAppointData[BookAppointmentKey.AcademicName] = ''
        makeAppointData[BookAppointmentKey.workingTime] = 0
      }

      // console.log("dataSelect:    ", dataSelect)
      // console.log("makeAppointData[BookAppointmentKey.workingTime]:    ", selectedTime)
      // console.log("makeAppointData[BookAppointmentKey.workingTime]:    ", makeAppointData[BookAppointmentKey.workingTime])
      // if (makeAppointData[BookAppointmentKey.workingTime] && makeAppointData[BookAppointmentKey.workingTime] !== 3) {
      //   let workingTime = selectedTime.isMorning ? 1 : 2
      //   if (makeAppointData[BookAppointmentKey.workingTime] != workingTime) {
      //     makeAppointData[BookAppointmentKey.DoctorId] = ''
      //     makeAppointData[BookAppointmentKey.DoctorName] = ''
      //     makeAppointData[BookAppointmentKey.DoctorGender] = ''
      //     makeAppointData[BookAppointmentKey.AcademicName] = ''
      //     makeAppointData[BookAppointmentKey.workingTime] = 0
      //   }
      // }
    }


    dispatch(actions.saveMakeAppointData(makeAppointData));

    // console.log("makeAppointData?.[BookAppointmentKey.TypeBook]:    ", makeAppointData?.[BookAppointmentKey.TypeBook])
    // if(onResponse) {
    //   navigation.goBack()
    // } else if(makeAppointData?.[BookAppointmentKey.TypeBook] === 1) {
    //   AppNavigate.navigateToBookByDay(navigation.dispatch);
    // } else if(makeAppointData?.[BookAppointmentKey.TypeBook] === 2) {
    //   AppNavigate.navigateToBookByDoctor(navigation.dispatch);
    // }

    onResponse
      ? navigation.goBack()
      : AppNavigate.navigateToBookByDay(navigation.dispatch);
  };

  return (
    <ScreensView
      titleScreen={"Chọn thời gian khám bệnh"}
      renderFooter={
        <ButtonView
          disabled={!isValidate}
          title={"Xác nhận"}
          onPress={handleAgree}
          style={{
            margin: 15,
            marginBottom: Platform.OS === "android" ? 15 : 30,
          }}
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
        <View style={styles.styleViewContentHeath}>
          {healthFacility.imgPath ?
            <Image source={validateImageUri(healthFacility.imgPath)} style={styles.stHeathLogo} />
            : <TextAvatar name={healthFacility.name || "Bệnh viện"} textColor={Colors.colorMain} size={90} borderRadius={Dimension.radiusButton} backgroundColor={Colors.colorSecondary}></TextAvatar>
          }
          <View style={styles.stContainHeathName}>
            <Text style={styles.stTextHeathName}>{healthFacility?.name}</Text>
            <Text style={styles.stTextHeathAddress}>
              {healthFacility?.address}
            </Text>
          </View>
        </View>
      </DropShadow>
      <Calendar
        style={styles.stContainCalendar}
        markingType={"custom"}
        hideExtraDays={true}
        minDate={new Date()}
        maxDate={getAdd30Days(new Date(), 30)}
        markedDates={{
          ...monthDataChoose,
          ...dateDataChoose,
          ...{
            [convertDateFormatVN(new Date())]: {
              disabled: false,
              customStyles: {
                text: { color: todayColorCalendar },
              },
            }
          },
          ...getDateHolidayOfYear()
        }}
        current={selectedDate}
        onDayPress={onDayPress}
        theme={{ calendarBackground: "white" }}
        onMonthChange={onMonthChange}
        theme={{
          todayTextColor: todayColorCalendar,
          agendaDayNumColor: "green",
        }}
      />
      <View style={styles.stContainDesCalendar}>
        <View style={{ flex: 1 }}>
          {renderNote("Ngày đăng ký khám", registrationDateCalendar)}
          {renderNote("Ngày nghỉ lễ", dayOffCalendarColor)}
        </View>
        <View style={{ flex: 1 }}>
          {renderNote("Ngày hiện tại", todayColorCalendar)}
          {renderNote("Ngày không thể chọn", disabledDateCalendar)}
        </View>
      </View>
      <ItemSelectTime
        onPress={onSelectedTime}
        dateSelected={selectedDate}
        healthFacilityId={makeAppointData?.healthFacilityId}
      />
    </ScreensView>
  );
}
