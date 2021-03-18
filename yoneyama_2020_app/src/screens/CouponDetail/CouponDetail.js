//Library:
import React, {useRef, useState, useEffect, useContext} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import moment from 'moment';
import hexToRgba from 'hex-to-rgba';
import HTMLView from 'react-native-htmlview';

//Setup:
import {AppText} from '../../elements/AppText';
import {SIZE, COLOR, FetchApi, getCurrentTime} from '../../utils';
import {AppImage, AppTextButton, AppContainer} from '../../elements';

//Component:
import CouponModal from '../Coupon/items/CouponModal';
import CountDownItem from '../Coupon/items/CountDownItem';
import {ContextContainer} from '../../contexts/AppContext';

//Services:
import {CouponService} from '../Coupon/services/CouponService';

const COUPON_POLICY = {
  ONCE_TIME_PER_DAY: '１日１回利用可能',
  ONCE_TIME: '１回のみ利用可能',
  COUNTLESS_TIME: '期間中何度でも利用可能',
};
const sizeContent = SIZE.H4 * 0.9;

export default function CouponDetail({route}) {
  const {colorApp} = useContext(ContextContainer);
  const {
    name,
    subtitle,
    description,
    imageUrl,
    usagePolicy,
    startTime,
    endTime,
    usedTime,
    id,
  } = route.params.item;
  const modalCoupon = useRef(null);
  const [data, setData] = useState(route.params.item);
  const [couponState, setCouponState] = useState({
    using:
      usedTime &&
      moment(getCurrentTime()).diff(usedTime, 'minutes') <
        route.params.limitTime,
    expired:
      usedTime &&
      moment(getCurrentTime()).diff(usedTime, 'minutes') >=
        route.params.limitTime,
  });

  useEffect(() => {
    CouponService.onChangeCoupon(`CouponDetail-${id}`, onChangeCouponSate);
    return () => {
      CouponService.deleteKey(`CouponDetail-${id}`);
    };
  }, []);

  const onChangeCouponSate = (state) => {
    if (state.id === id) {
      setData({...state});
      setCouponState({
        using:
          state.usedTime &&
          moment(getCurrentTime()).diff(state.usedTime, 'minutes') <
            route.params.limitTime,
        expired:
          state.usedTime &&
          moment(getCurrentTime()).diff(state.usedTime, 'minutes') >=
            route.params.limitTime,
      });
    }
  };

  const onUseCoupon = () => {
    FetchApi.useCouponInDetail(id);
    modalCoupon.current.setShowModal(couponState);
  };

  //If unlimited, will not remove item then else forceupdate item:
  const setExpired = () => {
    if (!couponState.expired) {
      setCouponState({...couponState, expired: true});
    }
  };

  return (
    <AppContainer haveTitle goBackScreen>
      <ScrollView
        contentContainerStyle={{alignItems: 'center', paddingBottom: 60}}
        style={{
          backgroundColor: 'white',
          paddingVertical: 30,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 4,
            marginBottom: 10,
          }}>
          {!!imageUrl && (
            <AppImage
              resizeMode="cover"
              style={{
                width: SIZE.width(30),
                height: SIZE.width(30),
                marginRight: 12,
              }}
              source={{uri: imageUrl}}
            />
          )}
          {couponState.using && !couponState.expired && (
            <CountDownItem
              style={{
                position: 'absolute',
                bottom: 0,
                left: 4,
                width: SIZE.width(30),
                height: SIZE.width(13),
              }}
              data={data}
              limitTime={route.params.limitTime}
              expired={couponState.expired}
              setExpired={setExpired}
            />
          )}
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: SIZE.H5 * 1.4,
                fontWeight: 'bold',
                marginBottom: 20,
              }}>
              {name}
            </Text>
            <AppText style={{fontSize: SIZE.H5}}>{subtitle}</AppText>
          </View>
        </View>
        <AppText style={{width: '100%', padding: 4, fontSize: sizeContent}}>
          {COUPON_POLICY[usagePolicy]}
        </AppText>
        <AppText
          style={{
            width: '100%',
            marginLeft: SIZE.width(4),
            fontSize: sizeContent,
          }}>
          利用期間：{moment(startTime).format('YYYY年MM月DD日')}
          {' 〜 '}
          {moment(endTime).format('YYYY年MM月DD日')}
        </AppText>
        <View
          style={{
            height: 1,
            backgroundColor: COLOR.grey_300,
            width: '96%',
            marginVertical: 14,
          }}
        />
        {/* Căn trái điều khoản xử dụng: */}
        <View style={{width: SIZE.width(100)}}>
          <AppText
            style={{
              fontSize: sizeContent,
              lineHeight: SIZE.H4,
              marginLeft: SIZE.width(2),
            }}>
            {description}
          </AppText>
        </View>

        <AppTextButton
          onPress={onUseCoupon}
          textStyle={{fontWeight: 'bold', fontSize: sizeContent}}
          style={{
            backgroundColor: hexToRgba(colorApp.backgroundColorButton, '0.6'),
            height: 52,
            borderRadius: SIZE.border_radius,
            marginTop: 10,
            width: '95%',
          }}
          title="クーポンを利用する"
        />
        {!!route.params.note && (
          <View
            style={{
              width: '94%',
              padding: 10,
              marginVertical: 14,
              borderWidth: 1,
              borderColor: COLOR.main_color_2,
            }}>
            <AppText
              style={{
                color: 'red',
                fontSize: sizeContent,
                fontWeight: 'bold',
                marginBottom: 16,
              }}>
              ご利用上のご注意事項
            </AppText>
            <HTMLView
              value={`<div>${route.params.note.replace(
                /(\r\n|\n|\r)/gm,
                '',
              )}</div>`}
              stylesheet={styles}
            />
          </View>
        )}
        <CouponModal
          note={route.params.note}
          ref={modalCoupon}
          data={data}
          limitTime={route.params.limitTime}
        />
      </ScrollView>
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  p: {
    lineHeight: 20,
    fontSize: sizeContent,
    fontFamily: 'MotoyaLMaru',
  },
});
