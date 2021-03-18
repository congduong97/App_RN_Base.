import React, {useImperativeHandle, useState} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import {SIZE, COLOR, AsyncStoreKey} from '../utils';
import {SafeAreaView} from 'react-native';
import {AppImage} from './AppImage';
import {AppText} from './AppText';
import {AppTextButton} from './AppTextButton';

const ModalUpdateAppStore = (props, ref) => {
  const [show, setShow] = useState(true);
  const {messUpdate, linkStore, versionAppStore, onDidMount} = props;
  useImperativeHandle(ref, () => ({setShowModal, closeModal}), []);
  const setShowModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
  };

  //Ấn vào tiếp tục xử dụng App:
  const skipUpdateApp = () => {
    AsyncStorage.setItem(
      AsyncStoreKey.onPressSkipUpdateVersion,
      'SKIP_VERSION_USING_APP',
    );
    AsyncStorage.setItem(AsyncStoreKey.versionUpdateSkip, `${versionAppStore}`);
    onDidMount();
    setShow(false);
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
          ]}>
          {messUpdate}
        </AppText>
      );
    }
  };
  //Ấn vào mở Store:
  const gotoStore = () => {
    Linking.openURL(linkStore).catch((error) => {});
  };

  //Hiển thị icon hoặc Logo App:
  const renderLogo = () => {
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
  };
  return (
    <Modal
      backdropOpacity={0.2}
      hideModalContentWhileAnimating={true}
      animationOut="fadeOut"
      animationInTiming={300}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={300}
      isVisible={show}
      deviceHeight={SIZE.device_height}
      deviceWidth={SIZE.device_width}
      style={{
        margin: 0,
      }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLOR.white,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View>
          {/* Logo App */}
          {renderLogo()}
          {/* Thông báo mess */}
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
            {/* Nút ấn tiếp tục xử dụng app */}
            <AppTextButton
              style={{...styles.buttonGoback, backgroundColor: COLOR.grey_400}}
              title={'スキップ'}
              textStyle={{
                color: COLOR.black,
                fontSize: SIZE.H4 * 0.9,
              }}
              onPress={skipUpdateApp}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
export default React.forwardRef(ModalUpdateAppStore);
