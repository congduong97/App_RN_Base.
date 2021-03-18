import React, {useEffect} from 'react';
import {View, Text, ScrollView} from 'react-native';
import moment from 'moment';
import {SIZE, COLOR} from '../../../utils';
import {AppText} from '../../../elements/AppText';
import {AppImage, TouchableCo} from '../../../elements';
import CountDownItem from './CountDownItem';

const COUPON_POLICY = {
  ONCE_TIME_PER_DAY: '１日１回利用可能',
  ONCE_TIME: '１回のみ利用可能',
  COUNTLESS_TIME: '期間中何度でも利用可能',
};
const sizeContent = SIZE.H4 * 0.9;

export default function ModalCountDown(props) {
  const {
    name,
    subtitle,
    description,
    imageUrl,
    value,
    usagePolicy,
    startTime,
    endTime,
    used,
    usedTime,
    id,
  } = props.data;

  return (
    <View style={{maxHeight: SIZE.height(60)}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center', paddingBottom: 60}}
        style={{
          width: SIZE.width(94),
          height: 120,
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
        <View
          style={{
            width: '90%',
            backgroundColor: 'red',
            padding: 10,
            alignItems: 'center',
          }}>
          <AppText
            style={{color: 'white', fontSize: SIZE.H4, marginBottom: 10}}>
            クーポン利用中
          </AppText>
          <CountDownItem
            style={{color: 'white', fontSize: sizeContent}}
            data={props.data}
            inModal={true}
            limitTime={props.limitTime}
          />
        </View>
        <AppText
          style={{
            color: 'red',
            fontSize: sizeContent,
            paddingVertical: 30,
            fontFamily: 'irohamaru-Medium',
          }}>
          本画面をレジスタッフにご提示ください
        </AppText>
        <View
          style={{
            height: 1,
            backgroundColor: COLOR.grey_300,
            width: '96%',
            marginBottom: 14,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 4,
            marginVertical: 10,
          }}>
          {!!imageUrl && (
            <AppImage
              resizeMode='cover'
              style={{
                width: SIZE.width(30),
                height: SIZE.width(30),
                marginRight: 12,
              }}
              source={{uri: imageUrl}}
            />
          )}
          <View style={{flex: 1}}>
            <AppText
              style={{
                fontFamily: 'irohamaru-Medium',
                marginBottom: SIZE.width(3),
                fontSize: SIZE.H5 * 1.4,
              }}>
              {name}
            </AppText>
            <AppText style={{fontSize: SIZE.h5}}>{subtitle}</AppText>
          </View>
        </View>
        <AppText
          style={{width: '100%', padding: 4, fontSize: sizeContent * 0.9}}>
          {COUPON_POLICY[usagePolicy]}
        </AppText>
        <AppText
          style={{
            width: '100%',
            marginLeft: SIZE.width(5),
            fontSize: sizeContent * 0.9,
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
        <TouchableCo
          onPress={props.closeModal}
          style={{
            padding: 14,
            marginTop: SIZE.width(5),
            backgroundColor: COLOR.grey,
            borderRadius: SIZE.border_radius,
            height: 52,
            width: '95%',
            justifyContent: 'center',
          }}>
          <AppText style={{fontSize: sizeContent, alignSelf: 'center'}}>
            閉じる
          </AppText>
        </TouchableCo>
      </ScrollView>
    </View>
  );
}
