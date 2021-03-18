import React from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import {AppText} from './AppText';
import {AppImage} from './AppImage';
import {SIZE, COLOR, AlertService, NavigationService} from '../utils';
import {keyNavigation} from '../navigators/utils/KeyNavigation';

const ExpiredMemmber = () => {
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
            onPress={() => {
              AlertService.hideModal();
              NavigationService.navigate(keyNavigation.AUTH_NAVIGATOR, {
                screen: keyNavigation.LOGIN,
              });
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ExpiredMemmber;

const styles = StyleSheet.create({});
