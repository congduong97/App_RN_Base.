//Library:
import React, {useRef, useState, useContext} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import hexToRgba from 'hex-to-rgba';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {SIZE, COLOR, FetchApi, isIos} from '../../../utils';
import Timer from './Timer';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import {AppTextButton} from '../../../elements';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {ToastModal} from '../utils/ToastModal';
import {AppText} from '../../../elements/AppText';
import AppTextInput from '../../../elements/AppTextInput';

//Services:
import {AccountService} from '../../../utils/services/AccountService';

const OptScreen = ({closeModal, setContent, dataScreen, mode}) => {
  const [activeResend, setActiveResend] = useState(true);
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const [activeButton, setStateActiveButton] = useState(false);
  const btnRef = useRef(null);
  const data = useRef({
    otp: '',
  });

  if (dataScreen.otp) {
    data.current.otp = dataScreen.otp;
  }

  const onClose = () => {
    closeModal();
  };

  const onChangeData = (value) => {
    data.current.otp = value;
    if (value && value.length == 6) {
      setStateActiveButton(true);
    } else {
      setStateActiveButton(false);
    }
  };

  const activeOTP = async () => {
    btnRef.current.setLoadingValue(true);
    const response = await FetchApi.activeOTP_SMS(
      data.current.otp,
      dataScreen.forgot.phone,
      'FORGOT_PASSWORD',
    );
    if (response && response.success) {
      btnRef.current.setLoadingValue(true);
      if (mode === 'mypage' || mode === 'app') {
        setContent('register', data.current);
        return;
      }
      closeModal();
      navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
        screen: keyNavigation.NEW_PASS,
        params: {index: 'no', mode: 'no'},
      });

      return;
    } else {
      ToastModal.showToast('認証コードが正しくありません。');
    }
    btnRef.current.setLoadingValue(false);
  };

  //Gửi lại mã OTP:
  const onReSendOtp = async () => {
    let memberId = null;
    const acc = AccountService.getAccount();
    if (acc) {
      memberId = acc.memberId;
    }
    const response = await FetchApi.resentOTP(
      'FORGOT_PASSWORD',
      dataScreen.forgot.phone,
      memberId,
    );
    if (response && response.success) {
      setActiveResend(false);
      ToastModal.showToast('認証コードが正しくありません。');
    } else {
      ToastModal.showToast('エラーが発生しました。');
    }
  };

  const renderNotice = () => {
    if (isIos) {
      return (
        <View style={{paddingVertical: 10}}>
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: COLOR.red,
              textDecorationLine: 'underline',
              fontWeight: 'bold',
            }}>
            【iOSの場合】
          </AppText>
          <AppText style={{fontSize: SIZE.H5, color: COLOR.red}}>
            「設定」→「通知」→表示されているアプリ中か
            ら「メッセージ」を選択→「通知を許可」をONに する
          </AppText>
        </View>
      );
    }
    return (
      <View style={{paddingVertical: 10}}>
        <AppText
          style={{
            fontSize: SIZE.H5,
            textDecorationLine: 'underline',
            color: COLOR.red,
            fontWeight: 'bold',
          }}>
          【Androidの場合】
        </AppText>
        <AppText style={{fontSize: SIZE.H5, color: COLOR.red}}>
          「設定」→「音と通知」→「アプリ の通知」→表示されているアプリの
          中から「メッセージ」を選択→「ブ ロック」をOFFにする
        </AppText>
      </View>
    );
  };
  const onBack = () => {
    setContent('forgot', {});
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: colorApp.backgroundColor,
        padding: 20,
        width: SIZE.device_width,
        paddingBottom: 60,
      }}>
      <TouchableOpacity
        hitSlop={{top: 16, bottom: 16, left: 16, right: 16}}
        onPress={onClose}
        style={{position: 'absolute', right: 16, top: 16}}>
        <FontAwesome name="close" size={SIZE.H1 * 1.5} />
      </TouchableOpacity>
      <AppText
        style={{
          marginVertical: 20,
          alignSelf: 'center',
          fontSize: SIZE.H3,
          fontWeight: 'bold',
        }}>
        SMS認証
      </AppText>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: 40,
          borderColor: COLOR.grey_300,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.2}}>
          ご登録の末尾が「
          {dataScreen.forgot.phone.slice(
            dataScreen.forgot.phone.length - 3,
            dataScreen.forgot.phone.length,
          )}
          」の携帯電話番号にSMSを送信しました。SMS本文の認証コードをご入力ください。
        </AppText>
        <AppText style={{marginTop: 15, marginBottom: 8, fontSize: SIZE.H4}}>
          SMS認証コード
        </AppText>
        <AppTextInput
          maxLength={6}
          defaultValue={data.current.otp}
          styleInput={{
            width: '100%',
            borderWidth: 1,
            borderColor: COLOR.grey_700,
            fontSize: SIZE.H4,
            padding: 10,
            borderRadius: SIZE.border_radius,
          }}
          keyboardType="decimal-pad"
          onChangeText={onChangeData}
          placeholder="SMS認証コードを入力"
        />
        <View style={{marginTop: 20}}>
          {/* Bộ đếm thời gian gửi lại mã OTP */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: SIZE.width(93),
            }}>
            <View style={{flex: 1}} />
            {!activeResend && <Timer setActiveResend={setActiveResend} />}
          </View>
          <TouchableOpacity
            activeOpacity={1}
            disabled={!activeResend}
            onPress={onReSendOtp}>
            <AppText
              style={{
                alignSelf: 'flex-end',
                fontSize: SIZE.H4,
                color: activeResend ? 'blue' : COLOR.grey_500,
                textDecorationLine: 'underline',
                marginTop: SIZE.width(2),
              }}>
              SMS認証コード再送
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <AppTextButton
        disabled={activeButton ? false : true}
        ref={btnRef}
        onPress={activeOTP}
        style={{
          marginTop: SIZE.width(8),
          backgroundColor: activeButton
            ? hexToRgba(colorApp.backgroundColorButton)
            : hexToRgba(colorApp.backgroundColorButton, '0.6'),
          height: SIZE.width(12),
          borderRadius: SIZE.border_radius,
        }}
        textStyle={{
          color: colorApp.textColorButton,
          fontSize: SIZE.H4 * 0.9,
        }}
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
        <AppText style={{fontSize: SIZE.H4 * 0.9, alignSelf: 'center'}}>
          戻る
        </AppText>
      </TouchableOpacity>
      <View
        style={{
          padding: 20,
          marginTop: 30,
          borderWidth: 2,
          borderColor: COLOR.red,
        }}>
        <AppText style={{fontSize: SIZE.H5, color: COLOR.red}}>ご注意</AppText>
        <AppText
          style={{
            fontSize: SIZE.H5,
            color: COLOR.red,
            marginTop: 20,
            fontWeight: 'bold',
          }}>
          SMSが受信できない場合に考えられる原因
        </AppText>
        {renderNotice()}
        <AppText style={{fontSize: SIZE.H5, color: COLOR.red}}>
          末により操作方法が異なる場合があります。
          上記でも受信できない場合は、ご契約の携帯キャリア各店舗、または各キャリアのコールセンターへお問い合わせください
        </AppText>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default OptScreen;
