import {useRoute, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Color, Dimension, Icon} from '../../../commons/constants';
import {ratioW} from '../../../commons/utils/devices';
import {
  convertTimeDateFormatVN,
  formatCurrency,
} from '../../../commons/utils/format';
import {Button, ScreensView, TextView} from '../../../components';
import models from '../../../models';
import {CartStatus, configCartStatus} from '../../../models/ConfigsData';
import API from '../../../networking';
import styles from '../styles';
import CartOrderView from './CartOrderView';
import {ActionsRequest, handleRequestAPI} from '../HandleRequestAPI';
import AppNavigate from '../../../navigations/AppNavigate';

function CartInfo(props) {
  const {cartData, statusName, statusColor} = props;
  const createDate = cartData?.createdAt
    ? convertTimeDateFormatVN(cartData?.createdAt)
    : '';
  const priceDisplay = formatCurrency(cartData?.totalAmount);

  return (
    <View
      style={[
        styles.styleContainOrderInfo,
        {flexDirection: 'row', marginBottom: 3},
      ]}>
      <Image source={Icon.boy} style={styles.styleImageTelco} />
      <View style={styles.styleContainHead}>
        <Text style={styles.styleTextSim}>
          <Text
            style={{
              color: Color.colorText,
              fontSize: Dimension.fontSize14,
              fontWeight: '200',
            }}>
            {'Mã số: '}
          </Text>
          {cartData?.id}
        </Text>
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={[styles.styleValue, {color: Color.Black}]}
          title={'Số SIM:'}
          value={cartData?.simCount}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValue}
          title={'Tổng giá:'}
          value={priceDisplay}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {marginRight: 0}]}
          styleValue={[styles.styleTextValue, {color: statusColor}]}
          title={'Trạng thái: '}
          value={statusName}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={[styles.styleValue, {color: Color.Black}]}
          title={'Ngày tạo:'}
          value={createDate}
        />
      </View>
    </View>
  );
}

const viewSeparator = () => {
  return <View style={styles.lineSeparator} />;
};

function RenderButtonFooter(props) {
  const {onPress, statusCode, isAgency, isTabarOrder} = props;
  if (!isAgency) {
    if (isTabarOrder) {
      return statusCode === CartStatus.done.statusCode ||
        statusCode === CartStatus.cancelled.statusCode ? null : (
        <View style={styles.styleViewButtonFooter}>
          <Button
            id={ActionsRequest.CancelCart}
            onPress={onPress}
            color={'#fff'}
            title="Huỷ giỏ hàng"
            style={styles.styleButtonCancelCart}
            titleStyle={{color: 'white', fontSize: 16}}
          />
          <View style={{width: 10 * ratioW}} />
          {statusCode === CartStatus.waitOrder.statusCode && (
            <Button
              id={ActionsRequest.PlaceOrder}
              onPress={onPress}
              color={Color.MayaBlue}
              title="Đặt hàng"
              style={{flex: 1, marginVertical: 10}}
            />
          )}
          {/* {statusCode === CartStatus.waitDone.statusCode && (
            <Button
              id={ActionsRequest.CompletedOrder}
              onPress={onPress}
              color={Color.MayaBlue}
              title="Hoàn tất"
              style={{flex: 1, marginVertical: 10}}
            />
          )} */}
        </View>
      );
    } else {
      return (
        <View style={styles.styleViewButtonFooter}>
          <Button
            id={ActionsRequest.CompletedOrder}
            onPress={onPress}
            color={Color.MayaBlue}
            title="Thêm vào giở hàng"
            style={{flex: 1, marginVertical: 10}}
          />
        </View>
      );
    }
  }
  return null;
}

function BlockSimOrderView(props) {
  const {blockTitle, onPress, reservations = [], statusCode} = props;
  const isAgency = models.isRoleAgency();
  const isRemoveSim =
    reservations.length > 1 &&
    !(
      statusCode === CartStatus.done.statusCode ||
      statusCode === CartStatus.cancelled.statusCode
    );

  const renderListSim = useCallback(
    ({item, index}) => (
      <CartOrderView
        dataItem={item}
        index={index}
        isAgency={isAgency}
        isRemoveSim={isRemoveSim}
        onPress={onPress}
      />
    ),
    [isRemoveSim],
  );
  return (
    <View style={[styles.styleContainBlockCart]}>
      <Text style={styles.styleBlockTitle}>{blockTitle}</Text>
      <FlatList
        data={reservations}
        keyboardShouldPersistTaps="never"
        extraData={reservations}
        renderItem={renderListSim}
        keyExtractor={(item, index) => `${item.id}${index}`}
        onEndReachedThreshold={0.2}
        removeClippedSubviews
        initialNumToRender={10}
        ItemSeparatorComponent={viewSeparator}
        style={{marginTop: 15}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function CartDetailScreen(props) {
  const {} = props;
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isAgency = models.isRoleAgency();
  const {cartId, isTabarOrder, typeStatus} = route.params;
  const [cartData, setCartData] = useState();

  useEffect(() => {
    requestCartDetail();
  }, [cartId]);

  const {statusCode, statusName, statusColor} = useMemo(
    () => configCartStatus(cartData?.status, cartData?.orderStatus, typeStatus),
    [cartData?.status, cartData?.orderStatus],
  );

  // useEffect(() => {
  //   if (
  //     statusCode &&
  //     statusCode === CartStatus.waitApproval.statusCode &&
  //     isAgency
  //   ) {
  //     navigation.goBack();
  //   }
  // }, [statusCode]);

  const handleOnPress = ({id: action, data}) => {
    if (
      action === ActionsRequest.NextOrderDetail ||
      action === ActionsRequest.NextOrderDetailCustomer ||
      action === ActionsRequest.NextOrderDetailOrderer
    ) {
      let typeShow = action === ActionsRequest.NextOrderDetail ? null : action;
      nextToOrderDetail({id: typeShow, data});
    } else {
      handleRequestAPI(
        {
          dispatch,
          action,
          cartId,
          orderId: data?.id,
          simAlias: data?.alias,
          simId: data?.simId,
        },
        requestCartDetail,
      );
    }
  };

  const nextToOrderDetail = ({id, data}) => {
    AppNavigate.navigateToOrderDetailScreen(navigation.dispatch, {
      dataItem: data,
      typeShow: id,
    });
  };

  const requestCartDetail = async () => {
    let responseData = await API.requestCartDetail(dispatch, cartId);
    setCartData(responseData);
  };

  return (
    <ScreensView
      titleScreen={'Chi Tiết Giỏ Hàng'}
      styleContent={{backgroundColor: Color.colorBGSQM}}
      renderFooter={
        cartData && (
          <RenderButtonFooter
            onPress={handleOnPress}
            statusCode={statusCode}
            isAgency={isAgency}
            isTabarOrder={isTabarOrder}
          />
        )
      }>
      <CartInfo
        cartData={cartData}
        statusName={statusName}
        statusColor={statusColor}
      />
      <View
        style={{
          backgroundColor: 'white',
          marginTop: 20,
          height: '100%',
        }}>
        <BlockSimOrderView
          statusCode={statusCode}
          blockTitle={'Danh sách SIM trong giỏ'}
          reservations={cartData?.reservations}
          onPress={handleOnPress}
        />
      </View>
    </ScreensView>
  );
}
