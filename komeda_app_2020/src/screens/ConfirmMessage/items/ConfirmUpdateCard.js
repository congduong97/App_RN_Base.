import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppHeader, AppWrapper, AppText} from '../../../elements';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {COLOR, SIZE} from '../../../utils';

const ConfirmUpdateCard = () => {
  const navigation = useNavigation();
  const onPressLeft = () => {
    navigation.reset({
      index: 1,
      routes: [
        {name: keyNavigation.HOME},
        {
          name: keyNavigation.MY_PAGE,
        },
      ],
    });
  };
  return (
    <View style={styles.container}>
      <AppHeader
        title={'KOMECA変更・削除'}
        onPressLeft={onPressLeft}
        leftGoBack
      />
      <View
        style={{
          paddingVertical: 40,
          backgroundColor: COLOR.white,
          paddingHorizontal: 20,
        }}>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.2,
            color: '#4D4D4D',
            lineHeight: 30,
            fontFamily: 'irohamaru-Medium',
            marginBottom: 30,
          }}>
          KOMECAの変更が完了しました。{'\n'}
          トップページもしくはKOMECAページより変更
          されたKOMECAのバリュー情報とポイント情報 を確認することができます。
        </AppText>
      </View>
      <AppText
        onPress={onPressLeft}
        style={{
          fontSize: SIZE.H5 * 1.25,
          textAlign: 'center',
          marginVertical: 40,
          color: '#68463A',
          fontFamily: 'irohamaru-Medium',
          textDecorationLine: 'underline',
        }}>
        マイアカウントTOPにもどる
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
export default ConfirmUpdateCard;
