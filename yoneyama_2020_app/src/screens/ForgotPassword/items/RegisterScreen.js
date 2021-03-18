//Library:
import React, {useRef, useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import hexToRgba from 'hex-to-rgba';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {AppTextButton} from '../../../elements';
import {SIZE, COLOR, FetchApi, Validate, AsyncStoreKey} from '../../../utils';

//Component:
import AppTextInput from '../../../elements/AppTextInput';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {ToastModal} from '../utils/ToastModal';
import {AppText} from '../../../elements/AppText';
import {ContextContainer} from '../../../contexts/AppContext';

//Services:
import {AccountService} from '../../../utils/services/AccountService';

const RegisterScreen = ({closeModal, dataScreen, setContent, mode}) => {
  const error = useRef({rePass: '', pass: ''});
  const forceUpdate = useForceUpdate();
  const {colorApp} = useContext(ContextContainer);
  const btnRef = useRef(null);
  const data = useRef({
    pass: '',
    rePass: '',
  });

  const onClose = () => {
    closeModal();
  };

  const onChangeData = (field) => (value) => {
    data.current[field] = value;
  };

  //Cập nhật mật khẩu:
  const onSubmit = async () => {
    error.current = {pass: '', rePass: ''};
    const {pass, rePass} = data.current;
    const check = Validate.password(pass);
    if (!check.status) {
      error.current = {...error.current, pass: check.message};
      forceUpdate();
      return;
    }
    if (pass !== rePass) {
      error.current = {
        ...error.current,
        rePass: 'パスワードと確認パスワードが正しくありません。',
      };
      forceUpdate();
      return;
    }
    btnRef.current.setLoadingValue(true);
    const response = await FetchApi.setPasswordForApp(
      pass,
      dataScreen.forgot.phone,
      dataScreen.otp,
    );
    if (response && response.success) {
      const accountUpdate = AccountService.getAccount();
      if (accountUpdate) {
        await AsyncStorage.removeItem(AsyncStoreKey.account);
      }
      btnRef.current.setLoadingValue(false);
      setContent('success', data.current);
      return;
    } else {
      ToastModal.showToast('ラーが発生しました');
    }
    forceUpdate();
    btnRef.current.setLoadingValue(false);
  };
  const onBack = () => {
    setContent('otp', {});
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        backgroundColor: COLOR.white,
        padding: 20,
        width: SIZE.device_width,
        paddingBottom: 60,
      }}>
      <TouchableOpacity
        hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
        onPress={onClose}
        style={{position: 'absolute', right: 16, top: 16}}>
        <AntDesign name="close" size={SIZE.H1 * 1.2} />
      </TouchableOpacity>
      <AppText
        style={{
          marginVertical: 20,
          alignSelf: 'center',
          fontSize: SIZE.H3,
          fontWeight: 'bold',
        }}>
        パスワード登録
      </AppText>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: 40,
          borderColor: COLOR.grey_300,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.2}}>
          ご登録するパスワードをご入力ください。
        </AppText>
        <AppText style={{marginTop: 15, marginBottom: 8, fontSize: SIZE.H4}}>
          パスワード
        </AppText>
        <AppTextInput
          autoCapitalize="none"
          secureTextEntry={true}
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          onChangeText={onChangeData('pass')}
          placeholder="パスワードを半角英数で入力"
          styleInput={{
            width: '100%',
            borderWidth: 1,
            borderColor: COLOR.grey_700,
            fontSize: SIZE.H4,
            padding: 10,
            borderRadius: SIZE.border_radius,
          }}
        />

        {error.current.pass.length > 0 && (
          <AppText
            style={{
              marginVertical: 8,
              color: COLOR.red,
              fontSize: SIZE.H5,
            }}>
            {error.current.pass}
          </AppText>
        )}
        <AppText
          style={{
            marginTop: 15,
            marginBottom: 8,
            color: COLOR.red,
            fontSize: SIZE.H5,
          }}>
          確認のため再度ご入力ください。
        </AppText>
        <AppTextInput
          secureTextEntry={true}
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          autoCapitalize="none"
          onChangeText={onChangeData('rePass')}
          placeholder="パスワードを半角英数で入力"
          styleInput={{
            width: '100%',
            borderWidth: 1,
            borderColor: COLOR.grey_700,
            fontSize: SIZE.H4,
            padding: 10,
            borderRadius: SIZE.border_radius,
          }}
        />

        {error.current.rePass.length > 0 && (
          <AppText
            style={{
              marginVertical: 8,
              color: COLOR.red,
              fontSize: SIZE.H5,
            }}>
            {error.current.rePass}
          </AppText>
        )}
      </View>
      <AppTextButton
        ref={btnRef}
        onPress={onSubmit}
        textStyle={{
          fontSize: SIZE.H4,
        }}
        style={{
          marginTop: 40,
          backgroundColor: hexToRgba(colorApp.backgroundColorButton),
          height: 52,
          borderRadius: SIZE.border_radius,
        }}
        title="登録"
      />
      <TouchableOpacity
        onPress={onBack}
        style={{
          padding: 14,
          marginTop: 20,
          backgroundColor: COLOR.grey,
          borderRadius: SIZE.border_radius,
        }}>
        <AppText style={{fontSize: SIZE.H4, alignSelf: 'center'}}>戻る</AppText>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};
export default RegisterScreen;
