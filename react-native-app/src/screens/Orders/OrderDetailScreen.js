import {useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState, useRef} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {Color, Dimension} from '../../commons/constants';
import {
  ratioW,
  setHeight,
  setWidth,
  verticalScale,
} from '../../commons/utils/devices';
import API from '../../networking';
import actions from '../../redux/actions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  concatenateString,
  convertTimeDateFormatVN,
  formatCurrency,
} from '../../commons/utils/format';
import {ActionsRequest, handleRequestAPI} from './HandleRequestAPI';
import {ScreensView, TextView, Button, ListImageView} from '../../components';
import models from '../../models';
import {
  PaymentPackage,
  SourceOrder,
  TelcoIcon,
  OrderStatusObject,
  SimHoldStatus,
  configOrderStatus,
} from '../../models/ConfigsData';
import styles from './styles';
import PreviewImage from '../../components/PreviewImage/PreviewImage';
import ModalImageZoom from '../../components/ModalImageZoom';
import ModalSelectUpLoadImage from '../../components/ModalSelectUpLoadImage';
const widthTitle = 110;
const sizeIcon = 13;

function OrderInfo(props) {
  const {
    alias,
    cateName,
    statusName,
    statusColor,
    affiliatePrice,
    websitePrice,
    telcoId,
    source,
  } = props;
  const priceDisplay = formatCurrency(
    source === SourceOrder.Affiliate.code ? affiliatePrice : websitePrice,
  );
  return (
    <View
      style={[
        styles.styleContainOrderInfo,
        styles.styleHightlightCard,
        {flexDirection: 'row', marginBottom: 3},
      ]}>
      <Image source={TelcoIcon[telcoId]} style={styles.styleImageTelco} />
      <View style={styles.styleContainHead}>
        <Text style={[styles.styleTextSim, {color: statusColor}]}>{alias}</Text>
        <Text style={[styles.styleValue, {fontWeight: '700'}]}>{cateName}</Text>
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValue}
          title={'Giá bán:'}
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
      </View>
    </View>
  );
}

function BlockSimInfoView(props) {
  const {
    blockTitle,
    paymentPackage,
    expAt,
    status,
    style,
    pledgeMonths,
    paidAt,
    createdAt,
  } = props;
  const createDate = convertTimeDateFormatVN(paidAt ? paidAt : createdAt);
  const expDate = convertTimeDateFormatVN(expAt);
  return (
    <View style={[styles.styleContainBlock, style]}>
      <Text style={styles.styleBlockTitle}>{blockTitle}</Text>
      <TextView
        style={[styles.styleContainRow, {marginTop: 20}]}
        styleContainerText={styles.styleContainerText}
        styleTitle={[styles.styleTextTitle, {width: widthTitle}]}
        styleValue={[styles.styleTextValue, {color: Color.MayaBlue}]}
        title={'Thuê bao:'}
        value={PaymentPackage[paymentPackage]}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={[styles.styleTextTitle, {width: widthTitle}]}
        styleValue={styles.styleTextValueDetail}
        title={'T.gian cam kết:'}
        value={`${pledgeMonths || 0} (tháng)`}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={[styles.styleTextTitle, {width: widthTitle}]}
        styleValue={styles.styleTextValueDetail}
        title={'Thời gian:'}
        value={createDate}
      />
      {status === SimHoldStatus.active.id && (
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: widthTitle}]}
          styleValue={styles.styleTextValueDetail}
          title={'Hạn giữ: '}
          value={expDate}
        />
      )}
    </View>
  );
}

