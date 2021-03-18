import React, {useState, useEffect, useRef} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {AppHeader, ErrorView, Loading} from '../../elements';
import {FetchApi, COLOR, isIos} from '../../utils';
import {NetworkError} from '../../elements/NetworkError';
import ReloadDataScreen from '../../elements/ReloadData';
import PushItem from './items/PushItem';
import {STRING} from '../../utils/constants/String';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';
import {PushNotificationService} from '../../utils/services/PushNotificationService';
import BadgeAndroid from 'react-native-android-badge';
import PushNotificationLibrary from 'react-native-push-notification';
import NotifService from '../../utils/services/NotifService';

const PushNotification = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const fetchConfig = useRef({
    pushList: null,
    page: 1,
    last: false,
    size: 10,
  });

  const error = useRef();

  useEffect(() => {
    getNotication();
    PushNotificationService.setCountNewNotification(0);
    setBadge(0);
    new NotifService().cancelAll();
    return () => {};
  }, []);
  const setBadge = (countNoti) => {
    if (isIos) {
      PushNotificationLibrary.setApplicationIconBadgeNumber(countNoti);
    } else {
      BadgeAndroid.setBadge(countNoti);
    }
  };
  const getNotication = async () => {
    error.current = undefined;

    if (!loading) {
      setLoading(true);
    }
    const {page, size} = fetchConfig.current;
    const response = await FetchApi.getPushNotification(page, size);
    if (response.success) {
      fetchConfig.current.page = page + 1;
      fetchConfig.current.last = response.data.last;
      fetchConfig.current.pushList = [...response.data.content];
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    if (!refresh) {
      setRefresh(true);
    }

    fetchConfig.current.page = 1;
    fetchConfig.current.last = false;
    await getNotication();
    setRefresh(false);
  };

  const onLoadMore = async () => {
    const {size, page, last} = fetchConfig.current;

    if (loading || refresh || last) {
      return;
    }
    if (!loading) {
      setLoading(true);
    }
    const response = await FetchApi.getPushNotification(page, size);

    if (response.success) {
      fetchConfig.current.page = page + 1;
      fetchConfig.current.last = response.data.last;
      fetchConfig.current.pushList = [
        ...fetchConfig.current.pushList,
        ...response.data.content,
      ];
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  const renderItem = ({item, index}) => {
    return <PushItem item={item} index={index} onRefresh={onRefresh} />;
  };

  const renderFooter = () => {
    if (loading && !!fetchConfig.current.notification) {
      return (
        <View style={{paddingVertical: 5}}>
          <Loading />
        </View>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (loading && fetchConfig.current.notification === null) {
      return <Loading />;
    }
    if (error.current === 'network') {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={getNotication}
        />
      );
    }
    if (error.current == 'server_maintain') {
      return (
        <ErrorView
          icon={{name: 'ios-settings'}}
          errorName={STRING.server_maintain}
          onPress={getNotication}
        />
      );
    }
    if (
      fetchConfig.current.notification &&
      fetchConfig.current.notification.length === 0
    ) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={onRefresh}
        />
      );
    }

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        data={fetchConfig.current.pushList}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        refreshing={refresh}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.8}
        onEndReached={onLoadMore}
        ListFooterComponent={renderFooter}
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'お知らせ一覧'} leftGoBack />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: COLOR.white,
  },
});

export default withInteractionsManaged(PushNotification);
