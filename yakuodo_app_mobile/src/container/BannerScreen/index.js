import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {Container, View} from 'native-base';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_WHITE} from '../../const/Color';
import {STRING} from '../../const/String';
import {screen, DEVICE_WIDTH, tracker} from '../../const/System';

import {Api} from '../../service';
import NetworkError from '../../commons/NetworkError';
import Loading from '../../commons/Loading';
import {ItemBanner} from './Item/ItemBanner';
import HandleAppLyCoupon from '../../service/HandleAppLyCoupon';
import {ButtonLogin} from '../LoginScreen/Item/ButtonLogin';
import ReloadScreen from '../../service/ReloadScreen';
import {checkBlackList} from '../Account/util/checkBlackList';
// import console = require('console');
export default class BannerScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: true,
      isLoadingRefresh: false,
      data: [],
      bannerSelect: [],
      page: 1,
      title: '',
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false,
    };
  }

  componentDidMount() {
    this.onDidMount();
    HandleAppLyCoupon.onChange('', dataApply => {
      // console.log('dataApply', dataApply);
      const {type, data, id} = dataApply;
      if (type === 'SELECT') {
        const dataOld = this.state.data;
        let newData = [...dataOld];
        newData = newData.map(item => {
          if (item.id === data.id) {
            return {...item, selected: true};
          }
          return item;
        });
        this.state.bannerSelect.push({...data, selected: true});
        this.setState({data: newData});
        return;
      }
      if (type === 'UN_SELECT') {
        const dataOld = this.state.data;
        let newData = [...dataOld];
        newData = newData.map(item => {
          if (item.id === data.id) {
            return {...item, selected: false};
          }
          return item;
        });
        // console.log('newData', newData);
        const bannerSelect = this.state.bannerSelect.filter(
          item => item.id !== data.id,
        );
        // console.log('bannerSelect', bannerSelect);
        this.setState({data: newData, bannerSelect});
        return;
      }

      if (type === 'APPLY') {
        const dataOld = this.state.data;

        let newData = [...dataOld];
        newData = newData.map(item => {
          if (item.id == id) {
            return {
              ...item,
              applied: true,
              numberMemberApply: Number.isInteger(item.numberMemberApply)
                ? item.numberMemberApply + 1
                : item.numberMemberApply,
            };
          }
          return item;
        });
        const bannerSelect = this.state.bannerSelect.filter(
          item => item.id != id,
        );
        // console.log('bannerSelect',bannerSelect)
        // console.log('newData', newData);
        this.setState({data: newData, bannerSelect});
        return;
      }
      if (type === 'APPLY_ALL') {
        const dataOld = this.state.data;

        let newData = [...dataOld];
        newData = newData.map(item => ({
          ...item,
          applied: item.selected || item.applied,
          numberMemberApply:
            Number.isInteger(item.numberMemberApply) && item.selected
              ? item.numberMemberApply + 1
              : item.numberMemberApply,
        }));
        this.state.bannerSelect = [];
        // console.log('newData', newData);
        this.setState({data: newData});
        return;
      }
    });
    const {routeName} = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      // alert('reload')
      this.getApi(true);
    });
  }

  componentWillUnmount() {
    const {routeName} = this.props.navigation.state;
    ReloadScreen.unChange(routeName);
    HandleAppLyCoupon.unChange('');
  }
  onDidMount = () => {
    this.getApi();
  };
  getApi = async loadRefresh => {
    const {isLoading, isLoadingRefresh} = this.state;
    if (isLoadingRefresh) {
      return;
    }
    try {
      if (loadRefresh) {
        this.setState({isLoadingRefresh: true, page: 1, error: false});
      } else {
        this.setState({isLoading: true, error: false});
      }

      const {navigation} = this.props;

      const blackList = await checkBlackList();
      if (blackList) {
        return;
      }
      const response = await Api.listBanner();
      if (response.code === 200 && response.res.status.code === 1028) {
        navigation.navigate('UpdateScreen', {
          messageUpdateApp: response.res.data,
        });
        return;
      }
      if (response.code === 200 && response.res.status.code === 1000) {
        const {data} = response.res;
        this.state.data = data;
        this.state.networkError = false;
        this.state.error = false;
      } else {
        this.state.error = true;
      }
    } catch (err) {
      this.state.error = true;
      // console.log(err);
    } finally {
      this.setState({isLoading: false, isLoadingRefresh: false});
    }
  };
  selectBanner = (dataSelect, status) => {
    const {data} = this.state;
    const newData = data;
    const indexData = newData.indexOf(dataSelect);
    newData[indexData].selected = status;
    this.setState({data: newData});
  };

  refreshPage() {
    this.getApi(true);
  }
  callClickAll = async () => {
    try {
      const {bannerSelect} = this.state;
      let listId = '';
      bannerSelect.forEach(element => {
        listId = `${listId},${element.id}`;
      });
      listId = listId.replace(',', '');
      // console.log('listId', listId);
      const response = await Api.selectListBannerApp(listId);
      // console.log('response', response);
    } catch (error) {}
  };
  goConfirmApply = () => {
    this.callClickAll();
    const {bannerSelect} = this.state;
    // console.log('ConfirmApply', this.props.navigation);
    this.props.navigation.navigate('ConfirmApply', {
      bannerSelect,
      gesturesEnabled: true,
    });
  };

  keyExtractor = (item, index) => `${item.id}`;
  renderItem = ({item, i}) => (
    <ItemBanner
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
      totalPages,
      page,
    } = this.state;
    if (error) {
      return <NetworkError onPress={this.onDidMount} />;
    }
    if (isLoading) {
      return <Loading />;
    }

    return (
      <FlatList
        data={data}
        extraData={this.state}
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
    const {bannerSelect} = this.state;
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
          title={'キャンペーン応募'}
          goBack={goBack}
          // imageUrl={iconUrl}
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
