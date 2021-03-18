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
              marginLeft: SIZE.width(6),
              marginRight: SIZE.width(6),
              textAlign: 'center',
            },
          ]}>
          {messUpdate}
        </AppText>
      );
    }
  };
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

  return (
    <Modal
      backdropOpacity={0.2}
      hideModalContentWhileAnimating={true}
      animationOut='fadeOut'
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
                fontSize: SIZE.H5 * 1.2,
                fontFamily: 'irohamaru-Medium',
                color: COLOR.COLOR_WHITE,
              }}
              onPress={gotoStore}
            />
            {/* Nút ấn tiếp tục xử dụng app */}
            <AppTextButton
              style={{...styles.buttonGoback, backgroundColor: COLOR.grey_400}}
              title={'スキップ'}
              textStyle={{
                color: COLOR.COFFEE_BROWN,
                fontSize: SIZE.H5 * 1.2,
                fontFamily: 'irohamaru-Medium',
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
    height: SIZE.height(7.5),
    width: SIZE.width(84),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    backgroundColor: COLOR.COFFEE_YELLOW,
  },
});
export default React.forwardRef(ModalUpdateAppStore);
