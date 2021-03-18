//Library:
import React, {useEffect, useRef} from 'react';
import {TouchableOpacity, Animated, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import * as Animatable from 'react-native-animatable';

//Setup:
import {AppImage, AppText} from '../../../elements';
//Component:
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {checkUserLogin} from '../../../utils';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

function HomeItemMenu(props) {
  const navigation = useNavigation();
  const {item, heightItem, widthItem} = props;

  //Click item menu:
  const onPressItem = (item) => async () => {
    switch (item.typeFunctionMenu) {
      case 'LINK_FUNCTION':
        if (checkUserLogin(item.function)) {
          if (Object.values(keyNavigation).includes(item.function)) {
            navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
              screen: item.function,
              params: {itemMenu: item},
            });
          }
        }
        break;
      case 'WEB_VIEW':
        if (item.typeOpen === 'WEBVIEW') {
          navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
            screen: keyNavigation.WEBVIEW,
            params: {data: {url: item.url}},
          });
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
  return (
    <Animatable.View
      animation='fadeIn'
      // delay={(rowIndex + index) * 120}
      // duration={400}
      useNativeDriver={true}>
      <TouchableOpacity
        onPress={onPressItem(item)}
        style={{overflow: 'hidden'}}>
        <AppImage
          resizeMethod={'contain'}
          source={{uri: item.iconUrl}}
          style={{
            height: heightItem,
            width: widthItem,
          }}
        />
        <AppText
          style={{
            fontSize: widthItem * 0.13,
            textAlign: 'center',
            color: '#68463A',
            position: 'absolute',
            fontFamily: 'irohamaru-Medium',
            top: 20,
            width: '100%',
            paddingHorizontal: 12,
          }}>
          {item.name}
        </AppText>
      </TouchableOpacity>
    </Animatable.View>
  );
}

export {HomeItemMenu};
