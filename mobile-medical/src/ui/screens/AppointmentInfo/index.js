import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import {
  Colors,
  convertGetDateTime,
  convertStringToFormatServer,
  ImagesUrl,
} from "../../../commons";
import styles from "./styles";
import ItemView from "./ItemView";
import API from "../../../networking";
import {
  convertTimeServerToDateVN,
  FORMAT_YYYYMMDDhhmm,
  FORMAT_YYYY_MM_DD,
  isCompareTime,
  convertDateFormatVN,
} from "../../../commons/utils/DateTime";
import { useMergeState, useApp } from "../../../AppProvider";
import ChoiceValueView from "./component/ChoiceValueView";
import AppNavigate from "../../../navigations/AppNavigate";
import Toast from "react-native-simple-toast";

function IconAvatar(props) {
  const { onPress } = props;
  return (
    <IconView
      onPress={onPress}
      styleImage={styles.stImageAvatar}
      style={styles.styleIconMenu}
      imgSource={ImagesUrl.avatarDefault}
      type={IconViewType.EVImage}
    />
  );
}

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

const EmptyView = (props) => {
  if (props.isCheckListEmptyComponent) {
    return (
      <View style={styles.stContentEmpty}>
        <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
        <Text style={styles.stTextTitleEmpty}>
          {"Hiện tại bạn không có phiếu khám !"}
        </Text>
      </View>
    );
  }
  return null
};

