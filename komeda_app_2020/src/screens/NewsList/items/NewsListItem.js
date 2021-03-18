import React from 'react';
import {TouchableOpacity, Linking} from 'react-native';
import {AppText, AppImage} from '../../../elements';
import {SIZE, COLOR, FetchApi, checkUserLogin} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

export default function NewsListItem({item}) {
  const {url, title, id} = item;
  const navigation = useNavigation();

  const onPress = async () => {
    const response = await FetchApi.openItemNews(id);

    if (item.typeOpen === 1) {
      if (item.typeOpenLink === 1) {
        navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.link}});
      } else {
        Linking.canOpenURL(item.link).then((supported) => {
          if (supported) {
            Linking.openURL(item.link);
          } else {
            openUlrBrowser(item.link);
          }
        });
      }
    } else if (item.typeOpen === 4) {
      if (item.typeOpenLink === 1) {
        navigation.navigate(keyNavigation.WEBVIEW, {
          data: {url: item.pdfUrl},
        });
      } else {
        Linking.canOpenURL(item.pdfUrl).then((supported) => {
          if (supported) {
            Linking.openURL(item.pdfUrl);
          } else {
            openUlrBrowser(item.pdfUrl);
          }
        });
      }
    } else if (item.typeOpen === 2) {
      switch (item.customMenuDataDtoForApp.typeFunctionMenu) {
        case 'LINK_FUNCTION':
          if (checkUserLogin(item.customMenuDataDtoForApp.function)) {
            if (
              Object.values(keyNavigation).includes(
                item.customMenuDataDtoForApp.function,
              )
            ) {
              navigation.navigate(item.customMenuDataDtoForApp.function, {
                itemMenu: item.customMenuDataDtoForApp,
              });
            }
          }
          break;
        case 'WEB_VIEW':
          if (item.typeOpen === 'WEBVIEW') {
            navigation.navigate(keyNavigation.WEBVIEW, {
              data: {url: item.url},
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
    } else {
      return;
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        marginHorizontal: 8,
        // width: SIZE.width(98),
        borderRadius: 6,
        borderWidth: 1,
        marginVertical: 8,
        borderColor: COLOR.grey_400,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
      }}>
      {url && (
        <AppImage
          style={{
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            width: '100%',
            height: (SIZE.width(97) * 182) / 353,
          }}
          source={{uri: url}}
          resizeMode='stretch'
        />
      )}
      {!!title && (
        <AppText
          style={{
            padding: SIZE.padding,
            marginBottom: 16,
            fontSize: SIZE.H5,
            color: '#68463A',
          }}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}
