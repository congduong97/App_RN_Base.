import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {Image, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {Color, Dimension} from '../../../commons/constants';
import {
  convertTimeDateFormatVN,
  formatCurrency,
} from '../../../commons/utils/format';
import {TextView} from '../../../components';
import {
  configOrderStatus,
  RequiredSources,
  SimHoldStatus,
  SourceOrder,
  TelcoIcon,
} from '../../../models/ConfigsData';
import {ActionsRequest} from '../HandleRequestAPI';
import styles from '../styles';

function IconActionView(props) {
  const {dataItem, onPress, isRemoveSim, isAgency} = props;

  return (
    <View style={styles.styleViewButton}>
      <TextView
        id={ActionsRequest.NextOrderDetail}
        onPress={onPress}
        data={dataItem}
        nameIconLeft={'tick-inside-circle'}
        colorIconLeft={Color.PersianGreen}
        style={[
          styles.styleButtomActionAccept,
          {marginLeft: Dimension.margin5},
        ]}
        styleContainerText={styles.styleTextButton}
        styleValue={[styles.textButton, {color: Color.PersianGreen}]}
        value={'Chi tiết'}
      />
      {isRemoveSim && !isAgency && (
        <TextView
          id={ActionsRequest.RemoveSIM}
          onPress={onPress}
          nameIconLeft={'cancel'}
          colorIconLeft={Color.colorNameEstate}
          style={[
            styles.styleButtomActionCancel,
            {borderColor: Color.colorNameEstate, marginLeft: Dimension.margin5},
          ]}
          styleContainerText={styles.styleTextButton}
          styleValue={[styles.textButton, {color: Color.colorNameEstate}]}
          value={'Bỏ sim'}
          data={dataItem}
        />
      )}
    </View>
  );
}

function CartOrderView(props) {
  const {index, dataItem, isAgency, isRemoveSim, onPress} = props;
  const {
    alias,
    telcoId,
    telco,
    cateName,
    source,
    affiliatePrice,
    websitePrice,
    status,
    orderStatus,
    agencyResponse,
    createdAt,
    expAt,
    agency,
    createBy,
    customer,
  } = dataItem;
  const imageName = TelcoIcon[telcoId || telco?.id];
  const {statusColor, statusName, statusCode} = useMemo(
    () => configOrderStatus(status, agencyResponse, orderStatus),
    [status, agencyResponse, orderStatus],
  );

  const priceDisplay = formatCurrency(
    source === SourceOrder.Affiliate.code ? affiliatePrice : websitePrice,
  );
  const createDate = createdAt ? convertTimeDateFormatVN(createdAt) : '';
  const expDate = expAt ? convertTimeDateFormatVN(expAt) : '';
  const requiredSource = RequiredSources[source];
  const titleOrdersOf = isAgency ? 'Người đặt:' : 'Đại lý bán:';
  const ordersOf = isAgency
    ? `${requiredSource} - ${createBy?.fullName}`
    : agency?.fullName;
  const customerOrders =
    customer?.phone !== createBy?.phone &&
    `${customer?.name} - ${customer?.phone}`;
  return (
    <View style={styles.styleContains}>
      <View style={{flexDirection: 'row', marginBottom: 3}}>
        <Image source={imageName} style={styles.styleImageTelco} />
        <View style={styles.styleContainHead}>
          <Text style={[styles.styleTextSim, {color: statusColor}]}>
            {alias}
          </Text>
          <Text style={styles.styleValue}>{cateName}</Text>
        </View>
      </View>
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleTextValue}
        title={'Giá bán: '}
        value={priceDisplay}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={[styles.styleTextValue, {color: statusColor}]}
        title={'Trạng thái: '}
        value={statusName}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleValue}
        title={'Thời gian: '}
        value={createDate}
      />
      {status === SimHoldStatus.active.id && (
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={styles.styleTextTitle}
          styleValue={styles.styleValue}
          title={'Hạn giữ: '}
          value={expDate}
        />
      )}
      <TextView
        id={'Orderer'}
        id={ActionsRequest.NextOrderDetailOrderer}
        onPress={onPress}
        data={dataItem}
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleOrderValue}
        title={titleOrdersOf}
        value={ordersOf}
      />
      <TextView
        id={ActionsRequest.NextOrderDetailCustomer}
        onPress={onPress}
        data={dataItem}
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleOrderValue}
        title={'Khách mua:'}
        value={customerOrders}
      />
      <Text style={[styles.textSTT]}>{index + 1}</Text>
      <IconActionView
        onPress={onPress}
        dataItem={dataItem}
        statusCode={statusCode}
        isRemoveSim={isRemoveSim}
        isAgency={isAgency}
      />
    </View>
  );
}

export default CartOrderView;
