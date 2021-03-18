//Library:
import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, AsyncStoreKey, ToastService} from '../../utils';

//Component:
import OtpInput from '../../elements/OtpInput';
import {AppContainer} from '../../elements';
import {AppText} from '../../elements/AppText';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Services:
import {SecureService} from '../SecureSetting/services/SecureService';

const AppPassword = ({navigation, route}) => {
  const [pass, setPass] = useState('');
  useEffect(() => {
    getPassApp();
  }, []);
  const getPassApp = async () => {
    const passApp = await AsyncStorage.getItem(AsyncStoreKey.app_password);
    setPass(passApp);
  };

  const onChangeValue = async (value) => {
    const {index, mode} = route.params;
    if (value.length === 4) {
      if (pass === value) {
        if (mode === 'off') {
          SecureService.setMode({index, mode});
          navigation.navigate(keyNavigation.SECURE);
        }
        if (mode === 'change-pass') {
          navigation.navigate(keyNavigation.NEW_PASS, {index, mode});
        }
      } else {
        ToastService.showToast('現在のパスワードが正しくありません。');
      }
    }
  };

  return (
    <AppContainer noHeader>
      <View style={{alignSelf: 'center', marginVertical: 20}}>
        <AppText style={{fontSize: SIZE.H5 * 1.2}}>
          現在パスワードを入力してください
        </AppText>
      </View>
      <OtpInput
        style={{width: SIZE.width(70), alignSelf: 'center'}}
        maxLength={1}
        numberInput={4}
        onChangeValue={onChangeValue}
      />
    </AppContainer>
  );
};

export default AppPassword;
