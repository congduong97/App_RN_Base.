import React, {PureComponent} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {AppImage} from '../../../component/AppImage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {
  COLOR_BROWN,
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BLACK,
  COLOR_RED,
  COLOR_BACK,
  APP_COLOR,
  COLOR_GRAY_LIGHT,
} from '../../../const/Color';
import {STRING} from '../../../const/String';
import {DEVICE_WIDTH, isIOS} from '../../../const/System';
import {ButtonLogin} from '../../LoginScreen/Item/ButtonLogin';
import WebViewComponent from '../../../component/WebViewComponent';
import {CouponSelectService} from '../util/services/CouponSelectService';
import {API} from '../util/api';
import NetInfo from '@react-native-community/netinfo';
export default class ItemDetailCoupon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listCouponSelected: CouponSelectService.getList(),
      isModalVisible: false,
      dataNotUerCoupon: [],
    };
  }
  componentDidMount() {
    CouponSelectService.onChange('DATA_USE_COUPON_SELECT', (data, dataList) => {
      this.setState({
        listCouponSelected: [...dataList],
      });
    });
  }
  componentWillUnmount() {
    CouponSelectService.unChange('DATA_USE_COUPON_SELECT');
  }
  getTimeFomartDDMMYY = time => {
    if (!time) {
      return '';
    }
    const date = new Date(time);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  gotoHomeCoupon = async () => {
    await this.apiUseCoupon();
  };

  gotoListCoupon = () => {
    const dataDetail = this.props.dataDetail;
    const {dataNotUerCoupon} = this.state;
    let newData = {...dataDetail};
    newData.useCoupon = true;
    CouponSelectService.setCouponUse(dataNotUerCoupon);
    CouponSelectService.set({newData, usedInScreen: 'ItemDetailCoupon'});
    this.setState({
      isModalVisible: false,
    });
    const {navigation} = this.props;
    navigation.goBack();
  };
  closeOptions = () => {
    const dataDetail = this.props.dataDetail;
    const {dataNotUerCoupon} = this.state;
    let newData = {...dataDetail};
    newData.useCoupon = true;
    CouponSelectService.setCouponUse(dataNotUerCoupon);
    CouponSelectService.set({newData, usedInScreen: 'ItemDetailCoupon'});
    this.setState({
      isModalVisible: false,
    });
  };

  renderModalUseCoupon = () => {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        useNativeDriver={true}
        onBackdropPress={this.closeOptions}
        duration={0}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropOpacity={0.8}
        swipeToClose={false}
        hideModalContentWhileAnimating={true}
        style={styles.modalStyle}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}
            onPress={this.closeOptions}>
            <AntDesign
              name="close"
              size={25}
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                right: 5,
                top: 5,
              }}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: COLOR_RED,
                marginTop: 16,
                fontWeight: 'bold',
                marginBottom: 16,
                paddingLeft: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              クーポン内容に変更がありました。
              再度、クーポン一覧からご選択お願いいたします
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 25,
            }}>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                paddingVertical: 8,
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
                backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              }}
              onPress={this.gotoListCoupon}>
              <Text style={{color: COLOR_WHITE}}>クーポン一覧へ戻る</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  apiUseCoupon = async () => {
    const dataDetail = this.props.dataDetail;
    const {navigation} = this.props;
    const response = await API.useListCoupon(dataDetail.id, false);
    if (response.code === 200 && response.res.status.code === 1000) {
      let newData = {...dataDetail};
      newData.useCoupon = true;
      CouponSelectService.setCouponUse([{...newData}]);
      CouponSelectService.set({newData, usedInScreen: 'ItemDetailCoupon'});
      navigation.goBack();
    } else if (response.res.status.code === 1039) {
      let newArr = response.res.data.map(function(val, index) {
        return {key: index, id: val, used: true};
      });
      this.setState({
        isModalVisible: true,
        dataNotUerCoupon: newArr,
      });
    }
  };

  gotoUseCoupon = () => {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        Alert.alert(
          STRING.are_you_sure_you_want_to_use_coupon,
          '',
          [
            {
              text: STRING.cancel,
              onPress: () => {},
              style: 'cancel',
            },
            {text: STRING.ok, onPress: this.gotoHomeCoupon},
          ],
          {cancelable: false},
        );
        return;
      }
      if (!isConnected) {
        Alert.alert(
          'ネットワークエラー',
          'インターネット接続を確認してください。',
        );
        return;
      }
    });
  };

  render() {
    const dataDetail = this.props.dataDetail;
    const {dataTextDeception} = this.props;
    console.log('dataTextDeception', dataTextDeception);
    const {isModalVisible} = this.state;
    return (
      <View
        style={{
          backgroundColor: COLOR_WHITE,
          flex: 1,
        }}>
        <ScrollView>
          <View style={styles.wrapperImageFeature}>
            <AppImage
              usingImageReactNative={!isIOS}
              useZoom
              notDomain
              style={styles.imageFeature}
              url={
                'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/' +
                dataDetail.imageUrl
              }
              resizeMode={'contain'}
            />
          </View>
          <View
            style={[
              styles.wrapperContainer,
              {
                borderBottomWidth: 0,
                paddingTop: 0,
                paddingBottom: 8,
              },
            ]}>
            {dataDetail.name ? (
              <View style={[styles.wrapperCenter1, {marginVertical: 8}]}>
                <Text
                  style={{
                    color: COLOR_BACK,
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {dataDetail.name}
                </Text>
              </View>
            ) : null}
            {dataDetail.subtitle ? (
              <View style={[styles.wrapperCenter1, {marginRight: 74}]}>
                <Text
                  style={{
                    color: COLOR_GRAY,
                    fontSize: 16,
                    paddingBottom: 6,
                  }}>
                  {dataDetail.subtitle}
                </Text>
              </View>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#CFE2F3',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  color: '#004FFF',
                  fontSize: 16,
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  paddingLeft: 5,
                  paddingVertical: 5,
                }}>
                獲得WA!CAポイント
              </Text>
              <Text
                style={{
                  color: '#004FFF',
                  fontSize: 22,
                  fontWeight: 'bold',
                  right: 3,
                  paddingVertical: 5,
                }}>
                {dataDetail.point}
                <Text
                  style={{
                    color: '#004FFF',
                    fontSize: 9,
                  }}>
                  {'pt'}
                </Text>
              </Text>
            </View>
            <View style={styles.wrapperCenter1}>
              <Text
                style={{
                  color: COLOR_GRAY,
                  fontSize: 14,
                  paddingTop: 5,
                  textDecorationLine: 'underline',
                }}>
                {dataDetail.numberMemberUse === undefined ||
                dataDetail.numberMemberUse === 0 ||
                dataDetail.limitNumbnumberMemberUseerUse === null
                  ? 0
                  : dataDetail.numberMemberUse}
                人がクーポンに交換しています。
              </Text>
            </View>
            {!dataDetail.description ? null : (
              <View style={styles.wrapperCenter1}>
                <Text style={{color: COLOR_GRAY, fontSize: 14, paddingTop: 5}}>
                  {dataDetail.description}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              borderWidth: 1,
              width: '96%',
              marginHorizontal: 8,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#cecece',
            }}>
            {dataTextDeception.dataTextSetting ? (
              <View
                style={{
                  width: '100%',
                  backgroundColor: COLOR_WHITE,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  padding: 16,
                }}>
                <WebViewComponent html={dataTextDeception.dataTextSetting} />
              </View>
            ) : null}
          </View>
        </ScrollView>
        {dataDetail.used || dataDetail.filter === 'used' ? null : (
          <View
            style={{
              padding: 7,
              backgroundColor: COLOR_WHITE,
              borderTopColor: COLOR_GRAY_LIGHT,
              borderTopWidth: 1,
            }}>
            <ButtonLogin
              name={'クーポンを獲得する'}
              onPress={this.gotoUseCoupon}
            />
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  color: COLOR_RED,
                  fontSize: 11,
                  margin: 4,
                  paddingTop: 5,
                }}>
                クーポン利用期間：
                {this.getTimeFomartDDMMYY(dataDetail.startTime)}〜
                {this.getTimeFomartDDMMYY(dataDetail.endTime)}
              </Text>
            </View>
          </View>
        )}
        {isModalVisible ? this.renderModalUseCoupon() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  image: {
    height: 120,
    width: '100%',
  },
  // wrapperContainer: {
  //   backgroundColor: COLOR_WHITE,
  //   flex: 1,
  // },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapperImageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
  textTitle: {
    fontFamily: 'SegoeUI',
    color: COLOR_BROWN,
    fontSize: 16,
    fontWeight: 'bold',
  },

  textDescription: {
    fontFamily: 'SegoeUI',
    color: COLOR_GRAY,
    fontSize: 13,
  },

  textTitleDetail: {
    color: COLOR_BLACK,
    fontSize: 15,
    fontFamily: 'SegoeUI',
  },
  textTimeUse: {
    color: COLOR_RED,
    fontSize: 11,
    margin: 4,
  },
  wrapperContainer: {
    width: '100%',
    paddingLeft: 16,
    paddingRight: 16,

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
  wrapperCenter1: {
    // flex: 1,
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
  container: {
    width: '92%',
    borderWidth: 1,
    borderColor: '#A3A4A5',
    height: 45,
    borderRadius: 4,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStyle: {
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: DEVICE_WIDTH - 100,
    borderRadius: 4,
    height: DEVICE_WIDTH / 2,
  },
});
