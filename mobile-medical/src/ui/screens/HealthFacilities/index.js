import React, { useState, useRef, } from "react";
import { useApp, useMergeState } from "../../../AppProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet, Text, View, TextInput, FlatList, Image, TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import { Colors } from "../../../commons";
import { ScreensView, IconView, TextView } from "../../../components";
import styles from "./styles";
import ChoiceValueView from './component/ChoiceValueView'
import ActionKey from './ActionKey'
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";

export default function DoctorScreen(props) {
  const [textSearch, setTextSearch] = useState('')
  const [dataLocation, setDataLocation] = useState({})
  const [dataList, setDataList] = useState([])
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onMomentumScrollBegin = useRef(false);
  const dataResponse = useRef({
    feedbacksData: [],
    isFinished: false,
  });
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
  });
  const { isReloadData } = stateScreen;

  const handleOnPress = ({ id }) => {
    switch (id) {
      case ActionKey.ShowPoupLocation:
        showDialog(id, (dataLocation ? dataLocation : {}));
        break
    }
  };

  const reloadGetFeedbacks = () => {
    setStateScreen({ isReloadData: true });
  };
  
  const onToCreateFeedback = () => {
    // AppNavigate.navigateToCreateFeedback(navigation.dispatch);
  };

  const handleLoadMore = () => {
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestFeedback();
      onMomentumScrollBegin.current = true;
    }
  };

  const handleSelected = async () => {
    let data = await API.requestHealthFaclitiesSearch(
      dispatch,
      {
        keyword: "Yen Bai",
        page: 0,
        size: 30
      }
    );

    console.log("data:    ", data)
    setDataList(data)
  }

  const showDialog = (typeDialog, itemSelect) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <ChoiceValueView
            typeDialog={typeDialog}
            refDialog={refDialog.current}
            onPress={handleSelected}
            itemSelect={itemSelect}
          />
        )
        .visibleDialog();
  };

  const clickItemList = () => {
    AppNavigate.navigateToDetailHealthFacilityScreen(navigation.dispatch, {});
  }

  const viewSeparator = () => {
    return <View style={styles.lineSeparator} />;
  };

  const EmptyView = (props) => {
    const { onPress } = props;
    return (
      <View style={styles.stContentEmpty}>
        {/* <Image source={ImagesUrl.imFeedback} style={styles.stImageEmpty} /> */}
        <Text style={styles.stTextTitleEmpty}>{"Không có dữ liệu cơ sở y tế"}</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!dataResponse.current.isFinished) {
      return (
        <>
          <Text style={{ alignContent: "center", textAlign: "center" }}>
            Đang tải thêm
          </Text>
          <ActivityIndicator color={Colors.colorMain} />
        </>
      );
    }
    return null;
  };

  const renderViewSearch = () => {
    return (
      <View style={styles.styleViewSearch}>
        <TextInput
          style={{ flex: 1, paddingVertical: 12 }}
          onChangeText={(text) => setTextSearch(text)}
          value={textSearch}
          placeholder={"Tìm kiếm cơ sở y tế"}
        />

        <IconView name={"ic-search"} />
      </View>
    )
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity onPress={clickItemList} style={styles.styleViewItem}>
        <Image
          source={require('../../../../assets/images/avatar.jpg')}
          style={{
            width: 90,
            height: 90,
            borderRadius: 12,

          }}
        />

        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[styles.styleText, { fontWeight: 'bold', marginTop: 6 }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.styleText, { fontSize: 12, color: Colors.colorTextDes, flex: 1 }]} numberOfLines={1}>{item.address}</Text>

          <TextView
            nameIconLeft={'ic-pin'}
            colorIconLeft={Colors.colorMain}
            style={[styles.stTextLocation]}
            styleTitle={[styles.stTitleButton, { marginLeft: 4, color: Colors.colorMain }]}
            title={"2 km"}
          />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <ScreensView styleContent={{ paddingHorizontal: 12 }} titleScreen={"Cơ sở y tế"}
      nameIconRight={'ic-pin'}
      onPressRight={() => { handleOnPress({ id: ActionKey.ShowPoupLocation }) }}
    >
      {renderViewSearch()}

      <FlatList
        style={{ marginTop: 12 }}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}


        keyboardShouldPersistTaps="never"
        extraData={dataResponse.current.feedbacksData}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
        ItemSeparatorComponent={viewSeparator}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => {
          onMomentumScrollBegin.current = false;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isReloadData}
            onRefresh={reloadGetFeedbacks}
          />
        }
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<EmptyView onPress={onToCreateFeedback} />}
      />
    </ScreensView>
  );
}
