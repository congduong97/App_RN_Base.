import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, AppState } from 'react-native';

import { DEVICE_WIDTH } from '../../../const/System';
import { AppImage } from '../../../component/AppImage';
import CountDownCouponUse from './CountDownCouponUse';
import { couponService } from '../util/service';

export default class ItemCouponDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthImage: 1,
      heightImage: 1,
      appState: 'active',
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    const { type, coupon } = this.props;

    if (coupon.imageUrl) {
      Image.getSize(coupon.imageUrl, (widthImage, heightImage) =>
        this.setState({
          widthImage,
          heightImage,
        })
      );
    }
  }
  handleAppStateChange = (nextAppState) => {
    let { limitTime } = couponService.getConfig();
    const { coupon } = this.props;
    const { countDownStart } = coupon;
    if (this.state.appState === 'background' && countDownStart) {
      let now = new Date();
      let timeStart = new Date(this.props.coupon.countDownStart);
      if (now.getTime() - timeStart.getTime() > limitTime * 60000) {
        this.countDownTimeout = setTimeout(() => {
          const { onCountDownDone } = this.props;
          if (onCountDownDone) onCountDownDone(coupon);
        }, 500);
      }
    }
    this.setState({ appState: nextAppState });
  };

  onDoneCountDown = () => {
    const { onCountDownDone, coupon } = this.props;
    if (onCountDownDone) onCountDownDone(coupon);
  };

  componentWillUnmount() {
    if (this.countDownTimeout) {
      clearTimeout(this.countDownTimeout);
    }
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
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
        return;
    }
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
          <Text style={{ fontWeight: 'bold' }}>利用回数：{title}</Text>
        </View>
      );
    }
    return null;
  };
  renderCountDown = () => {
    const { coupon, onCountDownDone } = this.props;
    const { countDownStart, usagePolicy, id } = coupon;
    let { limitTime } = couponService.getConfig();
    if (usagePolicy === 'COUNTLESS_TIME') return null;
    if (!countDownStart) return null;
    return (
      <Text style={{ color: 'red', textAlign: 'right', fontWeight: 'bold' }}>
        利用中：
        <CountDownCouponUse
          onDoneCountDown={onCountDownDone}
          couponStart={countDownStart}
          id={id}
          time={limitTime * 60000}
        />
      </Text>
    );
  };
  renderBarcode = () => {
    const { coupon } = this.props;
    const { countDownStart, barCodeUrl, usagePolicy } = coupon;
    if (
      barCodeUrl &&
      ((usagePolicy === 'COUNTLESS_TIME' && coupon.usedCountlessTime) ||
        countDownStart)
    ) {
      return (
        <View style={{ alignItems: 'center' }}>
          <AppImage
            source={{
              uri: barCodeUrl,
            }}
            style={{
              width: DEVICE_WIDTH * 0.9,
              height: DEVICE_WIDTH * 0.3,
              // marginVertical: 20,
              resizeMode: 'contain',
            }}
          />
          <Text style={{ fontWeight: 'bold' }}>{coupon.janCode}</Text>
        </View>
      );
    }
  };
  render() {
    //get barcode position
    const { coupon, onBarcodeLayout } = this.props;
    const {
      imageUrl,
      name,
      startTime,
      endTime,
      point,
      description,
      limitQuantity,
    } = coupon;

    const { widthImage, heightImage } = this.state;
    return (
      <>
        <View style={styles.wrapImage}>
          <AppImage
            source={{
              uri: imageUrl,
            }}
            style={{
              width: DEVICE_WIDTH * 0.7,
              height: (DEVICE_WIDTH * 0.6 * heightImage) / widthImage,
              resizeMode: 'cover',
            }}
          />
        </View>
        <View style={styles.content}>
          {this.renderHeader()}
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{name}</Text>
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
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 15 }}>
              獲得ポイント
            </Text>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
              <Text style={{ fontSize: 20 }}>{point}</Text>pt
            </Text>
          </View>
          <Text
            style={{
              marginTop: 10,
              textAlign: 'right',
              marginBottom: 5,
              fontWeight: 'bold',
            }}
          >
            利用期間：
            {`${this.convertTime(startTime)}`}〜{`${this.convertTime(endTime)}`}
          </Text>
          {this.renderUsagePolicy()}
          {!!limitQuantity && (
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 12,
                marginTop: 8,
                textAlign: 'right',
                justifyContent: 'flex-end',
              }}
            >
              限定数量：{limitQuantity}個まで
            </Text>
          )}
          {this.renderCountDown()}
          <Text
            style={{
              fontWeight: '400',
              marginHorizontal: 5,
              marginVertical: 16,
              paddingHorizontal: 10,
              fontSize: 16,
            }}
            onLayout={onBarcodeLayout}
          >
            {description}
          </Text>
          {this.renderBarcode()}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapImage: {
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  headerItem: {
    backgroundColor: '#F4CCCC',
    padding: 5,
    marginBottom: 10,
  },
});
