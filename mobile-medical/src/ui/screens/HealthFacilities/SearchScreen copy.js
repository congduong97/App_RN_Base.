import React, { useEffect, useCallback } from "react";
import { Text, View, FlatList, Image, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { ScreensView, InputView } from "../../../components";
import { ImagesUrl, Colors ,fontsValue} from "../../../commons";
import API from "../../../networking";
import styles from "./styles";
import ItemView from "./ItemView";
import ProvinceAreaView from "./ProvinceAreaView";
import { useApp } from "../../../AppProvider";
import { useState } from "react";
import Toast from "react-native-simple-toast";
import Geolocation from "@react-native-community/geolocation";
import actions from "../../../redux/actions";

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

const EmptyView = () => {
  return (
    <View style={styles.stContentEmpty}>
      <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
      <Text style={styles.stTextTitleEmpty}>{"Không có dữ liệu !"}</Text>
    </View>
  );
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

export default function HealthFacilitySearchScreen(props) {
  const {} = props;
  const { refDialog } = useApp();
  const dispatch = useDispatch();
  const [textSeach, setTextSearch] = useState("");
  const [dataList, setDataList] = useState([]);
  const [dataGeolocation, setDataGeolocation] = useState({});

  useEffect(() => {
    dispatch(actions.showLoading());
    Geolocation.getCurrentPosition(
      (position) => {
        setDataGeolocation(position.coords);
        handleSearch();
      },
      (error) => {
        Toast.showWithGravity(
          "Bạn chưa cấp quyền vị trí cho ứng dụng. Vui lòng vào cài đặt để thêm quyền cho ứng dụng.",
          Toast.SHORT,
          Toast.CENTER
        );
        handleSearch();
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
    );
  }, []);

  const handleSearch = () => {
    requestHeathFacilitiesSearch(requestParamsSearch(textSeach));
  };

  const requestParamsSearch = (keyword) => {
    return {
      keyword: keyword,
      page: 0,
      size: 30,
    };
  };

  const onShowProvinceArea = () => {
    showDialog();
  };

  const onChangeSearchValue = ({ id, data }) => {
    setTextSearch(data);
  };

  const onSelectedItem = ({ id, data }) => {};

  useEffect(() => {
    requestrequestHeathFacilities();
  }, []);

  const requestrequestHeathFacilities = async () => {
    let dataResponses = await API.requestHeathFacilities(dispatch, {
      keyword: "Yen Bai",
      page: 0,
      size: 30,
    });
    console.log(dataResponses);
  };

  const requestHeathFacilitiesSearch = async (params) => {
    let dataResponses = await API.requestHealthFaclitiesSearch(
      dispatch,
      params
    );
    setDataList(dataResponses);
  };

  const handleSelected = (id, data) => {
    requestHeathFacilitiesSearch("");
  };

  const showDialog = () => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
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
      nameIconRight={"ic-pin"}
      onPressRight={onShowProvinceArea}
      styleContent={styles.styleContent}
      isScroll={false}
    >
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
        ListEmptyComponent={<EmptyView />}
      />
    </ScreensView>
  );
}
