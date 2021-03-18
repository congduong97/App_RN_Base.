import React, {PureComponent} from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {Api} from '../until/api';
import ItemVideo from '../item/ItemVideo';
import {COLOR_WHITE} from '../../../const/Color';
import HeaderIconLeft from '../../../commons/HeaderIconLeft';
import {tab} from '../../../const/System';
import {Loading, NetworkError} from '../../../commons';
import {checkBlackList} from '../../Account/util/checkBlackList';
export default class VideoScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      data: [],
      err: true,
      loading: true,
      loadRefresh: false,
      totalPages: 0,
      loadNexpage: false,
      last: true,
      loadNextPage: false,
    };
  }
  componentDidMount = () => {
    // this.checkMemberInBlackList();
    this.getListVideo();
  };

  checkMemberInBlackList = async () => {
    try {
      const blackList = await checkBlackList();
      if (blackList) {
        return;
      }
    } catch (error) {}
  };
  getApiNextPage = async () => {
    try {
      this.setState({loadNextPage: true});
      const response = await Api.getListVideo(this.state.page + 1, 10);
      this.state.page = this.state.page + 1;
      if (response.code === 200) {
        this.state.data = [...this.state.data, ...response.res.content];
        this.state.last = response.res.last;
      }
    } catch (err) {
    } finally {
      this.setState({loadNextPage: false});
    }
  };

  refreshPage = () => {
    this.state.page = 1;
    this.getListVideo(true);
  };

  onLoadMore = () => {
    const {totalPages, page, loadNextPage, last} = this.state;
    if (last) {
      return;
    }
    if (totalPages > page && !loadNextPage) {
      this.getApiNextPage();
    }
  };

  getListVideo = async loadRefresh => {
    try {
      if (loadRefresh) {
        this.setState({
          loadRefresh: true,
          loading: true,
        });
      } else {
        this.setState({
          loading: true,
        });
      }
      const response = await Api.getListVideo(this.state.page, 10);
      // console.log('response', response);
      if (response.code === 200) {
        this.state.data = response.res.content;
        this.state.totalPages = response.res.totalPages;
        this.state.last = response.res.last;
        this.state.err = false;
      }
    } catch (err) {
      this.state.err = true;
    } finally {
      this.setState({
        loading: false,
        loadRefresh: false,
      });
    }
  };
  renderItem = ({item, index}) => {
    const {navigation} = this.props.navigation;
    return <ItemVideo data={item} index={index} navigation={navigation} />;
  };
  renderContainer = () => {
    const {data, loadRefresh, loading, loadNextPage, err} = this.state;
    if (loading) {
      return <Loading />;
    }
    if (err) {
      return <NetworkError onPress={this.getListVideo} />;
    }
    return (
      <FlatList
        ListFooterComponent={loadNextPage ? <Loading /> : null}
        data={data}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={loadRefresh}
            onRefresh={this.refreshPage}
          />
        }
        onEndReached={this.onLoadMore}
        keyExtractor={(item, index) => `${index}`}
        onEndReachedThreshold={0.8}
      />
    );
  };

  render() {
    const {goBack} = this.props.navigation;
    const {iconUrlVideoScreen, nameVideoScreen} = tab.screenTab;
    const {disableBackButton} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameVideoScreen}
          goBack={goBack}
          video={'5/20'}
          imageUrl={iconUrlVideoScreen}
        />
        {this.renderContainer()}
      </View>
    );
  }
}
