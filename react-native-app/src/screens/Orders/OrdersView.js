import {useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef} from 'react';
import {Platform} from 'react-native';
import FilterKey from '../Search/FilterView/FilterKey';

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
import models from '../../models';
import {OrderStatusRequest} from '../../models/ConfigsData';
import API from '../../networking';
import styles from '../Orders/styles';
import CartItemView from './Cart/CartItemView';
import OrderItemView from './OrderItemView';
import InputView from '../../components/InputView';

const renderItem = ({
  index,
  item,
  isAgency,
  statusOrder,
  isTabarOrder,
  simId,
  onSelected,
}) => {
  return statusOrder === OrderStatusRequest.DRAFT_CART ? (
    <CartItemView
      index={index}
      dataItem={item}
      isAgency={isAgency}
      statusOrder={statusOrder}
      isTabarOrder={isTabarOrder}
      simId={simId}
      onSelected={onSelected}
    />
  ) : (
    <OrderItemView
      dataItem={item}
      index={index}
      isAgency={isAgency}
      typeStatus={statusOrder}
    />
  );
};
export default function OrdersView(props) {
  const {isTabarOrder, statusCart, simId, onSelected} = props;
  const route = useRoute();
  const dispatch = useDispatch();
  const {typeOrder} = route.params;
  const statusOrder = statusCart ? statusCart : typeOrder;
  const refOnMomentumScrollBegin = useRef(false);

  const reftParamsRequest = useRef({
    isReloadData: true,
    status: statusOrder,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
    keyword: '',
  });
  const dataResponse = useRef({
    orderData: [],
    isFinished: false,
  });
  const isAgency = models.isRoleAgency();
  const {
    ordersDraftData,
    ordersNewData,
    ordersDonedData,
    ordersCanceledData,
  } = useSelector((state) => state.OrderReducer);
  const [stateScreen, setStateScreen] = useMergeState({
    isReloadData: true,
  });
  const {isReloadData} = stateScreen;
  useEffect(() => {
    if (isReloadData) {
      reftParamsRequest.current.page = 0;
      reftParamsRequest.current.isReloadData = true;
      requestMyOrder();
    }
  }, [isReloadData]);

  useEffect(() => {
    if (
      statusOrder === OrderStatusRequest.DRAFT_CART &&
      ordersDraftData?.isRequestDone
    ) {
      handleDataResponse();
      reftParamsRequest.current.isReloadData = false;
      setStateScreen({isReloadData: false});
    }
  }, [ordersDraftData?.ordersData]);

  useEffect(() => {
    if (
      statusOrder === OrderStatusRequest.NEW &&
      ordersNewData?.isRequestDone
    ) {
      handleDataResponse();
      reftParamsRequest.current.isReloadData = false;
      setStateScreen({isReloadData: false});
    }
  }, [ordersNewData?.ordersData]);

  useEffect(() => {
    if (
      statusOrder === OrderStatusRequest.DONE &&
      ordersDonedData?.isRequestDone
    ) {
      handleDataResponse();
      reftParamsRequest.current.isReloadData = false;
      setStateScreen({isReloadData: false});
    }
  }, [ordersDonedData?.ordersData]);

  useEffect(() => {
    if (
      statusOrder === OrderStatusRequest.CANCELLED &&
      ordersCanceledData?.isRequestDone
    ) {
      handleDataResponse();
      reftParamsRequest.current.isReloadData = false;
      setStateScreen({isReloadData: false});
    }
  }, [ordersCanceledData?.ordersData]);
  /////////////
  const setReloadData = () => {
    setStateScreen({isReloadData: true});
  };


  // const reloadSearchSim = () => {
  //   requestMyOrder();
  // };
  const onChangeTextSearch = ({data}) => {
    reftParamsRequest.current.keyword = data;
  };

  const handleLoadMore = () => {
    if (!refOnMomentumScrollBegin.current) {
      dataResponse.current.isFinished = false;
      requestMyOrder();
      refOnMomentumScrollBegin.current = true;
    }
  };

  const handleDataResponse = () => {
    if (statusOrder === OrderStatusRequest.DRAFT_CART) {
      dataResponse.current.isFinished = ordersDraftData.isFinished;
      dataResponse.current.orderData = ordersDraftData.ordersData;
      reftParamsRequest.current.page = ordersDraftData.pageNext;
    } else if (statusOrder === OrderStatusRequest.NEW) {
      dataResponse.current.isFinished = ordersNewData.isFinished;
      dataResponse.current.orderData = ordersNewData.ordersData;
      reftParamsRequest.current.page = ordersNewData.pageNext;
    } else if (statusOrder === OrderStatusRequest.DONE) {
      dataResponse.current.isFinished = ordersDonedData.isFinished;
      dataResponse.current.orderData = ordersDonedData.ordersData;
      reftParamsRequest.current.page = ordersDonedData.pageNext;
    } else if (statusOrder === OrderStatusRequest.CANCELLED) {
      dataResponse.current.isFinished = ordersCanceledData.isFinished;
      dataResponse.current.orderData = ordersCanceledData.ordersData;
      reftParamsRequest.current.page = ordersCanceledData.pageNext;
    }
  };

  const requestMyOrder = useCallback(() => {
    API.requestMyOrderByStatus(dispatch, reftParamsRequest.current);
  }, [statusOrder]);

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

  const viewSeparator = () => {
    return <View style={styles.lineSeparator} />;
  };

  const renderItemCall = useCallback(({item, index}) =>
    renderItem({
      item,
      index,
      isAgency,
      statusOrder,
      isTabarOrder,
      simId,
      onSelected,
    }),
  );


  return (
    <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
      <InputView
        id={FilterKey.Pattern}
        onPressIconLeft={setReloadData}
        style={styles.stylesContainSearch}
        styleInput={styles.styleInputSearch}
        iconLeft={'search'}
        iconLeftColor={Color.colorBorderDisable}
        iconLeftSize={20}
        placeholder="Nhập tên CTV hoặc số điện thoại..."
        placeholderTextColor={Color.colorText}
        onChangeText={onChangeTextSearch}
        onSubmitEditing={setReloadData}
        returnKeyType={Platform.OS === 'ios' ? 'done' : 'search'}
      />
      <FlatList
        data={dataResponse.current.orderData}
        keyboardShouldPersistTaps="never"
        extraData={dataResponse.current.orderData}
        renderItem={renderItemCall}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
        initialNumToRender={10}
        ItemSeparatorComponent={viewSeparator}
        style={{marginTop: 5}}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => {
          refOnMomentumScrollBegin.current = false;
        }}
        refreshControl={
          <RefreshControl refreshing={isReloadData} onRefresh={setReloadData} />
        }
        onEndReached={handleLoadMore}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}
