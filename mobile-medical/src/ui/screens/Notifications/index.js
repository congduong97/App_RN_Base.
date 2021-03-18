import React, { useEffect, useRef, useCallback, createRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView } from "../../../components";
import IconView, { IconViewType } from "../../../components/IconView";
import { ImagesUrl, Colors, Dimension } from "../../../commons";
import styles from "./styles";
import ItemView from "./ItemView";
import API from "../../../networking";
import { useMergeState, useApp } from "../../../AppProvider";
import NotificationsPopup from "../../../ui/screens/Notifications/popup";
import NotificationType from "./NotificationType";
import AppNavigate from "../../../navigations/AppNavigate";
const navigationRef = createRef();
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
  return (
    <View style={styles.stContentEmpty}>
      <Image source={ImagesUrl.imEmpty} style={styles.stImageEmpty} />
      {props.isCheckListEmptyComponent && <View>
        <Text style={styles.stTextTitleEmpty}>
          {"Hiện chưa có thông báo nào!"}
        </Text>
        <Text style={styles.stTextContentEmpty}>{"Bạn hãy quay lại sau."}</Text></View>}
    </View>
  );
};

const renderItemView = ({ index, item, onPress }) => {
  return <ItemView index={index} dataItem={item} onPress={onPress} />;
};

export default function NotificationsScreen(props) {
  const { } = props;
  const { refDialog } = useApp();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { resultNotifications } = useSelector(
    (state) => state.NotificationsReducer
  );
  const onMomentumScrollBegin = useRef(false);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  });
  const dataResponse = useRef({
    notificationsData: [],
    isFinished: false
  });
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
    reRender: false,
    isCheckListEmptyComponent
  });
  const { isReloadData, reRender, isCheckListEmptyComponent } = stateScreen;
  ///////
  useEffect(() => {
    if (isReloadData) {
      reftParams.current["isReloadData"] = true;
      reftParams.current["page"] = 0;
      requestNotifications();
    }
    return () => { };
  }, [isReloadData]);

  useEffect(() => {
    if (resultNotifications?.isRequestDone) {
      handleDataResponse();
      setStateScreen({ isReloadData: false });
    }
  }, [resultNotifications?.notificationsData]);

  const reloadSearchNotifications = () => {
    setStateScreen({ isReloadData: true });
  };
  const handleLoadMore = () => {
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestNotifications();
      onMomentumScrollBegin.current = true;
    }
  };

  const requestNotifications = async () => {
    await API.requestNotifications(dispatch, reftParams.current);
    if (!isCheckListEmptyComponent) {
      setStateScreen({ isCheckListEmptyComponent: true })
    }
  };

  const handleDataResponse = () => {
    dataResponse.current.totalRecords = resultNotifications.totalRecords;
    dataResponse.current.isFinished = resultNotifications.isFinished;
    dataResponse.current.notificationsData =
      resultNotifications.notificationsData;
    reftParams.current["isReloadData"] = false;
    reftParams.current["page"] = resultNotifications.pageNext;
  };

  const showDialog = (messageData) => {
    refDialog?.current &&
      refDialog.current
        .configsDialog({
          // visibleClose: false,
          isScroll: true,
        })
        .drawContents(
          <NotificationsPopup
            notifiData={messageData}
            refDialog={refDialog.current}
            // onPress={handleSelected}
            navigation={navigation}
          />
        )
        .visibleDialog();
  };

  /////
  const onSelectedItem = async (item) => {
    if(item.status !== 3) await API.requestCheckSend(dispatch, item.id);
    if(item.status !== 3) await reloadSearchNotifications();
    setTimeout(() => {
      showDialog(item);
    }, 700);
  };
  ///////////

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

  const renderItem = useCallback(({ item, index }) =>
    renderItemView({
      item,
      index,
      onPress: onSelectedItem,
    })
  );
  return (
    <ScreensView
      isShowBack={false}
      isScroll={dataResponse.current.notificationsData ? false : true}
      titleScreen={"Thông báo"}
      styleContent={styles.styleContent}
    >
      {Array.isArray(dataResponse.current.notificationsData) && (
        <FlatList
          style={{ flex: 1 }}
          data={dataResponse.current.notificationsData}
          keyboardShouldPersistTaps='never'
          extraData={dataResponse.current.notificationsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}${index}`}
          onEndReachedThreshold={0.2}
          removeClippedSubviews
          ItemSeparatorComponent={viewSeparator}
          style={styles.stList}
          showsVerticalScrollIndicator={false}
          onMomentumScrollBegin={() => {
            onMomentumScrollBegin.current = false;
          }}
          refreshControl={
            <RefreshControl
              refreshing={isReloadData}
              onRefresh={reloadSearchNotifications}
            />
          }
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<EmptyView isCheckListEmptyComponent={isCheckListEmptyComponent} />}
        />
      )}
    </ScreensView>
  );
}
