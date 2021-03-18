import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, RefreshControl} from 'react-native';
import {AppHeader, Loading, DataNull, ErrorView} from '../../elements';
import {COLOR, SIZE, FetchApi} from '../../utils';
import {NetworkError} from '../../elements/NetworkError';
import StampsItem from './items/StampsItem';
import ReloadDataScreen from '../../elements/ReloadData';
import {STRING} from '../../utils/constants/String';

export default function Stamps({route}) {
  // Stamp
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
    let result = await FetchApi.getListNoti(
      page.current.size,
      page.current.number,
    );
    if (result.success) {
      data.current = [...result.data.PageStamp.content];
      page.current.number = page.current.number + 1;
      page.current.last = result.data.PageStamp.last;
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
      result = await FetchApi.getListNoti(
        page.current.size,
        page.current.number,
      );

      if (result.success && result.data) {
        data.current = [...data.current, ...result.data.PageStamp.content];
        page.current.number = page.current.number + 1;
        page.current.last = result.data.PageStamp.last;
      }
      setLoading(false);
    } catch {}
  };

  const renderItem = ({item, index}) => {
    return <StampsItem item={item} index={index} />;
  };
  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <ReloadDataScreen
        title={'データがありません'}
        iconName={'reload'}
        onPress={onRefresh}
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
      <AppHeader title='スタンプ' leftGoBack />
      <View style={{backgroundColor: COLOR.grey_100, flex: 1}}>
        {!!error.current.status ? (
          renderError()
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 150,
              paddingTop: SIZE.padding,
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
