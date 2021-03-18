import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { useMergeState } from "../../../../AppProvider";
import {
  Colors,
  Dimension,
  Fonts
} from "../../../../commons/index";
import {
  convertTimeDateVN,
  convertTimeServerTimeZoneToDateVN,
  convertTimeServerToDateVN, FORMAT_DD_MM_YYYY,
  FORMAT_HH_MM,
  FORMAT_TO_SERVER, FORMAT_YYYY_MM_DD,
  getDate16h30, isCompareTime, isPastWithCurrentDate,
  isYesterday
} from "../../../../commons/utils/DateTime";
import { TouchableOpacityEx } from "../../../../components";
import models from "../../../../models";
import API from "../../../../networking";

export default function ItemSelectTimeByDoctor(props) {
  const { onPress, dateSelected, doctorId, healthFacilityId } = props;
  const dispatch = useDispatch();
  const [reRender, setReRender] = useState(false);
  const { endTimeMorning, allowTimeDefault } = models.getHospitalConfig(
    healthFacilityId
  );
  const [stateScreen, setStateScreen] = useMergeState({
    dateDisplay: "",
    dataMorning: [],
    dataAfternoon: [],
    dataAll: [],
  });
  const { dataMorning, dataAfternoon, dataAll } = stateScreen;
  useEffect(() => {
    requestHospitalWorkingTime();
    return () => { };
  }, [dateSelected, doctorId]);

  const requestHospitalWorkingTime = async () => {
    let dataResponse = await API.requestDoctorWorkingTime(dispatch, {
      doctorId: doctorId,
      date: convertTimeServerToDateVN(dateSelected, FORMAT_YYYY_MM_DD),
      // timeOption: true,
    });
    console.log("dataResponse:     ---    ", dataResponse)
    if (dataResponse) {
      let dataRespon = convertHourseWork(dataResponse, endTimeMorning);
      let isCheckYesterday16h30 = false
      if (isYesterday(new Date(), dateSelected)) {
        if (isCompareTime(new Date(), getDate16h30(new Date()))) {
          isCheckYesterday16h30 = true
        }
      }
      dataRespon?.dataAll.forEach((item) => {
        if (isCheckYesterday16h30) {
          item.available = false
        }
        item.isSelect = false;
        if (item.startTime === dateSelected) {
          item.isSelect = true;
        }
      });
      setStateScreen(dataRespon);
    } else {
      setStateScreen({
        dateDisplay: "",
        dataMorning: [],
        dataAfternoon: [],
        dataAll: [],
      });
    }
  };
  const selectItem = (itemData) => {
    onPress && onPress(itemData);
    dataAll.forEach((item) => {
      item.isSelect = false;
      if (item.startTime === itemData.startTime) {
        item.isSelect = true;
      }
    });
    setReRender(!reRender);
  };

  const timeOptionPeopleRegistered = async (isMoring = true) => {
    // if (isMoring) {
    //   let dataAvailable = dataMorning.filter(item => item.available);
    //   dataAvailable.sort((a, b) => {
    //     return a.peopleRegistered - b.peopleRegistered
    //   });
    //   if (dataAvailable.length > 0) {
    //     selectItem(dataAvailable[0])
    //   }
    // } else {
    //   let dataAvailable = dataAfternoon.filter(item => item.available);
    //   dataAvailable.sort((a, b) => {
    //     return a.peopleRegistered - b.peopleRegistered
    //   });
    //   if (dataAvailable.length > 0) {
    //     selectItem(dataAvailable[0])
    //   }
    // }
    var dataSelect = []
    if (isMoring) {
      console.log("asdsdadas:     ", {
        doctorId: doctorId,
        date: convertTimeServerToDateVN(dateSelected, FORMAT_YYYY_MM_DD),
        timeOption: true,
        isMorning: true
      })
      let dataResponse = await API.requestHospitalWorkingTimeDoctor(dispatch, {
        doctorId: doctorId,
        date: convertTimeServerToDateVN(dateSelected, FORMAT_YYYY_MM_DD),
        timeOption: true,
        isMorning: true
      });
      if (dataResponse.length > 0) {
        let dataAvailable = dataMorning.filter(item => item.available);
        dataSelect = dataAvailable.filter((item) => item.title == dataResponse[0].time)
      }
    } else {
      let dataResponse = await API.requestHospitalWorkingTimeDoctor(dispatch, {
        doctorId: doctorId,
        date: convertTimeServerToDateVN(dateSelected, FORMAT_YYYY_MM_DD),
        timeOption: true,
        isMorning: false
      });
      if (dataResponse.length > 0) {
        let dataAvailable = dataAfternoon.filter(item => item.available);
        dataSelect = dataAvailable.filter((item) => item.title == dataResponse[0].time)
      }
    }
    if (dataSelect.length > 0) {
      selectItem(dataSelect[0])
    }
  }

  const renderItem = (item, index) => {
    let disabled = !item?.available;
    return (
      <TouchableOpacityEx
        key={index}
        disabled={disabled}
        onPress={() => {
          selectItem(item);
        }}
        style={[
          styles.containerItem,
          {
            borderColor: disabled
              ? 'white'
              : item.isSelect
                ? Colors.colorMain
                : "#B0B3C7",

            backgroundColor: disabled
              ? '#F2F2F2'
              : item.isSelect
                ? Colors.colorMain
                : "white",
          },
        ]}
      >
        <Text style={{
          color: disabled
            ? Colors.disabledDateCalendar
            : item.isSelect ? "white" : Colors.textLabel
        }} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacityEx>
    );
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={styles.stHeaderSession}>
        <Text style={styles.stTextSessionDay}>{"Buổi sáng"}</Text>
        {allowTimeDefault === 1 && (
          <Text onPress={timeOptionPeopleRegistered} style={styles.stTextOption}>
            {"Tùy chọn thời gian"}
          </Text>
        )}
      </View>
      <View style={styles.stContainList}>
        {dataMorning.map((item, index) => {
          return renderItem(item, index);
        })}
      </View>
      <View style={styles.stHeaderSession}>
        <Text style={styles.stTextSessionDay}>{"Buổi chiều"}</Text>
        {allowTimeDefault === 1 && (
          <Text onPress={() => { timeOptionPeopleRegistered(false) }} style={styles.stTextOption}>
            {"Tùy chọn thời gian"}
          </Text>
        )}
      </View>
      <View style={styles.stContainList}>
        {dataAfternoon.map((item, index) => {
          return renderItem(item, index);
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stContainList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  containerItem: {
    // width: SCREEN_WIDTH / 3.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,

    marginHorizontal: 3,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  styleButtonFace: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "gray",
    marginHorizontal: 12,
    flex: 1,
  },

  stTextSessionDay: {
    flex: 1,
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSizeHeaderPopup,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextOption: {
    color: Colors.colorMain,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stHeaderSession: {
    flexDirection: "row",
    marginTop: Dimension.margin3x,
    paddingHorizontal: Dimension.padding,
  },
});

export const convertHourseWork = (dataRespone, endTimeMorning) => {
  let dateDisplay = "";
  let dataMorning = [];
  let dataAfternoon = [];
  let dataAll = [];
  if (dataRespone) {
    dateDisplay = convertTimeDateVN(
      dataRespone[0]?.startTime,
      FORMAT_DD_MM_YYYY
    );
    // dataRespone.forEach((item, index) => {
    //   let stEnd = convertTimeServerTimeZoneToDateVN(
    //     item?.endTime,
    //     FORMAT_HH_MM
    //   );
    //   if (hmsToSecondsOnly(stEnd) <= hmsToSecondsOnly(endTimeMorning)) {
    //     dataMorning.push(
    //       itemPeriod(index, item?.startTime, item?.endTime, item?.available)
    //     );
    //   } else {
    //     dataAfternoon.push(
    //       itemPeriod(index, item?.startTime, item?.endTime, item?.available)
    //     );
    //   }
    // });
    // dataAll.push(...dataMorning, ...dataAfternoon);
    dataRespone.forEach((item, index) => {
      if (item.morning) {
        dataMorning.push(
          itemPeriod(index, item?.startTime, item?.endTime, item?.available, index?.peopleRegistered)
        );
      } else {
        dataAfternoon.push(
          itemPeriod(index, item?.startTime, item?.endTime, item?.available, index?.peopleRegistered)
        );
      }
    })
    dataAll.push(...dataMorning, ...dataAfternoon);
  }
  return {
    dateDisplay,
    dataMorning,
    dataAfternoon,
    dataAll,
  };
};

const itemPeriod = (index, start, end, isAvailable, peopleRegistered) => {
  let stStart = convertTimeServerTimeZoneToDateVN(start, FORMAT_HH_MM);
  let stEnd = convertTimeServerTimeZoneToDateVN(end, FORMAT_HH_MM);
  let isPast = isPastWithCurrentDate(start, FORMAT_TO_SERVER);
  return {
    id: index + 1,
    title: `${stStart} - ${stEnd}`,
    startTime: start,
    endTime: end,
    available: isPast ? false : isAvailable,
    peopleRegistered: peopleRegistered,
  };
};
