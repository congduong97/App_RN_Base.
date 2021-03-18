import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {
  AppHeader,
  AppText,
  AppImageButton,
  AppTextButton,
} from '../../elements';
import {SIZE, COLOR, FetchApi, checkUserLogin, ToastService} from '../../utils';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {BookmarkService} from '../StoreBookmark/services/BookmarkService';

export default function StoreDetail({props, route}) {
  const {
    code1,
    name2,
    zipCode3,
    address6,
    phone8,
    workingTime,
    explainWorkingDay14,
    codeHoliday10,
    explainHoliday11,
    prInfo17,
    hasParkingSpace30,
    parking18,
    wifi,
    paymentMethod,
    allowSmoking28,
    hasSmokingRoom29,
    bookmarked,
    latitude15,
    longitude16,
  } = route.params.data;
  const navigation = useNavigation();
  const [liked, setLiked] = useState(bookmarked);
  const isLoading = useRef(false);
  const timer = useRef(0);
  useEffect(() => {
    BookmarkService.onChange(
      'unBookMarkInBookMark-BookMarkService',
      onChangeData,
    );
    return () => {
      clearTimeout(timer.current);
      BookmarkService.deleteKey('unBookMarkInBookMark-BookMarkService');
    };
  }, []);
  const onChangeData = (dataBookmark) => {
    // console.log('unBookMarkInBookMark-BookMarkService', dataBookmark);
    if (code1 == dataBookmark.code1 && dataBookmark.unFollowInStoreBookmarkItem) {
      console.log('unBookMarkInBookMark');
      setLiked(dataBookmark.bookmarked);
    }
  };
  const onToggle = async () => {
    if (checkUserLogin(keyNavigation.BOOKMARK_STORE)) {
      if (liked) {
        Alert.alert(
          '',
          'この店舗をお気に入りから削除しますか？',
          [
            {
              text: 'キャンセル',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: onUnFollow,
            },
          ],
          {cancelable: false},
        );
      } else {
        onFollow();
      }
    }
  };

  const onFollow = async () => {
    if (!isLoading.current) {
      isLoading.current = true;
      const res = await FetchApi.storeSetBookmarked(code1);
      if (res.success) {
        setLiked(true);
        let dataAfter = {...route.params.data, bookmarked: true};
        BookmarkService.set(dataAfter);
      } else {
        setLiked(false);
        ToastService.showToast(res.message);
      }
      timer.current = setTimeout(() => {
        isLoading.current = false;
      }, 700);
    }
  };

  const onUnFollow = async () => {
    if (!isLoading.current) {
      isLoading.current = true;
      console.log('onUnFollow');

      const res = await FetchApi.storeSetBookmarked(code1);
      if (res.success) {
        setLiked(false);
        let dataAfter = {...route.params.data, bookmarked: false};
        BookmarkService.set(dataAfter);
      } else {
        setLiked(true);
        ToastService.showToast(res.message);
      }
      timer.current = setTimeout(() => {
        isLoading.current = false;
      }, 1000);
    }
  };

  const onOpenGoogleMap = () => {
    const destination = `${latitude15}+${longitude16}`;
    const url = Platform.select({
      android: `google.navigation:q=${destination}`,
      ios: `maps://app?daddr=${destination}`,
    });
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader wrappedStyle={{paddingBottom: 0}} title={name2} leftGoBack />
      <ScrollView
        style={{backgroundColor: '#F0F0F0'}}
        contentContainerStyle={{paddingBottom: 70}}>
        {/* address, phone */}
        <AppText style={styles.bar}>住所・電話番号</AppText>
        <View
          style={{
            backgroundColor: 'white',
            width: SIZE.device_width,
            flexDirection: 'row',
            padding: SIZE.padding,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            {zipCode3 && (
              <AppText style={styles.contentText}>{zipCode3}</AppText>
            )}
            {address6 && (
              <AppText style={styles.contentText}>{address6}</AppText>
            )}
            {!!phone8 && <AppText style={styles.contentText}>{phone8}</AppText>}
          </View>
          <TouchableOpacity onPress={onOpenGoogleMap}>
            <AppImageButton
              style={{width: 26, height: 26}}
              source={require('./direction.png')}
            />
            <AppText style={{color: '#68463A', fontSize: SIZE.H6}}>
              ルート
            </AppText>
          </TouchableOpacity>
        </View>
        {/* end address, phone */}

        {/* business hours */}
        <AppText style={styles.bar}>営業時間</AppText>
        <View
          style={{
            backgroundColor: 'white',
            width: SIZE.device_width,
            padding: SIZE.padding,
            justifyContent: 'center',
          }}>
          {!!workingTime && (
            <AppText style={styles.contentText}>{workingTime}</AppText>
          )}
          {!!explainWorkingDay14 && (
            <AppText style={{color: '#4D4D4D', ...styles.contentText}}>
              {explainWorkingDay14}
            </AppText>
          )}
          {!!codeHoliday10 && (
            <AppText style={{color: '#4D4D4D', ...styles.contentText}}>
              {codeHoliday10}
            </AppText>
          )}
          {!!explainHoliday11 && (
            <AppText style={{color: '#4D4D4D', ...styles.contentText}}>
              {explainHoliday11}
            </AppText>
          )}
        </View>
        {/* end business hours */}

        {/* shop info detail */}
        <AppText style={styles.bar}>店舗詳細情報</AppText>
        <View style={{backgroundColor: 'white', paddingTop: 24}}>
          {!!prInfo17 && (
            <View
              style={{
                marginBottom: 24,
                width: SIZE.width(95),
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: COLOR.grey_300,
                borderRadius: 4,
                backgroundColor: '#FFFDF6',
              }}>
              <AppText
                style={{
                  padding: 10,
                  color: '#68463A',
                  fontSize: SIZE.H5,
                  lineHeight: SIZE.H5 * 1.6,
                  fontFamily: 'irohamaru-Medium',
                }}>
                {prInfo17}
              </AppText>
            </View>
          )}
          <View style={{...styles.box, paddingVertical: 0, paddingBottom: 20}}>
            <AppText style={styles.textTitle}>駐車場</AppText>
            <AppText style={{flex: 2, ...styles.contentText}}>
              {hasParkingSpace30}
            </AppText>
          </View>
          {!!parking18 && (
            <View
              style={{flexDirection: 'row', paddingHorizontal: SIZE.padding}}>
              <View style={{flex: 1}} />
              <AppText style={{flex: 2, color: '#4D4D4D'}}>{parking18}</AppText>
            </View>
          )}

          <View style={styles.box}>
            <AppText style={styles.textTitle}>Wifi</AppText>
            {!!wifi && wifi.length > 0 && (
              <View style={{flex: 2, flexDirection: 'row', flexWrap: 'wrap'}}>
                {wifi.map((item, index) => {
                  return (
                    <AppText
                      key={'' + index}
                      style={{
                        fontSize: SIZE.H5,
                        marginRight: SIZE.padding,
                        lineHeight: SIZE.H5 * 1.5,
                      }}>
                      {item}
                    </AppText>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.box}>
            <AppText style={styles.textTitle}>支払方法</AppText>
            {!!paymentMethod && paymentMethod.length > 0 ? (
              <View style={{flex: 2, flexDirection: 'row', flexWrap: 'wrap'}}>
                {paymentMethod.map((item, index) => {
                  return (
                    <AppText
                      key={'' + index}
                      style={{
                        fontSize: SIZE.H5,
                        marginRight: SIZE.padding,
                        lineHeight: SIZE.H5 * 1.5,
                      }}>
                      {item}
                    </AppText>
                  );
                })}
              </View>
            ) : (
              <View style={{flex: 2}}>
                <AppText
                  style={{
                    fontSize: SIZE.H5,
                    marginRight: SIZE.padding,
                    lineHeight: SIZE.H5 * 1.5,
                  }}>
                  現金のみ
                </AppText>
              </View>
            )}
          </View>
          <View style={styles.box}>
            <AppText style={{flex: 1, color: '#68463A', ...styles.textTitle}}>
              喫煙/禁煙
            </AppText>
            <View style={{flex: 2}}>
              <AppText style={{...styles.contentText, marginBottom: 4}}>
                {allowSmoking28}
              </AppText>
              {!!hasSmokingRoom29 && (
                <View style={{flexDirection: 'row'}}>
                  <AppText
                    style={{
                      ...styles.contentText,
                      marginRight: 18,
                    }}>
                    喫煙専用室
                  </AppText>
                  <AppText style={{...styles.contentText, flex: 1}}>
                    {hasSmokingRoom29}
                  </AppText>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* end shop info detail */}

        {/* follow btn */}
        <AppTextButton
          style={{
            alignItems: 'center',
            width: SIZE.width(82),
            padding: 14,
            borderWidth: 1,
            borderColor: '#FF9A27',
            backgroundColor: liked ? COLOR.white : '#FF9A27',
            marginVertical: SIZE.padding,
            borderRadius: 0,
            alignSelf: 'center',
          }}
          //   ref={(ref) => (this.btnConfirm = ref)}
          textStyle={{
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5,
            paddingVertical: 4,
            color: liked ? '#FF9A27' : COLOR.white,
          }}
          colorSpinner={COLOR.white}
          sizeSpinner={SIZE.H6}
          onPress={onToggle}
          title={
            liked ? 'お気に入り店舗を解除する' : 'お気に入り店舗に登録する'
          }
        />

        {/* navigate to bookmark */}
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: SIZE.padding,
            borderBottomWidth: 1,
            borderColor: '#68463A',
            height: undefined,
            width: undefined,
          }}
          onPress={() => {
            if (checkUserLogin(keyNavigation.BOOKMARK_STORE)) {
              navigation.navigate(keyNavigation.BOOKMARK_STORE);
            }
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              textAlign: 'center',
              color: '#68463A',
              letterSpacing: 0,
            }}>
            お気に入り店舗一覧を見る
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#68463A',
    width: SIZE.device_width,
    color: COLOR.white,
    padding: 12,
    fontSize: SIZE.H5,
  },
  contentText: {
    fontSize: SIZE.H5,
  },
  textTitle: {
    fontFamily: 'irohamaru-Medium',
    flex: 1,
    color: '#68463A',
  },
  box: {
    flexDirection: 'row',
    paddingHorizontal: SIZE.padding,
    paddingVertical: 20,
  },
});
