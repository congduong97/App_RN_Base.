//Library:
import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  View,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

//Setup:
import {SIZE, COLOR, AsyncStoreKey, getCurrentTime} from '../../../utils';

//Component:
import {Loading} from '../../../elements/Loading';
import {AppText} from '../../../elements/AppText';
import CouponItem from './CouponItem';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ListCoupon = (props) => {
  const {data, limitTime, note, keyTab, fetchData} = props;
  const [dataCupon, setdataCupon] = useState(data);
  const guideRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // CouponService.onChangeCoupon('item-expired', hasItenExpired);
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    const hide = await AsyncStorage.getItem(AsyncStoreKey.hideGuide);
    if (hide !== 'hide_guide') {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          500,
          LayoutAnimation.Types.easeOut,
          LayoutAnimation.Properties.scaleXY,
        ),
      );
      setShowGuide(true);
    }
    pushExpiredItemToLast();
  };

  const renderItem = ({item}) => {
    return (
      <CouponItem
        item={item}
        limitTime={limitTime}
        tabAll={props.tabAll}
        note={note}
      />
    );
  };

  const pushExpiredItemToLast = () => {
    const couponExpired = [];
    const couponNotExpired = [];
    dataCupon.forEach((item) => {
      if (
        item.usedTime &&
        moment(getCurrentTime()).diff(item.usedTime, 'minutes') >= limitTime
      ) {
        couponExpired.push(item);
      } else {
        couponNotExpired.push(item);
      }
    });
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.easeOut,
        LayoutAnimation.Properties.scaleXY,
      ),
    );
    setdataCupon([...couponNotExpired, ...couponExpired]);
  };

  const hideCouponGuide = () => {
    guideRef.current.flipOutX(300).then((end) => {
      setShowGuide(false);
    });
    AsyncStorage.setItem(AsyncStoreKey.hideGuide, 'hide_guide');
  };

  const renderHeaderList = () => {
    if (keyTab === 'all' && showGuide) {
      return (
        <Animatable.View
          useNativeDriver={true}
          ref={guideRef}
          style={{
            marginHorizontal: 8,
            padding: 10,
            borderWidth: 1,
            borderColor: COLOR.main_color_2,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <AppText
              style={{fontSize: SIZE.H5 * 1.2, fontFamily: 'irohamaru-Medium'}}>
              利用手順
            </AppText>
            <AppText
              onPress={hideCouponGuide}
              style={{
                fontSize: SIZE.H5,
                color: COLOR.main_color_2,
                textDecorationLine: 'underline',
              }}>
              利用手順を次回以降は表示しない
            </AppText>
          </View>
          <View>
            <AppText
              style={{fontSize: SIZE.H5, marginBottom: 8, lineHeight: 20}}>
              <AppText style={{fontSize: SIZE.H4}}>①</AppText>
              利用したいクーポンの「このクーポンを利用する」ボタンをクリック
            </AppText>
            <AppText style={{fontSize: SIZE.H5, marginBottom: 8}}>
              <AppText style={{fontSize: SIZE.H4}}>②</AppText>
              クーポン確認画面で「はい」をクリック
            </AppText>
            <AppText style={{fontSize: SIZE.H5, marginBottom: 8}}>
              <AppText style={{fontSize: SIZE.H4}}>③</AppText>
              クーポン利用中画面をレジスタッフにご提示
            </AppText>
          </View>
        </Animatable.View>
      );
    }
    return null;
  };
  const onRefresh = () => {
    if (refresh) {
      return;
    }
    setRefresh(true);
    fetchData();
    setRefresh(false);
  };

  if (!data) {
    return <Loading />;
  }

  return (
    <FlatList
      ListHeaderComponent={renderHeaderList()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 50}}
      refreshing={refresh}
      onRefresh={onRefresh}
      ListHeaderComponentStyle={{marginVertical: SIZE.padding}}
      data={dataCupon}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

export default ListCoupon;
