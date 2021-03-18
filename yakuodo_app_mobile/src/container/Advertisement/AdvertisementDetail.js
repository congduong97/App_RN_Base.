import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLOR_WHITE, COLOR_BLUE_LIGHT, COLOR_GRAY} from '../../const/Color';
import {HeaderIconLeft, NoData, Loading, NetworkError} from '../../commons';
import {AppImage} from '../../component/AppImage';
import {DEVICE_WIDTH, DEVICE_HEIGHT} from '../../const/System';
import CustomWebView from './item/CustomWebView';
import {Api} from '../../service';
import Modal from 'react-native-modal';
export default class AdvertisementDetail extends Component {
  constructor(props) {
    super(props);
    const {item} = this.props.navigation.state.params;
    console.log('item', item);
    this.state = {
      isLoading: true,
      data: item,
      error: false,
      networkError: false,
      btnLoading: false,
      isModal: false,
    };
  }
  componentDidMount() {
    this.onDidMount();
  }
  onDidMount = async () => {
    const {
      item,
      advertisingPageId,
      beaconTerminalId,
    } = this.props.navigation.state.params;
    console.log('advertisingPageId', advertisingPageId);
    console.log('beaconTerminalId', beaconTerminalId);
    try {
      this.setState({
        isLoading: true,
      });
      const response = await Api.getDetailAdvertisement(
        advertisingPageId,
        beaconTerminalId,
        item.id,
      );
      console.log(response, 'response');
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.data = response.res.data;
        this.state.networkError = false;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (error) {
      this.state.error = true;
    } finally {
      this.setState({isLoading: false});
    }
  };
  beaconCoupon = async () => {
    const {
      advertisingPageId,
      beaconTerminalId,
    } = this.props.navigation.state.params;

    try {
      this.setState({
        btnLoading: true,
      });

      const response = await Api.beaconApplyCoupon(
        advertisingPageId,
        beaconTerminalId,
        this.state.data.id,
      );
      console.log(response, 'beaconApplyCoupon');
      if (response.code === 200 && response.res.status.code === 1000) {
        // alert('クーポンをもらいました');
        this.isVisibleModal(true);
        this.setState({
          data: {
            ...this.state.data,
            receivedKikaku: true,
          },
        });
      } else {
        this.state.error = true;
      }
    } catch (error) {
      this.state.error = true;
    } finally {
      this.setState({btnLoading: false});
    }
  };
  isVisibleModal = isVisible => {
    this.setState({
      isModal: isVisible,
    });
  };
  renderModal() {
    return (
      <Modal
        isVisible={this.state.isModal}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: DEVICE_WIDTH * 0.7,
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 5,
          }}>
          <Text style={{fontSize: 18, marginVertical: 20,textAlign: 'center',}}>
            クーポンを受け取りました
          </Text>
          <TouchableOpacity
            style={{
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              width: '100%',
              alignItems: 'center',
            }}
            onPress={() => {
              this.isVisibleModal(false);
            }}>
            <Text style={{fontSize: 18, marginVertical: 10}}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  render() {
    const {goBack} = this.props.navigation;
    return (
      <View style={styles.containerStyle}>
        <HeaderIconLeft title={''} goBack={goBack} />
        {this.renderContent()}
        {this.renderModal()}
      </View>
    );
  }
  renderContent() {
    const {isLoading, data, error, networkError} = this.state;
    if (error || networkError) {
      return <NetworkError onPress={this.onDidMount} />;
    }
    if (isLoading) {
      return <Loading />;
    }
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      return <NoData title={'現在データありません。'} />;
    }
    return (
      <View style={{flex: 1, marginHorizontal: 15, marginTop: 15}}>
        <AppImage
          url={data.imageUrl}
          resizeMode={'cover'}
          style={{
            width: '100%',
            height: DEVICE_WIDTH * 0.52,
            borderRadius: 8,
          }}
        />
        <View style={{flex: 1}}>
          <Text
            numberOfLines={3}
            style={{
              marginTop: 30,
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
              color: 'black',
            }}>
            {data.summaryText}
          </Text>
          {!!data.detailText && (
            <View style={{flex: 1}}>
              <CustomWebView html={data.detailText} />
            </View>
          )}
        </View>
        {!!data.kikakuCode && (
          <TouchableOpacity
            disabled={this.state.btnLoading || data.receivedKikaku}
            onPress={this.beaconCoupon}
            style={{
              // marginHorizontal: 30,
              alignItems: 'center',
              backgroundColor: data.receivedKikaku ? COLOR_GRAY : '#3E4489',
              paddingVertical: 13,
              borderRadius: 5,
              marginVertical: 10,
              borderWidth: 1,
              borderColor: '#707070',
            }}>
            <Text
              style={{color: COLOR_WHITE, fontSize: 16, fontWeight: 'bold'}}>
              クーポンをもらう
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  renderBtn() {
    if (this.state.btnLoading) {
      return <Loading />;
    }
    return (
      <Text style={{color: COLOR_WHITE, fontSize: 16}}>クーポンをもらう</Text>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
});
