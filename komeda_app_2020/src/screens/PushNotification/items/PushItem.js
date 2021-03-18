//Library:
import React, {useState} from 'react';
import {TouchableOpacity, View, Linking, StyleSheet} from 'react-native';
import {COLOR, SIZE, FetchApi} from '../../../utils';
import {useNavigation} from '@react-navigation/core';
import * as Animatable from 'react-native-animatable';
import AntDesign from 'react-native-vector-icons/AntDesign';

import moment from 'moment';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {AppText} from '../../../elements';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

function PushItem(props) {
  const {item, index, onRefresh} = props;
  const [stateViewer, setstateViewer] = useState(item.viewed);
  const navigation = useNavigation();
  const AnimatedTouch = Animatable.createAnimatableComponent(TouchableOpacity);

  const openPushItem = async () => {
    if (!stateViewer) {
      setstateViewer(true);
    }
    const response = await FetchApi.openPushNotiItem(item.id);
    if (response.code === 1019) {
      onRefresh();
      return;
    }

    if (item.typePush === 'IN_APP') {
      navigation.navigate(keyNavigation.DETAIL_PUSH, {
        data: response,
        id: item.id,
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
            if (
              Object.values(keyNavigation).includes(item.menuEntity.function)
            ) {
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
  };

  return (
    <AnimatedTouch
      onPress={openPushItem}
      style={{
        flexDirection: 'row',
        width: SIZE.width(100),
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: COLOR.grey_500,
        alignItems: 'center',
        padding: 16,

        backgroundColor:
          item.typeNotification === 'IMPORTANT' ? '#FDE7E9' : COLOR.white,
      }}>
      <View style={{flex: 0.9}}>
        <AppText
          style={{
            color:
              item.typeNotification === 'IMPORTANT' ? item.color : '#4D4D4D',
            fontSize: SIZE.H5 * 1.1,
            fontFamily: 'irohamaru-Medium',
            marginBottom: SIZE.padding,
          }}>
          {item.title}
        </AppText>
        <AppText
          style={{
            color:
              item.typeNotification === 'IMPORTANT' ? item.color : '#4D4D4D',
            opacity: item.typeNotification === 'IMPORTANT' ? 1 : 0.6,
            fontSize: SIZE.H6,
            fontFamily: 'irohamaru-Medium',
          }}>
          {moment(new Date(item.pushTime)).format('YYYY.MM.DD')}
          {!stateViewer && '   未読'}
        </AppText>
      </View>
      <View
        style={{
          flex: 0.1,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}>
        <AntDesign
          name='right'
          color={item.typeNotification === 'IMPORTANT' ? item.color : '#AFAFAF'}
          size={SIZE.H5 * 1.2}
        />
      </View>
    </AnimatedTouch>
  );
}
export default React.memo(PushItem);
