//Library:
import React, {useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CookieManager from 'react-native-cookies';

//Setup:
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {COLOR, SIZE} from '../../../utils';

//Component:
import {AppHeader, AppText} from '../../../elements';

//Services:
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

const ConfirmDisableAccount = () => {
  const navigation = useNavigation();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    ServicesUpdateComponent.set('DISABLE_ACCOUNT_RELOAD_HOME');
    CookieManager.clearAll().then((res) => {});
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  const handleBackButton = () => {
    return true;
  };

  const onPressLeft = () => {
    navigation.reset({
      index: 0,
      routes: [{name: keyNavigation.HOME}],
    });
  };
  return (
    <View style={styles.container}>
      <AppHeader title={'退会'} onPressLeft={onPressLeft} leftGoBack />
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
          コメダ公式アプリ会員の退会が完了しました。
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: '#4D4D4D',
            lineHeight: 30,
            fontFamily: 'irohamaru-Medium',
          }}>
          再度、会員サービスをご利用いただくには新規会
          員登録が必要となりますのでご注意ください。
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
export default ConfirmDisableAccount;
