import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import {COLOR, SIZE, FetchApi, checkUserLogin, isIos} from '../../utils';
import {
  AppHeader,
  SearchBar,
  AppIcon,
  Loading,
  AppText,
  DataNull,
  ErrorView,
} from '../../elements';
import Geolocation from 'react-native-geolocation-service';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import ItemStore from './items/ItemStore';
import StoreMap from './items/StoreMap';
import {BookmarkService} from '../StoreBookmark/services/BookmarkService';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import AsyncStorage from '@react-native-community/async-storage';
import {NetworkError} from '../../elements/NetworkError';
import {STRING} from '../../utils/constants/String';

export default function Store(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loadingWrapper, setLoadingWrapper] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const coords = useRef({latitude: null, longitude: null});
  const location = useRef('undetermined');
  const data = useRef([]);
  const page = useRef({size: 15, number: 1, last: false});
  const error = useRef({status: false, message: ''});
  const dataFilter = useRef('');
  const timeout = useRef(0);
  const timeoutLoadmore = useRef(0);
  const flatlistRef = useRef();

  useEffect(() => {
    BookmarkService.onChange('Store-BookmarkService', onChangeData);
    const check = async () => {
      let checkFirstTimeRequest = await AsyncStorage.getItem(
        'REQUEST_LOCATION',
      );
      let checkLocationInUse;
      if (isIos) {
        checkLocationInUse = await Permissions.check(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        );
      } else {
        checkLocationInUse = await Permissions.check(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
      }
      location.current = checkLocationInUse;
      if (!checkFirstTimeRequest) {
        AsyncStorage.setItem('REQUEST_LOCATION', 'true');
        Permissions.request('location')
          .then((response) => {
            location.current = response;
            getMyLocation();
          })
          .catch((e) => console.log(e));
      } else {
        if (checkLocationInUse === 'granted') {
          getMyLocation();
        } else {
          onDidMount();
        }
      }
    };
    check();
    return () => {
      BookmarkService.deleteKey('Store-BookmarkService');
      timeoutLoadmore.current && clearTimeout(timeoutLoadmore.current);
      timeout.current && clearTimeout(timeout.current);
    };
  }, []);

  const onChangeData = (dataBookmark) => {
    let index = data.current.findIndex(
      (item, idx) => item.code1 === dataBookmark.code1,
    );
    if (index > -1) {
      data.current[index].bookmarked = dataBookmark.bookmarked;
    }
  };

  const onDidMount = async () => {
    if (!loadingWrapper) {
      setLoadingWrapper(true);
    }
    await fetchData();
    setLoadingWrapper(false);
  };

  const checkPermission = async () => {
    let checkLocationInUse;
    if (isIos) {
      checkLocationInUse = await Permissions.check(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
    } else {
      checkLocationInUse = await Permissions.check(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
    }
    location.current = checkLocationInUse;
    if (checkLocationInUse === 'granted') {
      getMyLocation();
    } else {
      requestPermisson();
    }
  };

  const requestPermisson = async () => {
    Permissions.request(
      isIos
        ? 'ios.permission.LOCATION_WHEN_IN_USE'
        : 'android.permission.ACCESS_FINE_LOCATION',
    )
      .then((response) => {
        if (
          location.current === 'unavailable' ||
          location.current === 'blocked'
        ) {
          alertForLocationPermission();
        } else {
          getMyLocation();
        }
      })
      .catch((e) => console.log(e));
  };

  const alertForLocationPermission = () => {
    Alert.alert(
      'コメダ珈琲店“に位置情報の利用を許可しますか？',
      '近くの店舗を表示するため位置情報を取得します。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {text: 'OK', onPress: Permissions.openSettings},
      ],
    );
  };

  const getMyLocation = () => {
    if (!loadingWrapper) {
      setLoadingWrapper(true);
    }
    Geolocation.getCurrentPosition(
      async (position) => {
        coords.current.latitude = position.coords.latitude;
        coords.current.longitude = position.coords.longitude;
        //call api
        data.current = [];
        page.current.number = 1;
        page.current.last = false;
        await fetchData();
        setLoadingWrapper(false);
      },
      async (error) => {
        data.current = [];
        page.current.number = 1;
        page.current.last = false;
        await fetchData();
        setLoadingWrapper(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 1000,
        forceRequestLocation: true,
      },
    );
  };

  const fetchData = async () => {
    let result = await FetchApi.getListStore(
      page.current.size,
      page.current.number,
      coords.current.latitude,
      coords.current.longitude,
      dataFilter.current,
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
    if (loading || refreshing || page.current.last) {
      return;
    }
    try {
      let result;
      setLoading(true);
      result = await FetchApi.getListStore(
        page.current.size,
        page.current.number,
        coords.current.latitude,
        coords.current.longitude,
        dataFilter.current,
      );
      if (result.success && result.data) {
        data.current = [...data.current, ...result.data.content];
        page.current.number = page.current.number + 1;
        page.current.last = result.data.last;
        timeoutLoadmore.current = setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    } catch {}
  };

  const navToBookMark = () => {
    if (checkUserLogin(keyNavigation.BOOKMARK_STORE)) {
      navigation.navigate(keyNavigation.BOOKMARK_STORE);
    }
  };

  const onChangeText = (text) => {
    dataFilter.current = text;
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      page.current.number = 1;
      data.current = [];
      onDidMount();
      flatlistRef.current &&
        flatlistRef.current.scrollToOffset({y: 0, animated: false});
    }, 1000);
  };

  const renderItem = ({item, index}) => {
    return <ItemStore data={item} index={index} />;
  };

  const renderHeader = () => {
    if (dataFilter.current) {
      return null;
    }
    return (
      <View>
        {coords.current.latitude ? (
          <StoreMap data={coords.current} markers={data.current} />
        ) : (
          renderNotAllowLocation()
        )}
        <TouchableOpacity
          onPress={navToBookMark}
          activeOpacity={0.8}
          style={{
            marginVertical: SIZE.padding,
            padding: SIZE.padding,
            backgroundColor: COLOR.white,
            paddingHorizontal: SIZE.padding,
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomColor: COLOR.grey_300,
            flexDirection: 'row',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: '#FF9A27',
              marginLeft: SIZE.padding,
              flex: 1,
              fontFamily: 'irohamaru-Medium',
            }}>
            お気に入り店舗一覧
          </AppText>
          <AppIcon
            type={'Entypo'}
            icon={'chevron-thin-right'}
            iconColor={'#FF9A27'}
            iconSize={24}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderLoading = () => {
    if (loading) {
      return <Loading />;
    }
    return null;
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return <DataNull style={{marginTop: 120}} title='データがありません' />;
  };

  const renderNotAllowLocation = () => {
    return (
      <View
        style={{
          width: SIZE.device_width,
          height: SIZE.device_width / 1.55,
          backgroundColor: '#47362B',
          padding: 50,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText
          style={{
            color: COLOR.white,
            textAlign: 'center',
            fontSize: SIZE.H5,
            lineHeight: SIZE.H5 * 2,
          }}>
          位置情報が許可されていないため{'\n'}
          現在地を表示できません
        </AppText>
        <TouchableOpacity
          onPress={checkPermission}
          activeOpacity={0.8}
          style={{
            width: SIZE.width(66),
            marginVertical: SIZE.padding,
            paddingVertical: SIZE.padding,
            paddingHorizontal: 12,
            backgroundColor: COLOR.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomColor: COLOR.grey_300,
            flexDirection: 'row',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: '#68463A',
              fontFamily: 'irohamaru-Medium',
              textAlign: 'center',
            }}>
            位置情報を許可する
          </AppText>
        </TouchableOpacity>
      </View>
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
      <AppHeader title={'店舗検索'} leftGoBack />
      <SearchBar
        styleWrap={{width: SIZE.device_width}}
        placeholder='店舗名・地名・住所でさがす'
        onChangeText={onChangeText}
      />
      {loadingWrapper && <Loading style={{flex: 1}} />}
      {!loadingWrapper && (
        <>
          <View style={{backgroundColor: COLOR.grey_100, flex: 1}}>
            {error.current.status ? (
              renderError()
            ) : (
              <FlatList
                ref={flatlistRef}
                contentContainerStyle={{paddingBottom: 150}}
                keyExtractor={(item, index) =>
                  `${item.code1}-${item.bookmarked}`
                }
                data={data.current}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                removeClippedSubviews={false}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                  <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                  />
                }
                onEndReachedThreshold={0.7}
                onEndReached={onLoadMore}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderLoading}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
}
