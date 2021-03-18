import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {AppHeader} from '../../../elements';
import {COLOR, SIZE} from '../../../utils';
import {AppText} from '../../../elements/AppText';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

function ConfirmMessage() {
  const navigation = useNavigation();
  //Hiển thị nội dung.
  const renderContent = () => {
    return (
      <View
        style={{
          marginLeft: SIZE.width(2),
          marginRight: SIZE.width(2),
          marginTop: SIZE.width(3),
          minHeight: SIZE.width(43),
        }}>
        <AppText style={styles.textTitle}>
          メールアドレスの変更が完了しました。
        </AppText>
        <AppText style={{...styles.textTitle, marginTop: SIZE.width(6)}}>
          以前使用していたメールアドレスでのログインはできませんのでご注意ください。
        </AppText>
      </View>
    );
  };

  //Ấn nút quay lại trên góc trái:
  const onPressLeft = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
    ServicesUpdateComponent.set('CHANGE_EMAIL_SUCCESS');
  };

  const renderButton = () => {
    return (
      <View
        style={{
          width: SIZE.width(100),
          height: SIZE.height(60),
          backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
          alignItems: 'center',
        }}>
        <AppText
          hitSlop={{
            top: SIZE.width(2),
            left: SIZE.width(2),
            bottom: SIZE.width(2),
            right: SIZE.width(2),
          }}
          onPress={onPressLeft}
          style={{
            marginTop: SIZE.width(5),
            color: COLOR.COFFEE_BROWN,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.COFFEE_BROWN,
            fontSize: SIZE.H5 * 1.25,
            fontFamily: 'irohamaru-Medium',
          }}>
          マイアカウントTOPにもどる
        </AppText>
      </View>
    );
  };
  return (
    <View>
      <AppHeader
        title={'パスワードを忘れた方'}
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
    marginTop: SIZE.width(3),
    fontFamily: 'irohamaru-Medium',
    color: COLOR.COFFEE_BROWN_LIGHT,
  },
});
