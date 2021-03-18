import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Alert} from 'react-native';
import Modal from 'react-native-modal';
import {
  COLOR_WHITE,
  COLOR_BLACK,
  COLOR_GRAY,
  APP_COLOR,
} from '../../const/Color';
import {
  DEVICE_WIDTH,
  managerAcount,
  stateSercurity,
  APP_ID,
} from '../../const/System';
import NavigationService from '../../service/NavigationService';
import Icon from 'react-native-vector-icons/Ionicons';
import {ButtonLogin} from '../LoginScreen/Item/ButtonLogin';
import ShowModalQrCoupon from '../../service/ShowModalQrCoupon';
import {Api} from '../../service';
import {getParams} from '../../util';
import {Loading} from '../../commons';
import {linkDeeplink, useDeepLink} from './SetUpDeepLink';
import {STRING} from '../../const/String';
import {checkBlackList} from '../Account/util/checkBlackList';
import {API_URL} from '../../const/Url';

export class ModalQrCoupon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: !!linkDeeplink.linkOpenQrCoupon && !!managerAcount.userId,
      status: false,
      loading: false,
      data: {},
      detailId: '',
    };
  }

  componentDidMount() {
    ShowModalQrCoupon.onChange('ShowModalQrCoupon', modal => {
      // console.log('modalmodal', modal);
      if (
        (modal &&
          modal.isModalVisible &&
          managerAcount.userId &&
          managerAcount.validateOtp) ||
        (managerAcount.userId && !stateSercurity.onSecurity)
      ) {
        const {navigation} = this.props;
        navigation.navigate('HOME');
        this.checkBlackListMember(modal);
      }
    });

    if (
      linkDeeplink.linkSave &&
      ((managerAcount.userId && managerAcount.validateOtp) ||
        (managerAcount.userId && !stateSercurity.onSecurity))
    ) {
      if (this.timeOutModalDidMount) {
        clearTimeout(this.timeOutModalDidMount);
      }
      this.timeOutModalDidMount = setTimeout(() => {
        useDeepLink(linkDeeplink.linkSave);
        linkDeeplink.linkSave = null;
      }, 500);
    } else {
      if (
        linkDeeplink.linkSave &&
        managerAcount.userId &&
        !managerAcount.validateOtp &&
        !linkDeeplink.linkSave.includes(
          `${API_URL.URL_DOMAIN}/api/v1/app/${APP_ID}/checkNewQPON?`,
        )
      ) {
        if (this.timeOutModalDidMount) {
          clearTimeout(this.timeOutModalDidMount);
        }
        this.timeOutModalDidMount = setTimeout(() => {
          useDeepLink(linkDeeplink.linkSave);
          linkDeeplink.linkSave = null;
        }, 500);
      }
    }
  }
  checkBlackListMember = async modal => {
    try {
      this.setState({isModalVisible: true, loading: true});
      const blackList = await checkBlackList();
      // console.log('blackList', blackList);
      if (blackList) {
        this.setState({isModalVisible: false, loading: false});
        return;
      }
      this.callApiUseQrCoupon(modal.link);
    } catch (error) {
      this.setState({isModalVisible: false, loading: false});

      if (this.timeOutErrorModal) {
        clearTimeout(this.timeOutErrorModal);
      }
      this.timeOutErrorModal = setTimeout(() => {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      }, 500);
    }
  };
  componentWillUnmount() {
    ShowModalQrCoupon.unChange('ShowModalQrCoupon');
  }
  callApiUseQrCoupon = async link => {
    try {
      linkDeeplink.linkOpenQrCoupon = false;
      const response = await Api.checkQrCpon(link);
      // console.log('responseresponse Qpon', response);
      if (response.status === 200) {
        const responseUse = await response.json();
        // console.log('responseUse', responseUse);
        if (responseUse.status.code === 1000) {
          // console.log('vao day khong em oi');
          this.state.status = true;
          this.state.detailId = responseUse.data.id;
          // console.log('this.state.data', this.state.detailId);
        } else if (responseUse.status.code === 4) {
          this.state.status = false;
        }
      } else {
        this.state.isModalVisible = false;
      }
    } catch (error) {
      this.state.status = false;
      this.state.isModalVisible = false;
    } finally {
      this.setState({loading: false});
      if (!this.state.isModalVisible) {
        if (this.timeOutErrorModal) {
          clearTimeout(this.timeOutErrorModal);
        }
        this.timeOutErrorModal = setTimeout(() => {
          Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        }, 500);
      }
    }
  };
  pushCountListCouponUsing = async list => {
    try {
      await Api.pushCountUsingCoupon(list, 2);
    } catch (e) {}
  };
  goMyCoupon = () => {
    const {detailId} = this.state;
    let qrCode = true;
    this._toggleModal();
    NavigationService.navigate('COUPON', {detailId, qrCode});
    // this.props.navigation.navigate('COUPON', {indexTabBottom: 4});
  };

  _toggleModal = () => {
    this.setState({isModalVisible: false});
  };

  render() {
    const {status, loading} = this.state;
    return (
      <View style={{flex: 1}}>
        <Modal isVisible={this.state.isModalVisible} animationInTiming={100}>
          {loading ? (
            <View
              style={{
                width: '100%',
                height: DEVICE_WIDTH,
                backgroundColor: COLOR_WHITE,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                paddingLeft: 0,
              }}>
              <Loading />
            </View>
          ) : (
            <View
              style={{
                width: '100%',
                height: DEVICE_WIDTH,
                backgroundColor: COLOR_WHITE,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: COLOR_BLACK,
                  fontWeight: 'bold',
                  marginBottom: 16,
                }}>
                {status
                  ? 'クーポンを獲得しました'
                  : 'クーポンを獲得できませんでした。'}
              </Text>
              <Text style={{fontSize: 14, color: COLOR_GRAY, marginBottom: 16}}>
                {status
                  ? 'クーポン一覧の獲得済みクーポンからご確認できます。対象商品の購入でWA!CAポイントが翌日以降に付与されます。'
                  : 'すでに獲得済みか、期間外クーポンのためクーポンを獲得できませんでした。'}
              </Text>
              <TouchableOpacity
                style={{position: 'absolute', padding: 15, right: 0, top: 0}}
                onPress={this._toggleModal}>
                <Icon name={'md-close'} size={25} />
              </TouchableOpacity>
              {status ? (
                <ButtonLogin
                  style={{marginBottom: 16}}
                  name={'獲得済みクーポン一覧へ'}
                  onPress={this.goMyCoupon}
                />
              ) : null}
              <ButtonLogin
                style={{
                  backgroundColor: COLOR_WHITE,
                  borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
                  borderWidth: 1,
                }}
                styleText={{color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1}}
                name={'閉じる'}
                onPress={this._toggleModal}
              />
            </View>
          )}
        </Modal>
      </View>
    );
  }
}
