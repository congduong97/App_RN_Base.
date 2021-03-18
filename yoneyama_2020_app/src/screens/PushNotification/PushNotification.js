//Library:
import React, {useEffect, useState, useRef, useContext} from 'react';
import {FlatList} from 'react-native';

//Setup:
import {FetchApi} from '../../utils';

//Component:
import {AppContainer, Loading} from '../../elements';
import PushItem from './items/PushItem';
import {ContextContainer} from '../../contexts/AppContext';
import ReloadDataScreen from '../../elements/ReloadData';
import {NetworkError} from '../../elements/NetworkError';

//Services:
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import ServicesChangeIconBagger from '../../utils/services/ServicesChangeIconBagger';

const PushNotification = ({route}) => {
  const objFetch = useRef({
    data: null,
    size: 20,
    page: 1,
    totalPage: 1,
  });
  const {colorApp} = useContext(ContextContainer);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const error = useRef();
  useEffect(() => {
    ServicesUpdateComponent.set('READ_LIST_PUSH_NOTI');
    ServicesChangeIconBagger.set(0);
    getPushNotification();
  }, []);

  const getPushNotification = async () => {
    if (!loading) {
      setLoading(true);
    }

    error.current = undefined;
    const {size, page} = objFetch.current;
    const response = await FetchApi.getPushNotification(page, size);

    if (response && response.success) {
      objFetch.current.data = [...response.data.content];
      objFetch.current.page = page + 1;
      objFetch.current.totalPage = response.data.totalPages;
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  //ItemPush:
  const renderItem = ({item, index}) => {
    return <PushItem item={item} index={index} />;
  };
  //Load lại dữ liệu:
  const onRefresh = async () => {
    ServicesUpdateComponent.set('RELOAD_LIST_PUSH_NOTI');
    if (refresh) {
      return;
    }
    setRefresh(true);
    objFetch.current.page = 1;
    const {size, page} = objFetch.current;
    await getPushNotification(page, size);
    setRefresh(false);
  };
  //Tải thêm trang:
  const onLoadMore = async () => {
    const {size, page, totalPage, data} = objFetch.current;
    if (loading || refresh || page > totalPage) {
      return;
    }
    setLoading(true);
    const response = await FetchApi.getPushNotification(page, size);
    if (response && response.success) {
      objFetch.current.data = [...data, ...response.data.content];
      objFetch.current.page = page + 1;
      objFetch.current.totalPage = response.data.totalPages;
    }
    setLoading(false);
  };

  //Tải lại danh sách từ đầu nếu trống:
  const pressReloadData = () => {
    getPushNotification();
  };

  const renderLoading = () => {
    if (loading) {
      return <Loading />;
    }
    return null;
  };

  const renderContent = () => {
    if (error.current) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => getPushNotification()}
        />
      );
    }
    if (objFetch.current.data && objFetch.current.data.length == 0) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={pressReloadData}
        />
      );
    }

    return (
      <FlatList
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        data={objFetch.current.data}
        keyExtractor={(item, index) => `${item.id}`}
        refreshing={refresh}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.8}
        onEndReached={onLoadMore}
        ListFooterComponent={renderLoading}
      />
    );
  };

  return (
    <AppContainer
      haveTitle
      nameScreen="プッシュ通知"
      goBackScreen
      style={{backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
};

export default PushNotification;
