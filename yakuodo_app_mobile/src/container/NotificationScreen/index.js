import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, View} from 'native-base';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {COLOR_GRAY_LIGHT, COLOR_GRAY, COLOR_WHITE} from '../../const/Color';
import {STRING} from '../../const/String';
import {screen, DEVICE_WIDTH, tracker} from '../../const/System';

import {Api} from '../../service';
import NetworkError from '../../commons/NetworkError';
import Loading from '../../commons/Loading';
import ItemNotification from './Item/ItemNotification';
import ReloadScreen from '../../service/ReloadScreen';
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      networkError: false,
      error: false,
      isLoading: true,
      isLoadingRefresh: false,
      data: [],
      page: 1,
      title: '',
      iconUrl: false,
      totalPages: 1,
      loadNextPage: false,
    };
  }

  componentDidMount() {
    this.onDidMount();
    const {routeName} = this.props.navigation.state;

    ReloadScreen.onChange(routeName, () => {
      // alert('reload')
      this.getApi(1, 10, true);
    });
  }

  componentWillUnmount() {
    const {routeName} = this.props.navigation.state;

    ReloadScreen.unChange(routeName);
  }
  onDidMount = () => {
    this.getApi(1, 10);
    AsyncStorage.getItem('iconNotification')
      .then(res => {
        // console.log('iconNotification', res);
        if (res != null) {
          this.setState({iconUrl: res});
        }
      })
      .catch(err => {});
    AsyncStorage.getItem('nameNotification')
      .then(res => {
        // console.log('iconNotification', res);
        if (res != null) {
          this.setState({nameNotification: res});
        }
      })
      .catch(err => {});
  };
  getApi = async (page, size, loadRefresh) => {
    try {
      if (loadRefresh) {
        this.setState({isLoadingRefresh: true, page: 1, error: false});
      } else {
        this.setState({isLoading: true, error: false});
      }
      const response = await Api.getNotification(page, size);
      console.log('response getNotification', response);

      if (response.code === 200 && response.res.status.code === 1000) {
        AsyncStorage.setItem(
          'timeNotification',
          new Date().getTime().toString(),
        );
        const {content, totalPages} = response.res.data.page;
        // console.log('NOTI', response);
        this.state.data = content;
        this.state.networkError = false;
        this.state.error = false;
        this.state.totalPages = totalPages;
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

  getApiNextPage = async () => {
    try {
      this.setState({loadNextPage: true});
      const response = await Api.getNotification(this.state.page + 1, 10);
      // console.log('responseNext', response);
      if (response.code == 200 && response.res.status.code == 1000) {
        this.state.page++;
        const {content} = response.res.data.page;
        this.state.data = [...this.state.data, ...content];
      }
    } catch (err) {
      // console.log(err);
      // Alert.alert(err.message || err);
    } finally {
      this.setState({loadNextPage: false});
    }
  };
  refreshPage() {
    this.state.page = 1;
    this.getApi(1, 10, true);
  }

  keyExtractor = (item, index) => `${index}`;
  renderItem = ({item, i}) => (
    <ItemNotification
      data={item}
      key={`${i}`}
      navigation={this.props.navigation}
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
        onEndReached={() => {
          if (totalPages > page && !loadNextPage) {
            this.getApiNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  };
  render() {
    const {goBack} = this.props.navigation;
    const {nameNotification, iconUrl} = this.state;
    const {disableBackButton} = this.props;
    return (
      <View style={styles.wrapperContainer}>
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameNotification}
          goBack={goBack}
          imageUrl={iconUrl}
        />
        {this.renderContent()}
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
