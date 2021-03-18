import React from 'react';
import {TouchableOpacity, Linking} from 'react-native';
import {AppText, AppImage} from '../../../elements';
import {SIZE, COLOR, FetchApi} from '../../../utils';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';
export default function StampsItem({item}) {
  const {imageUrl, title, id} = item;
  const navigation = useNavigation();

  const onPress = async () => {
    const response = await FetchApi.openStamps(id);
    if (item.typeOpenLink === 'WEBVIEW') {
      let link = item.linkWebview || item.pdfUrl;
      navigation.navigate(keyNavigation.WEBVIEW, {
        data: {url: link},
      });
    } else {
      let link = item.linkWebview || item.pdfUrl;
      Linking.canOpenURL(link).then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
          openUlrBrowser(link);
        }
      });
    }
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginHorizontal: 8,
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
      {imageUrl && (
        <AppImage
          resizeMode={'stretch'}
          style={{
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            width: '100%',
            height: (SIZE.width(97) * 464) / 750,
          }}
          source={{uri: imageUrl}}
        />
      )}
      {!!title && (
        <AppText
          style={{
            padding: SIZE.padding,

            fontSize: SIZE.H5,
            color: '#68463A',
            marginBottom: 16,
          }}>
          {title}
        </AppText>
      )}
    </TouchableOpacity>
  );
}
