import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  LayoutAnimation,
  UIManager,
  Text,
  View,
} from 'react-native';
import {
  COLOR_GRAY_LIGHT,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_RED,
} from '../../../const/Color';
import {Loading} from '../../../commons';
import ItemHistoryKeyWord from '../item/ItemHistoryKeyWord';
import {API} from '../util/api';

export default class ListItemSearchCoupons extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basic: true,
      listViewData: [],
      page: 1,
      totalPages: 1,
      active: false,
    };
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentDidMount() {
    this.getListHistoryCoupon();
  }
  getListHistoryCoupon = async reload => {
    try {
      if (reload) {
        this.setState({isLoadingRefresh: true});
      } else if (!this.state.loading) {
        this.setState({loading: true});
      }
      const response = await API.getListHistorySearchCoupon(1, 10);
      if (response.code == 200) {
        const {content, totalPages} = response.res;
        this.state.listViewData = content;
        this.state.totalPages = totalPages;
      }
    } catch (e) {
    } finally {
      this.setState({loading: false, isLoadingRefresh: false});
    }
  };
  getApiNextPage = async () => {
    try {
      this.setState({loadNextPage: true});
      const response = await API.getListHistorySearchCoupon(
        this.state.page + 1,
        10,
      );
      if (response.code == 200) {
        const {content} = response.res;
        this.state.listViewData = [...this.state.listViewData, ...content];
        this.state.page++;
      }
    } catch (e) {
    } finally {
      this.setState({loadNextPage: false});
    }
  };

  deleteRow = id => {
    const newList = this.state.listViewData.filter(items => items.id !== id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    this.setState({listViewData: newList});
    try {
      API.deteleHistorySearchCoupon(id ? id : '');
    } catch (e) {}
  };
  renderItem = ({item, i}) => {
    const {active} = this.state;
    return (
      <ItemHistoryKeyWord
        onDelete={id => this.deleteRow(id)}
        data={item}
        onPress={this.props.onPress}
        active={active}
      />
    );
  };
  refreshPage = () => {
    this.setState(
      {
        page: 1,
      },
      () => this.getListHistoryCoupon(true),
    );
  };
  loadMoreKeySearch = () => {
    const {loadNextPage, totalPages, page} = this.state;
    if (totalPages > page && !loadNextPage) {
      this.getApiNextPage();
    }
  };
  keyExtractor = (item, index) => `${item.id}`;
  renderContent() {
    const {loadNextPage, isLoadingRefresh, listViewData, active} = this.state;
    return (
      <FlatList
        data={listViewData}
        useFlatList
        extraData={this.state}
        disableRightSwipe
        disableLeftSwipe={!active}
        ListFooterComponent={loadNextPage ? <Loading /> : null}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={this.refreshPage}
          />
        }
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        onEndReached={this.loadMoreKeySearch}
        onEndReachedThreshold={0.8}
      />
    );
  }
  render() {
    const {active, loading, listViewData} = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <View style={{flex: 1}}>
        {listViewData.length > 0 ? (
          <View style={[styles.itemList, {height: 50}]}>
            <Text style={{color: COLOR_BLACK, fontWeight: 'bold'}}>
              検索履歴
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({active: !active});
              }}>
              <Text style={{color: 'blue', fontWeight: 'bold'}}>
                {active ? '完了' : '編集'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemList: {
    borderBottomColor: COLOR_GRAY_LIGHT,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  buttonDelete: {
    width: 75,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_RED,
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: COLOR_WHITE,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
