import React, { PureComponent } from 'react';
import { StyleSheet, StatusBar, FlatList, RefreshControl, View } from 'react-native';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';

import {
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
  APP_COLOR,
} from '../../../const/Color';

import { DEVICE_WIDTH, tab, sizePage } from '../../../const/System';


import { Api } from '../util/api';
import { Loading, NetworkError } from '../../../commons';
import { ItemCoupon } from '../item/ItemCoupon';
import ReloadScreen from '../../../service/ReloadScreen';
// import console = require('console');

export default class HistoryCoupon extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingRefresh: false,
      networkError: false,
      error: false,
      data: [],
      page: 1,
      name: false,
      iconUrl: false,
      history: false,
      totalPages: 1,
      loadNextPage: false
    };
  }
  componentDidMount() {
    this.onDidMount();
    const {routeName} = this.props.navigation.state
    ReloadScreen.onChange(routeName,()=>{
      // alert('reload')
      this.getApi(true)
    })
  }
  componentWillUnmount(){
    const {routeName} = this.props.navigation.state
    ReloadScreen.unChange(routeName)
  }

  onDidMount = () => {
    this.getApi();
  }
  getApiNextPage = async () => {
    try {
      this.setState({ loadNextPage: true });
     const response = await Api.getHistoryCoupon(sizePage, this.state.page + 1);
      if (response.code === 200) {
        const data = response.res.data.content;
        this.state.page = this.state.page + 1;
        this.state.data = [...this.state.data, ...data];
      }
    } catch (err) {

    } finally {
      this.setState({ loadNextPage: false });
    }

    // this.setState({ networkError: true });
  };

  getApi = async (loadRefresh) => {
    if (this.state.isLoadingRefresh || this.state.isLoading) {
      return;
    }
    try {
      if (loadRefresh) {
        await this.setState({ isLoadingRefresh: true, page: 1 });
      } else {
        await this.setState({ isLoading: true });
      }

      const response = await Api.getHistoryCoupon(sizePage, 1); 


      if (response.code === 200) {
        const { content, totalPages } = response.res.data;
        this.state.data = content;
        this.state.error = false;
        this.state.totalPages = totalPages;
      } else {
        this.state.error = true;
      }
    } catch (err) {
      this.state.error = true;
    } finally {
      this.setState({ isLoadingRefresh: false, isLoading: false });
    }
  };
  upDate = item => {
    item.canUse = false;
    // console.log('item', item);
    // console.log('data', this.state.data);
    this.setState({ data: this.state.data });
  };

  refreshPage() {
    this.getApi(true);
  }

  _renderItem = (({ item, index }) => (
      <ItemCoupon
        navigation={this.props.navigation}
        history
        data={item} key={`${item.id}`}
      />
    ))
  _keyExtractor = (item, index) => `${index}`;
  renderContent() {
    const { isLoading, data, error, isLoadingRefresh, page, totalPages, loadNextPage } = this.state;
    if (isLoading) {
      return (<Loading />);
    }
    if (error) {
      return (
        <NetworkError

          onPress={this.onDidMount}
        />
      );
    }
    if(!data || data.length===0){
      return <NetworkError title={'データなし'} iconName={'reload'} onPress={() => this.getApi()} />;
    }
    return (
      <FlatList
        data={data}
        ListFooterComponent={() => loadNextPage ? <Loading /> : null}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => this.refreshPage()}
          />
        }
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  }
  render() {
    const { goBack } = this.props.navigation;
    const { disableBackButton } = this.props;


    const { nameHistoryCouponScreen, iconUrlHistoryCouponScreen } = tab.screenTab;
    return (
      <View style={[styles.wrapperContainer, { backgroundColor: APP_COLOR.BACKGROUND_COLOR }]}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameHistoryCouponScreen}
          goBack={goBack}
          imageUrl={iconUrlHistoryCouponScreen}
        />
        {this.renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  
  }
});
