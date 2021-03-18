import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
  BackHandler,
} from 'react-native';
import {Container, View} from 'native-base';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_WHITE} from '../../const/Color';
import {STRING} from '../../const/String';
import {screen, DEVICE_WIDTH, tracker} from '../../const/System';

import {Api} from '../../service';
import Loading from '../../commons/Loading';
import {ItemBanner} from './Item/ItemBanner';
import HandleAppLyCoupon from '../../service/HandleAppLyCoupon';
import {ButtonLogin} from '../LoginScreen/Item/ButtonLogin';
// import console = require('console');
export default class ConfirmAppLy extends PureComponent {
  constructor(props) {
    // alert('ConfirmAppLy')
    super(props);
    const {bannerSelect} = this.props.navigation.state.params;
    this.state = {
      isLoading: false,
      isLoadingRefresh: false,
      bannerSelect: bannerSelect || [],
    };
  }

  componentDidMount() {
    HandleAppLyCoupon.onChange('ConfirmAppLy', dataApply => {
      // console.log('dataApply', dataApply);
      const {type, data, id} = dataApply;

      if (type === 'UN_SELECT') {
        const bannerSelect = this.state.bannerSelect.filter(
          item => item.id !== data.id,
        );
        if (bannerSelect.length === 0) {
          this.props.navigation.goBack(null);
        } else {
          this.setState({bannerSelect});
        }
        return;
      }
    });
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);

    HandleAppLyCoupon.unChange('ConfirmAppLy');
  }
  handleBackPress = () => {
    if (this.state.isLoading) {
      return true;
    }

    this.props.navigation.goBack(null);
    return true;
  };

  selectBanner = (dataSelect, status) => {
    const {data} = this.state;
    const newData = data;
    const indexData = newData.indexOf(dataSelect);
    newData[indexData].selected = status;
    this.setState({data: newData});
  };
  applyAll = async () => {
    try {
      this.setState({isLoading: true});
      this.props.navigation.setParams({gesturesEnabled: false});

      const {bannerSelect} = this.state;
      let listId = '';
      bannerSelect.forEach(element => {
        listId = `${listId},${element.id}`;
      });
      listId = listId.replace(',', '');
      const response = await Api.applyListBannerApp(listId);
      // console.log('response', response);

      if (response.code === 200 && response.res.status.code === 1000) {
        Alert.alert('キャンペーンを一括で応募しました。');
        HandleAppLyCoupon.set({type: 'APPLY_ALL'});
        this.props.navigation.goBack(null);

        return;
      }
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } catch (error) {
      // console.log('error', error);
      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      this.props.navigation.setParams({gesturesEnabled: true});
      this.setState({isLoading: false});
    }
  };

  refreshPage() {}

  goConfirmApply = () => {
    Alert.alert(
      'キャンペーンを応募しますか。',
      '',
      [
        {
          text: STRING.cancel,
          onPress: () => {},
          style: 'cancel',
        },
        {text: STRING.ok, onPress: () => this.applyAll()},
      ],
      {cancelable: false},
    );
  };

  keyExtractor = (item, index) => `${item.id}`;
  renderItem = ({item, i}) => (
    <ItemBanner
      isLoading={this.state.isLoading}
      confirm
      data={item}
      key={`${i}`}
      navigation={this.props.navigation}
      onPressSelect={this.selectBanner}
    />
  );
  renderContent = () => {
    const {
      isLoading,
      isLoadingRefresh,
      data,
      error,
      loadNextPage,
      bannerSelect,
    } = this.state;

    return (
      <FlatList
        data={bannerSelect}
        extraData={this.state.bannerSelect}
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => this.refreshPage()}
          />
        }
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  };
  renButtonAppLyAll = () => {
    const {bannerSelect, isLoading} = this.state;
    if (bannerSelect.length > 0) {
      return (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            paddingVertical: 8,
            alignItems: 'center',
          }}>
          <ButtonLogin
            loadingLogin={isLoading}
            name={'キャンペーンを一括で応募する'}
            style={{width: '80%'}}
            onPress={this.goConfirmApply}
          />
        </View>
      );
    }
    return null;
  };
  render() {
    const {goBack} = this.props.navigation;
    const {disableBackButton} = this.props;
    return (
      <View style={styles.wrapperContainer}>
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={'応募確認'}
          goBack={goBack}
        />
        {this.renderContent()}
        {this.renButtonAppLyAll()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  shadow: {
    shadowColor: COLOR_GRAY,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    elevation: 2,
  },
  wrapperSpace: {
    height: 50,
  },
});
