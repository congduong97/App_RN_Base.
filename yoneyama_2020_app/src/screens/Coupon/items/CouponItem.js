//Library:
import React, {useState, useRef, useEffect, useContext, useMemo} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import moment from 'moment';

//Setup:
import {AppImage, AppTextButton} from '../../../elements';
import {ContextContainer} from '../../../contexts/AppContext';
import {COLOR, SIZE, FetchApi, getCurrentTime} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import CouponModal from './CouponModal';
import CountDownItem from './CountDownItem';

//Services:
import {CouponService} from '../services/CouponService';

const COUPON_POLICY = {
  ONCE_TIME_PER_DAY: '１日１回利用可能',
  ONCE_TIME: '１回のみ利用可能',
  COUNTLESS_TIME: '期間中何度でも利用可能',
};
const CouponItem = ({item, limitTime, tabAll, note}) => {
  const {colorApp} = useContext(ContextContainer);
  const {
    name,
    subtitle,
    imageUrl,
    usagePolicy,
    startTime,
    endTime,
    usedTime,
    id,
  } = item;
  const navigation = useNavigation();
  const btnRef = useRef(null);
  const modalCoupon = useRef(null);

  const [data, setData] = useState(item);
  const [couponState, setCouponState] = useState({
    using:
      usedTime &&
      moment(getCurrentTime()).diff(usedTime, 'minutes') < limitTime,
    expired:
      usedTime &&
      moment(getCurrentTime()).diff(usedTime, 'minutes') >= limitTime &&
      item.usagePolicy !== 'COUNTLESS_TIME',
  });

  useEffect(() => {
    CouponService.onChangeCoupon(
      `couponitem-${id}-${tabAll}`,
      onChangeCouponState,
    );
    return () => {
      CouponService.deleteKey(`couponitem-${id}-${tabAll}`);
    };
  }, []);

  const onChangeCouponState = (state) => {
    if (state.id === id) {
      setData({...state});
      setCouponState({
        using:
          state.usedTime &&
          moment(getCurrentTime() + 1000).diff(state.usedTime, 'minutes') <
            limitTime,
        expired:
          usagePolicy !== 'COUNTLESS_TIME' &&
          state.usedTime &&
          moment(getCurrentTime()).diff(state.usedTime, 'minutes') >= limitTime,
      });
    }
  };

  const setExpired = () => {
    //if unlimited, will not remove item then else forceupdate item
    if (!couponState.expired && usagePolicy !== 'COUNTLESS_TIME') {
      setCouponState({...couponState, expired: true});
    }
  };
  const onUseCoupon = () => {
    FetchApi.useCouponInDetail(id);
    modalCoupon.current.setShowModal(couponState);
  };

  const onPressItem = () => {
    if (couponState.expired) {
      // alert('coupon het han');
      return;
    }
    navigation.navigate(keyNavigation.COUPON_DETAIL, {
      item: data,
      limitTime,
      note,
      setCouponState,
    });
  };

  const renderModal = useMemo(() => {
    return (
      <CouponModal
        ref={modalCoupon}
        data={data}
        couponState={couponState}
        limitTime={limitTime}
        note={note}
        tabAll={tabAll}
      />
    );
  }, [couponState]);

  return (
    <TouchableOpacity
      onPress={onPressItem}
      style={{
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.grey,
      }}>
      {couponState.expired && (
        <View
          style={{
            zIndex: 2,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLOR.BG_TRANSPARENT_40,
          }}>
          <Text
            style={{
              fontSize: SIZE.H1 * 1.5,
              color: COLOR.white,
              fontWeight: 'bold',
            }}>
            利用済み
          </Text>
        </View>
      )}

      <View style={{paddingVertical: 20}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: SIZE.width(30), height: SIZE.width(30)}}>
            {!!imageUrl && (
              <AppImage
                resizeMode="cover"
                style={{
                  width: SIZE.width(30),
                  height: SIZE.width(30),
                }}
                source={{uri: imageUrl}}
              />
            )}
            {couponState.using && !couponState.expired && (
              <CountDownItem
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: SIZE.width(30),
                  height: SIZE.width(13),
                }}
                data={data}
                limitTime={limitTime}
                setExpired={setExpired}
                expired={couponState.expired}
              />
            )}
          </View>
          <View style={{flex: 1, paddingLeft: 10}}>
            <Text style={{fontSize: SIZE.H5 * 1.3, fontWeight: 'bold'}}>
              {name}
            </Text>
            <Text style={{fontSize: SIZE.H5 * 1.0, marginVertical: 15}}>
              {subtitle}
            </Text>
          </View>
        </View>
        <Text style={{fontSize: SIZE.H5 * 1.2, marginTop: 10}}>
          {COUPON_POLICY[usagePolicy]}
        </Text>
        <Text style={{fontSize: SIZE.H5 * 1.2, marginTop: 10}}>
          利用期間：{moment(new Date(startTime)).format('YYYY年MM月DD日')}
          {' 〜 '}
          {moment(new Date(endTime)).format('YYYY年MM月DD日')}
        </Text>
        <AppTextButton
          ref={btnRef}
          onPress={onUseCoupon}
          textStyle={{fontWeight: 'bold'}}
          style={{
            backgroundColor: hexToRgba(colorApp.backgroundColorButton, '0.6'),
            height: 52,
            borderRadius: SIZE.border_radius,
            marginTop: 10,
          }}
          title="このクーポンを利用する"
        />
      </View>
      {renderModal}
    </TouchableOpacity>
  );
};

export default CouponItem;
