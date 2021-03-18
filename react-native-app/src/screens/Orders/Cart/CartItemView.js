import {useNavigation} from '@react-navigation/native';
import React, {useMemo} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Color, Icon} from '../../../commons/constants';
import {
  convertTimeDateFormatVN,
  formatCurrency,
} from '../../../commons/utils/format';
import {TextView} from '../../../components';
import {configCartStatus} from '../../../models/ConfigsData';
import AppNavigate from '../../../navigations/AppNavigate';
import API from '../../../networking';
import styles from '../styles';
import {
  ActionsRequest,
  handleRequestAPI,
  requestAddSimToCart,
} from '../HandleRequestAPI';

function IconActionView(props) {
  const {id: cartId, onPress, isTabarOrder} = props;
  const dispatch = useDispatch();
  const handleOnPress = ({id: action}) => {
    handleRequestAPI({
      dispatch,
      action,
      cartId,
      orderId: null,
      simAlias: null,
      simId: null,
    });
  };

  return isTabarOrder ? (
    <View style={[styles.styleViewButton, {marginTop: 10}]}>
      <TextView
        id={ActionsRequest.CancelCart}
        onPress={handleOnPress}
        nameIconLeft={'cancel'}
        colorIconLeft={Color.WildWatermelon}
        style={styles.styleButtomActionCancel}
        styleContainerText={styles.styleTextButton}
        styleValue={styles.textButton}
        value={'Huỷ giỏ hàng'}
      />
      <TextView
        id={ActionsRequest.PlaceOrder}
        onPress={handleOnPress}
        nameIconLeft={'send'}
        colorIconLeft={Color.PersianGreen}
        style={styles.styleButtomActionAccept}
        styleContainerText={styles.styleTextButton}
        styleValue={[styles.textButton, {color: Color.PersianGreen}]}
        value={'Đặt hàng'}
      />
    </View>
  ) : (
    <View style={[styles.styleViewButton, {marginTop: 10}]}>
      <TextView
        id={ActionsRequest.AddSimToCart}
        onPress={onPress}
        nameIconLeft={'send'}
        colorIconLeft={Color.PersianGreen}
        style={styles.styleButtomActionAccept}
        styleContainerText={styles.styleTextButton}
        styleValue={[styles.textButton, {color: Color.PersianGreen}]}
        value={'Lựa chọn'}
      />
    </View>
  );
}

export default function CartItemView(props) {
  const {index, dataItem, isAgency, isTabarOrder, simId, onSelected} = props;
  const {
    id: cartId,
    createdAt,
    customerName,
    simCount,
    totalAmount,
    status,
  } = dataItem;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const createDate = createdAt ? convertTimeDateFormatVN(createdAt) : '';
  const {statusName, statusColor, statusCode} = useMemo(
    () => configCartStatus(status),
    [status],
  );
  const priceDisplay = formatCurrency(totalAmount);

  const handleOnPress = ({id}) => {
    // if (id && id === ActionsRequest.AddSimToCart) {
    if (!isTabarOrder) {
      // Chọn them sim vao giỏ hàng
      Alert.alert(
        'Xác nhận',
        'Bạn có muốn thêm vào giỏ hàng ?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              handleAddSimToCart();
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      ///Sang chi tiết giỏ hàng
      AppNavigate.navigateToCartDetailScreen(navigation.dispatch, {
        cartId,
        isTabarOrder: isTabarOrder,
      });
    }
  };
  const handleAddSimToCart = async () => {
    await requestAddSimToCart(dispatch, {
      cartId,
      simId,
    });
    navigation.goBack();
    onSelected && onSelected();
  };

  return (
    <TouchableOpacity
      onPress={handleOnPress}
      activeOpacity={0.9}
      style={styles.styleContains}>
      <View style={{flexDirection: 'row', marginBottom: 3}}>
        <Image source={Icon.boy} style={styles.styleImageTelco} />
        <View style={styles.styleContainHead}>
          <Text style={styles.styleTextSim}>{customerName}</Text>
          <Text style={[styles.styleValueStatus, {color: statusColor}]}>
            {statusName}
          </Text>
        </View>
      </View>
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={[styles.styleValue, {color: Color.Black}]}
        // styleValue={styles.styleValue}
        title={'Số SIM: '}
        value={simCount}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={styles.styleTextValue}
        title={'Tổng giá: '}
        value={priceDisplay}
      />
      <TextView
        style={styles.styleContainRow}
        styleContainerText={styles.styleContainerText}
        styleTitle={styles.styleTextTitle}
        styleValue={[styles.styleValue, {color: Color.Black}]}
        title={'Ngày đặt: '}
        value={createDate}
      />
      <View style={[styles.viewSTT]}>
        <Text style={[styles.textSTT]}>{index + 1}</Text>
      </View>
      <IconActionView
        {...dataItem}
        cartStatus={statusCode}
        isTabarOrder={isTabarOrder}
        onPress={handleOnPress}
      />
    </TouchableOpacity>
  );
}
