import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {AppHeader, AppWrapper} from '../../../elements';
import {COLOR, SIZE} from '../../../utils';
import {AppText} from '../../../elements/AppText';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

function ConfirmMessage() {
  const navigation = useNavigation();
  //Hiển thị nội dung.
  const renderContent = () => {
    return (
      <View
        style={{
          backgroundColor: COLOR.white,
          minHeight: SIZE.width(43),
        }}>
        <AppText style={styles.textTitle}>メールアドレスの認証完了。</AppText>
        <AppText style={{...styles.textTitle, marginTop: SIZE.width(6)}}>
          新規会員登録が完了しました。コメダのアプリ会員サービスがご利用いただけます。
        </AppText>
      </View>
    );
  };

  //Goback Mypage:
  const goBackMain = () => {
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.HOME}],
    });
  };

  //Ấn nút quay lại trên góc trái:
  const onPressLeft = () => {
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.HOME}],
    });
  };
  const renderButton = () => {
    return (
      <View
        style={{
          width: SIZE.width(100),
          height: SIZE.height(65),
          backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
          alignItems: 'center',
        }}>
        <AppText
          onPress={goBackMain}
          style={{
            marginTop: SIZE.width(5),
            color: COLOR.COFFEE_BROWN,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.COFFEE_BROWN,
            fontSize: SIZE.H5 * 1.25,
            fontFamily: 'irohamaru-Medium',
          }}>
          アプリトップページへもどる
        </AppText>
      </View>
    );
  };
  return (
    <View>
      <AppHeader
        title={'メールアドレス認証完了'}
        leftGoBack
        onPressLeft={onPressLeft}
      />
      {/* Hiển thị phần tiêu đề nội dung màn hình */}
      {renderContent()}
      {/* Nút ấn chuyển hướng màn hình */}
      {renderButton()}
    </View>
  );
}

export default ConfirmMessage;

const styles = StyleSheet.create({
  textTitle: {
    fontSize: SIZE.H5 * 1.1,
    marginLeft: SIZE.width(2),
    marginRight: SIZE.width(2),
    marginTop: SIZE.width(3),
    fontFamily: 'irohamaru-Medium',
    color: COLOR.COFFEE_BROWN_LIGHT,
  },
});
