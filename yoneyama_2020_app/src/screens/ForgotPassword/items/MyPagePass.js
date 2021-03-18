//Libary:
import React, {useRef, useContext, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/core';
import hexToRgba from 'hex-to-rgba';

//Setup:
import {SIZE, COLOR, FetchApi} from '../../../utils';
import {AppTextButton} from '../../../elements';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {AccountService} from '../../../utils/services/AccountService';
import AppTextInput from '../../../elements/AppTextInput';
import {ToastModal} from '../utils/ToastModal';
import {AppText} from '../../../elements/AppText';
import {STRING} from '../../../utils/constants/String';
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

const MyPagePass = ({closeModal, setContent}) => {
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const [error, setError] = useState('');
  const btnRef = useRef(null);
  const data = useRef({
    pass: '',
  });

  const onClose = () => {
    closeModal();
    ServicesUpdateComponent.set(keyNavigation.CERTIFICATE_MEMBER);
  };

  const onChangeData = (value) => {
    data.current.pass = value;
  };

  const onSubmit = async () => {
    setError('');
    if (data.current.pass.length === 0) {
      setError('パスワードが入力されていません。');
      return;
    }
    const accountLogin = AccountService.getAccount();
    btnRef.current.setLoadingValue(true);
    if (data.current.pass && data.current.pass.length > 0) {
      const response = await FetchApi.checkPassWordChangeLate(
        data.current.pass,
      );
      if (response && response.status_code == 200 && response.code == 1000) {
        accountLogin.password = data.current.pass;
        AccountService.updateAccount(accountLogin);
        navigation.navigate(keyNavigation.MY_PAGE);
        closeModal();
      } else {
        ToastModal.showToast(STRING.wrong_pass_mypage);
      }
    }
    btnRef.current.setLoadingValue(false);
  };

  const onBack = () => {
    ServicesUpdateComponent.set(keyNavigation.CERTIFICATE_MEMBER);
    closeModal();
  };
  const onForgot = () => {
    setContent('forgot');
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: colorApp.backgroundColor,
        padding: 20,
        width: SIZE.device_width,
        paddingBottom: 60,
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
        onPress={onClose}
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
        }}>
        <FontAwesome name="close" size={SIZE.H1 * 1.5} />
      </TouchableOpacity>
      <AppText
        style={{
          marginVertical: 20,
          alignSelf: 'center',
          fontSize: SIZE.H3,
          fontWeight: 'bold',
        }}>
        パスワードを入力
      </AppText>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: 40,
          borderColor: COLOR.grey_300,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.2}}>
          アプリ会員登録されているパスワードをご入力ください。
        </AppText>
        <AppText style={{marginTop: 15, marginBottom: 8, fontSize: SIZE.H4}}>
          パスワード
        </AppText>
        <View>
          <AppTextInput
            secureTextEntry={true}
            textContentType={'password'}
            keyboardType={'ascii-capable'}
            onChangeText={onChangeData}
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
          {error.length > 0 && (
            <AppText
              style={{
                marginVertical: 6,
                fontSize: SIZE.H5,
                color: COLOR.red,
                alignSelf: 'flex-start',
              }}>
              {error}
            </AppText>
          )}
        </View>

        <AppText
          onPress={onForgot}
          style={{
            alignSelf: 'flex-end',
            marginTop: 20,
            fontSize: SIZE.H5 * 1.2,
            color: 'blue',
            textDecorationLine: 'underline',
          }}>
          パスワードをお忘れの方はこちら
        </AppText>
      </View>
      <AppTextButton
        ref={btnRef}
        onPress={onSubmit}
        style={{
          marginTop: 40,
          backgroundColor: hexToRgba(colorApp.backgroundColorButton),
          height: 52,
          borderRadius: SIZE.border_radius,
        }}
        textStyle={{color: colorApp.textColorButton, fontSize: SIZE.H5 * 1.2}}
        title="認証"
      />
      <TouchableOpacity
        onPress={onBack}
        style={{
          padding: 14,
          marginTop: 20,
          backgroundColor: COLOR.grey,
          borderRadius: SIZE.border_radius,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.2, alignSelf: 'center'}}>
          閉じる
        </AppText>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default MyPagePass;
