//Library:
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {FlatList, RefreshControl, View, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import hexToRgba from 'hex-to-rgba';

//Setup:
import {AsyncStoreKey, FetchApi, SIZE, COLOR} from '../../../utils';

//Component:
import ItemListStore from './ItemStore';
import ReloadDataScreen from '../../../elements/ReloadData';
import {Loading} from '../../../elements/Loading';
import {NetworkError} from '../../../elements/NetworkError';
import {AppText} from '../../../elements/AppText';
import ModalListCityOrDistrict from './ModalListCityOrDistrict';
import {ContextContainer} from '../../../contexts/AppContext';

import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

//Screen:
function ListStore(props, ref) {
  const {colorApp} = useContext(ContextContainer);
  const location = useRef({
    latitude: '',
    longitude: '',
  });
  const {keyActiveBookMark, index} = props;
  let countTimeout = 0;
  const [loading, setStateLoading] = useState(true);
  const [isLoadingRefresh, setStateIsLoadingRefresh] = useState(false);
  const [data, setStateData] = useState([]);
  const [loadNextPage, setStateLoadNextPage] = useState(false);
  const [dataCityAndDistrict, setStateDataCityAndDistrict] = useState([]);
  const [nameCity, setStateNameCity] = useState('県名');
  const [nameDistrict, setStateNameDistrict] = useState('市区町村');
  const cityID = useRef('');
  const districtID = useRef('');
  const [keyActiveModal, setStateKeyActiveModal] = useState('');
  const modalCityOrDistrict = useRef(null);
  const page = useRef(1);
  const totalPage = useRef(1);
  const size = useRef(10);
  const error = useRef(false);
  const accountLogin = useRef(false);
  const memberCode = useRef('');
  const numberStore = useRef(0);
  const [dataDistrich, setStateDataDisTrict] = useState([]);
  if (index == 1) {
    page.current = 1;
  }
  useEffect(() => {
    ServicesUpdateComponent.onChange('CallListStore', async (event) => {
      //Tắt location đi không cấp quyền:
      if (event == 'CALL_LIST_STORE_NOT_HAVE_LOCATION') {
        let ojbLocation = {
          latitude: '',
          longitude: '',
        };
        location.current = ojbLocation;
        getData();
      }

      //Lần đầu mở location cấp quyền cho App:
      if (event == 'CALL_LIST_STORE_NEW_LOCATION') {
        setStateLoading(true);
        await getLocation();
      }
    });
    onDidMount();
    return () => {
      clearTimeout(countTimeout);
      ServicesUpdateComponent.remove('CallListStore');
    };
  }, []);

  const onDidMount = async () => {
    await getLocation();
    await getDataDropDownCityAndDistrict();
    await getMemberCodeLogin();
  };

  //Đẩy ref ra ngoài:
  useImperativeHandle(ref, () => ({
    getData,
  }));

  //Lấy vị trí hiện tại người dùng:
  const getLocation = async () => {
    const checkPerissionLocationStore = await AsyncStorage.getItem(
      AsyncStoreKey.permissionLocation,
    );
    if (keyActiveBookMark == 'BOOKMARK_STORE') {
      return;
    } else {
      if (checkPerissionLocationStore == 'GRANTED' || !keyActiveBookMark) {
        Geolocation.getCurrentPosition(
          (position) => {
            if (position) {
              let ojbLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              location.current = ojbLocation;
              setStateLoading(true);
              countTimeout = setTimeout(() => {
                getData();
              }, 500);
            }
          },
          (error) => {
            console.log('ERROR', error);
            let ojbLocation = {
              latitude: '',
              longitude: '',
            };
            location.current = ojbLocation;
            countTimeout = setTimeout(() => {
              getData();
            }, 500);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 50,
            forceRequestLocation: true,
          },
        );
      }
    }
  };

  //Lấy danh sách Dropdown chọn thành phố hoặc huyện:
  const getDataDropDownCityAndDistrict = async () => {
    const response = await FetchApi.getListCityAndDistrict();
    if (response && response.status_code == 200 && response.code == 1000) {
      setStateDataCityAndDistrict(response.data);
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
    const response = await FetchApi.getListStore(
      size.current,
      page.current,
      location.current.latitude,
      location.current.longitude,
      cityID.current,
      districtID.current,
    );
    if (response && response.code == 1000 && response.status_code == 200) {
      const {content, totalPages, totalElements} = response.data;
      totalPage.current = totalPages;
      numberStore.current = totalElements;
      setStateData([...content]);
      setStateLoading(false);
    } else {
      error.current = true;
      setStateLoading(false);
    }
  };

  //Lấy thêm danh sách thông báo:
  const nextPage = async () => {
    setStateLoadNextPage(true);
    let nextPage = page.current + 1;
    const response = await FetchApi.getListStore(
      size.current,
      nextPage,
      location.current.latitude,
      location.current.longitude,
      cityID.current,
      districtID.current,
    );
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

  //Lấy tên thành phố:
  const getNameCityAndDataDistrich = (nameCi, ciID, dataDis) => {
    setStateNameCity(nameCi);
    cityID.current = ciID;
    setStateDataDisTrict(dataDis);
  };
  //Lấy tên huyện:
  const getNameDistrict = (nameDis, disID) => {
    setStateNameDistrict(nameDis);
    districtID.current = disID;
  };

  //Ấn vào nút tìm kiếm:
  const pressSearch = () => {
    getData();
  };

  //Hiển thị số lượng cửa hàng:
  const renderNumberStore = () => {
    return (
      <View
        style={{
          width: SIZE.width(100),
          height: SIZE.width(9),
          justifyContent: 'center',
        }}>
        <AppText
          style={{
            position: 'absolute',
            right: 10,
            fontSize: SIZE.H4,
            fontWeight: 'bold',
            marginBottom: SIZE.width(1),
          }}>
          全{numberStore.current}店舗
        </AppText>
      </View>
    );
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

  //Chọn thành phố:
  const pressChooseCity = () => {
    setStateKeyActiveModal('CITY');
    modalCityOrDistrict.current.openModal();
  };

  //Chọn Huyện:
  const pressChooseDistrict = () => {
    setStateKeyActiveModal('DISTRICT');
    modalCityOrDistrict.current.openModal();
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
      <ItemListStore
        item={item}
        index={index}
        accountLogin={accountLogin.current}
        memberCode={memberCode.current}
      />
    );
  };

  //Phần chọn Dropdown hiển thị danh sách Store:
  const DropDownSearchStore = () => {
    return (
      //Chọn dropDown để tìm kiếm cửa hàng:
      <View
        style={{
          height: SIZE.width(10),
          width: SIZE.width(100),
          flexDirection: 'row',
        }}>
        {/* Nút chọn thành phố: */}
        <TouchableOpacity
          onPress={pressChooseCity}
          style={{
            width: SIZE.width(35),
            height: SIZE.width(8.5),
            backgroundColor: COLOR.white,
            marginLeft: SIZE.width(2),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: SIZE.width(0.3),
            borderColor: COLOR.grey_500,
          }}>
          <AppText numberOfLines={1} style={{maxWidth: SIZE.width(42)}}>
            {nameCity}
          </AppText>
          <View
            style={{
              height: SIZE.width(5),
              width: SIZE.width(5),
              position: 'absolute',
              right: SIZE.width(1.2),
              top: SIZE.width(1.5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AntDesign name="caretdown" color="black" size={SIZE.H5 * 1.2} />
          </View>
        </TouchableOpacity>
        {/* Nút chọn huyện */}
        <TouchableOpacity
          disabled={nameCity == '県名' ? true : false}
          onPress={pressChooseDistrict}
          style={{
            width: SIZE.width(35),
            height: SIZE.width(8.5),
            marginLeft: SIZE.width(3.5),
            backgroundColor: nameCity == '県名' ? COLOR.grey_300 : COLOR.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: SIZE.width(0.3),
            borderColor: COLOR.grey_500,
          }}>
          <AppText numberOfLines={1} style={{maxWidth: SIZE.width(22)}}>
            {nameDistrict}
          </AppText>
          <View
            style={{
              height: SIZE.width(5),
              width: SIZE.width(5),
              position: 'absolute',
              right: SIZE.width(1.2),
              top: SIZE.width(1.5),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AntDesign name="caretdown" color="black" size={SIZE.H5 * 1.2} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pressSearch}
          style={{
            height: SIZE.width(8.5),
            width: SIZE.width(19),
            marginLeft: SIZE.width(3.5),
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: SIZE.width(0.3),
            borderColor: COLOR.grey_500,
            backgroundColor: hexToRgba(colorApp.activeTabBackground, '0.3'),
          }}>
          <AppText numberOfLines={1} style={{maxWidth: SIZE.width(42)}}>
            検索
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  //Nội dung danh sách cửa hàng:
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (error.current) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => getData()}
        />
      );
    }
    if (data && data.length == 0 && !error) {
      return (
        <ReloadDataScreen
          title={'データがありません'}
          iconName={'reload'}
          onPress={this.ClickReloadDataScreen}
        />
      );
    }

    return (
      <View>
        {DropDownSearchStore()}
        <FlatList
          data={data}
          ListHeaderComponent={() => {
            return renderNumberStore();
          }}
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
        {/* Hiển thị dropDown chọn thành phố */}
        <ModalListCityOrDistrict
          ref={modalCityOrDistrict}
          dataCityAndDistrict={dataCityAndDistrict}
          keyActive={keyActiveModal}
          getNameCity={getNameCityAndDataDistrich}
          getNameDistrict={getNameDistrict}
          dataDistrichChooseCity={dataDistrich}
        />
      </View>
    );
  };

  return <>{renderContent()}</>;
}
ListStore = forwardRef(ListStore);
export default ListStore;
