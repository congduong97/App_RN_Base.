//Library:
import React from 'react';
import {View, StyleSheet} from 'react-native';

//Setup:
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {COLOR, SIZE} from '../../../utils';

//Component:
import {AppHeader, AppText} from '../../../elements';
import {AccountService} from '../../../utils/services/AccountService';

const ConfirmForgotPass = () => {
  const navigation = useNavigation();
  const onPressLeft = () => {
    const checkLogin = AccountService.getAccount();
    if (checkLogin) {
      navigation.reset({
        index: 0,
        routes: [{name: keyNavigation.HOME}],
      });
    } else {
      navigation.reset({
        index: 1,
        routes: [
          {name: keyNavigation.HOME},
          {
            name: keyNavigation.LOGIN,
          },
        ],
      });
    }
  };
  return (
    <View style={styles.container}>
      <AppHeader
        title={'パスワードを忘れた方'}
        leftGoBack
        onPressLeft={onPressLeft}
      />
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
            marginBottom: 20,
          }}>
          パスワードの変更が完了しました。
        </AppText>

        <AppText
          style={{
            fontSize: SIZE.H5 * 1.25,
            color: '#4D4D4D',
            lineHeight: 40,
            fontFamily: 'irohamaru-Medium',
          }}>
          以前使用していたパスワードでのログインはでき
          ませんのでご注意ください。
        </AppText>
      </View>
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
export default ConfirmForgotPass;
