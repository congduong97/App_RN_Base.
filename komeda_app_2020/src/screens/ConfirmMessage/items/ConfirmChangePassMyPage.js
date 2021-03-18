//Library:
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';
//Setup:
import {AppHeader} from '../../../elements';
import {COLOR, SIZE} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

function ConfirmChangePassMyPage() {
  const navigation = useNavigation();
  //Hiển thị nội dung.
  const renderContent = () => {
    return (
      <View
        style={{
          minHeight: SIZE.width(43),
          backgroundColor: COLOR.white,
        }}>
        <AppText style={styles.textTitle}>
          パスワードの変更が完了しました。
        </AppText>
        <AppText style={{...styles.textTitle, marginTop: SIZE.width(6)}}>
          以前使用していたパスワードでのログインはでき
          ませんのでご注意ください。
        </AppText>
      </View>
    );
  };

  //Goback Mypage:
  const goBackMygage = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
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
          onPress={goBackMygage}
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
        title={'パスワードの変更'}
        leftGoBack
        onPressLeft={goBackMygage}
      />
      {/* Hiển thị phần tiêu đề nội dung màn hình */}
      {renderContent()}
      {/* Nút ấn chuyển hướng màn hình */}
      {renderButton()}
    </View>
  );
}

export default ConfirmChangePassMyPage;

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
