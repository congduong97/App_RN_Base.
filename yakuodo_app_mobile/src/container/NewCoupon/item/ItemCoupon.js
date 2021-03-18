/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import {BannerPoint} from '../item/BannerPoint';
import {AppImage} from '../../../component/AppImage';
import {CouponSelectService} from '../util/services/CouponSelectService';
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
  COLOR_RED,
} from '../../../const/Color';
import {API} from '../util/api';
import {STRING} from '../../../const/String';
export default class ItemCoupon extends Component {
  constructor(props) {
    super(props);
    const {data} = this.props;
    const {id} = data;
    let isSelectCoupon = false;
    const listUserCoupon = CouponSelectService.getList();
    if (listUserCoupon) {
      const indexUseCoupon = listUserCoupon.findIndex(item => {
        return item.id === id;
      });
      if (indexUseCoupon !== -1) {
        isSelectCoupon = true;
      }
    }
    this.state = {
      data: data,
      isSelectCoupon: isSelectCoupon,
    };
  }
  componentDidMount() {
    const {onRef} = this.props;
    onRef && onRef(this);
    const {data, category} = this.props;
    const {id} = data;
    CouponSelectService.onChange(
      `DATASELECT_COUPON_ITEMCOUPON${id}${category.key}`,
      data => {
        this.onChangeData(data);
      },
    );
  }
  componentWillUnmount() {
    const {data, category} = this.props;
    const {id} = data;
    CouponSelectService.unChange(
      `DATASELECT_COUPON_ITEMCOUPON${id}${category.key}`,
    );
  }
  onChangeData = data => {
    if (data.id === this.state.data.id) {
      this.setState({
        isSelectCoupon: data.isSelectCoupon,
      });
    }
  };
  countTime = (time, selected) => {
    const minutes = 1000 * 60;
    const hours = minutes * 60;
    const days = hours * 24;
    const years = days * 365;
    const d = new Date();
    const t = new Date(time).getTime() - d.getTime();
    let y;
    if (selected === 'days') {
      y = Math.round(t / days);
    } else {
      y = Math.round(t / minutes);
    }
    return y;
  };

  onSelectCoupon = () => {
    const {isSelectCoupon} = this.state;
    const {data} = this.state;
    if (!isSelectCoupon) {
      this.setState(
        {
          isSelectCoupon: true,
        },
        () => {
          let newData = {...data};
          newData.isSelectCoupon = this.state.isSelectCoupon;
          CouponSelectService.set(newData);
        },
      );
    } else {
      this.setState(
        {
          isSelectCoupon: false,
        },
        () => {
          let newData = {...data};
          newData.isSelectCoupon = this.state.isSelectCoupon;
          CouponSelectService.set(newData);
        },
      );
    }
  };
  renderCheckBox = () => {
    const {isSelectCoupon, data} = this.state;
    const {filter, used} = data;
    if (filter === 'used') {
      return null;
    }
    if (used) {
      return null;
    }
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
            }}>
            {isSelectCoupon ? STRING.selected : STRING.unSelected}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderTag() {
    const {numberDayUseCoupon, data} = this.props;
    const {endTime} = data;
    let couponExpired = this.countTime(endTime, 'days') <= numberDayUseCoupon;
    if (couponExpired) {
      return (
        <Image
          resizeMode={'contain'}
          style={styles.imageTag}
          source={require('../images/tag.png')}
        />
      );
    }
    return null;
  }
  gotoDetailCoupon = () => {
    const {dataTextSetting} = this.props;
    const {data} = this.state;
    const {navigation} = this.props;
    navigation.navigate('DETAIL_COUPN', {data, dataTextSetting});
  };
  renderTextSpecialCouponAndIntroduceCoupon = () => {
    const {data} = this.state;
    const {specialCoupon, introduceCoupon} = data;
    if (introduceCoupon) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text style={{color: '#0000FF', fontWeight: '500'}}>
            お友達ご紹介クーポン
          </Text>
        </View>
      );
    }
    if (!introduceCoupon && specialCoupon) {
      return (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
          }}>
          <Text style={{color: COLOR_RED, fontWeight: '500'}}>
            あなただけのクーポン
          </Text>
        </View>
      );
    }
    if (!specialCoupon || !introduceCoupon) {
      return null;
    }
  };
  gotoWebViewIntroduceCoupon = async () => {
    try {
      const {data} = this.state;
      const {id, couponCode, kikakuCode} = data;
      const response = await API.referralCoupon(id, couponCode, kikakuCode);
      if (response.res.status.code === 1000) {
        this.props.navigation.navigate('WEB_VIEW', {url: response.res.data});
      } else {
        Alert.alert(
          STRING.please_try_again_later,
          '',
          //FIXME: cái này để làm gì?
          // [
          //   {
          //     text: STRING.cancel,
          //     onPress: () => {},
          //     style: 'cancel',
          //   },
          //   {text: STRING.ok},
          // ],
          {cancelable: false},
        );
      }
    } catch (err) {}
  };
  renderButtonIntro = () => {
    const {data} = this.state;
    const {introduceCoupon, used, filter} = data;
    // if ((introduceCoupon && used) || filter) {
    //   return null;
    // }

    if (introduceCoupon) {
      return (
        <TouchableOpacity
          style={{
            width: '94%',
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: 2,
            borderColor: '#1255CC',
            backgroundColor: '#1255CC',
          }}
          onPress={this.gotoWebViewIntroduceCoupon}>
          <Text style={{color: COLOR_WHITE, fontWeight: '500'}}>
            このクーポンをお友達に紹介する
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  render() {
    const {data} = this.state;
    const {imageUrl, specialCoupon, introduceCoupon} = data;
    const borderWidth = specialCoupon ? 1 : 0;
    const borderColor = specialCoupon ? `${COLOR_RED}70` : COLOR_WHITE;
    return (
      <TouchableOpacity
        style={{
          paddingLeft: 0,
          paddingRight: 0,
          borderWidth,
          marginHorizontal: 16,
          borderColor,
          marginTop: 10,
        }}
        activeOpacity={0.8}
        onPress={this.gotoDetailCoupon}>
        {this.renderTextSpecialCouponAndIntroduceCoupon()}
        <View
          style={[
            styles.container,
            {
              paddingLeft: 8,
              backgroundColor: COLOR_WHITE,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              // borderLeftWidth: 3,
              // borderRightWidth: 3,
              borderColor:
                specialCoupon || introduceCoupon
                  ? COLOR_WHITE
                  : COLOR_GRAY_LIGHT,
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
            <BannerPoint dataPoint={data} />
          </View>
        </View>
        {this.renderCheckBox()}
        {this.renderTag()}
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
          }}>
          {this.renderButtonIntro()}
        </View>
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
    // borderColor: COLOR_GRAY_LIGHT,
    // borderBottomWidth: 1,
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
