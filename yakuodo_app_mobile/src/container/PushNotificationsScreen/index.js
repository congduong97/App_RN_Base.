import React, { PureComponent } from 'react';
import { StyleSheet, StatusBar, FlatList, RefreshControl, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { Container, View } from 'native-base';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {
  COLOR_GRAY_LIGHT,
  COLOR_WHITE,
} from '../../const/Color';
import { screen, DEVICE_WIDTH, isIOS, tracker, APP } from '../../const/System';
import { STRING } from '../../const/String';
import { Api } from '../../service';
import NetworkError from '../../commons/NetworkError';
import Loading from '../../commons/Loading';
import { ItemPushNotification } from './Item/ItemPushNotification';
import AsyncStorage from '@react-native-community/async-storage';
import ReloadScreen from '../../service/ReloadScreen';


export default class Notifications extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isLoadingRefresh: false,
      data: [],
      page: 1,
      namePushNotification: null,
      error: false,
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false
    };
  }
  componentDidMount() {
    this.onDidMount();
    const { routeName } = this.props.navigation.state

    ReloadScreen.onChange(routeName, () => {
      this.getApi(10, 1, true);
    })
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state
    ReloadScreen.unChange(routeName)

  }

  onDidMount = () => {
    this.getApi(10, 1);
    const { iconUrl, namePushNotification } = this.state;
    if (!iconUrl) {
      AsyncStorage.getItem('iconPushNotification')
        .then(res => {
          // console.log('iconPushNotification', URL_IMAGE + res);
          // if(res!=null){
          this.setState({ iconUrl: res });

          // }
        })
        .catch(err => { });
    }
    if (!namePushNotification) {
      AsyncStorage.getItem('namePushNotification')
        .then(res => {
          // alert(res);
          // if(res!=null){
          this.setState({ namePushNotification: res });

          // }
        })
        .catch(err => { });
    }
  }
  getApi = async (size, page, loadRefresh) => {
    const {isLoadingRefresh} = this.state
    if(isLoadingRefresh){
      return
    }
    try {
      if (loadRefresh) {
        this.setState({ isLoadingRefresh: true, page: 1 });
      } else {
        this.setState({ isLoading: true });
      }
      const response = await Api.getPushNotification(size, page);
      // console.log('PUSH', response);
      if (response.code === 200) {
        const { content, totalPages } = response.res.data;
        this.state.data = content || [];
        this.state.error = false;
        this.state.totalPages = totalPages;
        // NotificationCount.set(0);
        if (isIOS) {
          PushNotification.setApplicationIconBadgeNumber(0);
        } else {
          // BadgeAndroid.setBadge(0);
        }
        // console.log('params', params);
      } else {
        this.state.error = true;
      }
    } catch (e) {
      this.state.error = true;
      // console.log(e);
    } finally {
      this.setState({ isLoading: false, isLoadingRefresh: false });
    }
  };

  getApiNextPage = async () => {
    const { data, error } = this.state;
    this.setState({ loadNextPage: true });

    if (data.length === 0 && error) {
      return;
    }
    try {
      const response = await Api.getPushNotification(10, this.state.page + 1);
      if (response.code === 200 && response.res.status.code === 1000) {
        this.state.page = this.state.page + 1;
        this.state.data = [...this.state.data, ...response.res.data.content || []];
        this.state.isLoadingRefresh = false;
      }
    } catch (err) {
      // console.log(err);
    } finally {
      this.setState({ loadNextPage: false });
    }
  };

  refreshPage() {
    this.getApi(10, 1, true);
  }

  keyExtractor = (item, index) => `${index}`;

  renderItem = ({ item, index }) => (
    <ItemPushNotification item={item} navigation={this.props.navigation} />
  );
  renderContent() {
    const { isLoading, networkError, error, data, isLoadingRefresh, totalPages, page, loadNextPage } = this.state;
    if (error) {
      return (
        <NetworkError
          onPress={this.onDidMount}
        />
      );
    }
    if (isLoading) return <Loading />;

    return (
      <FlatList
        data={data}
        extraData={this.state}
        ListFooterComponent={() => loadNextPage ? <Loading /> : null}
        refreshControl={
          <RefreshControl refreshing={isLoadingRefresh} onRefresh={() => this.refreshPage()} />
        }
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
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
    const { namePushNotification, iconUrl, loadNextPage } = this.state;
    const { disableBackButton } = this.props;
    return (
      <View style={styles.wrapperContainer}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={namePushNotification}
          goBack={goBack}
          imageUrl={iconUrl}
        />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH
  }
});
