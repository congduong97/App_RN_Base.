//Library:
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {SIZE, AsyncStoreKey, ToastService} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../elements/AppText';
import {AppContainer} from '../../elements';
import OtpInput from '../../elements/OtpInput';

//Services:
import {SecureService} from '../SecureSetting/services/SecureService';

const RePass = ({navigation, route}) => {
  const [pass, setPass] = useState('');

  useEffect(() => {
    getPassApp();
  }, []);

  const getPassApp = async () => {
    const passApp = await AsyncStorage.getItem(AsyncStoreKey.app_password);
    setPass(passApp);
  };
  const onChangeValue = (value) => {
    if (value.length === 4) {
      const {index, mode, data} = route.params;

      if (value === data) {
        AsyncStorage.setItem(AsyncStoreKey.app_password, value);
        SecureService.setMode({index, mode});
        if (index === 'no' && mode === 'no') {
          navigation.navigate(keyNavigation.APP_INPUT_PASSWORD);
          return;
        }
        navigation.navigate(keyNavigation.SECURE);
        ToastService.showToast('パスワードを設定しました');
      } else {
        ToastService.showToast('パスワードに誤りがあります。');
      }
    }
  };

  return (
    <AppContainer noHeader>
      <AppText
        style={{
          alignSelf: 'center',
          marginVertical: 20,
          fontSize: SIZE.H5 * 1.2,
        }}>
        パスワードを再入力してください
      </AppText>
      <OtpInput
        style={{width: SIZE.width(70), alignSelf: 'center'}}
        maxLength={1}
        numberInput={4}
        onChangeValue={onChangeValue}
      />
    </AppContainer>
  );
};

export default RePass;
