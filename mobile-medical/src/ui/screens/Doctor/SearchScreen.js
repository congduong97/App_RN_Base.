import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet, Text, View, FlatList, Image,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScreensView, ButtonView, InputView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import ItemDoctorView from "./ItemDoctorView";
import { useApp, useMergeState } from "../../../AppProvider";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import {
  NavigationKey,
  Dimension,
  Colors,
  Fonts,
  fontsValue,
  ImagesUrl,
  SCREEN_WIDTH,
} from "../../../commons";
import API from "../../../networking";
import models, { BookAppointmentKey } from "../../../models";
import actions from "../../../redux/actions";
import {
  convertTimeServerToDateVN,
  FORMAT_SERVER,
  FORMAT_YYYYMMDDhhmmss,
  convertTimeServerTimeZoneToDateVN,
} from "../../../commons/utils/DateTime";
import ChoiceValueView from "./component/ChoiceValueView";
import ActionKey from "./ActionKey";
import FilterSelectDoctor from "./FilterSelectDoctor";

const idNameDoctor = "idNameDoctor";
const renderItem = ({ index, item, onPress, typeScreen }) => {
  return (
    <ItemDoctorView
      index={index}
      dataItem={item}
      onPress={onPress}
      typeScreen={typeScreen}
    />
  );
};

function HeaderRightView(props) {
  const { onPressSearch, styleIcon, onPressfilter, isShowSearch } = props;

  return (
    <>
      <IconView
        onPress={onPressSearch}
        style={{ ...styles.styleIconMenu, marginRight: 30 }}
        name={!isShowSearch ? "ic-search" : "ic-arrow-up"}
        // type={IconViewType.Fontisto}
        size={18}
        color={styleIcon}
      />
      <IconView
        onPress={onPressfilter}
        style={styles.styleIconMenu}
        name={"filter-outline"}
        type={IconViewType.MaterialCommunityIcons}
        size={22}
        color={styleIcon}
      />
    </>
  );
}