const renderItemView = ({ index, item, onPress }) => {
  return <ItemView index={index} dataItem={item} onPress={onPress} />;
};
function HeaderRightView(props) {
  const { onPressSearch, styleIcon, onPressCalendar, isShowSearch } = props;

  return (
    <>
      <IconView
        onPress={onPressSearch}
        style={{ ...styles.styleIconMenu, marginRight: 12 }}
        name={!isShowSearch ? "ic-search" : "ic-arrow-up"}
        // type={IconViewType.Fontisto}
        size={18}
        color={styleIcon}
      />
      <IconView
        onPress={onPressCalendar}
        style={{ ...styles.styleIconMenu, marginRight: 18 }}
        name={"ic-calendar"}
        size={18}
        color={styleIcon}
      />
    </>
  );
}
export default function AppointmentInfoScreen(props) {
  const { } = props;
  const keyFromDate = "keyFromDate";
  const keyToDate = "keyToDate";
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const dataItem = route?.params?.data;
  const refData = useRef([]);
  const { refDialog } = useApp();
  const [stateScreen, setStateScreen] = useMergeState({
    idSelectTabbar: 1,
    dataList: dataItem?.his_danhsachketquakham || [],
    dataSelectDate: {},
    textSearch: "",
    keySearch: "",
    isShowSearch: false,
    dataListAll: [],
    textFromDate: "",
    paramsDate: {},
    textToDate: "",
    isShowPickerDate: false,
    indexPickerDate: keyFromDate,
    isCheckListEmptyComponent: false
  });
  const {
    paramsDate,
    isShowPickerDate,
    indexPickerDate,
    idSelectTabbar,
    dataList,
    dataSelectDate,
    keySearch,
    isShowSearch,
    dataListAll,
    textToDate,
    textFromDate,
    textSearch,
    isCheckListEmptyComponent
  } = stateScreen;

  useEffect(() => {
    responseDataAppointments();
  }, []);

  const handleSelected = (params) => {
    let date = {};
    if (params.endDate) date = { ...date, ...{ endDate: params.endDate } };
    if (params.startDate)
      date = { ...date, ...{ startDate: params.startDate } };
    setStateScreen({
      dataSelectDate: date,
    });
    switch (idSelectTabbar) {
      case 1:
        responseDataAppointments(date);
        break;
      case 2:
        params.status = 1;
        responseDataAppointments(date);
        break;
      case 3:
        params.status = 2;
        responseDataAppointments(date);
        break;
      case 4:
        params.status = 3;
        responseDataAppointments(date);
        break;
    }
  };
  const reponDataParams = (params) => {
    return {
      patientRecordCode: params.patientRecordCode,
      doctorAppointmentCode: params.doctorAppointmentCode,
      startDate: params.startDate,
      endDate: params.endDate,
    };
  };
  const onPressFiltter = (params) => {
    console.log("paramsqưeee      ", params);
    // params.patientRecordCode = dataItem.patientCode
    // getDataSpecificDoctor(reponDataParams(params))
    console.log("a" + textSearch + "a");
    console.log("a" + dataItem + "a");
    let dataListKetQuaKham = dataItem?.his_danhsachketquakham || [];
    console.log(dataListKetQuaKham);
    // Tìm kiếm theo kí tự
    let dataSearch = dataListKetQuaKham.filter((item) => {
      return (
        textSearch.trim() === "" || item.his_makham.includes(textSearch.trim())
      );
    });
    console.log(dataSearch);
    //Tìm kiếm theo ngày
    let data = dataSearch.filter((item) => {
      let date = convertTimeServerToDateVN(
        item.his_ngaykham,
        FORMAT_YYYY_MM_DD
      );
      console.log(date);
      let startDate = params.startDate;
      let endDate = params.endDate;
      // let a = date <= startDate
      // console.log(a)
      // date = new Date(date).getTime()
      // console.log("date:   ", new Date(date).getTime())
      // console.log("params.startDate:   ", new Date(params.startDate).getTime())

      // console.log("isCompareTime(params.startDate, date):   ", params.startDate.isAfter(date))
      if (params.startDate === "" && params.endDate === "") {
        return true;
      } else if (params.startDate !== "" && params.endDate !== "") {
        if (startDate <= date && date <= endDate) {
          return true;
        }
      } else if (params.startDate !== "" && params.endDate === "") {
        if (startDate <= date) {
          return true;
        }
      } else if (params.startDate === "" && params.endDate !== "") {
        if (date <= endDate) {
          return true;
        }
      }
      // if (item.his_makham == params.his_makham) {
      //     return true
      // }

      // return false
    });
    setStateScreen({
      dataList: data,
      paramsDate: params,
    });
  };
  const showDialog = (itemSelect) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            refDialog={refDialog.current}
            onPress={handleSelected}
            itemSelect={itemSelect}
          />
        )
        .visibleDialog();
  };

  ///////
  const onShowChooseDate = () => {
    AppNavigate.navigateToFiterCodeExaminationForm(navigation.dispatch, {
      onPressFiltter: responseDataAppointments,
      data: paramsDate,
    });

    // showDialog((dataSelectDate ? dataSelectDate : {}));
  };
  /////
  const onSelectedItem = (data) => {
    AppNavigate.navigateToExaminationCard(navigation.dispatch, {
      idCard: data.id,
      statusAppointment: data.status,
      onPressReset: onPressReset,
    });
  };
  ///////////

  const responseDataAppointments = async (dataParams) => {
    let params = {};
    // if (dataParams?.status) { params.status = dataParams.status }
    // if (dataParams?.startDate) { params.startDate = dataParams.startDate }
    // if (dataParams?.endDate) { params.endDate = dataParams.endDate }
    console.log("dataParams:    ", dataParams);
    dataParams = { ...dataParams, ...{ keyword: keySearch } };
    let data = await API.respondataAppointments(dispatch, dataParams);
    console.log("data:    ", data);

    setStateScreen({
      dataList: data,
      dataListAll: data,
      isCheckListEmptyComponent: true
    });
  };

  const onPressReset = () => {
    onPressTab(idSelectTabbar);
  };
  const handleOnPressSearch = () => {
    setStateScreen({ isShowSearch: !isShowSearch });
  };

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({
      keySearch: data,
    });
  };

  const handleSearch = () => {
    onPressTab(idSelectTabbar);
  };
  const onPressTab = (id) => {
    setStateScreen({ idSelectTabbar: id });
    let date = {};
    if (dataSelectDate.endDate)
      date = { ...date, ...{ endDate: dataSelectDate.endDate } };
    if (dataSelectDate.startDate)
      date = { ...date, ...{ startDate: dataSelectDate.startDate } };
    switch (id) {
      case 1:
        responseDataAppointments(date);
        break;
      case 2:
        responseDataAppointments({ ...{ status: 1 }, ...date });
        break;
      case 3:
        responseDataAppointments({ ...{ status: 2 }, ...date });
        break;
      case 4:
        responseDataAppointments({ ...{ status: 3 }, ...date });
        break;
    }
  };

  const renderTabbar = (id, title) => (
    <TouchableOpacity
      onPress={() => {
        onPressTab(id);
      }}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Text
        style={[
          idSelectTabbar === id ? styles.textToolbarSelect : styles.textToolbar,
        ]}
      >
        {title}
      </Text>
      {idSelectTabbar === id ? (
        <View style={[styles.textDotToolbarSelect]} />
      ) : null}
    </TouchableOpacity>
  );

  const renderItem = useCallback(({ item, index }) =>
    renderItemView({
      item,
      index,
      onPress: onSelectedItem,
    })
  );

  return (
    <ScreensView
      // isBackAvatar
      titleScreen={"Phiếu khám"}
      // nameIconRight={"ic-calendar"}
      // onPressRight={onShowChooseDate}
      styleContent={styles.styleContent}
      isScroll={false}
      rightView={
        <HeaderRightView
          styleIcon={"black"}
          onPressSearch={handleOnPressSearch}
          onPressCalendar={onShowChooseDate}
          isShowSearch={isShowSearch}
        />
      }
    >
      {isShowSearch && (
        <InputView
          // label={"Tìm kiếm phiếu khám:"}
          placeholder={"Tìm kiếm theo Mã đặt lịch, Mã lần khám..."}
          placeholderTextColor={Colors.textLabel}
          iconRightName={"ic-search"}
          iconRighSize={24}
          onPressIconRight={handleSearch}
          // iconRightStyle={styles.stIconSearch}
          // offsetLabel={Platform.OS === "ios" ? -1 : -3}
          styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
          iconRightColor={'black'}
          style={styles.stInput}
          value={keySearch}
          styleInput={styles.styleContainInput}
          onChangeText={onChangeSearchValue}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: 12,
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        {renderTabbar(1, "Tất cả")}
        {renderTabbar(2, "Chờ duyệt")}
        {renderTabbar(3, "Chờ khám")}
        {renderTabbar(4, "Đã khám")}
      </View>

      {Array.isArray(dataList) && (
        <FlatList
          style={{ flex: 1 }}
          keyboardShouldPersistTaps='never'
          data={dataList}
          extraData={dataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}${index}`}
          onEndReachedThreshold={0.2}
          removeClippedSubviews
          ItemSeparatorComponent={viewSeparator}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyView isCheckListEmptyComponent={isCheckListEmptyComponent} />}
        />
      )}
    </ScreensView>
  );
}
