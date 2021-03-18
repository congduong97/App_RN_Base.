import React, {useState, useRef, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {
  AppWrapper,
  AppHeader,
  AppText,
  Loading,
  DataNull,
  ErrorView,
} from '../../elements';
import ItemStoreBookmark from './items/ItemStoreBookmark';
import {COLOR, SIZE, FetchApi} from '../../utils';
import {useForceUpdate} from '../../utils/hooks/useForceUpdate';
import {BookmarkService} from './services/BookmarkService';
import {NetworkError} from '../../elements/NetworkError';
import {STRING} from '../../utils/constants/String';

export default function StoreBookmark({route}) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = useRef([]);
  const page = useRef({size: 20, number: 1, last: true});
  const error = useRef({status: false, message: ''});
  const timeout = useRef(0);

  const forceUpdate = useForceUpdate();

  const onEditList = () => {
    setEditing((prev) => !prev);
  };

  useEffect(() => {
    BookmarkService.onChange('BookMark-BookMarkService', onChangeData);
    onDidMount();
    return () => {
      BookmarkService.deleteKey('BookMark-BookMarkService');
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  const onChangeData = (dataBookmark) => {
    let index = data.current.findIndex(
      (item, idx) => item.code1 === dataBookmark.code1,
    );
    if (index > -1) {
      if (dataBookmark.bookmarked) {
        data.current[index].bookmarked = dataBookmark.bookmarked;
      } else {
        data.current.splice(index, 1);
      }
    } else {
      if (dataBookmark.bookmarked) {
        data.current.unshift(dataBookmark);
      }
    }
    forceUpdate();
  };

  const onDidMount = async () => {
    if (!loading) {
      setLoading(true);
    }
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    let result = await FetchApi.getListBookMark(
      page.current.size,
      page.current.number,
    );
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
      setLoading(true);
      let result = await FetchApi.getListBookMark(
        page.current.size,
        page.current.number,
      );
      if (result.success && result.data) {
        data.current = [...data.current, ...result.data.content];
        page.current.number = page.current.number + 1;
        page.current.last = result.data.last;
      }
      timeout.current = setTimeout(() => {
        setLoading(false);
      }, 200);
    } catch {}
  };

  const renderItem = ({item, index}) => {
    return <ItemStoreBookmark data={item} index={index} editing={editing} />;
  };

  const renderHeader = () => {
    if (data.current.length < 1) {
      return null;
    }
    return (
      <View
        style={{
          width: SIZE.device_width,
          backgroundColor: COLOR.grey_100,
          paddingVertical: SIZE.padding,
          paddingHorizontal: 22,
        }}>
        <TouchableOpacity
          style={{alignSelf: 'flex-end'}}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
          onPress={onEditList}>
          <AppText style={{color: '#68463A', fontFamily: 'irohamaru-Medium'}}>
            {editing ? 'キャンセル' : '編集'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoading = () => {
    if (loading) {
      return (
        <Loading style={{marginTop: data.current.length < 1 ? 100 : 10}} />
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <DataNull
        style={{paddingHorizontal: 20}}
        title='お気に入り店舗が登録されていません'
      />
    );
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
      <AppHeader
        style={{paddingBottom: 0}}
        title='お気に入り店舗一覧'
        leftGoBack
      />
      {error.current.status ? (
        renderError()
      ) : (
        <FlatList
          contentContainerStyle={{flex: data.current.length < 1 ? 1 : null}}
          keyExtractor={(item, index) => `${item.code1}`}
          data={data.current}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          }
          onEndReachedThreshold={0.7}
          onEndReached={onLoadMore}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderLoading}
        />
      )}
    </View>
  );
}
