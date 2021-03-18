//Library:
import React, {useContext} from 'react';
import {View, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  SIZE,
  COLOR,
  AsyncStoreKey,
  ForgotModalService,
  isIos,
  isAndroid,
} from '../utils';
import {keyNavigation} from './utils/KeyNavigation';
import {ContextContainer} from '../contexts/AppContext';

//Component:
import {AppImageWithTextButton} from '../elements';
import {checkUserLogin} from '../utils/modules/CheckLogin';
import {TabViewService} from '../utils/services/TabViewService';
import {openUlrBrowser} from '../utils/modules/OpenURL';

//Services:
import ServicesUpdateComponent from '../utils/services/ServicesUpdateComponent';

const BottomMenu = () => {
  const {homeBottomMenu, colorApp} = useContext(ContextContainer);
  const navigation = useNavigation();

  //Ấn vào Menu:
  const pressMenu = (item) => async () => {
    const toggleSecure = JSON.parse(
      await AsyncStorage.getItem(AsyncStoreKey.setup_secu_and_certy),
    );
    let onSecure = false;
    if (
      (isIos && toggleSecure.usingSecurityIos) ||
      (isAndroid && toggleSecure.usingSecurityAndroid)
    ) {
      onSecure = true;
    }

    ServicesUpdateComponent.set(item.function);
    switch (item.typeFunctionMenu) {
      //Chức năng:
      case 'LINK_FUNCTION':
        if (checkUserLogin(item.function)) {
          if (item.function === keyNavigation.MY_PAGE) {
            ForgotModalService.showModal('mypage');
            return;
          }
          //Chuyển đến màn hình Store và Active vào TabBookMark:
          if (item.function === 'BOOKMARK_STORE') {
            navigation.navigate(keyNavigation.STORE, {
              keyActiveBookMark: 'BOOKMARK_STORE',
            });
            TabViewService.setTab();
            return;
          }
          if (item.function === keyNavigation.CERTIFICATE_MEMBER) {
            const initSecure = await AsyncStorage.getItem(
              AsyncStoreKey.memmber_secure,
            );
            if (initSecure === 'secure' && onSecure) {
              navigation.navigate(keyNavigation.APP_INPUT_PASSWORD, {
                mode: 'memmber',
              });
            } else {
              navigation.navigate(item.function, {itemMenu: item});
            }
          } else {
            navigation.navigate(item.function, {itemMenu: item});
          }
        }
        break;

      //Mở WebView :
      case 'WEB_VIEW':
        if (item.typeOpen === 'WEBVIEW') {
          navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.url}});
        } else if (item.typeOpen === 'BROWSER') {
          Linking.canOpenURL(item.url).then((supported) => {
            if (supported) {
              Linking.openURL(item.url);
            } else {
              openUlrBrowser(item.url);
            }
          });
        }
        break;
    }
  };

  //Item:
  const renderItem = () => {
    return homeBottomMenu.map((item) => {
      return (
        <AppImageWithTextButton
          onPress={pressMenu(item)}
          textStyle={{color: COLOR.white, fontSize: SIZE.H6}}
          styleImage={{width: SIZE.width(8), height: SIZE.width(8)}}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          resizeMode="contain"
          key={item.id}
          title={item.name}
          source={{uri: item.iconUrl}}
        />
      );
    });
  };
  if (homeBottomMenu.length <= 0) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        width: SIZE.device_width,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        backgroundColor: colorApp.backgroundColorButton,
        paddingVertical: 10,
      }}>
      {renderItem()}
    </View>
  );
};

export default BottomMenu;
