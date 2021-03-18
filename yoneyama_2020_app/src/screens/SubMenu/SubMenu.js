//Library:
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  Linking,
  View,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  SIZE,
  COLOR,
  versionApp,
  AsyncStoreKey,
  ForgotModalService,
  isIos,
  isAndroid,
  versionCodePush,
} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';

//Component:
import {AppText} from '../../elements/AppText';
import {AppContainer} from '../../elements';
import {checkUserLogin} from '../../utils/modules/CheckLogin';

//Services:
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import {openUlrBrowser} from '../../utils/modules/OpenURL';

const SubMenu = ({navigation, route}) => {
  const {homeSubMenu, colorApp} = useContext(ContextContainer);
  const [checkSecurityMenu, setStateCheckSecurityMenu] = useState(false);
  const homeSubConvert = useRef([...homeSubMenu]);
  const [newSubmenu, setStateNewSubmenu] = useState([]);
  const versionAppAndCodePush = `${versionApp}(${versionCodePush})`;
  useEffect(() => {
    checkSecurityFunctionMenu();
    return () => {};
  }, []);

  //Kiểm tra có hiển thị chức năng màn hình security:
  const checkSecurityFunctionMenu = async () => {
    const dataAsync = await AsyncStorage.getItem(
      AsyncStoreKey.setup_secu_and_certy,
    );
    const checkSecuMenu = JSON.parse(dataAsync);
    if (isIos) {
      if (
        checkSecuMenu &&
        !checkSecuMenu.usingSecurityIos &&
        homeSubConvert.current &&
        homeSubConvert.current.length > 0
      ) {
        let indexItemSecu = homeSubConvert.current.findIndex(
          (item) => item.function == 'SECURITY',
        );
        if (indexItemSecu != -1) {
          homeSubConvert.current.splice(indexItemSecu, 1);
        }
        setStateNewSubmenu(homeSubConvert.current);
        setStateCheckSecurityMenu(false);
      } else {
        setStateNewSubmenu(homeSubConvert.current);
        setStateCheckSecurityMenu(true);
      }
    } else {
      if (
        checkSecuMenu &&
        !checkSecuMenu.usingSecurityAndroid &&
        homeSubConvert.current &&
        homeSubConvert.current.length > 0
      ) {
        let indexItemSecu = homeSubConvert.current.findIndex(
          (item) => item.function == 'SECURITY',
        );
        if (indexItemSecu != -1) {
          homeSubConvert.current.splice(indexItemSecu, 1);
        }
        setStateNewSubmenu(homeSubConvert.current);
        setStateCheckSecurityMenu(false);
      } else {
        setStateNewSubmenu(homeSubConvert.current);
        setStateCheckSecurityMenu(true);
      }
    }
  };

  //Ấn vào menu:
  const pressItem = (item) => async () => {
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

    switch (item.typeFunctionMenu) {
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
            return;
          }
          if (item.function === keyNavigation.CERTIFICATE_MEMBER) {
            ServicesUpdateComponent.set(keyNavigation.CERTIFICATE_MEMBER);
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
      case 'WEB_VIEW':
        checkTypeOpenWeb(item);
        break;
      case 'LINK_APP':
        break;
    }
  };

  //Mở bằng trình duyệt:
  const checkTypeOpenWeb = (item) => {
    if (item.typeOpen === 'WEBVIEW') {
      navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.url}});
    } else {
      Linking.canOpenURL(item.url).then((supported) => {
        if (supported) {
          Linking.openURL(item.url);
        } else {
          openUlrBrowser(item.url);
        }
      });
    }
  };

  //Hiển thị item:
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={pressItem(item)}
        style={{
          flexDirection: 'row',
          width: SIZE.width(100),
          justifyContent: 'space-between',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderColor: COLOR.grey_500,
          alignItems: 'center',
          padding: 8,
          alignSelf: 'center',
        }}>
        <AppText style={{fontSize: SIZE.H5, marginVertical: 10}}>
          {item.name}
        </AppText>
        <AntDesign name="right" size={18} />
      </TouchableOpacity>
    );
  };

  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen={'サブメニュー'}
      style={{backgroundColor: colorApp.backgroundColor}}>
      <FlatList
        contentContainerStyle={{width: SIZE.device_width}}
        data={newSubmenu}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      />
      <View style={{padding: 12, backgroundColor: COLOR.black}}>
        <AppText
          style={{fontSize: SIZE.H4, color: COLOR.white, fontWeight: 'bold'}}>
          アプリバージョン：{versionAppAndCodePush}
        </AppText>
      </View>
    </AppContainer>
  );
};

export default withInteractionsManaged(SubMenu);
