import React, {useRef} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {SIZE, COLOR, FetchApi, getCurrentTime} from '../../../utils';
import {AppText} from '../../../elements/AppText';
import {AppImage, AppTextButton, TouchableCo} from '../../../elements';
import moment from 'moment';
import hexToRgba from 'hex-to-rgba';
import {CouponService} from '../services/CouponService';
import Toast from '../../../elements/Toast';
import {ToastModal} from '../../ForgotPassword/utils/ToastModal';
import HTMLView from 'react-native-htmlview';

const COUPON_POLICY = {
  ONCE_TIME_PER_DAY: '１日１回利用可能',
  ONCE_TIME: '１回のみ利用可能',
  COUNTLESS_TIME: '期間中何度でも利用可能',
};
const sizeContent = SIZE.H4 * 0.9;

export default function ModalDetail(props) {
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
    pKikakuId,
    id,
  } = props.data;

  const btnSubmitRef = useRef(null);

  const onPressUse = async () => {
    btnSubmitRef.current.setLoadingValue(true);
    let result = await FetchApi.useCoupon(pKikakuId, '' + id);

    if (result.success) {
      CouponService.set({
        ...props.data,
        usedTime: getCurrentTime(),
        used: true,
      });
      btnSubmitRef.current.setLoadingValue(false);
      props.setContent('ModalCountDown');
    } else {
      btnSubmitRef.current.setLoadingValue(false);
      ToastModal.showToast('クーポンを利用できません。');
    }
  };

  return (
    <View style={{height: SIZE.height(90)}}>
      <ScrollView
        contentContainerStyle={{alignItems: 'center', paddingBottom: 60}}
        style={{
          width: SIZE.width(94),
          backgroundColor: 'white',
          paddingVertical: 30,
        }}>
        <AppText style={{fontFamily: 'irohamaru-Medium', fontSize: SIZE.H3}}>
          クーポン利用確認
        </AppText>
        <AppText
          style={{
            paddingHorizontal: 10,
            fontSize: sizeContent,
            color: 'red',
            marginVertical: 24,
            lineHeight: SIZE.H4,
          }}>
          次の画面でクーポン利用となります。{'\n'}
          利用後のキャンセルはできませんのでご注意ください。
        </AppText>
        <AppText style={{fontSize: sizeContent}}>
          クーポンを利用します。よろしいですか？
        </AppText>
        <View
          style={{
            height: 1,
            backgroundColor: COLOR.grey_300,
            width: '96%',
            marginVertical: 14,
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
              style={{fontSize: SIZE.H5 * 1.3, fontFamily: 'irohamaru-Medium'}}>
              {name}
            </AppText>
            <AppText style={{fontSize: SIZE.H5 * 1.0, marginVertical: 15}}>
              {subtitle}
            </AppText>
          </View>
        </View>
        <AppText
          style={{
            width: '100%',
            marginLeft: SIZE.width(3),
            fontSize: sizeContent,
          }}>
          {COUPON_POLICY[usagePolicy]}
        </AppText>
        <AppText
          style={{
            width: '100%',
            marginLeft: SIZE.width(5),
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
        <View style={{width: SIZE.width(100)}}>
          <AppText
            style={{
              marginLeft: SIZE.width(5),
              fontSize: sizeContent,
              lineHeight: SIZE.H4,
            }}>
            {description}
          </AppText>
        </View>

        <AppTextButton
          ref={btnSubmitRef}
          onPress={onPressUse}
          textStyle={{fontFamily: 'irohamaru-Medium', fontSize: sizeContent}}
          style={{
            backgroundColor: hexToRgba(COLOR.main_color, '0.6'),
            height: 52,
            borderRadius: SIZE.border_radius,
            marginTop: 10,
            width: '95%',
          }}
          title='はい'
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
            キャンセル
          </AppText>
        </TouchableCo>
        {!!props.note && (
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
                fontFamily: 'irohamaru-Medium',
                marginBottom: 16,
              }}>
              ご利用上のご注意事項
            </AppText>
            <HTMLView
              value={`<div>${props.note.replace(/(\r\n|\n|\r)/gm, '')}</div>`}
              stylesheet={styles}
            />
          </View>
        )}
      </ScrollView>
      <Toast ref={ToastModal.toastRef} inModal={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  p: {
    lineHeight: 20,
    fontSize: sizeContent,
    fontFamily: 'MotoyaLMaru',
  },
});
