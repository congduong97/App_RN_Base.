import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScreensView, ButtonView, InputView } from "../../../components";
import { ImagesUrl, Dimension, Colors } from "../../../commons";
import styles from "./styles";
import IconView, { IconViewType } from "../../../components/IconView";
import ItemView from "./ItemView";
import { useMergeState } from "../../../AppProvider";
import AppNavigate from "../../../navigations/AppNavigate";
import API from "../../../networking";
import actions from "../../../redux/actions";

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

const EmptyView = (props) => {
  const { onPress, isHideButton } = props;
  return (
    <View style={styles.stContentEmpty}>
      <Image source={ImagesUrl.imFeedback} style={styles.stImageEmpty} />
      {props.isCheckListEmptyComponent && (
        <View>
          <Text style={styles.stTextTitleEmpty}>
            {isHideButton
              ? "Bạn chưa có góp ý nào"
              : "Không có kết quả tìm kiếm"}
          </Text>
          {isHideButton && (
            <Text style={styles.stTextContentEmpty}>
              {
                "Hãy tạo một góp ý những điều bạn chưa hài lòng để chúng tôi được phục vụ bạn tốt hơn. Xin cảm ơn !"
              }
            </Text>
          )}
          {isHideButton && (
            <ButtonView onPress={onPress} title={"Tạo góp ý cho chúng tôi"} />
          )}
        </View>
      )}
    </View>
  );
};
function HeaderRightView(props) {
  const { onPressSearch, styleIcon, onPressEdit } = props;

  return (
    <>
      <IconView
        onPress={onPressSearch}
        style={{ ...styles.styleIconMenu, marginRight: 18 }}
        name={"search"}
        type={IconViewType.Fontisto}
        size={18}
        color={styleIcon}
      />
      <TouchableOpacity onPress={onPressEdit}>
        <Image source={ImagesUrl.iconAlarm} />
      </TouchableOpacity>
    </>
  );
}
const renderItemView = ({ index, item, onPress }) => {
  return <ItemView index={index} dataItem={item} onPress={onPress} />;
};

export default function FeedbackScreen(props) {
  const {} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const refData = useRef([]);
  const [pressSearch, setStatePressSearch] = useState(false);
  const { resultFeedbacks } = useSelector((state) => state.FeedbacksReducer);
  const { isShowLoading } = useSelector((state) => state.CommonsReducer);
  const onMomentumScrollBegin = useRef(false);
  const [onLoadEnd, setStateOnLoadEnd] = useState(false);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  });
  const dataResponse = useRef({
    feedbacksData: [],
    isFinished: false,
  });
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
    keySearch: "",
    isShowSearch: false,
    isCheckListEmptyComponent: false,
    isHideButton: false,
  });
  const {
    isReloadData,
    keySearch,
    isShowSearch,
    isCheckListEmptyComponent,
    isHideButton,
  } = stateScreen;

  useEffect(() => {
    if (isReloadData) {
      dispatch(actions.responseFeedbacksReset());
      reftParams.current["isReloadData"] = true;
      reftParams.current["page"] = 0;
      setTimeout(() => {
        requestFeedback();
      }, 700);
    }
    return () => {};
  }, [isReloadData]);

  useEffect(() => {
    if (resultFeedbacks?.isRequestDone) {
      handleDataResponse();
      setStateScreen({ isReloadData: false });
    }
  }, [resultFeedbacks?.feedbacksData, isShowLoading]);

  const reloadGetFeedbacks = () => {
    setStateScreen({ isReloadData: true });
  };

  const handleLoadMore = () => {
    setStateOnLoadEnd(true);
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestFeedback();
      onMomentumScrollBegin.current = true;
    }
    setTimeout(() => {
      setStateOnLoadEnd(false);
    }, 2000);
  };

  const requestFeedback = async () => {
    await API.requestFeedbacks(dispatch, reftParams.current);
    if (!isCheckListEmptyComponent) {
      setStateScreen({ isCheckListEmptyComponent: true });
    }
  };

  const handleDataResponse = () => {
    dataResponse.current.totalRecords = resultFeedbacks.totalRecords;
    dataResponse.current.isFinished = resultFeedbacks.isFinished;
    dataResponse.current.feedbacksData = resultFeedbacks.feedbacksData;
    reftParams.current["isReloadData"] = false;
    reftParams.current["page"] = resultFeedbacks.pageNext;
    // console.log("esultFeedbacks.feedbacksData:    ", resultFeedbacks.feedbacksData)
  };

  const onToCreateFeedback = () => {
    AppNavigate.navigateToCreateFeedback(navigation.dispatch, {
      callback: reloadGetFeedbacks,
    });
  };

  const onSelectedItem = ({ id, data }) => {};
  const handleOnPressSearch = () => {
    setStateScreen({ isShowSearch: !isShowSearch });
  };

  const handleSearch = () => {
    dispatch(actions.responseFeedbacksReset());
    setStateScreen({ isHideButton: keySearch == "" });
    reftParams.current["keyword"] = keySearch;
    reloadGetFeedbacks();
    setStatePressSearch(true);
  };

  const onChangeSearchValue = ({ id, data }) => {
    setStateScreen({
      keySearch: data,
    });
  };

  const renderFooter = () => {
    if (onLoadEnd) {
      return (
        <>
          <Text
            style={{
              alignContent: "center",
              textAlign: "center",
            }}
          >
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
      isScroll={refData.current ? false : true}
      titleScreen={"Góp ý"}
      // nameIconRight={"ic-edit"}
      // onPressRight={onToCreateFeedback}
      // styleContent={styles.styleContent}
      rightView={
        <HeaderRightView
          styleIcon={"black"}
          onPressSearch={handleOnPressSearch}
          onPressEdit={onToCreateFeedback}
        />
      }
    >
      {isShowSearch && (
        <InputView
          // label={"Tìm kiếm góp ý:"}
          placeholder={"Tìm kiếm theo tiêu đề, nội dung..."}
          placeholderTextColor={Colors.textLabel}
          iconRightName={"ic-search"}
          iconRighSize={24}
          onPressIconRight={handleSearch}
          // iconRightStyle={styles.stIconSearch}
          // offsetLabel={Platform.OS === "ios" ? -1 : -3}
          styleViewLabel={{ backgroundColor: "white", paddingHorizontal: 3 }}
          iconRightColor={"black"}
          style={styles.stInput}
          value={keySearch}
          styleInput={styles.styleContainInput}
          onChangeText={onChangeSearchValue}
        />
      )}

      <FlatList
        data={dataResponse.current.feedbacksData}
        keyboardShouldPersistTaps='never'
        extraData={dataResponse.current.feedbacksData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={-0.15}
        removeClippedSubviews
        ItemSeparatorComponent={viewSeparator}
        style={[styles.stList]}
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
        // ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyView
            onPress={onToCreateFeedback}
            isCheckListEmptyComponent={isCheckListEmptyComponent}
            isHideButton={isHideButton}
          />
        }
      />
    </ScreensView>
  );
}
