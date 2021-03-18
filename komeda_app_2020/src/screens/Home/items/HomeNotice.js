//Library:
import React, {useContext} from 'react';
import {View, TouchableOpacity, Linking, Text} from 'react-native';
import moment from 'moment';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {SIZE, FetchApi} from '../../../utils';
import {ContextContainer} from '../../../contexts/AppContext';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';
import AntDesign from 'react-native-vector-icons/AntDesign';
//Component:
import hexToRgba from 'hex-to-rgba';
import {Loading} from '../../../elements';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

const HomeNotice = ({notice}) => {
  const {colorApp} = useContext(ContextContainer);
  const navigation = useNavigation();

  //Ấn vào mở noti Home:
  const openPushItem = (item) => async () => {
    const response = await FetchApi.openPushNotiItem(item.id);
    if (response.code === 1019) {
      onRefresh();
      return;
    }

    if (item.typePush === 'IN_APP') {
      navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
        screen: keyNavigation.DETAIL_PUSH,
        params: {data: response, id: item.id},
      });

      return;
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
      navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
        screen: keyNavigation.WEBVIEW,
        params: {data: {url: item.linkWebview}},
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

      navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
        screen: keyNavigation.WEBVIEW,
        params: {data: {url: item.pdfUrl}},
      });
    } else {
      switch (item.menuEntity.typeFunctionMenu) {
        case 'LINK_FUNCTION':
          if (checkUserLogin(item.menuEntity.function)) {
            if (
              Object.values(keyNavigation).includes(item.menuEntity.function)
            ) {
              navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
                screen: item.menuEntity.function,
                params: {itemMenu: item.menuEntity},
              });
            }
          }
          break;
        case 'WEB_VIEW':
          if (item.menuEntity.typeOpen === 'WEBVIEW') {
            navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
              screen: keyNavigation.WEBVIEW,
              params: {data: {url: item.menuEntity.url}},
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
  };

  if (notice === undefined) {
    return (
      <Loading style={{height: SIZE.width(12), width: SIZE.device_width}} />
    );
  }
  if (notice === null) {
    return null;
  }
  if (!!notice) {
    return (
      <TouchableOpacity
        style={{backgroundColor: 'white'}}
        onPress={openPushItem(notice)}>
        <View
          style={{
            backgroundColor: hexToRgba('#EF6572', '0.3'),
            paddingHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
          }}>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                fontSize: SIZE.H5,
                color: '#EF6572',
                textDecorationLine: 'underline',
                lineHeight: 24,
                fontFamily: 'irohamaru-Medium',
              }}>
              {notice.title}
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <AntDesign name='right' color={'#EF6572'} size={SIZE.H5 * 1.2} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
};

export default React.memo(HomeNotice);
