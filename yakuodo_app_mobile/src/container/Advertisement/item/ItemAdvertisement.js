import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {DEVICE_WIDTH, DEVICE_HEIGHT} from '../../../const/System';
import {COLOR_GRAY, COLOR_WHITE} from '../../../const/Color';
import {AppImage} from '../../../component/AppImage';
import NavigationService from '../../../service/NavigationService';
import ItemCouponInAdvertisement from './ItemCouponInAdvertisement';
import CustomWebView from './CustomWebView';
import {Api} from '../../../service';
export default class ItemAdvertisement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedKikaku: this.props.item.receivedKikaku,
      showDetail: false,
      btnLoading: false,
    };
  }
  showDetail = async () => {
    const {item, setError, isVisibleModal} = this.props;
    // console.log('this.state.showDetail', this.state.showDetail);
    if (!this.state.showDetail) {
      try {
        const response = await Api.getDetailAdvertisement(item.id);
        console.log('getDetailAdvertisement', response);
      } catch (error) {}
    }
    this.setState({
      showDetail: !this.state.showDetail,
    });
  };
  receiverCoupon = async () => {
    const {item, setError, isVisibleModal} = this.props;
    try {
      this.setState({
        btnLoading: true,
      });

      const response = await Api.beaconApplyCoupon(item.id);
      console.log(response, 'beaconApplyCoupon');
      if (response.code === 200 && response.res.status.code === 1000) {
        // isVisibleModal(true);
        Alert.alert('クーポンを受け取りました');
        this.setState({
          receivedKikaku: true,
        });
      } else if (response.code === 200 && response.res.status.code === 1054) {
        Alert.alert('このクーポンは取得済みです。');
        this.setState({
          receivedKikaku: true,
        });
      } else {
        setError();
      }
    } catch (error) {
      setError();
    } finally {
      this.setState({btnLoading: false});
    }
  };

  renderDetail = () => {
    const {item, index} = this.props;
    // console.log("imageUrl",item.imageUrl)
    return (
      <View style={{marginHorizontal: 15, marginTop: 15}}>
        {!!item.imageUrl && (
          <AppImage
            url={item.imageUrl}
            resizeMode={'cover'}
            style={{
              width: '100%',
              height: DEVICE_WIDTH * 0.52,
              borderRadius: 8,
              marginBottom:20
            }}
          />
        )}

        {!!item.detailText && <CustomWebView html={item.detailText} />}
      </View>
    );
  };
  render() {
    const {item, index, isDetail} = this.props;
    const {receivedKikaku, showDetail, btnLoading} = this.state;
    // const arrCoupon = new Array(2).fill(2);
    return (
      <View style={{marginHorizontal: isDetail ? 15 : 0, marginTop: 15}}>
        <View style={{backgroundColor: '#EDF7FF', paddingHorizontal: 15}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              lineHeight: 15,
              paddingVertical: 10,
            }}>
            {item.summaryText}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: receivedKikaku ? COLOR_GRAY : '#3E4489',
              paddingVertical: 5,
              alignSelf: 'center',
              borderRadius: 6,
              marginBottom: 15,
              width: DEVICE_WIDTH * 0.6,
              alignItems: 'center',
            }}
            disabled={receivedKikaku || btnLoading}
            onPress={this.receiverCoupon}>
            <Text
              style={{
                color: COLOR_WHITE,
              }}>
              {receivedKikaku
                ? 'このクーポンを取得しました。'
                : 'クーポンを取得'}
            </Text>
          </TouchableOpacity>
        </View>
        {(!!item.detailText || !!item.imageUrl) && isDetail && (
          <TouchableOpacity
            style={{
              paddingVertical: 5,
              backgroundColor: '#B5DEFF',
              alignItems: 'center',
            }}
            onPress={this.showDetail}>
            <Text
              style={{
                fontSize: 14,
                color: '#3E4489',
                fontWeight: '700',
              }}>
              {showDetail ? '詳細を閉じる' : '詳細はこちら'}
            </Text>
          </TouchableOpacity>
        )}
        {showDetail && this.renderDetail()}
        {item.listCoupon.length > 0 &&
          item.listCoupon.map((ItemCoupon, indexCoupon) => {
            return (
              <ItemCouponInAdvertisement
                index={indexCoupon}
                item={ItemCoupon}
                key={`${indexCoupon}`}
              />
            );
          })}
      </View>
    );
  }
}
