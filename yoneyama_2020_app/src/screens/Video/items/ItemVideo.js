//Library:
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {YouTubeStandaloneIOS} from 'react-native-youtube';

//Setup:
import {getImageWithLinkYouTube, getIDWithLinkYouTube} from '../utils';
import {FetchApi, COLOR, isIos, SIZE, ToastService} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppImage} from '../../../elements';
import {GetTimeJapan} from '../../../utils/modules/GetTimeJapan';
import {AppText} from '../../../elements/AppText';

function ItemVideo(props) {
  const {item, index, needToken} = props;
  const navigation = useNavigation();
  const onPressVideo = async () => {
    const response = await FetchApi.countVideoClicked(item.id, needToken);
    if (response && response.message == 'Network request failed') {
      ToastService.showToast(
        'ネットワークに接続できませんでした。後でやり直してください。',
      );
      return;
    }
    if (isIos) {
      YouTubeStandaloneIOS.playVideo(getIDWithLinkYouTube(item.url));
    } else {
      navigation.navigate(keyNavigation.VIDEO_DETAIL, {
        itemVideoAndroid: item,
      });
    }
  };
  return (
    <TouchableOpacity onPress={onPressVideo} activeOpacity={0.8}>
      <View
        style={{
          width: SIZE.width(100),
          marginTop: index == 0 ? SIZE.width(2) : SIZE.width(12),
        }}>
        <AppImage
          source={{
            uri: getImageWithLinkYouTube(item.url),
          }}
          style={{width: SIZE.width(100), height: SIZE.width(70)}}
          resizeMode="contain"
        />
        <View
          style={[
            {top: SIZE.width(25), left: SIZE.width(40)},
            {
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <AntDesign name={'youtube'} size={70} color={COLOR.red} />
        </View>
      </View>
      <View>
        <AppText
          style={{
            marginLeft: SIZE.width(3),
            marginRight: SIZE.width(3),
            marginTop: SIZE.width(2),
            fontSize: SIZE.H5 * 1.2,
            fontWeight: 'bold',
          }}>
          {item.name}
        </AppText>
        <AppText style={{marginLeft: SIZE.width(3), marginTop: SIZE.width(2)}}>
          {GetTimeJapan.convertTimeJaPanCreateTime(item.createdTime)}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
export default ItemVideo;
