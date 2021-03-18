import React, {PureComponent} from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import ItemCouponSelectUse from '../item/ItemCouponSelectUse';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import {
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_RED,
  APP_COLOR,
} from '../../../const/Color';
import {STRING} from '../../../const/String';
import {ButtonLogin} from '../../LoginScreen/Item/ButtonLogin';
import {tab, DEVICE_WIDTH} from '../../../const/System';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {API} from '../util/api';
import {CouponSelectService} from '../util/services/CouponSelectService';
import NetInfo from '@react-native-community/netinfo';
export default class ListCouponSelectUse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listCouponSelected: CouponSelectService.getList(),
      couponId: [],
      isModalVisible: false,
      dataNotUerCoupon: [],
    };
  }

  componentDidMount() {
    CouponSelectService.onChange('DATA_DELETE', (data, lisData) => {
      this.setState(
        {
          listCouponSelected: [...lisData],
        },
        () => this.setCoupon(lisData),
      );
    });
  }
  setCoupon = lisData => {
    const {navigation} = this.props;
    if (lisData.length === 0) {
      navigation.goBack();
      return;
    }
  };
  componentWillUnmount() {
    CouponSelectService.unChange('DATA_DELETE');
  }

  renderItem = ({item, index}) => {
    return (
      <ItemCouponSelectUse
        data={item}
        deleteItemCoupon={this.unChangeCouponSelect}
      />
    );
  };
  renderContainer = () => {
    const {listCouponSelected} = this.state;
    return (
      <FlatList
        data={listCouponSelected}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => `${item.id}`}
      />
    );
  };
  closeOptions = () => {
    const {listCouponSelected, dataNotUerCoupon} = this.state;
    let newData = {...listCouponSelected};
    newData.useCoupon = true;
    CouponSelectService.setCouponUse(dataNotUerCoupon);
    CouponSelectService.set(newData);
    this.setState({
      isModalVisible: false,
    });
  };
  gotoListCoupon = () => {
    const {listCouponSelected, dataNotUerCoupon} = this.state;
    let newData = {...listCouponSelected};
    newData.useCoupon = true;
    CouponSelectService.setCouponUse(dataNotUerCoupon);
    CouponSelectService.set(newData);
    this.setState({
      isModalVisible: false,
    });
    const {navigation} = this.props;
    navigation.goBack();
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
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 8,
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

  gotoHomeCoupon = async () => {
    await this.apiUseCoupon();
  };

  apiUseCoupon = async () => {
    const {listCouponSelected} = this.state;
    const {navigation} = this.props;
    let couponId = [];
    for (let i = 0; i < listCouponSelected.length; i++) {
      couponId.push(listCouponSelected[i].id);
    }
    const response = await API.useListCoupon(couponId, true);
    if (response.code === 200 && response.res.status.code === 1000) {
      let newData = {...listCouponSelected};
      newData.useCoupon = true;
      CouponSelectService.setCouponUse(listCouponSelected);
      navigation.goBack();
      CouponSelectService.set(newData);
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

  onUseCoupon = () => {
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
    const {goBack} = this.props.navigation;
    const {navigation} = this.props;
    const {iconUrlCouPonScreen, nameCouPonScreen} = tab.screenTab;
    const {isModalVisible} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <HeaderIconLeft
          navigation={navigation}
          title={nameCouPonScreen}
          goBack={goBack}
          imageUrl={iconUrlCouPonScreen}
        />
        {this.renderContainer()}
        <View
          style={{
            padding: 7,
            backgroundColor: COLOR_WHITE,
            borderTopColor: COLOR_GRAY_LIGHT,
            borderTopWidth: 1,
          }}>
          <ButtonLogin onPress={this.onUseCoupon} name={STRING.used_coupon} />
        </View>
        {isModalVisible ? this.renderModalUseCoupon() : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