export default function DoctorSearchScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const typeScreen = route?.params?.typeScreen || 1;
  const isNotKillClass = route?.params?.isNotKillClass || false;
  //bien nay sẽ check từ thông tin lich kham(dạt lich kham) => muc dich sẽ kill class khi chon bs xong
  const isBackKillClass = route?.params?.isBackKillClass || false;
  const onMomentumScrollBegin = useRef(false);
  const [onLoadEnd, setStateOnLoadEnd] = useState(false);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
    name: ''
  });

  const { resultDoctor } = useSelector((state) => state.DoctorReducer);
  const { isShowLoading } = useSelector((state) => state.CommonsReducer);
  const dataResponse = useRef({
    notificationsData: [],
    isFinished: false
  });

  const { refDialog } = useApp();
  const [stateScreen, setStateScreen] = useMergeState({
    itemSelected: {},
    dataDoctors: [],
    dataFitter: {},
    isDisabled: false,
    dataSpecialities: [],
    dataClinics: [],
    dataAcademics: [],
    isShowSearch: false,
    keySearch: "",
    isCheckListEmptyComponent: false,
    dataParamsSelect: {
      medicalSpecialityId: makeAppointData?.medicalSpecialityId,
      clinicId: makeAppointData?.[BookAppointmentKey.ClinicsId],
    },
    isReloadData: true
  });
  const {
    dataDoctors,
    itemSelected,
    dataFitter,
    isDisabled,
    dataSpecialities,
    dataClinics,
    dataAcademics,
    isShowSearch,
    keySearch,
    isCheckListEmptyComponent,
    dataParamsSelect,
    isReloadData,
  } = stateScreen;
  const makeAppointData = useSelector(
    (state) => state.MakeAppointmentReducer.makeAppointData
  );
  useEffect(() => { }, []);

  useEffect(() => {
    searchDoctors();
  }, []);

  useEffect(() => {
    if (isReloadData) {
      reftParams.current["isReloadData"] = true;
      reftParams.current["page"] = 0;
      console.log("reftParams.current[ :    ", reftParams.current["page"])
      setTimeout(() => {
        searchDoctorsLoadMode();
      }, 700);
    }
    return () => { };
  }, [isReloadData]);

  useEffect(() => {
    if (resultDoctor?.isRequestDone) {
      console.log("vao day")
      handleDataResponse();
      setStateScreen({ isReloadData: false });
    }
  }, [resultDoctor?.doctorsData, isShowLoading]);

  const reloadGetDoctor = () => {
    setStateScreen({ isReloadData: true });
  };

  const handleLoadMore = () => {
    setStateOnLoadEnd(true);
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      searchDoctorsLoadMode();
      onMomentumScrollBegin.current = true;
    }
    setTimeout(() => {
      setStateOnLoadEnd(false);
    }, 2000);
  };

  const searchDoctorsLoadMode = () => {
    console.log("?reftParams.current:     ", reftParams.current)
    API.searchDoctorsLoadMode(dispatch, reftParams.current);
  }

  const handleDataResponse = () => {
    dataResponse.current.isFinished = resultDoctor.isFinished;
    dataResponse.current.doctorsData = resultDoctor.doctorsData;
    reftParams.current["isReloadData"] = false;
    reftParams.current["page"] = resultDoctor.pageNext;

  };

  const onChangeSearchValue = ({ id, data }) => {
    switch (id) {
      case idNameDoctor:
        setStateScreen({ keySearch: data });
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (typeScreen === 1) {
      dispatch(actions.responseDoctorReset())
      reftParams.current["name"] = keySearch;
      reftParams.current["advancedSearch"] = true;
      reloadGetDoctor()
      // searchDoctors(reponData(dataFitter));
    } else {
      searchFilterDoctor(dataParamsSelect);
    }
  };

  const reponData = (params) => {
    let data = {
      advancedSearch: true,
      status: 1,
      name: keySearch,
      page: 0,
      size: 30,
    };
    if (params?.medicalSpecialityId) {
      data.medicalSpecialityId = params.medicalSpecialityId;
    }
    if (params?.healthFacilityId) {
      data.healthFacilityId = params.healthFacilityId;
    }
    if (params?.academicId) {
      data.academicId = params.academicId;
    }
    return data;
  };

  const searchDoctors = async (params) => {
    let dataDoctorResponse = [];
    if (typeScreen === 1) {
      // dataDoctorResponse = await API.searchDoctors(dispatch, params);
      // console.log("🚀 ~ file: SearchScreen.js ~ line 108 ~ searchDoctors ~ dataDoctorResponse", dataDoctorResponse)
    } else {
      dispatch(actions.showLoading());
      let dataChuyenKhoa = await API.getSpecialities(
        dispatch,
        makeAppointData?.healthFacilityId,
        {
          hasClinic: true,
        }, false
      );
      let data = await API.requestDataClinics(
        dispatch,
        makeAppointData?.healthFacilityId,
        {}, false
      );

      let dataAcademics = await API.getAcademics(dispatch, {
        status: "1",
      });
      setStateScreen({
        dataSpecialities: dataChuyenKhoa,
        dataClinics: data,
        dataAcademics: dataAcademics,
      });

      if (makeAppointData?.[BookAppointmentKey.TypeBook] === 1) {
        let params1 = {};
        if (makeAppointData?.[BookAppointmentKey.ClinicsId]) {
          params1 = {
            ...params1,
            ...{ clinicId: makeAppointData?.[BookAppointmentKey.ClinicsId] },
          };
        }
        if (makeAppointData?.healthFacilityId) {
          params1 = {
            ...params1,
            ...{ healthFacilitiesId: makeAppointData?.healthFacilityId },
          };
        }
        if (makeAppointData?.startTime) {
          params1 = {
            ...params1,
            ...{
              startTime: convertTimeServerTimeZoneToDateVN(
                makeAppointData?.startTime,
                FORMAT_YYYYMMDDhhmmss
              ),
            },
          };
        }
        if (makeAppointData?.endTime) {
          params1 = {
            ...params1,
            ...{
              endTime: convertTimeServerTimeZoneToDateVN(
                makeAppointData?.endTime,
                FORMAT_YYYYMMDDhhmmss
              ),
            },
          };
        }
        console.log("params1:    ", params1);
        dataDoctorResponse = await API.searchDoctorsTimeSelected(
          dispatch,
          params1,
          false
        );
        dispatch(actions.hideLoading());
      } else if (makeAppointData?.[BookAppointmentKey.TypeBook] === 2) {
        dataDoctorResponse = await API.searchDoctorsInAppointmentDoctor(
          dispatch,
          {
            healthFacilityId: makeAppointData?.healthFacilityId,
            keyword: keySearch,
            medicalSpecialityId: makeAppointData?.medicalSpecialityId,
          },
          false
        );
        dispatch(actions.hideLoading());
      }
      if (makeAppointData[BookAppointmentKey.DoctorId]) {
        dataDoctorResponse.forEach((item) => {
          if (
            (item.isChecked =
              item.id === makeAppointData[BookAppointmentKey.DoctorId])
          ) {
            setStateScreen({ itemSelected: item, isDisabled: true });
            true;
          } else {
            false;
          }
        });
      }
    }

    setStateScreen({
      dataDoctors: dataDoctorResponse ? dataDoctorResponse : [],
      isCheckListEmptyComponent: true,
      dataParamsSelect: {
        medicalSpecialityId: makeAppointData?.medicalSpecialityId,
        clinicId: makeAppointData?.[BookAppointmentKey.ClinicsId]
      },
    });
  };
  const handleAgree = () => {
    let paramPatient = {
      [BookAppointmentKey.DoctorId]: itemSelected?.id,
      [BookAppointmentKey.DoctorName]: itemSelected?.name,
      [BookAppointmentKey.medicalSpecialityId]:
        itemSelected?.medicalSpecialityId,
      [BookAppointmentKey.MedicalSpecialtyName]:
        itemSelected?.medicalSpecialityName,
      [BookAppointmentKey.DoctorGender]: itemSelected?.gender,
      [BookAppointmentKey.AcademicCode]: itemSelected?.academicCode,
      [BookAppointmentKey.AcademicName]: itemSelected?.academicName,
      [BookAppointmentKey.DoctorAvatar]: itemSelected?.avatar,
      //phong kham
      [BookAppointmentKey.ClinicsId]: itemSelected?.clinicId,
      [BookAppointmentKey.ClinicName]: itemSelected?.clinicName,
      //để kiem tra ca làm viec cua bac sy
      [BookAppointmentKey.workingTime]: itemSelected?.workingTime,
    };

    dispatch(actions.saveMakeAppointData(paramPatient));
    if (!isNotKillClass) navigation.goBack();
    console.log("isBackKillClass:    ", isBackKillClass);
    if (isBackKillClass) {
      // navigation.goBack();
    } else {
      if (makeAppointData?.[BookAppointmentKey.TypeBook] === 1) {
        AppNavigate.navigateToBookByDay(navigation.dispatch);
      } else if (makeAppointData?.[BookAppointmentKey.TypeBook] === 2) {
        AppNavigate.navigateToChooseBookTimeByDoctor(navigation.dispatch);
      }
    }
  };
  const onSelectedItem = ({ data }) => {
    console.log("data:     ", data);
    dataDoctors.forEach(
      (item) => (item.isChecked = item.id === data.id ? true : false)
    );
    setStateScreen({ itemSelected: data, isDisabled: true });
  };

  const renderItemCall = useCallback(({ item, index }) =>
    renderItem({
      item,
      index,
      onPress: onSelectedItem,
      typeScreen: typeScreen,
    })
  );
  //navigateToFitterDoctorScreen

  const onSearchFitter = (data) => {
    setStateScreen({
      // keySearch: "",
      dataFitter: data,
    });
    // searchDoctors(reponData(data));
    if (typeScreen === 1) {
      dispatch(actions.responseDoctorReset())
      reftParams.current["advancedSearch"] = true;
      reftParams.current["medicalSpecialityId"] = data.medicalSpecialityId ? data.medicalSpecialityId : '';
      reftParams.current["healthFacilityId"] = data.healthFacilityId ? data.healthFacilityId : '';
      reftParams.current["academicId"] = data.academicId ? data.academicId : '';

      reloadGetDoctor()
    }
  };

  const searchFilterDoctor = async (params) => {
    var dataDoctorResponse = [];
    if (makeAppointData?.[BookAppointmentKey.TypeBook] === 1) {
      let params1 = {};
      if (params?.clinicId) {
        params1 = {
          ...params1,
          ...{ clinicId: params?.clinicId },
        };
      }
      if (params?.medicalSpecialityId) {
        params1 = {
          ...params1,
          ...{ medicalSpecialityId: params?.medicalSpecialityId },
        };
      }
      if (makeAppointData?.healthFacilityId) {
        params1 = {
          ...params1,
          ...{ healthFacilitiesId: makeAppointData?.healthFacilityId },
        };
      }
      if (makeAppointData?.startTime) {
        params1 = {
          ...params1,
          ...{
            startTime: convertTimeServerTimeZoneToDateVN(
              makeAppointData?.startTime,
              FORMAT_YYYYMMDDhhmmss
            ),
          },
        };
      }
      if (makeAppointData?.endTime) {
        params1 = {
          ...params1,
          ...{
            endTime: convertTimeServerTimeZoneToDateVN(
              makeAppointData?.endTime,
              FORMAT_YYYYMMDDhhmmss
            ),
          },
        };
      }
      // if (keySearch) { params1 = { ...params1, ... { keyword: keySearch } } }

      console.log("params1:    ", params1);
      dataDoctorResponse = await API.searchDoctorsTimeSelected(
        dispatch,
        params1
      );
      console.log("dataDoctorResponse:    ", dataDoctorResponse);

      if (params?.gender) {
        dataDoctorResponse = dataDoctorResponse.filter(
          (item) => item.gender == params?.gender
        );
      }

      // if (params?.nameDoctor) {
      //   dataDoctorResponse = dataDoctorResponse.filter(item => item.name.toLowerCase().includes(params?.nameDoctor?.trim().toLowerCase()));
      // }

      if (params?.academicId) {
        dataDoctorResponse = dataDoctorResponse.filter(
          (item) => item.academicId == params?.academicId
        );
      }

      if (keySearch) {
        dataDoctorResponse = dataDoctorResponse.filter((item) =>
          item.name.toLowerCase().includes(keySearch.trim().toLowerCase())
        );
      }
    } else if (makeAppointData?.[BookAppointmentKey.TypeBook] === 2) {
      let paramsApi = { healthFacilityId: makeAppointData?.healthFacilityId };
      if (params.medicalSpecialityId) {
        paramsApi = {
          ...paramsApi,
          ...{ medicalSpecialityId: params.medicalSpecialityId },
        };
      }
      if (params.academicId) {
        paramsApi = { ...paramsApi, ...{ academicId: params.academicId } };
      }
      if (params.gender) {
        paramsApi = { ...paramsApi, ...{ gender: params.gender } };
      }
      if (keySearch) {
        paramsApi = { ...paramsApi, ...{ keyword: keySearch } };
      }
      dataDoctorResponse = await API.searchDoctorsInAppointmentDoctor(
        dispatch,
        paramsApi
      );
    }

    if (makeAppointData[BookAppointmentKey.DoctorId]) {
      let isCheckInclude = false;
      dataDoctorResponse.forEach((item) => {
        if (
          (item.isChecked =
            item.id === makeAppointData[BookAppointmentKey.DoctorId])
        ) {
          isCheckInclude = true;
          setStateScreen({ itemSelected: item, isDisabled: true });
          true;
        } else {
          false;
        }
      });
      if (!isCheckInclude) {
        setStateScreen({ itemSelected: {}, isDisabled: false });
      }
    }

    setStateScreen({
      dataDoctors: dataDoctorResponse ? dataDoctorResponse : [],
      dataParamsSelect: params,
    });
  };

  const onPressRight = () => {
    if (typeScreen === 1) {
      AppNavigate.navigateToFitterDoctorScreen(navigation.dispatch, {
        onSearchFitter: onSearchFitter,
        dataSelect: dataFitter,
      });
    } else {
      AppNavigate.navigateToFilterSelectDoctor(navigation.dispatch, {
        searchFilterDoctor: searchFilterDoctor,
        dataSpecialities: dataSpecialities,
        dataAcademics: dataAcademics,
        dataClinics: dataClinics,
        dataParamsSelect: dataParamsSelect,
      });
    }
  };
  const handleOnPressSearch = () => {
    setStateScreen({ isShowSearch: !isShowSearch });
  };
  const EmptyView = () => {
    if (isCheckListEmptyComponent) {
      return (
        <View style={{ justifyContent: "center" }}>
          <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
          <Text style={styles.stTextTitleEmpty}>
            {"Không có dữ liệu bác sỹ !"}
          </Text>
        </View>
      );
    } else {
      return null
    }

  };

  const returnViewFlatList = () => {
    if (typeScreen == 1) {
      if (Array.isArray(dataResponse.current.doctorsData)) {
        return <FlatList
          style={{ flex: 1 }}
          data={dataResponse.current.doctorsData}
          renderItem={renderItemCall}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<EmptyView />}

          onMomentumScrollBegin={() => {
            onMomentumScrollBegin.current = false;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isReloadData}
              onRefresh={reloadGetDoctor}
            />
          }
          onEndReached={handleLoadMore}
        />
      }
    } else {
      if (Array.isArray(dataDoctors)) {
        return <FlatList
          style={{ flex: 1 }}
          data={dataDoctors}
          renderItem={renderItemCall}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<EmptyView />}
        />
      }
    }

    return null
  }

  return (
    <ScreensView
      isScroll={false}
      // nameIconRight={typeScreen === 1 ? "ic-search" : (isShowSearch ? "ic-search" : "ic-arrow-up")}
      // nameIconRight={"filter-outline"}
      // onPressRight={onPressRight}
      // typeIconRight={IconViewType.MaterialCommunityIcons}
      // styleRightView={styles.styleIconMenu}
      // colorIconRight={"black"}
      styleContent={styles.styleContent}
      titleScreen={typeScreen === 1 ? "Tra cứu bác sỹ" : "Chọn bác sỹ"}
      isCheckAuth={typeScreen === 1}
      rightView={
        <HeaderRightView
          styleIcon={"black"}
          onPressSearch={handleOnPressSearch}
          onPressfilter={onPressRight}
          isShowSearch={isShowSearch}
        />
      }
      renderFooter={
        <ButtonView
          disabled={!isDisabled}
          title={"Xác nhận"}
          onPress={handleAgree}
          style={{
            marginBottom: Dimension.margin2x,
            marginHorizontal: Dimension.margin2x,
          }}
        />
      }
    >
      {isShowSearch && (
        <InputView
          id={idNameDoctor}
          // label={"Tìm bác sĩ:"}
          placeholder={"Nhập tên bác sỹ..."}
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

      {/* {!isShowSearch ?
        <FilterSelectDoctor
          dataSpecialities={dataSpecialities}
          dataAcademics={dataAcademics}
          medicalSpecialityId={makeAppointData?.medicalSpecialityId}
          onPress={searchFilterDoctor}
        /> : null} */}

      {returnViewFlatList()}
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: 20,
  },
  styleIconMenu: {
    position: "absolute",
    right: 16,
    top: -8,
    // marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    // width: Dimension.sizeIconHeader,
    // height: Dimension.sizeIconHeader,
    alignContent: "center",
    // backgroundColor: Colors.colorBtBack,
    // borderRadius: 10,
  },

  stInput: {
    margin: Dimension.margin,
    // marginTop: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colorBg2,
  },
  styleContainInput: {
    height: fontsValue(46),
    borderRadius: fontsValue(16),
    backgroundColor: '#F8F8F8',
    borderColor: 'white',
  },
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginBottom: Dimension.margin,
    marginTop: -18,
  },
  stImageEmpty: {
    marginTop: -56,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    alignSelf: "center",
  },
  stTextContentEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.textLabel,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
});
