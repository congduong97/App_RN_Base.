import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef } from "react";
import { Image, Platform, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DropShadow from "react-native-drop-shadow";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMergeState } from "../../../../AppProvider";
import { Colors, Dimension, Fonts, ImagesUrl, validateImageUri } from "../../../../commons";
import {
  convertDateFormatVN, convertTimeDateVN,
  FORMAT_DD_MM_YYYY,
  FORMAT_YYYY_MM_DD,
  getAdd30Days, getAddDay,
  getDate16h30, getDateHolidayOfYear, getHolidaysDatesOfMonthNow,
  isCompareTime, isPastWithCurrentDate
} from "../../../../commons/utils/DateTime";
import { ButtonView, ScreensView, TextView } from "../../../../components";
import models, { BookAppointmentKey, getGenderName } from "../../../../models";
import AppNavigate from "../../../../navigations/AppNavigate";
import actions from "../../../../redux/actions";
import { TextAvatar } from "../../../../ui/components/TextAvatar";
import ItemSelectTimeByDoctor from "./ItemSelectTimeByDoctor";
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
  return {};
};

export default function ChooseBookTimeByDoctor(props) {
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
    isValidate: dateSelect

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
    selectedTime.startTime = selectedItem?.startTime;
    selectedTime.endTime = selectedItem?.endTime;
    makeAppointData[BookAppointmentKey.TimeDisPlay] = selectedItem?.title;
    setStateScreen({
      isValidate: selectedTime.startTime && selectedTime.endTime,
    });
  };

  const handleAgree = () => {
    makeAppointData[BookAppointmentKey.DateChoose] = convertTimeDateVN(
      selectedTime.startTime,
      FORMAT_DD_MM_YYYY
    );
    makeAppointData[BookAppointmentKey.StartTime] = selectedTime.startTime;
    makeAppointData[BookAppointmentKey.EndTime] = selectedTime.endTime;
    dispatch(actions.saveMakeAppointData(makeAppointData));
    onResponse
      ? navigation.goBack()
      // : AppNavigate.navigateToBookByDay(navigation.dispatch);
      : AppNavigate.navigateToBookByDoctor(navigation.dispatch);

  };
  const handleBack = () => {
    navigation.goBack()

  }
  return (
    <ScreensView
      onGoBack={handleBack}
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
      headerBottomView={
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
            {makeAppointData[BookAppointmentKey.DoctorAvatar] ?
              <Image source={validateImageUri(makeAppointData[BookAppointmentKey.DoctorAvatar])} style={{...styles.stHeathLogo,borderRadius:90}} />
              : <TextAvatar name={makeAppointData[BookAppointmentKey.DoctorName] || "Bác sĩ"} textColor={Colors.colorMain} size={90} borderRadius={90} backgroundColor={Colors.colorSecondary}></TextAvatar>
            }
            <View style={styles.stContainHeathName}>
              <Text style={styles.stTextHeathName}>
                {"BS. " + makeAppointData?.[BookAppointmentKey.DoctorName]}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                  paddingRight: 8,
                }}
              >
                {/* <Image
                  source={ImagesUrl.iconDoctor}
                  style={{
                    width: 14,
                    height: 14,
                    resizeMode: "contain",
                    alignContent: "center",
                    tintColor: '#747F9E'

                  }}
                /> */}
                <Text style={{ marginLeft: 2, color: "#747F9E", fontSize: Dimension.fontSize12,fontFamily:Fonts.SFProDisplayRegular }}>
                  {makeAppointData?.[BookAppointmentKey.MedicalSpecialtyName]}
                </Text>
              </View>

              <TextView
                style={styles.stContainTextName}
                styleValue={styles.stTextValue}
                value={getGenderName(
                  makeAppointData?.[BookAppointmentKey.DoctorGender]
                )}
                // stylesIconLeft={styles.stylesIconLeft}
                // nameIconLeft={"ic-gender"}
                // colorIconLeft={'#747F9E'}
              />
            </View>
          </View>
        </DropShadow>
      }
    >
      <Calendar
        style={styles.stContainCalendar}
        markingType={"custom"}
        hideExtraDays={true}
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
        minDate={new Date()}
        maxDate={getAdd30Days(new Date(), 30)}
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
      <ItemSelectTimeByDoctor
        onPress={onSelectedTime}
        dateSelected={selectedDate}
        doctorId={makeAppointData?.doctorId}
        healthFacilityId={makeAppointData?.healthFacilityId}
      />
    </ScreensView>
  );
}
