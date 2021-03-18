import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {HeaderIconLeft, NoData, Loading, NetworkError} from '../../commons';
import {COLOR_WHITE} from '../../const/Color';
import {Api} from '../../service';
import ItemAdvertisement from './item/ItemAdvertisement';
import Modal from 'react-native-modal';
import {DEVICE_WIDTH} from '../../const/System';
import { STRING } from '../../const/String';
export default class AdvertisementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingRefresh: false,
      data: [],
      error: false,
      isModal: false,
      title: '',
    };
  }
  setError = () => {
    this.setState({
      error: true,
    });
  };
  componentDidMount() {
    this.onDidMount(false);
  }
  onDidMount = async loadRefresh => {
    let { isLoadingRefresh} = this.state;
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
      const response = await Api.getAdvertisement("CLICK_PUSH");
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

  isVisibleModal = isVisible => {
    Alert.alert('クーポンを受け取りました');
    // this.setState({
    //   isModal: isVisible,
    // });
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
  renderContent() {
    const {
      isLoading,
      isLoadingRefresh,
      data,
      error,
    } = this.state;
    // console.log(data, 'data', isLoading);
    if (error ) {
      return <NetworkError onPress={this.onDidMount} />;
    }
    if (isLoading) {
      return <Loading />;
    }
    if (data.length == 0) {
      return <NoData title={'お知らせの期限が終了しました。'} />;
    }
    return (
      <View style={{paddingBottom: 10, flex: 1}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          // contentContainerStyle={{marginVertical: 10}}
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => this.onDidMount(true)}
            />
          }
          keyExtractor={(item, index) => `${index} ${item.receivedKikaku}`}
          renderItem={({item, index}) => {
            return (
              <ItemAdvertisement
                item={item}
                index={index}
                isDetail={true}
                setError={this.setError}
                // isVisibleModal={this.isVisibleModal}
              />
            );
          }}
        />
      </View>
    );
  }
  render() {
    const {goBack} = this.props.navigation;

    return (
      <View style={styles.containerStyle}>
        <HeaderIconLeft title={'PR'} goBack={goBack} />
        <Text
          style={{
            marginTop: 15,
            alignSelf: 'center',
            fontWeight: '700',
            fontSize: 14,
          }}>
          {STRING.intro_advertisement}
        </Text>
        {this.renderContent()}
        {/* {this.renderModal()} */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
});
