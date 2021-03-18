//Library:
import React, {useRef, useContext, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import hexToRgba from 'hex-to-rgba';

//Setup:
import {SIZE, COLOR, FetchApi} from '../../../utils';
import {ContextContainer} from '../../../contexts/AppContext';

//Component:
import {AppTextButton} from '../../../elements';
import AppTextInput from '../../../elements/AppTextInput';
import {ToastModal} from '../utils/ToastModal';
import {AppText} from '../../../elements/AppText';
import {STRING} from '../../../utils/constants/String';

const ForgotScreen = ({closeModal, setContent, dataScreen, mode}) => {
  const {colorApp} = useContext(ContextContainer);
  const [error, setError] = useState('');
  const btnRef = useRef(null);
  const data = useRef({
    phone: '',
    rePhone: '',
    date: '',
  });

  if (dataScreen.forgot) {
    data.current = {...dataScreen.forgot};
  }

  //Tắt modal:
  const onClose = () => {
    closeModal();
  };

  //Thay đổi tài khoản mật khẩu:
  const onChangeData = (field) => (value) => {
    data.current[field] = value;
  };

  //Quay lại màn trước:
  const onBack = () => {
    if (mode === 'mypage') {
      setContent('mypage', {});
    } else {
      closeModal();
    }
  };

  //Gọi API quên mật khẩu:
  const onSubmit = async () => {
    setError('');
    const {phone, rePhone} = data.current;
    if (phone !== rePhone) {
      setError('携帯電話番号に誤りがあります。');
      return;
    }
    btnRef.current.setLoadingValue(true);
    const response = await FetchApi.forgotPasswordApp(
      data.current.phone,
      data.current.date,
    );
    if (response.success) {
      btnRef.current.setLoadingValue(false);
      setContent('otp', {forgot: data.current});
      return;
    } else {
      ToastModal.showToast(STRING.wrong_phone_or_pass);
    }
    btnRef.current.setLoadingValue(false);
  };

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        backgroundColor: colorApp.backgroundColor,
        padding: 20,
        width: SIZE.device_width,
        justifyContent: 'center',
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
        パスワードリセット
      </AppText>
      <View
        style={{
          borderTopWidth: 1,
          borderBottomWidth: 1,
          paddingVertical: 40,
          borderColor: COLOR.grey_300,
        }}>
        <AppText style={{fontSize: SIZE.H5 * 1.35}}>
          会員ご登録の携帯電話番号へSMS認証を行うことでパスワードのリセットを行うことができます。
        </AppText>
        <AppText
          style={{
            marginTop: SIZE.width(4),
            marginBottom: SIZE.width(2),
            fontSize: SIZE.H4,
          }}>
          携帯電話番号
        </AppText>
        <AppTextInput
          maxLength={11}
          defaultValue={data.current.phone}
          keyboardType="decimal-pad"
          onChangeText={onChangeData('phone')}
          placeholder="携帯電話番号をハイフンなしで入力"
          placeholderTextColor={COLOR.grey}
          styleInput={{
            width: '100%',
            borderWidth: 1,
            borderColor: COLOR.grey_700,
            fontSize: SIZE.H5 * 1.2,
            padding: 10,
            color: COLOR.black,
            borderRadius: SIZE.border_radius,
            height: SIZE.width(12),
          }}
        />
        <AppText
          style={{
            marginTop: SIZE.width(2),
            marginBottom: SIZE.width(2),
            color: COLOR.red,
            fontSize: SIZE.H5,
          }}>
          入力間違い防止のため再度ご入力ください。
        </AppText>
        <AppTextInput
          maxLength={11}
          defaultValue={data.current.rePhone}
          keyboardType="decimal-pad"
          placeholder="携帯電話番号をハイフンなしで入力"
          placeholderTextColor={COLOR.grey_500}
          onChangeText={onChangeData('rePhone')}
          styleInput={{
            width: '100%',
            borderWidth: 1,
            color: COLOR.black,
            borderColor: COLOR.grey_700,
            fontSize: SIZE.H5 * 1.2,
            padding: 10,
            borderRadius: SIZE.border_radius,
            height: SIZE.width(12),
          }}
        />
        {error.length > 0 && (
          <AppText
            style={{
              marginVertical: 8,
              color: COLOR.red,
              fontSize: SIZE.H5,
            }}>
            携帯電話番号に誤りがあります。
          </AppText>
        )}
      </View>
      <AppTextButton
        ref={btnRef}
        onPress={onSubmit}
        textStyle={{
          color: colorApp.textColorButton,
        }}
        style={{
          marginTop: SIZE.width(10),
          backgroundColor: hexToRgba(colorApp.backgroundColorButton),
          height: SIZE.width(12),
          borderRadius: SIZE.border_radius,
        }}
        title="携帯電話番号へSMSコードを送信"
      />
      <TouchableOpacity
        onPress={onBack}
        style={{
          padding: 14,
          marginTop: SIZE.width(5),
          backgroundColor: COLOR.grey,
          borderRadius: SIZE.border_radius,
          height: SIZE.width(12),
          justifyContent: 'center',
        }}>
        <AppText style={{fontSize: SIZE.H4, alignSelf: 'center'}}>戻る</AppText>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

export default ForgotScreen;
