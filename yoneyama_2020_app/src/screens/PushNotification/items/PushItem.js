//Library:
import React, {useContext, useRef, useEffect} from 'react';
import {View, Linking, TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/core';
import hexToRgba from 'hex-to-rgba';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  SIZE,
  COLOR,
  FetchApi,
  ForgotModalService,
  AsyncStoreKey,
} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import {AppImage} from '../../../elements';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';
import {AppText} from '../../../elements/AppText';
import {GetTimeJapan} from '../../../utils/modules/GetTimeJapan';
import PushNotification from 'react-native-push-notification';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

const PushItem = ({item, index}) => {
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const disableClickItem = useRef(false);
  const timerClick = useRef(0);
  useEffect(() => {
    return () => {
      clearTimeout(timerClick.current);
    };
  }, []);
  const onPressItem = async () => {
    if (!disableClickItem.current) {
      if (index === 0) {
        PushNotification.setApplicationIconBadgeNumber(0);
      }
      if (item.typePush === 'IN_APP') {
        navigation.navigate(keyNavigation.DETAIL_PUSH, {
          id: item.id,
        });
        return;
      } else {
        disableClickItem.current = true;
        FetchApi.openPushNotiItem(item.id);
        timerClick.current = setTimeout(() => {
          disableClickItem.current = false;
        }, 1000);
      }

      //Webview:
      if (item.typePush === 'WEB_VIEW') {
        if (item.typeOpenLink === 'BROWSER') {
          Linking.canOpenURL(item.linkWebview).then((supported) => {
            if (supported) {
              Linking.openURL(item.linkWebview);
            } else {
              openUlrBrowser(item.linkWebview);
            }
          });
          return;
        }
        navigation.navigate(keyNavigation.WEBVIEW, {
          data: {url: item.linkWebview},
        });
      } else if (item.typePush === 'PDF') {
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
      } else {
        switch (item.menuEntity.typeFunctionMenu) {
          case 'LINK_FUNCTION':
            if (checkUserLogin(item.menuEntity.function)) {
              //MyPage:
              if (item.menuEntity.function === keyNavigation.MY_PAGE) {
                ForgotModalService.showModal('mypage');
              }
              //Bookmark:
              else if (item.menuEntity.function === 'BOOKMARK_STORE') {
                navigation.navigate(keyNavigation.STORE, {
                  keyActiveBookMark: 'BOOKMARK_STORE',
                });
              }
              //Thẻ thành viên:
              else if (
                item.menuEntity.function === keyNavigation.CERTIFICATE_MEMBER
              ) {
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
            break;
          case 'WEB_VIEW':
            if (item.menuEntity.typeOpen === 'WEBVIEW') {
              navigation.navigate(keyNavigation.WEBVIEW, {
                data: {url: item.menuEntity.url},
              });
            } else if (item.menuEntity.typeOpen === 'BROWSER') {
              Linking.canOpenURL(item.menuEntity.url).then((supported) => {
                if (supported) {
                  Linking.openURL(item.menuEntity.url);
                } else {
                  openUlrBrowser(item.menuEntity.url);
                }
              });
            }
        }
      }
    }
  };

  if (item.typePush === 'PDF') {
    return (
      <TouchableOpacity
        onPress={onPressItem}
        style={{
          padding: 16,
          backgroundColor:
            index % 2 === 0
              ? hexToRgba(colorApp.activeTabBackground, '0.1')
              : 'transparent',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 0.96}}>
            {/* Thời gian */}
            <AppText
              style={{
                color: COLOR.black,
                fontSize: SIZE.H5 * 1.1,
                fontWeight: 'bold',
              }}>
              {GetTimeJapan.convertTimeJaPanCreateTime(item.pushTime)}
            </AppText>
            {/* Tiêu đề */}
            <AppText
              style={{
                fontSize: SIZE.H5,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
                marginTop: SIZE.width(1),
              }}>
              {item.title}
            </AppText>
            {/* Miêu tả ngắn */}
            <AppText
              style={{
                fontSize: SIZE.H6,
                marginTop: SIZE.width(2),
              }}>
              {item.shortDescription}
            </AppText>
          </View>
          {/* Icon PDF */}
          <View
            style={{
              height: SIZE.width(20),
              marginRight: SIZE.width(-1),
            }}>
            <AntDesign
              name="pdffile1"
              size={SIZE.width(10)}
              color={COLOR.main_color_2}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPressItem}
      style={{
        flexDirection: 'row',
        padding: 16,
        backgroundColor:
          index % 2 === 0
            ? hexToRgba(colorApp.activeTabBackground, '0.1')
            : 'transparent',
      }}>
      <View style={{flex: 0.9}}>
        {/* Thời gian */}
        <AppText
          style={{
            color: COLOR.black,
            fontSize: SIZE.H5 * 1.1,
            fontWeight: 'bold',
          }}>
          {GetTimeJapan.convertTimeJaPanCreateTime(item.pushTime)}
        </AppText>
        {/* Tiêu đề */}
        <AppText
          style={{
            fontSize: SIZE.H5,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            marginTop: SIZE.width(1),
          }}>
          {item.title}
        </AppText>
        {/* Miêu tả ngắn */}
        <AppText
          style={{
            fontSize: SIZE.H6,
            marginTop: SIZE.width(2),
          }}>
          {item.shortDescription}
        </AppText>
      </View>

      {item.imageUrl ? (
        <AppImage
          resizeMode="cover"
          source={{uri: item.imageUrl}}
          style={{
            width: SIZE.width(20),
            height: SIZE.width(20),
            borderRadius: 8,
          }}
        />
      ) : (
        <View style={{height: SIZE.width(20)}} />
      )}
    </TouchableOpacity>
  );
};

export default React.memo(PushItem);
