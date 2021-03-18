//Library:
import React, {useContext, useState, useLayoutEffect, useRef} from 'react';
import {View, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  SIZE,
  AsyncStoreKey,
  ForgotModalService,
  isIos,
  isAndroid,
} from '../../../utils';
import {AppImageWithTextButton, Loading} from '../../../elements';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import HomeNotice from './HomeNotice';
import {ContextContainer} from '../../../contexts/AppContext';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';
import {AppText} from '../../../elements/AppText';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

const HomeMenu = ({
  homeMainMenu,
  notice,
  index,
  checkStatusNotification,
  hasCoupon,
  countPushNoti,
  refreshNotiHome,
}) => {
  const {colorApp} = useContext(ContextContainer);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const checkSecurityMenu = useRef(false);

  useLayoutEffect(() => {
    checkSecurityFunctionMenu();
    if (!loading) {
      setLoading(true);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  //Xử lý thao tác chọn menu:
  const onPressItem = (item) => async () => {
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

  //Kiểm tra có hiển thị chức năng màn hình security:
  const checkSecurityFunctionMenu = async () => {
    const dataAsync = await AsyncStorage.getItem(
      AsyncStoreKey.setup_secu_and_certy,
    );
    let checkSecuMenu = JSON.parse(dataAsync);
    if (isIos) {
      if (checkSecuMenu && !checkSecuMenu.usingSecurityIos) {
        checkSecurityMenu.current = false;
      } else {
        checkSecurityMenu.current = true;
      }
    } else {
      if (checkSecuMenu && !checkSecuMenu.usingSecurityAndroid) {
        checkSecurityMenu.current = false;
      } else {
        checkSecurityMenu.current = true;
      }
    }
  };

  //Kiểm tra xem có thông báo mới không hiển thị chữ NEW:
  const renderIconNewNoti = (numberItem, keyMenuHasNew) => {
    let sizeIconNew = numberItem > 2 ? SIZE.width(6) : SIZE.width(10);
    let sizeBoderIconNew = numberItem > 2 ? SIZE.width(3) : SIZE.width(5);
    let sizeTextIconNew = numberItem > 2 ? SIZE.H5 : SIZE.H4;
    if (keyMenuHasNew) {
      return (
        <View
          style={{
            position: 'absolute',
            top: SIZE.width(2),
            right: SIZE.width(2),
            height: sizeIconNew,
            width: sizeIconNew,
            borderRadius: sizeBoderIconNew,
            borderColor: colorApp.activeTabBackground,
            alignItems: 'center',
            borderWidth: 1,
            justifyContent: 'center',
          }}>
          <AppText
            style={{
              color: colorApp.activeTabBackground,
              fontWeight: 'bold',
              fontSize: sizeTextIconNew,
            }}>
            N
          </AppText>
        </View>
      );
    }
    return null;
  };

  //Lấy chiều cao của item:
  const getHeight = (numberItem) => {
    if (numberItem === 1) {
      return SIZE.width(96);
    }
    return SIZE.width(96) / numberItem;
  };

  //Hiển thị item của menu:
  const itemMenu = (item, sizeItem, numberItem) => {
    const sizeImg = sizeItem / 2.5;
    if (item && item.typeDisplay == 'NONE') {
      return (
        <View
          key={`${index}${item.id}`}
          style={{
            flex: 1,
            backgroundColor: colorApp.backgroundColor,
          }}
        />
      );
    }

    //Item Noti:
    if (item && item.function == keyNavigation.NOTIFICATION) {
      return (
        <View key={`${index}${item.id}`}>
          <AppImageWithTextButton
            onPress={onPressItem(item)}
            style={{
              borderColor: colorApp.borderColorOutlineButton,
              borderWidth: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            styleImage={{height: sizeImg, width: sizeImg}}
            textStyle={{color: colorApp.textColor, fontSize: SIZE.H5}}
            key={item.id}
            title={item.name}
            source={{uri: item.iconUrl}}
          />
          {renderIconNewNoti(numberItem, checkStatusNotification)}
        </View>
      );
    }

    //Item Push:
    if (item && item.function == keyNavigation.PUSH_NOTIFICATION) {
      return (
        <View key={`${index}${item.id}`}>
          <AppImageWithTextButton
            onPress={onPressItem(item)}
            style={{
              borderColor: colorApp.borderColorOutlineButton,
              borderWidth: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            styleImage={{height: sizeImg, width: sizeImg}}
            textStyle={{color: colorApp.textColor, fontSize: SIZE.H5}}
            key={item.id}
            title={item.name}
            source={{uri: item.iconUrl}}
          />
          {renderIconNewNoti(numberItem, countPushNoti)}
        </View>
      );
    }

    //Item Coupon:
    if (item && item.function == keyNavigation.COUPON) {
      return (
        <View key={`${index}${item.id}`}>
          <AppImageWithTextButton
            onPress={onPressItem(item)}
            style={{
              borderColor: colorApp.borderColorOutlineButton,
              borderWidth: 1,
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            styleImage={{height: sizeImg, width: sizeImg}}
            textStyle={{color: colorApp.textColor, fontSize: SIZE.H5}}
            key={item.id}
            title={item.name}
            source={{uri: item.iconUrl}}
          />
          {renderIconNewNoti(numberItem, hasCoupon)}
        </View>
      );
    }

    return (
      <View key={`${index}${item.id}`}>
        <AppImageWithTextButton
          onPress={onPressItem(item)}
          style={{
            borderColor: colorApp.borderColorOutlineButton,
            borderWidth: 1,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          styleImage={{height: sizeImg, width: sizeImg}}
          textStyle={{color: colorApp.textColor, fontSize: SIZE.H5}}
          key={item.id}
          title={item.name}
          source={{uri: item.iconUrl}}
        />
      </View>
    );
  };

  //Hiển thị danh sách menu:
  const listItemMenu = (listItem) => {
    const numberItem = listItem.length;
    const sizeItem = getHeight(numberItem) - numberItem * SIZE.width(1);
    let listItemConvert = listItem;
    if (checkSecurityMenu.current) {
      listItemConvert = [...listItem];
    } else {
      let indexItemSecu = listItemConvert.findIndex(
        (item) => item.function == 'SECURITY',
      );
      if (indexItemSecu != -1) {
        listItemConvert = listItemConvert.splice(indexItemSecu, 1);
      }
    }
    return listItemConvert.map((item, index) => {
      return (
        <View
          key={`${index}`}
          style={{
            width: sizeItem,
            height: sizeItem,
            marginTop: SIZE.width(1),
          }}>
          {itemMenu(item, sizeItem, numberItem)}
        </View>
      );
    });
  };

  //Hiển thị item menu:
  const renderItemMenu = () => {
    const homeMainMenuCovert = [...homeMainMenu];
    return homeMainMenuCovert.map((listItem, index) => {
      return (
        <View
          key={`${index}`}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: SIZE.width(95.5),
            marginTop: SIZE.width(2),
          }}>
          {listItemMenu(listItem)}
        </View>
      );
    });
  };

  if (loading) {
    return <Loading style={{marginVertical: SIZE.height(6)}} />;
  }

  return (
    <View>
      <HomeNotice
        notice={notice}
        index={index}
        refreshNotiHome={refreshNotiHome}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginLeft: SIZE.width(2),
        }}>
        {renderItemMenu()}
      </View>
    </View>
  );
};

export default React.memo(HomeMenu);
