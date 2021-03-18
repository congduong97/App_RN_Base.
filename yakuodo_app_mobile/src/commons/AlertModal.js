import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {COLOR_WHITE, COLOR_BLACK} from '../const/Color';
import Icon from 'react-native-vector-icons/AntDesign';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '../const/System';
import {STRING} from '../const/String';
import NetworkError from './NetworkError';
import Loading from './Loading';
import NoData from './ NoData';
import ItemAdvertisement from '../container/Advertisement/item/ItemAdvertisement';
import {Api} from '../service';

const heightDEVICE = Dimensions.get('window').height;
export default class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      isLoading: true,
      isLoadingRefresh: false,
      data: [],
      error: false,
      typeGetListContent: 'CLICK_PUSH',
    };
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('prevState', prevState);
    console.log('isVisible', this.state.isVisible);
    if (!prevState.isVisible && this.state.isVisible) {
      this.callApi(false);
    }
  }
  callApi = async loadRefresh => {
    let {isLoadingRefresh, typeGetListContent} = this.state;
    console.log('typeGetListContent', typeGetListContent);
    if (isLoadingRefresh) {
      return;
    }
    try {
      if (loadRefresh) {
        this.setState({
          isLoadingRefresh: true,
        });
      } else {
        this.setState({
          isLoading: true,
        });
      }
      const response = await Api.getAdvertisement(typeGetListContent);
      console.log(response, 'response');
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.data = response.res.data;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (error) {
      this.state.error = true;
    } finally {
      this.setState({isLoading: false, isLoadingRefresh: false});
    }
  };
  ableModal = typeGetListContent => {
    this.state.typeGetListContent = typeGetListContent;
    this.setState({isVisible: true});
  };
  disableModal = () => {
    this.setState({
      isVisible: false,
    });
  };
  setError = () => {
    this.setState({
      error: true,
    });
  };

  // isVisibleModal = () => {
  //   Alert.alert('クーポンを受け取りました');
  // };
  renderContent() {
    const {isLoading, isLoadingRefresh, data, error} = this.state;
    // console.log(data, 'data', isLoading);
    if (error) {
      return <NetworkError onPress={this.callApi} />;
    }
    if (isLoading) {
      return <Loading />;
    }
    if (data.length == 0) {
      return <NoData title={'現在データありません。'} />;
    }
    return (
      <View style={{paddingBottom: 10, flex: 1, marginTop: 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => this.callApi(true)}
            />
          }
          keyExtractor={(item, index) => `${item.receivedKikaku} ${index}`}
          renderItem={({item, index}) => {
            return (
              <ItemAdvertisement
                item={item}
                index={index}
                setError={this.setError}
                isDetail={false}
                // isVisibleModal={this.isVisibleModal}
              />
            );
          }}
        />
      </View>
    );
  }
  render() {
    const {isVisible} = this.state;
    return (
      <Modal
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationInTiming={600}
        backdropTransitionInTiming={600}
        animationOut="fadeOut"
        animationOutTiming ={600}
        backdropTransitionOutTiming={600}
        hideModalContentWhileAnimating={true}
        backdropOpacity={0.4}
        style={{
          margin: 0,
          alignItems: 'center',
        }}
        isVisible={isVisible}
        useNativeDriver={true}>
        <View
          style={{
            backgroundColor: COLOR_WHITE,
            // marginHorizontal: 10,
            height: heightDEVICE * 0.8,
            width: DEVICE_WIDTH * 0.9,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            {'<<'}PR{'>>'}
          </Text>
          <Text
            style={{
              marginTop: 5,
              alignSelf: 'center',
              fontWeight: '700',
              fontSize: 14,
            }}>
            {STRING.intro_advertisement}
          </Text>
          <View style={{flex: 1}}>{this.renderContent()}</View>
          <TouchableOpacity
            style={{
              margin: DEVICE_WIDTH * 0.03,
              borderRadius: 3,
              borderWidth: 1,
              borderColor: COLOR_BLACK,
              alignItems: 'center',
              paddingVertical: DEVICE_WIDTH * 0.03,
            }}
            onPress={this.disableModal}>
            <Text style={{fontSize: 14, color: COLOR_BLACK, fontWeight: '700'}}>
              閉じる
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
