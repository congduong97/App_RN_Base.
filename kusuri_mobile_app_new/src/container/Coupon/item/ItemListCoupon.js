import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';

import { DEVICE_WIDTH, DEVICE_HEIGHT } from '../../../const/System';
import { couponService } from '../util/service';
import { AppImage } from '../../../component/AppImage';
import CountDownCoupon from './CountDownCoupon';
import CouponUsed from './CouponUsed';

class ItemListCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelect: !!props.isSelect,
      used: !!props.coupon.used,
      countDown: 0,
      countDownWaiting: false, // coupon COUNTLESS_TIME is done and waiting for next use time
    };
  }

  componentDidMount() {
    const { type, coupon } = this.props;

    const now = new Date();

    const milisecond = now.getTime();

    let { limitTime } = couponService.getConfig();
    if (coupon.countDownStart) {
      let timeStart = new Date(coupon.countDownStart);
      // console.log('itemlist');
      if (coupon.used && coupon.usedTime) {
        timeStart = new Date(coupon.usedTime);
      }

      if (milisecond - timeStart.getTime() > limitTime * 60000) {
        if (coupon.usagePolicy !== 'COUNTLESS_TIME') {
          this.setState({ used: true });
        }
      } else {
        this.setState({
          countDown: limitTime * 60000 - milisecond + timeStart.getTime(),
        });
      }
    }

    if (type !== 'select') {
      couponService.regisCouponUse(coupon.id, () => {
        this.setState({
          countDown: parseInt(couponService.getConfig().limitTime) * 60000,
        });
      });
      couponService.regisCouponChange(coupon.id, () => {
        let listCoupon = couponService.getListCoupon();
        let checkExist = listCoupon.findIndex((item) => item.id === coupon.id);

        if (checkExist >= 0) {
          this.setState({ isSelect: true });
        } else {
          this.setState({ isSelect: false });
        }
      });
    } else {
      this.setState({ isSelect: !this.state.isSelect });
    }
  }

  toggleSelect = () => {
    const { coupon } = this.props;
    const { countDown } = this.state;
    if (countDown === 0 || coupon.usagePolicy === 'COUNTLESS_TIME') {
      const { screen } = this.props;
      if (screen === 'CouponSelected') {
        couponService.removeCoupon(this.props.coupon, 'select');
        return;
      }
      const { isSelect } = this.state;

      if (isSelect) {
        couponService.removeCoupon(this.props.coupon);
      } else {
        couponService.addCoupon(this.props.coupon);
      }
    }
  };
  /**
   * when countdown is done
   */
  changeToUsed = () => {
    let { coupon, screen, onCountDownDone } = this.props;
    const { countDownWaiting } = this.state;
    if (onCountDownDone && screen === 'CouponSelected') onCountDownDone(coupon);
    if (coupon.usagePolicy === 'COUNTLESS_TIME' && coupon.timeReuse === 0) {
      coupon.countDownStart = null;
      this.setState({ countDown: 0, used: false });
      return;
    }
    //set waiting time for COUNTLESS_TIME coupon
    if (
      coupon.usagePolicy === 'COUNTLESS_TIME' &&
      coupon.timeReuse &&
      !countDownWaiting
    ) {
      coupon.used = true;
      coupon.countDownStart = null;
      this.setState({
        used: true,
        countDown: coupon.timeReuse * 60000,
        countDownWaiting: true,
      });
      return;
    }
    //when out of waiting time
    if (
      coupon.usagePolicy === 'COUNTLESS_TIME' &&
      coupon.timeReuse &&
      countDownWaiting
    ) {
      coupon.countDownStart = null;
      coupon.usedTime = null;
      coupon.used = false;
      this.setState({
        used: false,
        countDown: 0,
        countDownWaiting: false,
      });
      return;
    }
    coupon.used = true;
    this.setState({ used: true, countDown: 0, countDownWaiting: false });
  };
  convertTime = (time) => {
    const date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (year < 10) {
      year = '0' + year;
    }

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return `${year}/${month}/${day}`;
  };
  moveToDetail = () => {
    let { coupon, screen, onUseCoupon } = this.props;
    const { used } = this.state;
    if (screen === 'CouponSelected') return;

    if (coupon.usagePolicy === 'COUNTLESS_TIME') {
      this.props.navigation.navigate('DetailCoupon', {
        coupon,
      });
    }
    if (used) {
      if (coupon.usagePolicy === 'ONCE_TIME') return;
      if (coupon.usagePolicy === 'ONCE_TIME_PER_DAY') return;
    }

    let { limitTime } = couponService.getConfig();
    const now = new Date();

    if (coupon.countDownStart) {
      const timeStart = new Date(coupon.countDownStart);

      let timeOut = now.getTime() - timeStart.getTime();
      if (timeOut < limitTime * 60000) {
        this.props.navigation.navigate('DetailCoupon', {
          coupon,
          onUseCoupon,
        });
      }
    } else {
      this.props.navigation.navigate('DetailCoupon', {
        coupon,
        onUseCoupon,
      });
    }
  };

  renderHeader = () => {
    const { typeHeader, numberUserCanUse } = this.props.coupon;

    switch (typeHeader) {
      case 'special':
        return (
          <View style={styles.headerItem}>
            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
              プレミアムクーポン
            </Text>
          </View>
        );

      case 'limit':
        return null;
      case 'normal':
        return null;
      default:
        return null;
    }
  };
  renderBarcode = () => {
    const { screen, coupon, initialShowBarcode } = this.props;
    const { countDown, used } = this.state;

    if (
      initialShowBarcode &&
      coupon.usagePolicy === 'COUNTLESS_TIME' &&
      coupon.barCodeUrl
    ) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <AppImage
            source={{ uri: coupon.barCodeUrl }}
            style={{ width: DEVICE_WIDTH * 0.9, height: DEVICE_WIDTH * 0.3 }}
          />
          <Text style={{ fontWeight: 'bold' }}>{coupon.janCode}</Text>
        </View>
      );
    }
    if (
      initialShowBarcode &&
      screen === 'CouponSelected' &&
      countDown &&
      coupon.barCodeUrl &&
      !used
    ) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          <AppImage
            source={{ uri: coupon.barCodeUrl }}
            style={{ width: DEVICE_WIDTH * 0.9, height: DEVICE_WIDTH * 0.3 }}
          />
          <Text style={{ fontWeight: 'bold' }}>{coupon.janCode}</Text>
        </View>
      );
    }
    return null;
  };
  renderSelectButton = () => {
    const { countDown, isSelect } = this.state;
    let { coupon, screen } = this.props;

    if (countDown && coupon.usagePolicy !== 'COUNTLESS_TIME') return null;
    if (screen === 'CouponSelected') {
      return null;
    }
    return (
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'red',
          paddingVertical: 5,
          paddingHorizontal: 30,
          marginTop: 8,
          minWidth: DEVICE_WIDTH * 0.5,
          backgroundColor: isSelect ? 'red' : undefined,
        }}
        onPress={this.toggleSelect}
      >
        <Text
          style={{
            color: isSelect ? 'white' : 'red',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {isSelect ? 'クーポン選択中' : 'クーポンを選択する'}
        </Text>
      </TouchableOpacity>
    );
  };
  renderUsagePolicy = () => {
    const { coupon } = this.props;
    let title = '';
    if (coupon.usagePolicy === 'ONCE_TIME_PER_DAY') {
      title = '一日一回';
    } else if (coupon.usagePolicy === 'ONCE_TIME') {
      title = '一回のみ';
    } else {
      title = '期間中何回でも';
    }
    if (title) {
      return (
        <View
          style={{
            // width: DEVICE_WIDTH,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
            利用回数：{title}
          </Text>
        </View>
      );
    }
    return null;
  };
  renderCountDown = () => {
    const { countDown } = this.state;
    const { coupon } = this.props;
    if (!countDown) return null;
    if (coupon && coupon.usagePolicy === 'COUNTLESS_TIME') return null;
    return (
      <View style={styles.countDown}>
        <Text style={{ color: 'red', fontWeight: 'bold' }}>利用中</Text>
        <CountDownCoupon
          key={`${countDown}`}
          from="itemList"
          onComplete={this.changeToUsed}
          time={countDown}
        />
      </View>
    );
  };
  render() {
    const { used, countDown } = this.state;
    const { coupon } = this.props;
    const { name, point, startTime, endTime, imageUrl, limitQuantity } = coupon;
    //padding when countdown is showing
    let paddingBottom = 24;
    if (!countDown) paddingBottom = undefined;
    if (coupon && coupon.usagePolicy === 'COUNTLESS_TIME')
      paddingBottom = undefined;

    return (
      <TouchableWithoutFeedback onPress={this.moveToDetail}>
        <View style={[styles.wrapItemCoupon, { paddingBottom }]}>
          {this.renderHeader()}
          <View style={styles.contentItem}>
            <View style={styles.contentLeft}>
              <AppImage
                source={{ uri: imageUrl }}
                style={{ width: '100%', aspectRatio: 0.83 }}
              />
              {this.renderCountDown()}
            </View>
            <View style={styles.contentRight}>
              <Text style={{ fontWeight: 'bold' }}>{name}</Text>
              <View
                style={{
                  backgroundColor: '#FCEFEF',
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}
              >
                <Text
                  style={{ color: 'red', fontWeight: 'bold', fontSize: 15 }}
                >
                  獲得Aocaポイント
                </Text>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>
                  <Text style={{ fontSize: 20 }}>{point}</Text>pt
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>
                  利用期間：
                  {`${this.convertTime(startTime)}`}〜
                  {`${this.convertTime(endTime)}`}
                </Text>
                {this.renderUsagePolicy()}

                {!!limitQuantity && (
                  <Text
                    style={{ fontWeight: 'bold', fontSize: 12, marginTop: 8 }}
                  >
                    限定数量：{limitQuantity}個まで
                  </Text>
                )}
                {this.renderSelectButton()}
              </View>
            </View>
          </View>
          {this.renderBarcode()}
          {!!used && <CouponUsed />}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(ItemListCoupon);

const styles = StyleSheet.create({
  wrapItemCoupon: {
    margin: 5,
    // borderColor: "rgb(252,13,27)",
    alignItems: 'center',
    borderColor: '#F4CCCC',
    borderWidth: 1,
    padding: 5,
  },
  headerItem: {
    backgroundColor: '#F4CCCC',
    width: DEVICE_WIDTH - 20,
    // backgroundColor: "rgb(252,13,27)",
    padding: 5,
  },
  contentItem: {
    width: DEVICE_WIDTH - 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    justifyContent: 'space-between',
  },
  contentLeft: {
    width: '32%',
  },
  contentRight: {
    width: '63%',
  },
  countDown: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'red',
  },
});
