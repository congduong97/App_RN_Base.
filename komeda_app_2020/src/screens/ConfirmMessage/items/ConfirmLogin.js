//Library:
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//Setup:
import {COLOR, SIZE} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppHeader, AppText} from '../../../elements';

const ConfirmLogin = () => {
  const navigation = useNavigation();
  const onPressLeft = () => {
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.HOME}],
    });
  };
  return (
    <View style={styles.container}>
      <AppHeader title={'ログイン'} onPressLeft={onPressLeft} leftGoBack />
      <View
        style={{
          paddingVertical: 40,
          backgroundColor: COLOR.white,
          paddingHorizontal: 20,
        }}>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.25,
            color: '#4D4D4D',
            lineHeight: 30,
            fontFamily: 'irohamaru-Medium',
          }}>
          正常にログインが完了しました。コメダのアプリ会員サービスがご利用いただけます。
        </AppText>
      </View>
      <AppText
        onPress={onPressLeft}
        style={{
          paddingVertical: 40,
          textDecorationLine: 'underline',
          fontFamily: 'irohamaru-Medium',
          color: '#68463A',
          fontSize: SIZE.H5 * 1.25,
          textAlign: 'center',
        }}>
        アプリトップページへもどる
      </AppText>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
});
export default ConfirmLogin;
