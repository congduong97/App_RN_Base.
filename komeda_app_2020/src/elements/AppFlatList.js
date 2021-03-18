import React, {Component} from 'react';
import {RefreshControl} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import appItemFlatList from './AppItemFlatList';

export default class CameraRoll extends Component {
  constructor(props) {
    super(props);
    const {api, paramsLoadMore} = this.props;
    this.api = api;
    this.paramsLoadMore = paramsLoadMore;
    this.state = {
      data: [],
      refreshing: false,
      loading: false,
      error: {
        status: '',
        message: '',
      },
      paging: {},
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef) {
      onRef(this);
    }

    this.onDidMount();
  }

  onDidMount = async () => {
    this.setState({loading: true});
    await this.api();
    this.setState({loading: false});
  };

  refresh = async () => {
    const {refreshing} = this.state;
    if (refreshing) {
      return;
    }
    this.state.loading = false;
    this.setState({refreshing: true});
    await this.api();
    this.setState({refreshing: false});
  };

  loadMore = async () => {
    const {paging} = this.state;
    if (paging.next === false) {
      return;
    }
    this.setState({loading: true});
    await this.api(this.paramsLoadMore);
    this.setState({loading: false});
  };

  renderItem = ({item, index}) => {
    const {itemComponent} = this.props;
    const ItemFLatList = appItemFlatList(itemComponent);

    return <ItemFLatList />;
  };
  render() {
    const {data, refreshing} = this.state;
    const {
      numColumns,
      onEndReachedThreshold,
      contentContainerStyle,
      keyExtractor,
      extraData,
      style,
    } = this.props;
    return (
      <FlatList
        keyExtractor={keyExtractor}
        extraData={extraData}
        data={data}
        renderItem={this.renderItem}
        contentContainerStyle={[
          {
            justifyContent: 'center',
            alignItems: 'center',
          },
          contentContainerStyle,
        ]}
        style={[{}, style]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
        onEndReachedThreshold={onEndReachedThreshold || 0.2}
        onEndReached={this.loadMore}
        numColumns={numColumns}
      />
    );
  }
}
