//Library:
import React, {useContext, useState, useEffect, useMemo} from 'react';
import {Linking, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Setup:
import {SIZE, COLOR, NavigationService} from '../utils';
import {keyNavigation} from './utils/KeyNavigation';
import {ContextContainer} from '../contexts/AppContext';

//Component:
import {AppImageWithTextButton} from '../elements';
import {checkUserLogin} from '../utils/modules/CheckLogin';
import ServicesUpdateComponent from '../utils/services/ServicesUpdateComponent';
import * as Animatable from 'react-native-animatable';
import {BottomService} from './services/BottomService';
import {openUlrBrowser} from '../utils/modules/OpenURL';

const BottomMenu = () => {
  const {homeBottomMenu} = useContext(ContextContainer);
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(null);
  const [checkDisableAccount, setStateCheckDisableAccount] = useState(false);

  useEffect(() => {
    ServicesUpdateComponent.onChange(
      'BottomMenuCheckDisableAccount',
      (event) => {
        if (event == 'DISABLE_ACCOUNT_RELOAD_HOME') {
          setStateCheckDisableAccount(true);
        }
      },
    );

    const currentScreen = NavigationService.navigationRef.current.getCurrentRoute()
      .name;
    if (currentScreen === keyNavigation.HOME) {
      setActive(keyNavigation.HOME);
    }

    BottomService.onChangeScreen('active-bottom', setActive);
    return () => {
      BottomService.deleteKey('active-bottom');
    };
  }, []);
  const setActive = (screen) => {
    if (
      screen === keyNavigation.LOGIN ||
      screen === keyNavigation.REGISTER ||
      screen === keyNavigation.FORGOTPASSWORD ||
      screen === keyNavigation.SUB_MENU
    ) {
      setActiveIndex(null);
    }
    homeBottomMenu.forEach((item, index) => {
      switch (item.typeFunctionMenu) {
        //Chức năng:
        case 'LINK_FUNCTION':
          if (item.function === screen) {
            setActiveIndex(index);
          }
          break;
      }
    });
  };

  //Ấn vào Menu:
  const pressMenu = (item, index) => async () => {
    ServicesUpdateComponent.set(item.function);
    switch (item.typeFunctionMenu) {
      //Chức năng:
      case 'LINK_FUNCTION':
        if (checkUserLogin(item.function)) {
          if (Object.values(keyNavigation).includes(item.function)) {
            if (item.function == keyNavigation.HOME && checkDisableAccount) {
              navigation.reset({
                index: 0,
                routes: [{name: keyNavigation.HOME}],
              });
            } else {
              navigation.navigate(item.function, {itemMenu: item});
              if (index !== activeIndex) {
                setActiveIndex(index);
              }
            }
          }
        }
        break;

      //Mở WebView :
      case 'WEB_VIEW':
        if (item.typeOpen === 'WEBVIEW') {
          navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.url}});
          if (index !== activeIndex) {
            setActiveIndex(index);
          }
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
  const renderItem = useMemo(() => {
    let widthItem = 0;
    if (homeBottomMenu.length > 0) {
      widthItem = SIZE.device_width / homeBottomMenu.length;
    }

    return homeBottomMenu.map((item, index) => {
      return (
        <AppImageWithTextButton
          onPress={pressMenu(item, index)}
          textStyle={{
            color: COLOR.white,
            fontSize: widthItem / 8,
            marginHorizontal: 2,
          }}
          styleImage={{
            width: widthItem / 3,
            height: widthItem / 3,
          }}
          style={{
            backgroundColor: activeIndex === index ? '#47362B' : '#6F452F',
            marginRight: 1,
            borderColor: COLOR.white,
            width: widthItem,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}
          resizeMode='contain'
          key={item.id}
          title={item.name}
          source={{uri: item.iconUrl}}
        />
      );
    });
  }, [homeBottomMenu, activeIndex]);
  if (!homeBottomMenu && homeBottomMenu.length <= 0) {
    return null;
  }

  return (
    <Animatable.View
      useNativeDriver={true}
      animation={'fadeInUp'}
      delay={10}
      duration={500}
      style={{
        flexDirection: 'row',
        width: SIZE.device_width,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'blue',
      }}>
      {renderItem}
    </Animatable.View>
  );
};

export default BottomMenu;