function BlockInfoView(props) {
  const dispatch = useDispatch();
  const route = useRoute();
  const {fengshui, dataItem} = route.params;
  const heightSheet = verticalScale(fengshui ? 200 : 530);

  const renderPreviewImage = () => {
    return <PreviewImage requestPreviewFile={requestPreviewFile} />;
  };
  const requestPreviewFile = async () => {
    return await API.requestPreviewImage(dispatch, {
      reservationId: dataItem.cartId,
    });
  };
  const refOpenSheetPreview = React.useRef();
  const {
    typeBlock,
    style,
    blockTitle,
    name,
    fullName,
    email,
    phone,
    facebook,
    zalo,
    address,
    ward,
    district,
    province,
  } = props;
  const addressDisplay = concatenateString(
    ', ',
    address,
    ward,
    district,
    province,
  );
  const titleName =
    typeBlock === 'TypeCustomer' ? 'Khách hàng:' : 'Người liên hệ:';
  const valueName = typeBlock === 'TypeCustomer' ? name : fullName;
  return (
    <>
      <View style={[styles.styleContainBlock, style]}>
        <Text style={styles.styleBlockTitle}>{blockTitle}</Text>
        <TextView
          style={[styles.styleContainRow, {marginTop: 20}]}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          title={titleName}
          nameIconLeft={'user'}
          value={valueName}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          title={'ĐT liên hệ: '}
          nameIconLeft={'telephone'}
          value={phone}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          nameIconLeft={'email'}
          title={'Email: '}
          value={email}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          nameIconLeft={'facebook'}
          title={'Facebook: '}
          value={facebook}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          nameIconLeft={'zalo'}
          title={'Zalo: '}
          value={zalo}
        />
        <TextView
          style={styles.styleContainRow}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          title={'Địa chỉ: '}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          nameIconLeft={'home-address'}
          value={addressDisplay}
        />
        <TextView
          style={[styles.styleContainRow, {width: '40%'}]}
          styleContainerText={styles.styleContainerText}
          styleTitle={[styles.styleTextTitle, {width: null}]}
          styleValue={styles.styleTextValueDetail}
          title={'Chứng thực: '}
          sizeIconLeft={sizeIcon}
          styleIconLeft={{marginRight: 3}}
          nameIconLeft={'idcard'}
          typeIconLeft="AntDesign"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}></View>
      </View>
      <RBSheet
        ref={refOpenSheetPreview}
        animationType="fade"
        height={heightSheet}
        openDuration={200}
        closeOnPressMask={true}
        closeOnPressBack={false}
        customStyles={{
          container: {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}>
        {renderPreviewImage()}
      </RBSheet>
    </>
  );
}

function RenderButtonFooter(props) {
  const {onPress, statusCode, isAgency} = props;
  return statusCode === OrderStatusObject.done.statusCode ||
    statusCode === OrderStatusObject.cancelled.statusCode ||
    statusCode === OrderStatusObject.agencyCancelled.statusCode ? null : (
    <View style={styles.styleViewButtonFooter}>
      <Button
        id={isAgency ? ActionsRequest.CancelOrder : ActionsRequest.RemoveSIM}
        onPress={onPress}
        color={'#fff'}
        title={isAgency ? 'Huỷ bỏ' : 'Bỏ Sim'}
        style={styles.styleButtonCancelCart}
        titleStyle={{color: 'white', fontSize: 16}}
      />
      <View style={{width: 10 * ratioW}} />
      {statusCode === OrderStatusObject.waitApproval.statusCode && isAgency && (
        <Button
          id={ActionsRequest.ApproveOrder}
          onPress={onPress}
          color={Color.MayaBlue}
          title="Đồng ý"
          style={{flex: 1, marginVertical: 10}}
        />
      )}

      {statusCode === OrderStatusObject.waitDone.statusCode && isAgency && (
        <Button
          id={ActionsRequest.CompletedOrder}
          onPress={onPress}
          color={Color.MayaBlue}
          title="Hoàn tất"
          style={{flex: 1, marginVertical: 10}}
        />
      )}
    </View>
  );
}

export default function OrderDetailScreen(props) {
  const {} = props;
  const route = useRoute();
  const dispatch = useDispatch();
  const {dataItem, typeShow, isRequestData} = route.params;
  const [typeViewShow, setTypeViewShow] = useState(typeShow);
  const [urlImgZoom, setStateUrlImgZoom] = useState('');
  const refModalImageZoom = useRef(null);
  const refSheetPreview = useRef(null);
  const refListImageView = useRef(null);
  const [orderData, setOrderData] = useState(dataItem);
  const {
    id: orderId,
    alias: simAlias,
    simId,
    status,
    cartId,
    agencyResponse,
    orderStatus,
    agency,
    createBy,
    customer,
  } = orderData;

  const isAgency = models.isRoleAgency();
  const userInfo = models.getUserInfo();
  const {statusColor, statusName, statusCode} = useMemo(
    () => configOrderStatus(status, agencyResponse, orderStatus),
    [status, agencyResponse, orderStatus],
  );

  const handleOnPress = ({id: action}) => {
    handleRequestAPI(
      {
        dispatch,
        action,
        cartId,
        orderId,
        simAlias,
        simId,
      },
      requestOrderDetail,
    );
  };

  const requestOrderDetail = async () => {
    let orderDetail = await API.requestOrderDetail(dispatch, orderId);
    setOrderData(orderDetail);
  };

  useEffect(() => {
    return () => {
      dispatch(actions.saveDataNotification(null));
    };
  }, []);

  useEffect(() => {
    if (typeShow !== typeViewShow) {
      setTypeViewShow(typeShow);
    }
  }, [typeShow]);

  useEffect(() => {
    if (isRequestData) {
      requestOrderDetail();
    }
  }, [isRequestData]);

  const handleClearShow = () => {
    typeViewShow && setTypeViewShow(null);
  };

  const zoomImage = () => {
    refModalImageZoom.current.openModal();
  };
  const getUrlImgZoom = (link) => {
    setStateUrlImgZoom(link);
  };

  const getImgSelectUpToListView = (ojbPushToList) => {
    refListImageView.current.uploadSuccessImgToFilesData(ojbPushToList);
  };
  return (
    <ScreensView
      titleScreen={'Chi tiết đơn hàng'}
      subTitle={`Mã đơn: ${cartId}`}
      styleContent={{backgroundColor: Color.colorBGSQM, paddingBottom: 20}}
      renderFooter={
        <RenderButtonFooter
          onPress={handleOnPress}
          statusCode={statusCode}
          isAgency={isAgency}
        />
      }>
      <OrderInfo
        {...orderData}
        statusColor={statusColor}
        statusName={statusName}
      />
      <View style={{backgroundColor: 'white', marginTop: 20, height: '100%'}}>
        <BlockSimInfoView
          blockTitle={'Thông tin'}
          {...orderData}
          statusColor={statusColor}
          status={status}
        />
        {!isAgency ? (
          <BlockInfoView
            typeBlock={'Orderer'}
            blockTitle={'Đại lý bán Sim'}
            {...agency}
            style={typeViewShow === 'Orderer' ? styles.styleHightlightCard : {}}
          />
        ) : (
          <BlockInfoView
            typeBlock={'Orderer'}
            blockTitle={'Người đặt'}
            {...createBy}
            style={typeViewShow === 'Orderer' ? styles.styleHightlightCard : {}}
          />
        )}
        <BlockInfoView
          typeBlock={'TypeCustomer'}
          blockTitle={'Khách hàng mua Sim'}
          {...customer}
          style={
            typeViewShow === 'TypeCustomer' ? styles.styleHightlightCard : {}
          }
        />
        <ScrollView
          horizontal
          style={{
            width: setWidth(375),
            minHeight: setHeight(45),
          }}>
          <View
            style={{
              minWidth: setWidth(375),
              flexDirection: 'row',
            }}>
            {userInfo && userInfo.nameRole == 'ROLE_AFFILIATE' && (
              <TouchableOpacity
                onPress={() => {
                  refSheetPreview.current.openSheetPreview();
                }}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 8,
                  marginLeft: 8,
                  borderColor: Color.Border,
                  borderWidth: 0.5,
                  marginTop: Dimension.margin10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {/* Thêm ảnh vào danh sách chi tiết đơn hàng */}
                <MaterialIcons
                  name={'add-a-photo'}
                  size={45}
                  color={'grey'}></MaterialIcons>
              </TouchableOpacity>
            )}
            <ListImageView
              ref={refListImageView}
              idItemSelect={dataItem.id}
              reservationId={cartId}
              zoomImage={zoomImage}
              getUrlImgZoom={getUrlImgZoom}
            />
          </View>
        </ScrollView>

        {typeViewShow && (
          <TouchableOpacity
            onPress={handleClearShow}
            activeOpacity={1}
            style={{
              position: 'absolute',
              left: 0,
              top: -100,
              right: 0,
              bottom: 0,
              backgroundColor: '#3455',
            }}
          />
        )}
        <ModalSelectUpLoadImage
          idItemSelect={dataItem.id}
          ref={refSheetPreview}
          reservationId={cartId}
          getImgSelectUpToListView={
            getImgSelectUpToListView
          }></ModalSelectUpLoadImage>
        <ModalImageZoom
          reservationId={cartId}
          ref={refModalImageZoom}
          urlImgZoom={urlImgZoom}></ModalImageZoom>
      </View>
    </ScreensView>
  );
}
