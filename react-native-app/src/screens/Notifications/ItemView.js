import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useDispatch, useSelector} from 'react-redux';
import {Color, Dimension} from '../../commons/constants';
import {
  convertTimeDate,
  FORMAT_HH_MM_DD_MM_YYY,
} from '../../commons/utils/format';
import {TextView} from '../../components';
import AppNavigate from '../../navigations/AppNavigate';
import API from '../../networking';
import actions from '../../redux/actions';
import styles from './styles';

const WIDTH_SWIPE = 70;

const ItemSwipe = (props) => {
  const {id, iconName, style, onPress} = props;
  return (
    <TextView
      id={id}
      onPress={onPress}
      style={[styles.buttonDelete, style]}
      nameIconLeft={iconName}
      // typeIconLeft="FontAwesome"
      colorIconLeft="white"
      sizeIconLeft={Dimension.sizeIcon24}
    />
  );
};

export default function ItemView(props) {
  const {index, itemData, onPress, isChecked} = props;
  const {
    id,
    heading,
    content,
    createdAt,
    status,
    cartId,
    reservationsId,
  } = itemData;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isReaded, setIsReaded] = useState(status === 1);
  const {dataReadedNotifi, isReadedAll} = useSelector(
    (state) => state.NotificationsReducer,
  );

  useEffect(() => {
    if (isReadedAll) {
      setIsReaded(1);
    }
  }, [isReadedAll]);
  useEffect(() => {
    if (dataReadedNotifi?.id === id) {
      setIsReaded(dataReadedNotifi.status === 1);
      dispatch(actions.setDataReadedNotifi(null));
    }
  }, [dataReadedNotifi]);

  useEffect(() => {
    if (status !== isReaded) setIsReaded(status === 1);
  }, [status]);

  const createTime = convertTimeDate(createdAt, FORMAT_HH_MM_DD_MM_YYY);
  const prevOpenedRow = useRef();
  const colorIcon = isReaded ? Color.colorIcon : Color.MayaBlue;
  const styleTitle = isReaded
    ? styles.stTitleNoti
    : [styles.stTitleNoti, {color: Color.MayaBlue, fontWeight: '700'}];

  const requestGetOrderDetail = async (reservationId) => {
    let orderDetail = await API.requestOrderDetail(dispatch, reservationId);
    AppNavigate.navigateToOrderDetailScreen(navigation.dispatch, {
      dataItem: orderDetail,
      typeShow: null,
    });
  };
  const requestChangeStatusNotifi = () => {
    if (!isReaded) {
      let params = {id: itemData.id, status: 1};
      API.requestChangeStatusNotifi(dispatch, params);
    }
  };
  const handleOnPress = ({id, data}) => {
    if (id === ActionId.NextDetail) {
      requestChangeStatusNotifi();
      if (!reservationsId && !cartId) {
        // AppNavigate.navigateToNotificationDetailScreen(navigation.dispatch, {
        //   cartId: cartId,
        //   isTabarOrder: true,
        // });
      } else {
        let reservations = reservationsId
          ? reservationsId.split(',').map((x) => +x)
          : [];
        if (reservations.length !== 1 && cartId) {
          // AppNavigate.navigateToNotificationDetailScreen(navigation.dispatch, {});
          AppNavigate.navigateToCartDetailScreen(navigation.dispatch, {
            cartId: cartId,
            isTabarOrder: true,
          });
        } else {
          requestGetOrderDetail(reservations[0]);
        }
      }
    } else if (id === 'Type-Reded') {
      requestChangeStatusNotifi();
    } else if (id === 'Type-Delete') {
      Alert.alert(
        'Xác nhận xóa?',
        'Bạn chắc chắn muốn xóa thông báo ?',
        [
          {
            text: 'Huỷ bỏ',
            style: 'cancel',
          },
          {
            text: 'Đồng ý xoá',
            onPress: () => {
              onPress && onPress({id, data: itemData});
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  return (
    <Swipeable
      //   ref={(ref) => (row[index] = ref)}
      friction={1.3}
      leftThreshold={WIDTH_SWIPE / 2}
      rightThreshold={WIDTH_SWIPE / 2}
      onSwipeableLeftOpen={() => handleOnPress({id: 'Type-Reded'})}
      //   onSwipeableWillOpen={closeRow}
      overshootFriction={20}
      overshootLeft={false}
      renderLeftActions={(progress, drag) =>
        !isReaded ? (
          <ItemSwipe
            id={'Type-Reded'}
            iconName={'tick-inside-circle'}
            style={{backgroundColor: Color.lightGreenIOS}}
            // onPress={handleOnPress}
          />
        ) : null
      }
      renderRightActions={(progress, drag) => (
        <ItemSwipe
          id={'Type-Delete'}
          iconName={'delete'}
          // style={{}}
          onPress={handleOnPress}
        />
      )}>
      <View style={styles.stRow}>
        <TextView
          id={ActionId.NextDetail}
          nameIconLeft={'bell'}
          typeIconLeft="MaterialCommunityIcons"
          sizeIconLeft={Dimension.sizeIcon18}
          styleIconLeft={styles.stIconRow}
          colorIconLeft={colorIcon}
          onPress={handleOnPress}
          style={styles.stContainsRow}
          styleContainerText={styles.stContentRow}
          styleTitle={styleTitle}
          styleValue={[styles.stValueNoti, {flexWrap: 'wrap'}]}
          title={heading}
          value={content}
        />
        <Text style={styles.textDateNoti}>{createTime}</Text>
      </View>
    </Swipeable>
  );
}

const ActionId = {
  NextDetail: 'NextDetail',
  NextNotifiDetail: 'NextNotifiDetail',
  NextOrderDetail: 'NextOrderDetail',
};
