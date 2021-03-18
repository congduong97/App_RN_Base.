import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {BannerPoint} from './BannerPoint';
import {AppImage} from '../../../component/AppImage';
import {DEVICE_WIDTH} from '../../../const/System';
import {CouponSelectService} from '../util/services/CouponSelectService';
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from '../../../const/Color';
import {STRING} from '../../../const/String';
export default class ItemCouponSelectUse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSelectCoupon: true,
    };
  }

  onSelectCoupon = () => {
    const {data} = this.props;
    let newData = {...data};
    newData.isSelectCoupon = false;
    CouponSelectService.set(newData);
  };
  renderCheckBox() {
    const {isSelectCoupon} = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={this.onSelectCoupon}>
        <View
          style={{
            borderRadius: 4,
            width: 64,
            backgroundColor: isSelectCoupon
              ? APP_COLOR.COLOR_BORDER_TAB_BAR_ACTIVE
              : COLOR_WHITE,
            borderWidth: 0.5,
            borderColor: APP_COLOR.COLOR_BORDER_TAB_BAR_UN_ACTIVE,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            marginTop: 10,
            paddingVertical: 8,
            marginBottom: 20,
            marginLeft: 20,
          }}>
          <Text
            style={{
              color: isSelectCoupon
                ? APP_COLOR.COLOR_TEXT_TAB_BAR_ACTIVE
                : APP_COLOR.COLOR_TEXT_TAB_BAR_UN_ACTIVE,
              fontSize: 12,
              fontSize: 12,
            }}>
            {isSelectCoupon ? STRING.selected : STRING.unSelected}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {data, dataAllCoupon} = this.props;
    const {imageUrl} = data;
    return (
      <TouchableOpacity
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
        activeOpacity={0.8}>
        <View
          style={[
            styles.container,
            {
              paddingLeft: 8,
              backgroundColor: COLOR_WHITE,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              borderLeftWidth: 3,
              borderRightWidth: 3,
              borderColor: COLOR_GRAY_LIGHT,
              borderBottomWidth: 1,
            },
          ]}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <AppImage
              url={
                'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/' +
                imageUrl
              }
              notDomain
              style={styles.wrapperImage}
              resizeMode={'cover'}
            />
          </View>
          <View style={styles.itemRight}>
            <BannerPoint dataPoint={data} dataAllCoupon={dataAllCoupon} />
          </View>
        </View>
        <View
          style={{
            position: 'absolute',
            width: DEVICE_WIDTH - 32,
            marginLeft: 16,
            marginRight: 16,
            backgroundColor: COLOR_GRAY_LIGHT,
            height: 1,
            bottom: 0,
          }}
        />
        {this.renderCheckBox()}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  imageTag: {
    height: 35,
    width: 35,
    position: 'absolute',
    top: 6,
    left: 16,
  },
  wraperTime: {
    borderColor: COLOR_GRAY_LIGHT,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderBottomWidth: 1,
  },
  wrapperImage: {
    borderRadius: 4,
    height: 88,
    width: 88,
  },
  textTime: {
    fontFamily: 'SegoeUI',
    fontSize: 10,
    color: COLOR_WHITE,
  },

  container: {
    width: '100%',
    // height: 100,
    flexDirection: 'row',
    borderColor: COLOR_GRAY_LIGHT,
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingRight: 8,
  },
  textDescription: {
    fontFamily: 'SegoeUI',
    fontSize: 12,
    marginLeft: 5,
    color: COLOR_GRAY,
  },
  textTitle: {
    fontSize: 14,
  },

  itemRight: {
    // height: 100 - 32,
    flex: 1,
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
