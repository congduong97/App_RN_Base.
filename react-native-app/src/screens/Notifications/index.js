import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useMergeState} from '../../AppProvider';
import {Color, Dimension} from '../../commons/constants';
import {IconView, ScreensView, TextView} from '../../components';
import API from '../../networking';
import actions from '../../redux/actions';
import ItemView from './ItemView';
import styles from './styles';

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

function ViewButtonActions(props) {
  const {onPress} = props;
  return (
    <View style={styles.styleButtonAction}>
      <IconView
        id={'Type-TickAll'}
        onPress={onPress}
        size={24}
        name={'tick-inside-circle'}
      />
      <TextView
        id={'Type-DeleteAll'}
        style={styles.styleButton}
        styleValue={styles.styleValueButton}
        value={'Xoá'}
        onPress={onPress}
      />
      <TextView
        id={'Type-ReadedAll'}
        style={styles.styleButton}
        styleValue={styles.styleValueButton}
        value={'Đã đọc'}
        onPress={onPress}
      />
    </View>
  );
}

function renderItemView({index, item, onPress, isChecked}) {
  return (
    <ItemView
      index={index}
      itemData={item}
      onPress={onPress}
      isChecked={isChecked}
    />
  );
}

export default function NotificationsScreen(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
    isCheckList: false,
    isCheckAll: false,
  });
  const {isCheckList, isReloadData, isCheckAll} = stateScreen;
  const {resultNotifications} = useSelector(
    (state) => state.NotificationsReducer,
  );
  const onMomentumScrollBegin = useRef(false);
  const reftParams = useRef({
    isReloadData: true,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  });
  const dataResponse = useRef({
    notificationsData: [],
    isFinished: false,
  });

  const handleOnPress = async ({id, data}) => {
    if (id === 'Type-Delete') {
      let params = {id: data.id, status: -1};
      let isDeleted = await API.requestChangeStatusNotifi(dispatch, params);
      if (isDeleted) {
        setStateScreen({isReloadData: true});
        // requestGetNotifications();
      }
    } else if (id === 'Type-TickAll') {
      setStateScreen({isCheckAll: !isCheckAll});
    } else if (id === 'Type-DeleteAll') {
      ///Xoá nhưng item dã chon
    } else if (id === 'Type-ReadedAll') {
      ///DCo nhưng item dã chon
    }
  };

  useEffect(() => {
    return () => {
      dispatch(actions.setReadedAll(null));
    };
  }, []);

  useEffect(() => {
    if (resultNotifications?.isRequestDone) {
      handleDataResponse();
      setStateScreen({isReloadData: false});
    }
  }, [resultNotifications?.notificationsData]);

  useEffect(() => {
    if (isReloadData) {
      reftParams.current['page'] = 0;
      reftParams.current['isReloadData'] = true;
      requestGetNotifications();
    }
  }, [isReloadData]);

  const handleDataResponse = () => {
    dataResponse.current.totalRecords = resultNotifications.totalRecords;
    dataResponse.current.isFinished = resultNotifications.isFinished;
    dataResponse.current.notificationsData =
      resultNotifications.notificationsData;
    reftParams.current['isReloadData'] = false;
    reftParams.current['page'] = resultNotifications.pageNext;
  };

  const reloadSearchSim = () => {
    reftParams.current['isReloadData'] = true;
    reftParams.current['page'] = 0;
    setStateScreen({isReloadData: true});
  };
  const handleLoadMore = () => {
    if (!onMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestGetNotifications();
      onMomentumScrollBegin.current = true;
    }
  };

  const requestGetNotifications = () => {
    API.requestNotifications(dispatch, reftParams.current);
  };

  const handleCheckList = () => {
    // setStateScreen({isCheckList: !isCheckList});
    API.requestReadAllNotifications(dispatch, reftParams.current);
  };

  /////
  const renderFooter = () => {
    if (!dataResponse.current.isFinished) {
      return (
        <>
          <Text style={{alignContent: 'center', textAlign: 'center'}}>
            Đang tải thêm
          </Text>
          <ActivityIndicator color={Color.MayaBlue} />
        </>
      );
    }
    return null;
  };

  const renderItem = useCallback(
    ({item, index}) =>
      renderItemView({
        item,
        index,
        onPress: handleOnPress,
        isChecked: isCheckAll,
      }),
    [],
  );

  return (
    <ScreensView
      isScroll={false}
      titleScreen={'Thông Báo'}
      // styleContent={styles.styleContains}
      // nameIconRight={'list-menu'}
      nameIconRight={'checklist'}
      onPressRight={handleCheckList}
      headerBottomView={
        isCheckList ? <ViewButtonActions onPress={handleOnPress} /> : null
      }>
      <FlatList
        data={dataResponse.current.notificationsData}
        keyboardShouldPersistTaps="never"
        extraData={dataResponse.current.notificationsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
        ItemSeparatorComponent={viewSeparator}
        style={{marginTop: 20, marginBottom: 80}}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => {
          onMomentumScrollBegin.current = false;
        }}
        refreshControl={
          <RefreshControl
            refreshing={isReloadData}
            onRefresh={reloadSearchSim}
          />
        }
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
      />
    </ScreensView>
  );
}
