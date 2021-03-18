//Library:
import React, {useImperativeHandle, useState, useEffect} from 'react';
import {View, StyleSheet,SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Modal from 'react-native-modal';
import CookieManager from 'react-native-cookies';

//Setup:
import {SIZE, COLOR, AccountLocal} from '../utils';
import {keyNavigation} from '../navigators/utils/KeyNavigation';

//Component:
import {AppTextButton} from './AppTextButton';
import {AppImage} from './AppImage';
import {AppText} from './AppText';

//Services:
import {AccountService} from '../utils/services/AccountService';

const ExpireLoginModal = (props, ref) => {
  const [show, setShow] = useState(true);
  const navigation = useNavigation();
  useImperativeHandle(ref, () => ({setShowModal, closeModal}), []);
  const setShowModal = () => {
    setShow(true);
  };
  useEffect(() => {
    removeAcount();
  }, []);

  const removeAcount = async () => {
    CookieManager.clearAll()
    .then((res) => {
     });
    await AccountLocal.remove();
    AccountService.init();

  };

  const closeModal = () => {
    setShow(false);
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.MAIN_NAVIGATOR}],
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
            fontFamily: 'irohamaru-Medium',
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
              title={'ログイン'}
              textStyle={{
                fontSize: SIZE.H5 * 1.2,
                color: COLOR.white,
                fontFamily: 'irohamaru-Medium',
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
    height: SIZE.height(7.5),
    width: SIZE.width(84),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    backgroundColor: COLOR.COFFEE_YELLOW,
  },
});
export default React.forwardRef(ExpireLoginModal);
