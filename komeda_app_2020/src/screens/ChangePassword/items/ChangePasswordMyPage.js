//Library:
import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

//Setup:
import {SIZE, COLOR, FetchApi, Validate} from '../../../utils';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import AppTextInput from '../../../elements/AppTextInput';
import {AccountService} from '../../../utils/services/AccountService';
import {STRING} from '../../../utils/constants/String';

const sizeText = SIZE.H5;

//Quên mật khẩu:
const ChangePasswordMypage = () => {
  const navigation = useNavigation();
  const passWordMyPage = useRef('');
  const password = useRef({
    pass1: '',
    pass2: '',
  });
  const error = useRef({pass1: '', pass2: ''});
  const errorFetch = useRef('');
  const submitBtn = useRef(null);
  const passOldInput = useRef('');
  const forceUpdate = useForceUpdate();

  // 2 Ô nhập mật khẩu ở bên dưới:
  const onChangeText = (field) => (value) => {
    password.current[field] = value;
  };

  //Ấn vào nút quên mật khẩu:
  const onForgotPass = () => {
    navigation.navigate(keyNavigation.EMAIL_INPUT, {
      key: 'FORGOT_PASSWORD',
    });
  };

  //Quay lại màn hình Mypage:
  const comeBackMypage = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
  };

  //Nhập mật khẩu cũ:
  const onchangeTextPassOld = (text) => {
    passOldInput.current = text;
  };

  const onValidate = () => {
    if (errorFetch.current === STRING.network_error_try_again_later) {
      return false;
    }
    error.current = {pass1: '', pass2: ''};
    const {pass1, pass2} = password.current;
    const pass1Validate = Validate.password(pass1);
    if (!passOldInput.current) {
      errorFetch.current = STRING.need_pass_current_my_page;
      forceUpdate();
      return false;
    }
    if (passOldInput.current != passWordMyPage.current) {
      errorFetch.current = STRING.old_pass_not_exactly;
      forceUpdate();
      return false;
    }
    if (!pass1Validate.status) {
      if (pass1) {
        errorFetch.current = pass1Validate.message;
        forceUpdate();
        return false;
      } else {
        errorFetch.current = STRING.need_newpass_my_page;
        forceUpdate();
        return false;
      }
    }

    if (pass2.length == 0) {
      errorFetch.current = STRING.need_input_pass_confirm;
      forceUpdate();
      return false;
    }
    if (pass1 !== pass2) {
      errorFetch.current = STRING.pass_confirm_wrong;
      forceUpdate();
      return false;
    }

    if (password.current.pass1 == passWordMyPage.current) {
      errorFetch.current = STRING.new_pass_similar_old_pass;
      forceUpdate();
      return false;
    }
    forceUpdate();
    return true;
  };

  //Ấn vào nút đổi mật khẩu:
  const onSubmit = async () => {
    submitBtn.current.setLoadingValue(true);
    const validate = onValidate();
    if (validate) {
      try {
        const response = await FetchApi.changePassWordMyPage(
          passWordMyPage.current,
          password.current.pass1,
        );
        if (response && response.success) {
          const accountLogin = AccountService.getAccount();
          errorFetch.current = '';
          accountLogin.password = password.current.pass1;
          AccountService.updateAccount(accountLogin);
          navigation.navigate(keyNavigation.CONFIRM_MESS, {
            key: 'CHANGE_PASS_MY_PAGE',
          });
          forceUpdate();
        } else if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          errorFetch.current = STRING.network_error_try_again_later;
          forceUpdate();
          return;
        } else {
          errorFetch.current = STRING.have_error_happy_waiting;
          forceUpdate();
        }
      } catch (error) {
        errorFetch.current = STRING.update_pass_fail;
        forceUpdate();
      }
    }
    submitBtn.current.setLoadingValue(false);
  };

  //Hiển thị tiêu đề phần sẽ đăng kí:
  const renderTitleFormMyPage = (title, top) => {
    return (
      <View
        style={{
          height: SIZE.width(10),
          width: SIZE.width(100),
          backgroundColor:
            title == '新しいパスワード' ? '#47362B' : COLOR.COFFEE_BROWN,
          justifyContent: 'center',
          marginTop: top ? SIZE.width(top) : 0,
        }}>
        <AppText
          style={{
            fontSize: SIZE.H5,
            marginLeft: SIZE.width(2),
            color: COLOR.white,
            fontFamily: 'irohamaru-Medium',
          }}>
          {title}
        </AppText>
      </View>
    );
  };
  const checkPassCurrent = async () => {
    const response = await FetchApi.checkPassWordChangeLate(
      passOldInput.current,
    );
    if (response && response.status_code == 200 && response.code == 1000) {
      passWordMyPage.current = passOldInput.current;
      errorFetch.current = '';
      forceUpdate();
    } else {
      if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        errorFetch.current = STRING.network_error_try_again_later;
        forceUpdate();
        return;
      }
      if (!passOldInput.current) {
        errorFetch.current = STRING.need_pass_current_my_page;
      } else {
        errorFetch.current = STRING.old_pass_not_exactly;
      }
      forceUpdate();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'パスワードの変更'} leftGoBack />
      <KeyboardAwareScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: COLOR.white,
            paddingTop: 25,
            paddingBottom: 40,
          }}>
          <AppText
            style={{
              marginHorizontal: 20,
              fontSize: 1.1 * sizeText,
              color: '#4D4D4D',
              fontFamily: 'irohamaru-Medium',
              marginBottom: 10,
            }}>
            現在のパスワードと新しく変更するパスワードを 入力してください。
          </AppText>
          {/* Tiêu đề phần nhập mật khẩu cũ: */}
          {renderTitleFormMyPage('現在のパスワード', 0)}
          <AppTextInput
            keyboardType={'ascii-capable'}
            textContentType={'password'}
            maxLength={32}
            onBlur={checkPassCurrent}
            secureTextEntry
            onChangeText={onchangeTextPassOld}
            styleWrap={{
              ...styles.input,
              marginTop: SIZE.width(4),
            }}
            styleInput={{...styles.textInput}}
            autoCapitalize='none'
          />
          {renderTitleFormMyPage('新しいパスワード', 0)}
          <AppTextInput
            keyboardType={'ascii-capable'}
            textContentType={'password'}
            maxLength={32}
            secureTextEntry
            onChangeText={onChangeText('pass1')}
            autoCapitalize='none'
            styleWrap={{
              ...styles.input,
              marginTop: SIZE.width(4),
            }}
            styleInput={styles.textInput}
          />
          <AppText
            style={{
              color: '#4D4D4D',
              fontSize: sizeText * 0.8,
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 6,
              opacity: 0.5,
            }}>
            ※確認のためもう一度入力してください
          </AppText>
          <AppTextInput
            keyboardType={'ascii-capable'}
            textContentType={'password'}
            maxLength={32}
            secureTextEntry
            onChangeText={onChangeText('pass2')}
            styleWrap={styles.input}
            styleInput={styles.textInput}
            autoCapitalize='none'
          />
          {/* Dòng chữ gạch chân quên mật khảu: */}
          <View
            style={{
              width: SIZE.width(100),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AppText
              onPress={onForgotPass}
              style={{
                marginTop: SIZE.height(2),
                fontSize: SIZE.H5 * 1.2,
                color: COLOR.COFFEE_BROWN,
                textDecorationLine: 'underline',
                textDecorationStyle: 'solid',
                textDecorationColor: COLOR.COFFEE_BROWN,
                fontFamily: 'irohamaru-Medium',
              }}>
              パスワードを忘れた方はこちら
            </AppText>
          </View>
        </View>
        <View style={{marginHorizontal: 40, paddingVertical: 30}}>
          {errorFetch.current.length > 0 && (
            <AppText
              style={{
                fontSize: sizeText * 0.9,
                color: '#EF6572',
                marginBottom: 16,
                textAlign: 'center',
                fontFamily: 'irohamaru-Medium',
              }}>
              {errorFetch.current}
            </AppText>
          )}
          <AppTextButton
            onPress={onSubmit}
            ref={submitBtn}
            title={'パスワードを変更する'}
            style={styles.submitBtn}
            textStyle={styles.submitTextBtn}
          />
        </View>
        {/* Nút ấn quay lại màn hình Mpage: */}
        <View
          style={{
            alignItems: 'center',
          }}>
          <AppText
            onPress={comeBackMypage}
            style={{
              fontSize: SIZE.H5 * 1.2,
              color: COLOR.COFFEE_BROWN,
              fontFamily: 'irohamaru-Medium',
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: COLOR.COFFEE_BROWN,
              marginBottom: SIZE.width(10),
              marginTop: SIZE.width(3),
            }}>
            マイアカウントTOPにもどる
          </AppText>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(112,112,112,0.5)',
    borderRadius: 2,
    height: 50,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  textInput: {
    fontSize: SIZE.H3,
    padding: 10,
    color: '#4D4D4D',
  },
  submitBtn: {
    height: SIZE.height(7.5),
    backgroundColor: '#FF9A27',
  },
  submitTextBtn: {
    color: COLOR.white,
    fontSize: sizeText * 1.15,
    fontFamily: 'irohamaru-Medium',
  },
  errorText: {
    color: 'red',
    marginHorizontal: 20,
    marginVertical: 5,
    fontSize: sizeText,
  },
});

export default ChangePasswordMypage;
