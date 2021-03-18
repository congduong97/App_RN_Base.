import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useMemo, useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {verticalScale} from '../../commons/utils/devices';
import {Color} from '../../commons/constants';
import {
  convertTimeDateFormatVN,
  formatCurrency,
} from '../../commons/utils/format';
import {TextView} from '../../components';
import UploadImage from '../../components/UploadImage/UploadImage';
import {
  configOrderStatus,
  OrderStatusObject,
  RequiredSources,
  SimHoldStatus,
  SourceOrder,
  TelcoIcon,
} from '../../models/ConfigsData';
import AppNavigate from '../../navigations/AppNavigate';
import styles from './styles';
import {ActionsRequest, handleRequestAPI} from './HandleRequestAPI';
import API from '../../networking';
import Button from '../../components/Button';
import PreviewImage from '../../components/PreviewImage/PreviewImage';
import FontAwersome from 'react-native-vector-icons/FontAwesome5';

export function UploadImageButton({handleOnPress, title, name}) {
  return (
    <TouchableOpacity
      style={styles.customeUploadButton}
      onPress={handleOnPress}>
      <Text style={styles.customeUploadButtonText}>{title}</Text>
      <FontAwersome name={name} size={18} color="#38C8EC" />
    </TouchableOpacity>
  );
}

function IconActionView(props) {
  const {onPress, statusCode, isCart, isAgency} = props;
  return statusCode === OrderStatusObject.done.statusCode ||
    statusCode === OrderStatusObject.cancelled.statusCode ||
    statusCode === OrderStatusObject.agencyCancelled.statusCode ? null : (
    <View style={styles.styleViewButton}>
      {isAgency ? (
        <TextView
          id={ActionsRequest.CancelOrder} ///xem lai
          onPress={onPress}
          nameIconLeft={'cancel'}
          colorIconLeft={Color.WildWatermelon}
          style={styles.styleButtomActionCancel}
          styleContainerText={styles.styleTextButton}
          styleValue={styles.textButton}
          value={'Huỷ bỏ đơn'}
        />
      ) : (
        <TextView
          id={ActionsRequest.RemoveSIM} ///xem lai
          onPress={onPress}
          nameIconLeft={'cancel'}
          colorIconLeft={Color.colorNameEstate}
          style={[
            styles.styleButtomActionCancel,
            {borderColor: Color.colorNameEstate},
          ]}
          styleContainerText={styles.styleTextButton}
          styleValue={[styles.textButton, {color: Color.colorNameEstate}]}
          value={'Bỏ Sim'}
        />
      )}
      {statusCode === OrderStatusObject.waitApproval.statusCode && isAgency && (
        <TextView
          id={ActionsRequest.ApproveOrder}
          onPress={onPress}
          nameIconLeft={'tick-inside-circle'}
          colorIconLeft={Color.PersianGreen}
          style={styles.styleButtomActionAccept}
          styleContainerText={styles.styleTextButton}
          styleValue={[styles.textButton, {color: Color.PersianGreen}]}
          value={'Đồng ý'}
        />
      )}
      {statusCode === OrderStatusObject.waitDone.statusCode && isAgency && (
        <TextView
          id={ActionsRequest.CompletedOrder}
          onPress={onPress}
          nameIconLeft={'tick-inside-circle'}
          colorIconLeft={Color.PersianGreen}
          style={styles.styleButtomActionAccept}
          styleContainerText={styles.styleTextButton}
          styleValue={[styles.textButton, {color: Color.PersianGreen}]}
          value={'Hoàn tất'}
        />
      )}
    </View>
  );
}

