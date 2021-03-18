import React, {useImperativeHandle, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Modal from 'react-native-modal';
import {SIZE, COLOR} from '../utils';
import {SafeAreaView} from 'react-native';
import {AppImage} from './AppImage';
import {AppText} from './AppText';
import {AppTextButton} from './AppTextButton';
import {keyNavigation} from '../navigators/utils/KeyNavigation';

const ExpireLoginModal = (props, ref) => {
  const [show, setShow] = useState(true);
  const navigation = useNavigation();
  useImperativeHandle(ref, () => ({setShowModal, closeModal}), []);
  const setShowModal = () => {
    setShow(true);
  };

  const closeModal = () => {
    setShow(false);
    navigation.reset({
      index: 1,
      routes: [{name: keyNavigation.GUIDE}],
    });
  };

  //Hiển thị tiêu đề:
  const renderTitle = () => {
    return (
      <AppText
        style={[
          {
            color: COLOR.red,
            fontSize: SIZE.H4 * 0.9,
            marginLeft: SIZE.width(2),
            marginRight: SIZE.width(2),
            marginBottom: SIZE.width(8),
          },
        ]}>
        ログインセッションの期限が切れました
      </AppText>
    );
  };

  //Hiển thị icon hoặc Logo App:
  const renderLogo = () => {
    return (
      <View
        style={{
          height: SIZE.width(20),
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
            height: SIZE.width(20),
            width: SIZE.width(80),
            marginBottom: SIZE.width(8),
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
              title={'ログイン'}
              textStyle={{
                fontSize: SIZE.H4 * 0.9,
                color: COLOR.white,
              }}
              onPress={closeModal}
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
export default React.forwardRef(ExpireLoginModal);
