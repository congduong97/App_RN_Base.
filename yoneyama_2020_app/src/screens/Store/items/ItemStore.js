//Library:
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import hexToRgba from 'hex-to-rgba';
//Setup:

import {SIZE, COLOR, FetchApi} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';
import {useNavigation} from '@react-navigation/core';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../../contexts/AppContext';
import {AppImage} from '../../../elements';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

function ItemListStore(props) {
  const {colorApp} = useContext(ContextContainer);
  const [isBookmark, setStateIsBookMark] = useState(null);
  const {item, index, accountLogin, memberCode} = props;
  const {code, fileUrl, latitude, longitude, distance} = item;
  const navigation = useNavigation();

  useEffect(() => {
    if (item && item.bookmarked) {
      setStateIsBookMark(true);
    } else {
      setStateIsBookMark(false);
    }
    return () => {};
  }, []);

  //Ấn vào nút đánh dấu cửa hàng:
  const pressBookMark = async () => {
    if (accountLogin) {
      alertBookMarkOrUnBookMark();
    } else {
      goToLogin();
    }
  };

  //Thông báo theo dõi hoặc bỏ theo dõi cửa hàng;
  const alertBookMarkOrUnBookMark = () => {
    if (isBookmark) {
      Alert.alert(
        'この店舗をお気に入りから削除しますか？',
        '',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => {
              setBookMarkAPI();
            },
          },
        ],
        {cancelable: false},
      );
    }

    //Bạn có muốn thêm cửa hàng này váo danh sách yêu thích.
    else {
      Alert.alert(
        'この店舗をお気に入り一覧に追加しますか？',
        '',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
          {
            text: 'OK',
            style: 'cancel',
            onPress: () => {
              setBookMarkAPI();
            },
          },
        ],
        {cancelable: false},
      );
    }
  };

  //Gọi API theo dõi hoặc bỏ theo dõi cửa hàng:
  const setBookMarkAPI = async () => {
    const response = await FetchApi.storeSetBookmarked(code, memberCode);
    if (response && response.status_code == 200 && response.code == 1000) {
      setStateIsBookMark(!isBookmark);
    } else {
      Alert.alert(
        'エラーが発生しました。',
        '',
        [
          {
            text: 'キャンセル',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  };

  //Chuyển tới màn hình Login:
  const goToLogin = () => {
    Alert.alert(
      'お知らせ',
      'ログインが必須となります。',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => {
            navigation.navigate(keyNavigation.AUTH_NAVIGATOR, {
              screen: keyNavigation.LOGIN,
              params: {
                activeOTP: '',
                account: '',
              },
            });
          },
        },
      ],
      {cancelable: false},
    );
  };

  //Gọi điện thoại :
  const pressNumberPhone = (phone) => () => {
    try {
      let number = `${phone}`.replace(/[&\/\-（）\#,+()$~%.'":*?<>{} ]/g, '');
      Linking.openURL(`tel:${number}`);
    } catch (error) {}
  };

  //Mở google Map.
  const openMapDirect = () => {
    const destination = `${latitude}+${longitude}`;
    const url = Platform.select({
      android: `google.navigation:q=${destination}`,
      ios: `maps://app?daddr=${destination}`,
    });
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          openUlrBrowser(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  //Mở google Map tarkget store:
  const openMapTargetStore = () => {
    Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
  };

  //Tính khoảng cách Km:
  const farConvert = () => {
    if (distance && distance > 0) {
      if (Math.ceil(distance) < 1000) {
        return `現在地から${Math.ceil(distance)}m`;
      } else {
        return `現在地から${Math.ceil(distance / 1000)}km`;
      }
    }
  };

  //Hiển thị tên và ảnh cửa hàng:
  const renderCardNameAndImg = () => {
    return (
      <View>
        {/* Tên cửa hàng */}
        <View
          style={{
            alignItems: 'center',
            minHeight: distance ? SIZE.width(18) : SIZE.width(12),
            justifyContent: 'center',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H4 * 1.2,
              fontWeight: 'bold',
              color: colorApp.backgroundColorButton,
              marginTop: SIZE.width(2),
            }}>
            {item.name}
          </AppText>
          {/* Khoảng cách */}
          {distance ? (
            <View
              style={{
                width: SIZE.width(100),
                flexDirection: 'row',
                marginBottom: item.urlImageMap ? SIZE.width(4) : SIZE.width(2),
                marginTop: SIZE.width(2),
              }}>
              <View style={{flex: 1}} />
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText
                  style={{
                    color: colorApp.backgroundColorButton,
                    fontSize: SIZE.H5 * 1.3,
                    fontWeight: '400',
                    right: SIZE.width(4),
                    alignSelf: 'flex-end',
                  }}>
                  {farConvert()}
                </AppText>
              </View>
            </View>
          ) : null}
        </View>

        {/* Ảnh map cửa hàng */}
        {item.urlImageMap ? (
          <TouchableOpacity onPress={openMapTargetStore}>
            <AppImage
              resizeMode={'contain'}
              source={{
                uri: item.urlImageMap,
              }}
              style={styles.imgZoom}
            />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={openMapDirect}
          style={{
            height: SIZE.width(8),
            width: SIZE.width(92),
            backgroundColor: colorApp.backgroundColorButton,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: SIZE.width(4),
            marginTop: SIZE.width(2),
          }}>
          <AppText
            style={{
              color: colorApp.textColorButton,
              fontSize: SIZE.H5,
              fontWeight: '400',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: colorApp.textColorButton,
            }}>
            この店舗までの経路を調べる
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  //Thông tin liên hệ
  const cardInfoContact = () => {
    return (
      <View style={styles.containerCard}>
        <AppText style={styles.textTitleCard}>アクセス・連絡先</AppText>
        <View style={{marginLeft: SIZE.width(5)}}>
          <View
            style={{
              width: SIZE.width(87),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {/* Mã zipCode */}
            <AppText style={styles.textInfo}>{item.zipCode}</AppText>
            {/* Theo dõi cửa hàng */}
            <TouchableOpacity
              hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
              onPress={pressBookMark}>
              <AppText style={styles.textButtonFollow}>
                {isBookmark ? 'お気に入りから削除する' : 'お気に入りに登録する'}
              </AppText>
            </TouchableOpacity>
          </View>
          {/* Địa chỉ cửa hàng: */}
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: COLOR.black,
              marginLeft: -1,
              marginTop: SIZE.width(1),
            }}>
            {item.address}
          </AppText>
          {/* Số điên thoại */}
          <TouchableOpacity onPress={pressNumberPhone(item.phone)}>
            <AppText
              style={{
                fontSize: SIZE.H5,
                color: COLOR.black,
                marginLeft: 2,
                marginTop: SIZE.width(1),
              }}>
              TEL{' '}
              <AppText style={styles.textButtonFollow}> {item.phone}</AppText>
            </AppText>
          </TouchableOpacity>
          {/* Số fax */}
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: COLOR.black,
              marginLeft: SIZE.width(1),
              marginTop: SIZE.width(1),
              marginBottom: SIZE.width(0.8),
            }}>
            FAX {item.fax}
          </AppText>
        </View>
      </View>
    );
  };

  //Thời gian làm việc:
  const renderInfoTimeWork = () => {
    return (
      <View style={styles.containerCard}>
        <AppText style={styles.textTitleCard}>営業時間</AppText>
        <View style={{marginLeft: SIZE.width(6)}}>
          <AppText style={styles.textInfo}>{item.workingTime}</AppText>
        </View>
      </View>
    );
  };

  //Đọc thông báo tờ rơi:
  const pressReadFlyer = () => {
    navigation.navigate(keyNavigation.WEBVIEW, {data: {url: fileUrl}});
  };

  //Catalog bảng phiếu giảm giá:
  const renderKataLogFlyers = () => {
    return (
      <View style={styles.containerCard}>
        <AppText style={styles.textTitleCard}>チラシ</AppText>
        <TouchableOpacity
          onPress={pressReadFlyer}
          disabled={fileUrl ? false : true}
          style={{
            height: SIZE.width(8),
            width: SIZE.width(92),
            backgroundColor: fileUrl ? colorApp.backgroundColorButton : null,
            alignItems: fileUrl ? 'center' : null,
            justifyContent: 'center',
            marginTop: SIZE.width(2),
            marginBottom: SIZE.width(2),
          }}>
          <AppText
            style={{
              marginLeft: fileUrl ? null : SIZE.width(6),
              color: fileUrl ? colorApp.textColorButton : COLOR.black,
              fontSize: SIZE.H5,
              fontWeight: '400',
              textDecorationLine: fileUrl ? 'underline' : null,
              textDecorationStyle: fileUrl ? 'solid' : null,
              textDecorationColor: fileUrl ? colorApp.textColorButton : null,
            }}>
            {fileUrl
              ? '掲載中のチラシはこちら'
              : '現在、掲載中のチラシはありません'}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  //Ngày nghỉ:
  const renderInfoTimeVacation = () => {
    return (
      <View style={styles.containerCard}>
        <AppText style={styles.textTitleCard}>定休日</AppText>
        <View style={{marginLeft: SIZE.width(6)}}>
          <AppText style={styles.textInfo}>{item.dayOff}</AppText>
        </View>
      </View>
    );
  };

  //Xử lý sản phẩm:
  const renderInfoProductHandling = () => {
    return (
      <View style={styles.containerCard}>
        <AppText style={styles.textTitleCard}>取扱商品</AppText>
        <View style={{marginLeft: SIZE.width(6)}}>
          <AppText style={styles.textInfo}>{item.productHandle}</AppText>
        </View>
      </View>
    );
  };

  //Thông tin bãi đỗ xe:
  const renderInfoParking = () => {
    return (
      <View
        style={{
          width: SIZE.width(92),
          borderBottomColor: item.otherInfo
            ? COLOR.grey_400
            : hexToRgba(colorApp.activeTabBackground, '0.3'),
          borderBottomWidth: item.otherInfo ? 2 : 0,
          marginBottom: item.otherInfo ? 0 : SIZE.width(2),
          marginLeft: SIZE.width(4),
        }}>
        <AppText style={styles.textTitleCard}>駐車場</AppText>
        <View style={{marginLeft: SIZE.width(6)}}>
          <AppText style={styles.textInfo}>{item.parking}</AppText>
        </View>
      </View>
    );
  };

  //Thông tin khác:
  const renderInfoOther = () => {
    if (item.otherInfo) {
      return (
        <View
          style={{
            width: SIZE.width(92),
            marginLeft: SIZE.width(4),
            marginBottom: SIZE.width(2),
          }}>
          <AppText style={styles.textTitleCard}>その他</AppText>
          <View style={{marginLeft: SIZE.width(6)}}>
            <AppText style={styles.textInfo}>{item.otherInfo}</AppText>
          </View>
        </View>
      );
    }
    return null;
  };

  //Các thông tin về cửa hàng:
  const renderInfoStore = () => {
    return (
      <>
        {/* Thông tin về số điện thoại,mã fax: */}
        {cardInfoContact()}
        {/* Thông tin giờ làm việc */}
        {renderInfoTimeWork()}
        {/* Thông tin phiếu giảm giá */}
        {renderKataLogFlyers()}
        {/* Thời gian nghỉ lễ */}
        {renderInfoTimeVacation()}
        {/* Xử lí sản phẩm */}
        {renderInfoProductHandling()}
        {/* Thông tin về bãi đỗ xe */}
        {renderInfoParking()}
        {/* Thông tin khác về cửa hàng */}
        {renderInfoOther()}
      </>
    );
  };

  return (
    <View
      style={[
        {
          width: SIZE.width(100),
          backgroundColor:
            index % 2 == 0
              ? hexToRgba(colorApp.activeTabBackground, '0.3')
              : COLOR.white,
        },
      ]}>
      {/* Tên cửa hàng */}
      {renderCardNameAndImg()}
      {/* Thông tin cửa hàng */}
      {renderInfoStore()}
    </View>
  );
}

const styles = StyleSheet.create({
  imgZoom: {
    height: SIZE.width(60),
    width: SIZE.width(96),
    marginLeft: SIZE.width(2),
  },
  buttonOpenMap: {
    height: SIZE.width(10),
    width: SIZE.width(92),
    backgroundColor: '#B6D7A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZE.width(4),
  },
  textButton: {
    fontSize: 20,
    fontWeight: '400',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#000',
  },
  containerCard: {
    width: SIZE.width(92),
    borderBottomColor: COLOR.grey_400,
    borderBottomWidth: 2,
    marginLeft: SIZE.width(4),
  },
  textTitleCard: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginTop: SIZE.width(3),
  },
  textInfo: {
    fontSize: 16,
    color: COLOR.black,
    marginLeft: 0,
    marginTop: SIZE.width(1),
    marginBottom: SIZE.width(0.8),
  },
  textButtonFollow: {
    color: '#3D4DFC',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: '#3D4DFC',
  },
});
export default ItemListStore;
