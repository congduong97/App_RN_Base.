import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  APP_COLOR,
  COLOR_GRAY,
  COLOR_GRAY_LIGHT,
  COLOR_BACK,
  COLOR_RED,
} from '../../../const/Color';
import {isIOS} from '../../../const/System';

export class BannerPoint extends PureComponent {
  getTimeFomartDDMMYY = time => {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  render() {
    const data = this.props.dataPoint;
    return (
      <View
        style={[
          styles.wrapperContainer,
          {
            borderBottomWidth: 0,
            paddingTop: 0,
            paddingBottom: 0,
          },
        ]}>
        <View
          style={[styles.wrapperCenter, {marginVertical: 3, marginRight: 74}]}>
          <Text
            style={{
              color: COLOR_BACK,
              fontSize: 16,
              fontWeight: 'normal',
            }}>
            {data && data.name}
          </Text>
        </View>
        {data && data.subtitle ? (
          <View
            style={[
              styles.wrapperCenter,
              {marginVertical: 3, marginRight: 74},
            ]}>
            <Text
              style={{
                color: '#727272',
                fontSize: 12,
                fontWeight: 'normal',
              }}>
              {data && data.subtitle}
            </Text>
          </View>
        ) : null}

        <View style={styles.wrapperCenter}>
          <Text
            style={{
              color: '#515684',
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            獲得WA!CAポイント
          </Text>
          <Text
            style={{
              color: APP_COLOR.COLOR_TEXT,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {data && data.point}
            <Text
              style={{
                color: APP_COLOR.COLOR_TEXT,
                fontSize: 8,
              }}>
              {'pt'}
            </Text>
          </Text>
        </View>
        {data.pointIntroduce ? (
          <View style={[styles.wrapperCenter, {fex: 1}]}>
            <Text
              style={{
                color: '#E69138',
                fontSize: 12,
                fontWeight: 'bold',
                flex: 1,
              }}>
              お友達ご紹介WA!CAポイント
            </Text>
            <Text
              style={{
                color: '#E69138',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {data && data.pointIntroduce}
              <Text
                style={{
                  color: '#E69138',
                  fontSize: 8,
                }}>
                {'pt'}
              </Text>
            </Text>
          </View>
        ) : null}
        <View style={[styles.wrapperCenter]}>
          <Text
            style={{
              color: data.used || data.filter ? COLOR_RED : '#ADADAD',
              fontSize: 10.5,
              fontWeight: 'normal',
            }}>
            利用期間：{this.getTimeFomartDDMMYY(data && data.startTime)}〜
            {this.getTimeFomartDDMMYY(data && data.endTime)}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    width: '100%',
    paddingLeft: 16,
    // paddingRight: 16,

    borderBottomWidth: 1,
    borderBottomColor: COLOR_GRAY_LIGHT,
    justifyContent: 'space-between',
    flexDirection: 'column',
    // paddingVertical:8,
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.5,
      }
    : {
        elevation: 1,
      },
  wrapperCenter: {
    paddingTop: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapperIcon: {
    borderRadius: 17,
    width: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
