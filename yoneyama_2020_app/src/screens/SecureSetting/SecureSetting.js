//Library:
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Setup:
import {AppContainer} from '../../elements';
import {AppText} from '../../elements/AppText';
import {
  COLOR,
  SIZE,
  AsyncStoreKey,
  ForgotModalService,
  AlertService,
} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Services:
import {SecureService} from './services/SecureService';

const SecureSetting = ({navigation}) => {
  const [secureApp, setSecureApp] = useState(false);
  const [secureMember, setSecureMember] = useState(false);

  useEffect(() => {
    SecureService.onChange('secure', onChangeMode);
    getInitSecure();
  }, []);

  const onChangeMode = ({index, mode}) => {
    if (index === 0) {
      if (mode === 'on') {
        setSecureApp(true);
        AsyncStorage.setItem(AsyncStoreKey.app_secure, 'secure');
      } else {
        setSecureApp(false);
        AsyncStorage.setItem(AsyncStoreKey.app_secure, 'no_secure');
      }
    } else {
      if (mode === 'on') {
        setSecureMember(true);
        AsyncStorage.setItem(AsyncStoreKey.memmber_secure, 'secure');
      } else {
        setSecureMember(false);
        AsyncStorage.setItem(AsyncStoreKey.memmber_secure, 'no_secure');
      }
    }
  };

  const getInitSecure = async () => {
    const initSecureMember = await AsyncStorage.getItem(
      AsyncStoreKey.memmber_secure,
    );
    const initSecureApp = await AsyncStorage.getItem(AsyncStoreKey.app_secure);
    if (initSecureApp === 'secure') {
      setSecureApp(true);
    }
    if (initSecureMember === 'secure') {
      setSecureMember(true);
    }
  };

  const navigateToForgotPass = async () => {
    const pass = await AsyncStorage.getItem(AsyncStoreKey.app_password);
    if (pass === null) {
      navigation.navigate(keyNavigation.NEW_PASS, {
        index: 'no',
        mode: 'no',
      });
      return;
    }
    ForgotModalService.showModal('');
  };

  const renderAlertApp = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(248,248,248)',
          width: SIZE.width(70),
          alignSelf: 'center',
          borderRadius: SIZE.border_radius,
          overflow: 'hidden',
        }}>
        <AppText
          style={{
            marginVertical: 30,
            fontSize: SIZE.H5,
            marginHorizontal: 20,
          }}>
          パスワード認証設定をONにするにはパスワードの設定が必須です
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderColor: '#E8E9E8',
              padding: 16,
              width: '50%',
            }}
            onPress={() => {
              navigation.navigate(keyNavigation.NEW_PASS, {
                mode: 'on',
                index: 0,
              });
              setSecureApp(false);
              AlertService.hideModal();
            }}>
            <AppText
              style={{
                textAlign: 'center',
                fontSize: SIZE.H5,
                color: COLOR.blue_light_3,
              }}>
              パスワード設定
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderColor: '#E8E9E8',
              padding: 16,
              width: '50%',
            }}
            onPress={() => {
              setSecureApp(false);
              AlertService.hideModal();
            }}>
            <AppText
              style={{
                textAlign: 'center',
                fontSize: SIZE.H5,
                color: COLOR.red,
              }}>
              閉じる
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderAlertMemeber = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgb(248,248,248)',
          width: SIZE.width(70),
          alignSelf: 'center',
          borderRadius: SIZE.border_radius,
          overflow: 'hidden',
        }}>
        <AppText
          style={{
            marginVertical: 30,
            fontSize: SIZE.H5,
            marginHorizontal: 20,
          }}>
          パスワード認証設定をONにするにはパスワードの設定が必須です
        </AppText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderColor: '#E8E9E8',
              padding: 16,
              width: '50%',
            }}
            onPress={() => {
              navigation.navigate(keyNavigation.NEW_PASS, {
                mode: 'on',
                index: 1,
              });
              setSecureMember(false);
              AlertService.hideModal();
            }}>
            <AppText
              style={{
                textAlign: 'center',
                fontSize: SIZE.H5,
                color: COLOR.blue_light_3,
              }}>
              パスワード設定
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderColor: '#E8E9E8',
              padding: 16,
              width: '50%',
            }}
            onPress={() => {
              setSecureMember(false);
              AlertService.hideModal();
            }}>
            <AppText
              style={{
                textAlign: 'center',
                fontSize: SIZE.H5,
                color: COLOR.red,
              }}>
              閉じる
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const toggleSecureApp = async () => {
    const pass = await AsyncStorage.getItem(AsyncStoreKey.app_password);
    if (!secureApp) {
      setSecureApp(true);

      if (pass === null) {
        AlertService.showModal(renderAlertApp);
      } else {
        AsyncStorage.setItem(AsyncStoreKey.app_secure, 'secure');
      }
    } else {
      navigation.navigate(keyNavigation.APP_PASSWORD, {
        mode: 'off',
        index: 0,
      });
    }
  };

  const toggleSecureMember = async () => {
    const pass = await AsyncStorage.getItem(AsyncStoreKey.app_password);
    if (!secureMember) {
      setSecureMember(true);

      if (pass === null) {
        AlertService.showModal(renderAlertMemeber);
      } else {
        AsyncStorage.setItem(AsyncStoreKey.memmber_secure, 'secure');
      }
    } else {
      navigation.navigate(keyNavigation.APP_PASSWORD, {
        mode: 'off',
        index: 1,
      });
    }
  };

  const openSetPassword = async () => {
    const pass = await AsyncStorage.getItem(AsyncStoreKey.app_password);

    if (pass === null) {
      navigation.navigate(keyNavigation.NEW_PASS, {
        index: 'no',
        mode: 'new-pass',
      });
    } else {
      navigation.navigate(keyNavigation.APP_PASSWORD, {
        index: 'no',
        mode: 'change-pass',
      });
    }
  };

  return (
    <AppContainer
      goBackScreen
      haveBottom
      haveTitle
      nameScreen=" セキュリティ設定">
      <View style={styles.wrapItem}>
        <AppText style={styles.titleContent}>パスコード</AppText>
        <AppText style={styles.text}>
          パスコードをご設定いただくことで第三者による利用防止となりますのでご設定を推奨しています。
        </AppText>
      </View>
      <TouchableOpacity
        onPress={openSetPassword}
        style={[
          styles.wrapItem,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <AppText style={styles.text}>パスコード登録・変更</AppText>
        <AntDesign name="right" color={COLOR.grey_500} size={SIZE.H4} />
      </TouchableOpacity>
      <View
        style={[
          styles.wrapItem,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <AppText style={styles.text}>アプリ起動時にパスコード認証</AppText>
        <Switch value={secureApp} onValueChange={toggleSecureApp} />
      </View>
      <View
        style={[
          styles.wrapItem,
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          },
        ]}>
        <AppText style={styles.text}>会員証表示時にパスコード認証</AppText>
        <Switch value={secureMember} onValueChange={toggleSecureMember} />
      </View>

      <View style={styles.wrapItem}>
        <AppText style={styles.forgotText} onPress={navigateToForgotPass}>
          パスコードをお忘れの場合はこちら
        </AppText>
      </View>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: SIZE.H4,
    paddingVertical: 16,
  },
  wrapItem: {
    paddingVertical: 16,
    marginHorizontal: 8,
    borderBottomColor: COLOR.grey_100,
    borderBottomWidth: 1,
  },
  titleContent: {
    fontSize: SIZE.H5 * 1.2,
    fontWeight: 'bold',
    paddingBottom: 16,
  },
  text: {
    fontSize: SIZE.H5,
    color: COLOR.black_light,
  },
  forgotText: {
    color: 'blue',
    textDecorationLine: 'underline',
    alignSelf: 'flex-end',
    fontSize: SIZE.H5,
  },
});

export default SecureSetting;
