//Library:
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, FetchApi, AsyncStoreKey} from '../../utils';

//Component:
import ItemBookMark from './items/ItemBookMark';
import ReloadDataScreen from '../../elements/ReloadData';
import {Loading} from '../../elements/Loading';
import {NetworkError} from '../../elements/NetworkError';
import {ErrorView} from '../../elements';

//Services:
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';

//Screen:
// Lưu ý biến props kia đen không dùng đến cũng không được phép xóa vì nó extend phải dùng đến.
function BookMark(props, ref) {
  // Lưu ý biến props kia đen không dùng đến cũng không được phép xóa vì nó extend phải dùng đến.
  const [loading, setStateLoading] = useState(true);
  const {index} = props;
  const [isLoadingRefresh, setStateIsLoadingRefresh] = useState(false);
  const [data, setStateData] = useState([]);
  const [loadNextPage, setStateLoadNextPage] = useState(false);
  const page = useRef(1);
  const totalPage = useRef(1);
  const size = useRef(10);
  const error = useRef(false);
  const maintain = useRef(false);
  const accountLogin = useRef(false);
  const memberCode = useRef('');
  const numberStore = useRef(0);

  if (index == 0) {
    page.current = 1;
  }

  useEffect(() => {
    onDidMount();
    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({
    getData,
  }));

  const onDidMount = async () => {
    ServicesUpdateComponent.onChange('bookmark', (event) => {
      if (event == 'BOOKMARK_STORE') {
        getData();
      }
    });
    await getMemberCodeLogin();
    await getData();
  };

  //Xóa item unBookMark :
  const unBookMarkItem = (item) => {
    let newListBookmarkShop = data;
    let check = checkItemInsideArray(newListBookmarkShop, item.code);
    if (item.bookmarked && check != -1) {
      newListBookmarkShop.splice(check, 1);
      if (newListBookmarkShop.length > 0) {
        setStateData([...newListBookmarkShop]);
      } else {
        getData();
      }
    }
  };

  //Kiểm tra xem item đã tồn tại trong mảng chưa, nếu chưa thì mới push vào mảng mới:
  const checkItemInsideArray = (myArray, code) => {
    return myArray.findIndex((item) => item.code === code);
  };

  //Lấy memberCode nếu người dùng đăng nhập:
  const getMemberCodeLogin = async () => {
    const userLoggined = await AsyncStorage.getItem(AsyncStoreKey.account);
    if (userLoggined) {
      accountLogin.current = true;
      const isMemberCode = userLoggined
        ? JSON.parse(userLoggined).memberCode
        : '';
      memberCode.current = isMemberCode;
    }
  };

  //Lấy danh sách thông báo từ API:
  const getData = async (loadRefresh) => {
    if (loadRefresh) {
      page.current = 1;
      error.current = false;
      setStateLoading(false);
      setStateIsLoadingRefresh(true);
    } else {
      error.current = false;
      setStateLoading(true);
    }
    const response = await FetchApi.getListBookMark(size.current, page.current);
    if (response && response.code == 1000 && response.status_code == 200) {
      const {content, totalPages, totalElements} = response.data;
      totalPage.current = totalPages;
      numberStore.current = totalElements;
      setStateData([...content]);
      setStateLoading(false);
      maintain.current = false;
    } else {
      if (response && response.status_code >= 500) {
        maintain.current = true;
        error.current = false;
        setStateLoading(false);
      } else {
        error.current = true;
        maintain.current = false;
        setStateLoading(false);
      }
    }
  };

  //Lấy thêm danh sách thông báo:
  const nextPage = async () => {
    setStateLoadNextPage(true);
    let nextPage = page.current + 1;
    const response = await FetchApi.getListBookMark(size.current, nextPage);
    if (response && response.status_code === 200 && response.code === 1000) {
      const {content} = response.data;
      page.current++;
      setStateData([...data, ...content]);
      setStateLoadNextPage(false);
    } else {
      error.current(true);
      setStateLoadNextPage(false);
    }
  };

  //Tải lại danh sách:
  const refreshPage = () => {
    page.current = 1;
    getData();
  };

  //Khóa Key:
  const keyExtractor = (item, index) => `${index}${item.id}`;

  //Item Noti:
  const renderItem = ({item, index}) => {
    return (
      <ItemBookMark
        bookMark
        unBookMarkItem={unBookMarkItem}
        item={item}
        index={index}
        accountLogin={accountLogin.current}
        memberCode={memberCode.current}
      />
    );
  };

  //Nội dung danh sách cửa hàng:
  const renderContent = () => {
    //Loading:
    if (loading) {
      return <Loading />;
    }

    //Hiện tại không có dữ liệu:
    if (data.length == 0 && !error.current) {
      return (
        <ReloadDataScreen
          textStyle={{fontSize: SIZE.H5 * 1.2}}
          title={'お気に入り店舗のご登録がありません。'}
          disableIcon
          disabled
        />
      );
    }

    return (
      <View>
        <FlatList
          data={data}
          contentContainerStyle={{paddingBottom: SIZE.width(15)}}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          updateCellsBatchingPeriod={100}
          initialNumToRender={5}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.2}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={() => refreshPage()}
            />
          }
          onEndReached={() => {
            if (totalPage.current > page.current && !loadNextPage) {
              nextPage();
            }
          }}
          ListFooterComponent={() => (loadNextPage ? <Loading /> : null)}
        />
      </View>
    );
  };

  //Mất mạng :
  if (error.current) {
    return (
      <NetworkError
        title={
          'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
        }
        onPress={() => onDidMount()}
      />
    );
  }

  //Bảo trì máy chủ:
  if (maintain.current) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName="只今、システムメンテナンス中です。"
          onPress={onDidMount}
        />
      </View>
    );
  }

  return <>{renderContent()}</>;
}
BookMark = forwardRef(BookMark);
export default BookMark;
