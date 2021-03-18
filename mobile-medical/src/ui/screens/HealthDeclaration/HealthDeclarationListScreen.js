import styles from "./styles";
import React, { useEffect, useCallback, useRef } from "react";
import { ScreensView } from "../../../components";
import {
  Text,
  View,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useMergeState } from "../../../AppProvider";
import { ImagesUrl, Colors, Dimension } from "../../../commons";
import AppNavigate from "../../../navigations/AppNavigate";
import { useNavigation } from "@react-navigation/native";
import API from "../../../networking";
import { useDispatch, useSelector } from "react-redux";
import ItemView from "./ItemView";

const renderItemView = ({ index, item }) => {
  return <ItemView index={index} dataItem={item} />;
};

const EmptyView = () => {
  return (
    <View style={styles.stContentEmpty}>
      <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
      <Text style={styles.stTextTitleEmpty}>{"Bạn chưa khai báo y tế!"}</Text>
      <Text style={styles.stTextContentEmpty}>
        {
          "Đây là tài liệu quan trọng, thông tin của anh/chị sẽ giúp cơ quan y tế liên lạc khi cần thiết để phòng chống dịch bệnh truyền nhiễm"
        }
      </Text>
    </View>
  );
};

export default function HealthDeclarationListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { resultHealthDecalarations } = useSelector(
    (state) => state.HealthDeclarationReducer
  );

  const onMomentumScrollBegin = useRef(false);

  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  });

  const dataResponse = useRef({
    data: [],
    isFinished: false,
  });
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
  });
  const { isReloadData } = stateScreen;

  useEffect(() => {
    if (isReloadData) {
      reftParams.current["isReloadData"] = true;
      reftParams.current["page"] = 0;
      requestGetHealthDeclarationList();
    }
    return () => {};
  }, [isReloadData]);

  useEffect(() => {
    if (resultHealthDecalarations?.isRequestDone) {
      handleDataResponse();
      setStateScreen({ isReloadData: false });
    }
  }, [resultHealthDecalarations?.healthDeclarationData]);

  const reloadList = () => {
    setStateScreen({ isReloadData: true });
  };

  const handleLoadMore = () => {
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestGetHealthDeclarationList();
      onMomentumScrollBegin.current = true;
    }
  };

  const requestGetHealthDeclarationList = () => {
    API.requestGetHealthDeclarationList(dispatch, reftParams.current);
  };

  const handleDataResponse = () => {
    dataResponse.current.totalRecords = resultHealthDecalarations.totalRecords;
    dataResponse.current.isFinished = resultHealthDecalarations.isFinished;
    dataResponse.current.healthDeclarationData =
      resultHealthDecalarations.healthDeclarationData;
    reftParams.current["isReloadData"] = false;
    reftParams.current["page"] = resultHealthDecalarations.pageNext;
  };

  const handleSearchOrAddNew = () => {
    AppNavigate.navigateToHealthDeclaration(navigation.dispatch);
  };

  const renderItem = useCallback(({ item, index }) =>
    renderItemView({
      item,
      index,
    })
  );

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

  return (
    <ScreensView
      isScroll={false}
      titleScreen={"Khai báo y tế"}
      nameIconRight={"ic_edit"}
      colorIconRight={Colors.colorTitleScreen}
      // styleContent={styles.styleContent}
      onPressRight={handleSearchOrAddNew}
      renderFooter={null}
    >
      {Array.isArray(dataResponse.current.healthDeclarationData) && (
        <FlatList
          style={{ flex: 1 }}
          keyboardShouldPersistTaps='never'
          data={dataResponse.current.healthDeclarationData}
          extraData={dataResponse.current.healthDeclarationData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}${index}`}
          onEndReachedThreshold={0.2}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          onMomentumScrollBegin={() => {
            onMomentumScrollBegin.current = false;
          }}
          refreshControl={
            <RefreshControl refreshing={isReloadData} onRefresh={reloadList} />
          }
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<EmptyView />}
        />
      )}
    </ScreensView>
  );
}
