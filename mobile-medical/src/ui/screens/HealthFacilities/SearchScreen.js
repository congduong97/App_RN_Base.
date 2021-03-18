import React, { useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Platform,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { ImagesUrl, Colors, Dimension, fontsValue } from "../../../commons";
import API from "../../../networking";
import AppNavigate from "../../../navigations/AppNavigate";
import styles from "./styles";
import ItemView from "./ItemView";
import ProvinceAreaView from "./ProvinceAreaView";
import { useMergeState, useApp } from "../../../AppProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import models from "../../../models";
import { useState } from "react";
import Toast from "react-native-simple-toast";

import Geolocation from "@react-native-community/geolocation";
import actions from "../../../redux/actions";

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

const EmptyView = (props) => {
  if (props.isCheckListEmptyComponent) {
    return (
      <View style={styles.stContentEmpty}>
        <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
        <Text style={styles.stTextTitleEmpty}>{"Không có dữ liệu !"}</Text>
      </View>
    );
  }
  return null
};

const renderItemView = ({ index, item, dataGeolocation, onPress }) => {
  return (
    <ItemView
      index={index}
      dataItem={item}
      dataGeolocation={dataGeolocation}
      onPress={onPress}
    />
  );
};
function HeaderRightView(props) {
  const { onPressSearch, styleIcon, onPressPin, isShowSearch } = props;

  return (
    <>
      <IconView
        onPress={onPressSearch}
        style={{ ...styles.styleIconMenu, marginRight: 30 }}
        name={!isShowSearch ? "search" : "ic-arrow-up"}
        type={!isShowSearch ? IconViewType.Fontisto : null}
        size={18}
        color={styleIcon}
      />
      <IconView
        onPress={onPressPin}
        style={styles.styleIconMenu}
        name={"ic-pin"}
        size={20}
        color={styleIcon}
      />
    </>
  );
}

export default function HealthFacilitySearchScreen(props) {
  const { } = props;
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  // const refData = useRef([]);
  const [textSeach, setTextSearch] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isShowSearch, setShowSearch] = useState(false);
  const [dataGeolocation, setDataGeolocation] = useState({});
  const refData = useRef(models.getListHealthFacilities());
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
    isCheckListEmptyComponent: false
  });
  const {
    isReloadData,
    isCheckListEmptyComponent
  } = stateScreen;

  const onMomentumScrollBegin = useRef(false);
  const [onLoadEnd, setStateOnLoadEnd] = useState(false);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
    keyword: ''
  });

  const { resultHeathFaclitiesData } = useSelector((state) => state.HeathFacilitiesReducer);
  const { isShowLoading } = useSelector((state) => state.CommonsReducer);
  const dataResponse = useRef({
    isFinished: false
  });

  useEffect(() => {
    // handleSearch()
    dispatch(actions.showLoading());
    Geolocation.getCurrentPosition(
      (position) => {
        setDataGeolocation(position.coords);
        // handleSearch();
      },
      (error) => {
        Toast.showWithGravity(
          "Bạn chưa cấp quyền vị trí cho ứng dụng. Vui lòng vào cài đặt để thêm quyền cho ứng dụng.",
          Toast.SHORT,
          Toast.CENTER
        );
        // alert("error:    ", error)
        // handleSearch();
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (isReloadData) {
      reftParams.current["isReloadData"] = true;
      reftParams.current["page"] = 0;
      console.log("reftParams.current[ :    ", reftParams.current["page"])
      setTimeout(() => {
        searchHealthFacilitiLoadMode();
      }, 700);
    }
    return () => { };
  }, [isReloadData]);

  useEffect(() => {
    if (resultHeathFaclitiesData?.isRequestDone) {
      console.log("vao day")
      handleDataResponse();
      setStateScreen({ isReloadData: false });
    }
  }, [resultHeathFaclitiesData?.heathFaclitiesData, isShowLoading]);

  const reloadGethealthFaclities = () => {
    setStateScreen({ isReloadData: true, isCheckListEmptyComponent: true });
  };

  const handleLoadMore = () => {
    setStateOnLoadEnd(true);
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      searchHealthFacilitiLoadMode();
      onMomentumScrollBegin.current = true;
    }
    setTimeout(() => {
      setStateOnLoadEnd(false);
    }, 2000);
  };

  const searchHealthFacilitiLoadMode = () => {
    console.log("?reftParams.current:     ", reftParams.current)
    API.requestHealthFaclitiesSearchLoadMode(dispatch, reftParams.current);
  }

  const handleDataResponse = () => {
    dataResponse.current.isFinished = resultHeathFaclitiesData.isFinished;
    dataResponse.current.healthFaclitiessData = resultHeathFaclitiesData.heathFaclitiesData;
    reftParams.current["isReloadData"] = false;
    reftParams.current["page"] = resultHeathFaclitiesData.pageNext;
  };

  ///////
  const handleSearch = () => {
    // requestHeathFacilitiesSearch(
    //   requestParamsSearch({
    //     keyword: textSeach,
    //   })
    // );
    dispatch(actions.responseHeathFaclitiesSearchLoadModeReset())
    reftParams.current["keyword"] = textSeach;
    reloadGethealthFaclities()
  };

  // const requestParamsSearch = (params) => {
  //   return {
  //     keyword: params.keyword,
  //     page: 0,
  //     size: 30,
  //     cityCode: params.cityCode,
  //     // districtCode: params.districtCode,
  //     // wardCode: params.wardCode
  //   };
  // };

  const onShowProvinceArea = () => {
    showDialog();
  };

  const onChangeSearchValue = ({ id, data }) => {
    setTextSearch(data);
  };
  /////
  const onSelectedItem = ({ id, data }) => {
    // AppNavigate.navigateToHealthFacilitiesDetail(navigation.dispatch, data);
  };

  const requestrequestHeathFacilities = async (params) => {
    // let dataResponses = await API.requestHealthFaclitiesParentAndThis(dispatch, params);
  };
  ///////////

  const requestHeathFacilitiesSearch = async (params) => {
    let dataResponses = await API.requestHealthFaclitiesSearch(
      dispatch,
      params
    );
    setDataList(dataResponses);
  };

  const handleSelected = (id, data) => {
    console.log("data:   ", data);
    // requestHeathFacilitiesSearch({
    //   keyword: textSeach,
    //   cityCode: data.areaCode,
    // });
    dispatch(actions.responseHeathFaclitiesSearchLoadModeReset())
    reftParams.current["keyword"] = textSeach;
    reftParams.current["cityCode"] = data.areaCode;
    reloadGethealthFaclities()
  };

  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <ProvinceAreaView
            refDialog={refDialog.current}
            onPress={handleSelected}
          />
        )
        .visibleDialog();
  };
  const handleOnPressSearch = () => {
    setShowSearch(!isShowSearch);
  };
  const renderItem = useCallback(({ item, index }) =>
    renderItemView({
      item,
      index,
      dataGeolocation,
      onPress: onSelectedItem,
    })
  );

  return (
    <ScreensView
      titleScreen={"Tra cứu cơ sở y tế"}
      // nameIconRight={"ic-pin"}
      // onPressRight={onShowProvinceArea}
      styleContent={styles.styleContent}
      isScroll={false}
      rightView={
        <HeaderRightView
          styleIcon={"black"}
          onPressSearch={handleOnPressSearch}
          onPressPin={onShowProvinceArea}
          isShowSearch={isShowSearch}
        />
      }
    >
      {isShowSearch && (
        <InputView
          // label={"Tìm cơ sở y tế:"}
          placeholder={"Nhập tên cơ sở y tế..."}
          placeholderTextColor={Colors.textLabel}
          iconRightName={"ic-search"}
          iconRighSize={24}
          onPressIconRight={handleSearch}
          // iconRightStyle={styles.stIconSearch}
          // offsetLabel={Platform.OS === "ios" ? -1 : -3}
          styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
          iconRightColor={'black'}
          style={styles.stInput}
          styleInput={styles.styleContainInput}
          value={textSeach}
          onChangeText={onChangeSearchValue}
        />
      )}

      {Array.isArray(dataResponse.current.healthFaclitiessData) && (
        <FlatList
          style={{ flex: 1 }}
          keyboardShouldPersistTaps='never'
          data={dataResponse.current.healthFaclitiessData}
          extraData={dataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.2}
          removeClippedSubviews
          ItemSeparatorComponent={viewSeparator}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyView isCheckListEmptyComponent={isCheckListEmptyComponent} />}

          onMomentumScrollBegin={() => {
            onMomentumScrollBegin.current = false;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isReloadData}
              onRefresh={reloadGethealthFaclities}
            />
          }
          onEndReached={handleLoadMore}
        />
      )}
    </ScreensView>
  );
}
