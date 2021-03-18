//Library:
import React, {useEffect, useContext, useRef} from 'react';
import {TouchableOpacity, View, Linking} from 'react-native';
import {
  COLOR,
  SIZE,
  FetchApi,
  ForgotModalService,
  AsyncStoreKey,
} from '../../../utils';
import hexToRgba from 'hex-to-rgba';
import {useNavigation} from '@react-navigation/core';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {GetTimeJapan} from '../../../utils/modules/GetTimeJapan';
import {ContextContainer} from '../../../contexts/AppContext';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';

//Component:
import {AppText} from '../../../elements/AppText';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {AppImage} from '../../../elements';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

function ItemNoti(props) {
  const {item, nameScreenDetail, index} = props;
  const {colorApp} = useContext(ContextContainer);
  const disableClickItem = useRef(false);
  const timerClick = useRef(0);
  const navigation = useNavigation();
  useEffect(() => {
    return () => {
      clearTimeout(disableClickItem.current);
    };
  }, []);

  const readNoti = async () => {
    if (!disableClickItem.current) {
      //Đếm số lượng người đọc thông báo thường không phải detail:
      if (`${item.typeOpenNoti}` !== 'VIEW_DETAIL') {
        disableClickItem.current = true;
        const response = await FetchApi.notificationDetail(item.id);
        timerClick.current = setTimeout(() => {
          disableClickItem.current = false;
        }, 1000);
      }
      //Mở PDF.
      if (`${item.typeOpenNoti}` === 'OPEN_PDF') {
        if (item.typeOpenLink === 'BROWSER') {
          Linking.canOpenURL(item.pdfUrl).then((supported) => {
            if (supported) {
              Linking.openURL(item.pdfUrl);
            } else {
              openUlrBrowser(item.pdfUrl);
            }
          });
          return;
        }
        navigation.navigate(keyNavigation.WEBVIEW, {
          data: {url: item.pdfUrl},
        });
      }
      //Mở chi tiết thông báo:
      if (`${item.typeOpenNoti}` === 'VIEW_DETAIL') {
        navigation.navigate(keyNavigation.NOTIFICATION_DETAIL, {
          data: {item, nameScreenDetail},
        });
      }

      //Mở Function:
      if (`${item.typeOpenNoti}` === 'APP_FUNCTION') {
        if (checkUserLogin(item.menuEntity.function)) {
          //MyPage:
          if (item.menuEntity.function === keyNavigation.MY_PAGE) {
            ForgotModalService.showModal('mypage');
            return;
          }
          //Bookmark:
          if (item.menuEntity.function === 'BOOKMARK_STORE') {
            navigation.navigate(keyNavigation.STORE, {
              keyActiveBookMark: 'BOOKMARK_STORE',
            });
            return;
          }
          //Thẻ thành viên:
          if (item.menuEntity.function === keyNavigation.CERTIFICATE_MEMBER) {
            const initSecure = await AsyncStorage.getItem(
              AsyncStoreKey.memmber_secure,
            );
            if (initSecure === 'secure') {
              navigation.navigate(keyNavigation.APP_INPUT_PASSWORD, {
                mode: 'memmber',
              });
            } else {
              navigation.navigate(item.menuEntity.function, {
                itemMenu: item.menuEntity,
              });
            }
          } else {
            navigation.navigate(item.menuEntity.function, {
              itemMenu: item.menuEntity,
            });
          }
        }
      }

      //Mở Webview:
      if (`${item.typeOpenNoti}` === 'OPEN_WEBVIEW') {
        const link = item.linkWebview;
        if (item.typeOpenLink === 'BROWSER') {
          Linking.canOpenURL(link).then((supported) => {
            if (supported) {
              Linking.openURL(link);
            } else {
              openUlrBrowser(link);
            }
          });
          return;
        }
        navigation.navigate(keyNavigation.WEBVIEW, {
          data: {url: link},
        });
      }
    }
  };

  //Hiển thị thời gian bắt đầu thông báo:
  const renderTimeJaPan = (time) => {
    return (
      <AppText
        style={{
          color: COLOR.black,
          fontSize: SIZE.H5 * 1.1,
          fontWeight: 'bold',
          marginLeft: SIZE.width(3),
        }}>
        {GetTimeJapan.convertTimeJaPanCreateTime(time)}
      </AppText>
    );
  };

  //Hiển thị ảnh image hoặc là icon PDF:
  const renderImagesOrIconPDF = () => {
    if (item.typeOpenNoti == 'OPEN_PDF') {
      return (
        <View
          style={{
            height: SIZE.width(20),
            marginRight: SIZE.width(2),
            marginTop: SIZE.width(-4),
          }}>
          <AntDesign
            name="pdffile1"
            size={SIZE.width(10)}
            color={COLOR.main_color_2}
          />
        </View>
      );
    }
    if (item.imageUrl) {
      return (
        <AppImage
          resizeMode="contain"
          source={{uri: item.imageUrl}}
          style={{
            height: SIZE.width(25),
            width: SIZE.width(25),
            margin: SIZE.width(3),
            borderRadius: SIZE.width(3),
          }}
        />
      );
    }
    return null;
  };
  return (
    <>
      <TouchableOpacity onPress={readNoti} activeOpacity={0.8}>
        <View
          useNativeDriver={true}
          style={{
            height: SIZE.width(30),
            width: SIZE.width(100),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor:
              index % 2 == 0
                ? hexToRgba(colorApp.activeTabBackground, '0.1')
                : '#FFFFFF',
          }}>
          <View
            style={{
              maxWidth: item.imageUrl ? SIZE.width(69) : SIZE.width(70),
            }}>
            {/* Thời gian viết thông báo */}
            {renderTimeJaPan(item.startTime)}
            {/* Tiêu đề bài viết */}
            <AppText
              style={{
                color: COLOR.black,
                fontSize: SIZE.H5 * 1.1,
                marginTop: SIZE.width(1),
                marginLeft: SIZE.width(3),
                marginBottom: SIZE.width(3),
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: '#000',
              }}>
              {item.title}
            </AppText>
          </View>
          {/* Phần hiển thị ảnh  */}
          {renderImagesOrIconPDF()}
        </View>
      </TouchableOpacity>
    </>
  );
}
export {ItemNoti};
