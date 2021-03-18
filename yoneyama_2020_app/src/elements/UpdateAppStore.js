//Library:
import React, {useEffect} from 'react';
import {View, Dimensions, Linking, StyleSheet} from 'react-native';

//Setup:
import {COLOR, SIZE} from '../utils';
import {AppText} from './AppText';

//Component:
import {BottomService} from '../navigators/services/BottomService';
import {AppImage} from './AppImage';
import {AppTextButton} from './AppTextButton';

const {height} = Dimensions.get('window');

function UpdateAppStore(props) {
  const {messUpdate, onPress, style, textStyle, showLogo, linkStore} = props;
  useEffect(() => {
    BottomService.setDisplay(false);
    return () => {
      BottomService.setDisplay(true);
    };
  }, []);

  //Ấn vào mở Store:
  const gotoStore = () => {
    Linking.openURL(linkStore);
  };

  //Hiển thị icon hoặc Logo App:
  const renderIcon = () => {
    if (showLogo) {
      return (
        <View
          style={{
            height: SIZE.width(12),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <AppImage
            source={{
              uri:
                'https://s3-ap-northeast-1.amazonaws.com/kusuri-bucket/images/cb48df4a-3bf2-4768-97b6-360032c25701logo.png',
            }}
            style={{
              height: SIZE.icon_button * 2,
              width: SIZE.width(60),
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </View>
      );
    }
  };

  //Hiển thị tiêu đề:
  const renderTitle = () => {
    if (messUpdate) {
      return (
        <AppText
          style={[
            {
              color: COLOR.main_color,
              fontSize: SIZE.H5,
              marginLeft: SIZE.width(2),
              marginRight: SIZE.width(2),
            },
            textStyle,
          ]}>
          {messUpdate}
        </AppText>
      );
    }
  };
  return (
    <View
      onPress={onPress}
      style={[
        {
          height,
          width: SIZE.width(100),
          backgroundColor: COLOR.white,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {/* Ảnh logo App: */}
      {renderIcon()}
      {/* Tiêu đề app */}
      {renderTitle()}
      {/* Nút ấn Update App */}
      <View style={{alignItems: 'center'}}>
        <AppTextButton
          style={styles.buttonGoback}
          title={'更新する'}
          textStyle={{
            fontSize: SIZE.H4 * 0.9,
            color: COLOR.red_light,
          }}
          onPress={gotoStore}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGoback: {
    height: SIZE.width(12),
    width: SIZE.width(84),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    backgroundColor: COLOR.color_bottom_app1,
  },
});

export {UpdateAppStore};