function OrderItemView(props) {
  const {index, dataItem, isAgency, isCart, typeStatus} = props;
  const route = useRoute();
  const {fengshui} = route.params;
  // console.log(route.params);
  const refOpenSheetUpload = useRef();
  const refUploadImage = useRef({
    reservationId: null,
    images: [],
  });
  const refOpenSheetPreview = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    cartId,
    alias,
    telcoId,
    telco,
    cateName,
    source,
    affiliatePrice,
    websitePrice,
    statusText,
    status,
    agencyResponse,
    createdAt,
    expAt,
    agency,
    createBy,
    customer,
    paidAt,
  } = dataItem;
  const heightSheet = verticalScale(fengshui ? 200 : 530);
  const imageName = TelcoIcon[telcoId || telco?.id];
  const {statusColor, statusName, statusCode} = useMemo(
    () => configOrderStatus(status, agencyResponse),
    [status, agencyResponse],
  );
  const handleOnPress = ({id: action}) => {
    if (action === ActionsRequest.NextCartDetail) {
      AppNavigate.navigateToCartDetailScreen(navigation.dispatch, {
        cartId: cartId,
        isTabarOrder: true,
        typeStatus: typeStatus,
      });
    } else {
      handleRequestAPI({
        dispatch,
        action,
        cartId,
        orderId: dataItem?.id,
        simAlias: dataItem?.alias,
        simId: dataItem?.simId,
      });
    }
  };

  const requestUploadFile = async () => {
    await API.requestUploadImage(dispatch, refUploadImage.current);
    refOpenSheetUpload.current.close();
  };

  const requestPreviewFile = async () => {
    return await API.requestPreviewImage(dispatch, dataItem.cartId);
  };

  const renderUploadImage = (dataItem) => {
    return (
      <React.Fragment>
        <UploadImage
          dataItem={dataItem}
          param="LIBRARY"
          refUploadImage={refUploadImage}
        />
        <UploadImage
          dataItem={dataItem}
          param="CAMERA"
          refUploadImage={refUploadImage}
        />
        <Button
          title="Tải lên"
          style={{backgroundColor: '#38C8EC', marginHorizontal: 10}}
          onPress={requestUploadFile}
        />
      </React.Fragment>
    );
  };

  const renderPreviewImage = () => {
    return <PreviewImage requestPreviewFile={requestPreviewFile} />;
  };
  const nextToOrderDetail = ({id, data}) => {
    AppNavigate.navigateToOrderDetailScreen(navigation.dispatch, {
      dataItem: dataItem,
      typeShow: id,
    });
  };
  const priceDisplay = formatCurrency(
    source === SourceOrder.Affiliate.code ? affiliatePrice : websitePrice,
  );
  const createDate = paidAt
    ? convertTimeDateFormatVN(paidAt)
    : convertTimeDateFormatVN(createdAt);
  const expDate = expAt ? convertTimeDateFormatVN(expAt) : '';
  const requiredSource = RequiredSources[source];
  const titleOrdersOf =
    source === SourceOrder.Website.code
      ? 'Nguồn đặt:'
      : isAgency
      ? 'Người đặt:'
      : 'Đại lý bán:';
  const ordersOf =
    source === SourceOrder.Website.code
      ? requiredSource
      : isAgency
      ? `${requiredSource} - ${createBy?.fullName}`
      : agency?.fullName;
  const customerOrders =
    customer?.phone !== createBy?.phone &&
    `${customer?.name} - ${customer?.phone}`;
  return (
    <TouchableOpacity
      onPress={nextToOrderDetail}
      activeOpacity={0.9}
      style={styles.styleContains}>
      <View style={{flexDirection: 'row', marginBottom: 3}}>
        <Image source={imageName} style={styles.styleImageTelco} />
        <View style={styles.styleContainHead}>
          <Text style={[styles.styleTextSim, {color: statusColor}]}>
            {alias}
          </Text>
          <Text style={styles.styleValue}>{cateName}</Text>
        </View>
        {!isAgency && (
          <TextView
            id={ActionsRequest.NextCartDetail}
            onPress={handleOnPress}
            nameIconLeft={'cart-outline'}
            sizeIconLeft={18}
            styleIconLeft={styles.styleIconStatus}
            colorIconLeft={statusColor}
            style={[styles.stTextStatus, {borderBottomColor: statusColor}]}
            styleContainerText={styles.stContainsTextStatus}
            styleValue={[styles.textStatus, {color: statusColor}]}
            value={cartId}
          />
        )}
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
        id={ActionsRequest.NextOrderDetailOrderer}
        onPress={nextToOrderDetail}
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleOrderValue}
        title={titleOrdersOf}
        value={ordersOf}
      />
      <TextView
        id={ActionsRequest.NextOrderDetailCustomer}
        onPress={nextToOrderDetail}
        style={[styles.styleContainRow, {width: '55%'}]}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleOrderValue}
        title={'Khách mua:'}
        value={customerOrders}
      />
      <View style={[styles.viewSTT]}>
        <Text style={[styles.textSTT]}>{index + 1}</Text>
      </View>
      <IconActionView
        onPress={handleOnPress}
        {...dataItem}
        statusCode={statusCode}
        isCart={isCart}
        isAgency={isAgency}
      />
    </TouchableOpacity>
  );
}

export default OrderItemView;
