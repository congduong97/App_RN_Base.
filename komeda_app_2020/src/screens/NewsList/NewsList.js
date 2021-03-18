import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {
  AppWrapper,
  AppHeader,
  Loading,
  DataNull,
  ErrorView,
} from '../../elements';
import {COLOR, SIZE, FetchApi} from '../../utils';
import NewsListItem from './items/NewsListItem';
import {NetworkError} from '../../elements/NetworkError';
import ReloadDataScreen from '../../elements/ReloadData';
import {STRING} from '../../utils/constants/String';

export default function NewsList({route}) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const data = useRef(null);
  const page = useRef({size: 10, number: 1, last: false});
  const error = useRef({});

  useEffect(() => {
    onDidMount();
  }, []);

  const onDidMount = async () => {
    if (!loading) {
      setLoading(true);
    }
    await fetchData();
    setLoading(false);
  };
  const fetchData = async () => {
    error.current.status = false;
    let result = await FetchApi.getNewsList(
      page.current.size,
      page.current.number,
    );
    console.log('result-news', result);
    if (result.success) {
      data.current = [...result.data.content];
      page.current.number = page.current.number + 1;
      page.current.last = result.data.last;
    } else if (result.status_code >= 500) {
      error.current.status = 'maintain';
    } else {
      error.current.status = 'network';
    }
  };

  const onRefresh = async () => {
    if (refreshing) {
      return;
    }
    page.current.number = 1;
    page.current.last = false;
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const onLoadMore = async () => {
    if (refreshing || page.current.last || loading) {
      return;
    }
    try {
      let result;
      setLoading(true);
      result = await FetchApi.getNewsList(
        page.current.size,
        page.current.number,
      );

      if (result.success && result.data) {
        data.current = [...data.current, ...result.data.content];
        page.current.number = page.current.number + 1;
        page.current.last = result.data.last;
      }
      setLoading(false);
    } catch {}
  };

  const renderItem = ({item, index}) => {
    return <NewsListItem item={item} index={index} />;
  };
  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <ReloadDataScreen
        title={'データがありません'}
        iconName={'reload'}
        onPress={onDidMount}
      />
    );
  };
  const renderLoading = () => {
    if (loading) {
      return <Loading style={{flex: 1}} />;
    }
    return null;
  };
  const renderError = () => {
    if (error.current.status === 'network') {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={onDidMount}
        />
      );
    }
    return (
      <ErrorView
        icon={{name: 'ios-settings'}}
        errorName={STRING.server_maintain}
        onPress={onDidMount}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader title='ニュース一覧' leftGoBack />

      <View style={{backgroundColor: COLOR.grey_100, flex: 1}}>
        {!!error.current.status ? (
          renderError()
        ) : (
          <FlatList
            contentContainerStyle={{
              // alignItems: 'center',
              paddingTop: SIZE.padding,
              paddingBottom: 150,
            }}
            keyExtractor={(item, index) => `${item.id}`}
            data={data.current}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
            }
            onEndReachedThreshold={0.8}
            onEndReached={onLoadMore}
            ListFooterComponent={renderLoading}
          />
        )}
      </View>
    </View>
  );
}
