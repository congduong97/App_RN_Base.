import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {DEVICE_WIDTH} from '../../../const/System';
import {COLOR_GRAY} from '../../../const/Color';
import {AppImage} from '../../../component/AppImage';

export default class ItemCouponInAdvertisement extends Component {
  getTimeFomartDDMMYY = time => {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  render() {
    const {index, item} = this.props;
    return (
      <View
        style={{
          padding: DEVICE_WIDTH * 0.03,
          marginHorizontal: DEVICE_WIDTH * 0.03,
          borderTopWidth: index == 0 ? 0 : 0.5,
          borderColor: COLOR_GRAY,
          flexDirection: 'row',
        }}>
        <AppImage
          url={item.imageUrl}
          resizeMode={'cover'}
          style={{
            width: DEVICE_WIDTH * 0.16,
            height: DEVICE_WIDTH * 0.2,
            // backgroundColor:"red"
          }}
        />
        <View
          style={{
            height: DEVICE_WIDTH * 0.2,
            flex: 1,
            marginLeft: DEVICE_WIDTH * 0.05,
            justifyContent: 'space-between',
          }}>
          <Text
            style={{fontSize: DEVICE_WIDTH*0.028, fontWeight: '700', flex: 1}}
            numberOfLines={2}>
            {item.name}
          </Text>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}>
              <Text
                style={{
                  fontSize: DEVICE_WIDTH*0.03,
                  fontWeight: '700',
                  flex: 1,
                  color: '#63689F',
                }}
                numberOfLines={2}>
                お友達ご紹介WA!CAポイント
              </Text>
              <Text
                style={{
                  fontSize: DEVICE_WIDTH*0.03,
                  fontWeight: '700',
                  marginLeft: 5,
                  color: '#63689F',
                }}>
                <Text style={{fontSize: DEVICE_WIDTH*0.04}}> {item.point}</Text> pt
              </Text>
            </View>
            <Text style={{fontSize: DEVICE_WIDTH*0.026, color: COLOR_GRAY, marginTop: 2}}>
              利用期間：{this.getTimeFomartDDMMYY(item.startTime)}〜
              {this.getTimeFomartDDMMYY(item.endTime)}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
