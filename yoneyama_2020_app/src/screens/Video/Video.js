//Library:
import React, {useState, useRef, useLayoutEffect, useContext} from 'react';
import {FlatList, RefreshControl} from 'react-native';

//Setup:
import {FetchApi, SIZE} from '../../utils';

//Component:
import ItemVideo from './items/ItemVideo';
import ReloadDataScreen from '../../elements/ReloadData';
import {AppContainer, Loading} from '../../elements';
import {NetworkError} from '../../elements/NetworkError';
import {ContextContainer} from '../../contexts/AppContext';

//Services:
import {AccountService} from '../../utils/services/AccountService';

function Video({route}) {
  const {colorApp} = useContext(ContextContainer);
  const [loading, setStateLoading] = useState(true);
  const [isLoadingRefresh, setStateIsLoadingRefresh] = useState(false);
  const [dataVideo, setStateDataVideo] = useState([]);
  const [loadNextPage, setStateLoadNextPage] = useState(false);
  const [nameScreen, setStateName] = useState('');
  const needToken = useRef(false);
  const page = useRef(1);
  const totalPage = useRef(1);
  const size = useRef(10);
  const errorView = useRef(false);

  useLayoutEffect(() => {
    onDidMount();
    return () => {};
  }, []);

  const onDidMount = async () => {
    await getNameScreen();
    await getData();
    checkLogin();
  };

  //Kiểm tra đăng nhập:
  const checkLogin = () => {
    let accountLogin = AccountService.getAccount();
    if (accountLogin) {
      needToken.current = true;
    }
  };
  //Lấy tên màn hình:
  const getNameScreen = () => {
    const {name} = route.params.itemMenu;
    setStateName(name);
  };

  //Tải lại danh sách:
  const refreshPage = () => {
    page.current = 1;
    getData();
  };

  //Tải lại danh sách từ đầu nếu trống:
  const pressReloadData = () => {
    getData();
  };

  //Khóa Key:
  const keyExtractor = (item, index) => `${index}${item.id}`;

  //Item Noti:
  const renderItem = ({item, index}) => {
    return (
      <ItemVideo item={item} index={index} needToken={needToken.current} />
    );
  };
  //Nội dung trang thông báo:
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (errorView.current) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => getData()}
        />
      );
    }
    if (dataVideo && dataVideo.length == 0 && !errorView.current) {
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
        data={dataVideo}
        ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        contentContainerStyle={{paddingBottom: SIZE.width(12)}}
        // ListHeaderComponent={() => {}}
        refreshControl={
          <RefreshControl
            refreshing={isLoadingRefresh}
            onRefresh={() => refreshPage()}
          />
        }
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => {
          if (totalPage.current > page.current && !loadNextPage) {
            nextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    );
  };

  //Lấy danh sách video :
  const getData = async (loadRefresh) => {
    if (loadRefresh) {
      page.current = 1;
      errorView.current = false;
      setStateLoading(false);
      setStateIsLoadingRefresh(true);
    } else {
      errorView.current = false;
      setStateLoading(true);
    }
    const response = await FetchApi.getListVideo(page.current, size.current);
    if (response && response.code == 1000 && response.status_code == 200) {
      const {content, totalPages} = response.data;
      totalPage.current = totalPages;
      setStateDataVideo([...content]);
      setStateLoading(false);
    } else {
      errorView.current = true;
      setStateLoading(false);
    }
  };

  //Lấy thêm danh sách video:
  const nextPage = async () => {
    setStateLoadNextPage(true);
    let nextPage = page.current + 1;
    const response = await FetchApi.getListNoti(size.current, nextPage);
    if (response && response.status_code === 200 && response.code === 1000) {
      const {content} = response.data.PageNormalNotification;
      page.current++;
      setStateDataVideo([...dataVideo, ...content]);
      setStateLoadNextPage(false);
    } else {
      errorView.current(true);
      setStateLoadNextPage(false);
    }
  };
  return (
    <AppContainer
      haveTitle
      nameScreen={nameScreen}
      goBackScreen
      style={{backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
}
export default Video;
