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
  const renderLogo = () => {
    return (
      <View
        style={{
          height: SIZE.width(40),
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <AppImage
          source={{
            uri:
              'https://s3-ap-northeast-1.amazonaws.com/komeda/images/c0c1e860-70ba-47bc-9ecd-222f07873ef9%E7%94%BB%E5%83%8F-11@3x.png',
          }}
          style={{
            height: SIZE.width(40),
            width: SIZE.width(40),
            marginBottom: SIZE.width(8),
            alignSelf: 'center',
          }}
          resizeMode='contain'
        />
      </View>
    );
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
              marginLeft: SIZE.width(6),
              marginRight: SIZE.width(6),
              textAlign: 'center',
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
      {renderLogo()}
      {/* Tiêu đề app */}
      {renderTitle()}
      {/* Nút ấn Update App */}
      <View style={{alignItems: 'center'}}>
        <AppTextButton
          style={styles.buttonGoback}
          title={'更新する'}
          textStyle={{
            fontSize: SIZE.H5 * 1.4,
            color: COLOR.white,
          }}
          onPress={gotoStore}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGoback: {
    height: SIZE.height(7.5),
    width: SIZE.width(84),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    backgroundColor: COLOR.COFFEE_YELLOW,
  },
});

export {UpdateAppStore};
