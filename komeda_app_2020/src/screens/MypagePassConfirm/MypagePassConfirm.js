//Library:
import React, {useEffect, useState, useRef} from 'react';
import {TouchableOpacity, View, StyleSheet, TextInput} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

//Setup:
import {AppHeader, AppText, AppTextButton} from '../../elements';
import {SIZE, COLOR, FetchApi} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AccountService} from '../../utils/services/AccountService';
import {STRING} from '../../utils/constants/String';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import {StateUserService} from '../Home/services/StateUserService';

function MypagePassConfirm({navigation, route}) {
  const password = useRef('');
  const passwordLocal = useRef('');
  const {keyActiveButton, userInformation} = route.params;
  const [showPass, setStateShowPass] = useState(false);
  const [passWord, setStatePassWord] = useState('');
  const [messCheckPassOrAPI, setStateMessCheckPassOrAPI] = useState('');
  const submitBtn = useRef(null);
  useEffect(() => {
    const acount = AccountService.getAccount();
    passwordLocal.current = acount.password;
    return () => {};
  }, []);

  const renderTitle = () => {
    return (
      <AppText style={styles.textTitle}>
        ご登録情報の変更前に、ご登録のパスワードを入力してください。
      </AppText>
    );
  };

  //Ấn nút: hiển thị mật khẩu.
  const pressShowPass = () => {
    setStateShowPass(!showPass);
  };

  //Thay đổi mật khẩu:
  const onChangePass = (inputPassword) => {
    password.current = inputPassword;
    setStatePassWord(inputPassword);
    setStateMessCheckPassOrAPI('');
  };

  //Hiển thị mắt đọc mật khẩu:
  const showEye = () => {
    if (showPass) {
      return 'eye-with-line';
    }
    return 'eye';
  };

  //Khung nhập mật khẩu:
  const setPassWord = () => {
    return (
      <View
        style={[styles.boxItem, {flexDirection: 'row', alignItems: 'center'}]}>
        {/* Phần nhập mật khẩu: */}
        <TextInput
          placeholderTextColor={COLOR.grey_500}
          placeholder={'パスワード入力'}
          numberOfLines={1}
          maxLength={32}
          defaultValue={passWord}
          secureTextEntry={showPass ? false : true}
          style={styles.boxInputPass}
          onChangeText={(text) => onChangePass(text)}
          autoCapitalize='none'
        />
        {passWord ? (
          <TouchableOpacity
            onPress={pressShowPass}
            style={{
              height: SIZE.width(13),
              width: SIZE.width(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Entypo
              name={showEye()}
              color={COLOR.COFFEE_BROWN}
              size={SIZE.H5 * 1.5}
            />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: SIZE.width(12),
              height: SIZE.width(12),
            }}
          />
        )}
      </View>
    );
  };

  //Hiển thị tiêu đề nhập mật khẩu:
  const renderTitleFormInput = (title, top) => {
    return (
      <View
        style={{
          height: SIZE.width(10),
          width: SIZE.width(100),
          backgroundColor: COLOR.COFFEE_BROWN,
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

  //Các case xử lý với keyActiveButton
  const checkKeyActive = () => {
    switch (keyActiveButton) {
      case 'CHANGE_EMAIL_MY_PAGE':
        return changeEmail();
      case 'CHANGE_PASS_WORD_MY_PAGE':
        return changePassWord();
      case 'CHANGE_PERSONAL_INFO_MY_PAGE':
        return changeInfoPersonal();
      case 'CHANGE_CARD_KOMECA_INFO_MY_PAGE':
        return changeCardKOMECA();
      case 'REMOVE_LINKINGCARD':
        return removeLinkingCard();
      default:
        break;
    }
  };

  const removeLinkingCard = async () => {
    const response = await FetchApi.removeLinkingCard();

    if (response.success) {
      const acc = AccountService.getAccount();
      const newAcc = {...acc, money: null, point: null};
      AccountService.updateAccount(newAcc);
      StateUserService.updateState();
      navigation.navigate(keyNavigation.CONFIRM_MESS, {
        key: 'REMOVE_LINKINGCARD',
      });
    }
  };

  //Thay đổi địa chỉ email my page:
  const changeEmail = () => {
    navigation.navigate(keyNavigation.EMAIL_INPUT, {
      key: 'CHANGE_EMAIL_MY_PAGE',
    });
  };

  //Ấn vào nút quên mật khẩu:
  const onForgotPass = () => {
    navigation.navigate(keyNavigation.EMAIL_INPUT, {
      key: 'FORGOT_PASSWORD',
    });
  };

  //Thay đổi mật khẩu my page:
  const changePassWord = () => {
    navigation.navigate(keyNavigation.CHANGE_PASSWORD, {
      key: 'CHANGE_PASS_MY_PAGE',
      passWordMyPage: password.current,
    });
  };

  //Thay đổi thông tin cá nhân:
  const changeInfoPersonal = () => {
    navigation.navigate(keyNavigation.CHANGE_PERSONAL_INFO, {
      personalInformation: userInformation,
    });
  };

  //Thay đổi thông tin thẻ KOMECA:
  const changeCardKOMECA = () => {
    navigation.navigate(keyNavigation.LINKING_CARD, {key: 'UPDATELINKING'});
  };
  //Kiểm tra mật khẩu đăng nhập của mypage:
  const checkPassMypageAPI = async () => {
    submitBtn.current.setLoadingValue(true);
    if (!password.current) {
      setStateMessCheckPassOrAPI(STRING.need_pass_current_my_page);
    }
    if (password.current) {
      const accountLogin = AccountService.getAccount();
      const response = await FetchApi.checkPassWordChangeLate(password.current);
      if (response && response.status_code == 200 && response.code == 1000) {
        checkKeyActive();
        setStateMessCheckPassOrAPI('');
        accountLogin.password = password.current;
        AccountService.updateAccount(accountLogin);
      } else if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        setStateMessCheckPassOrAPI(STRING.network_error_try_again_later);
      } else {
        setStateMessCheckPassOrAPI(STRING.wrong_pass_current_my_page);
      }
    }
    setTimeout(() => {
      submitBtn.current.setLoadingValue(false);
    }, 500);
  };
  return (
    <View style={styles.container}>
      <AppHeader title={'パスワード認証'} leftGoBack />
      {/* Phần tiêu đề */}
      <KeyboardAwareScrollView>
        <View style={{minHeight: SIZE.width(55), backgroundColor: COLOR.white}}>
          {/* Phần chữ giới thiệu màn hình */}
          {renderTitle()}
          {/* Phần khung màu tiêu đề */}
          {renderTitleFormInput('パスワード', 0)}
          {/* Phần khung nhập mật khẩu: */}
          {setPassWord()}
          {/* Dòng chữ gạch chân quên mật khảu: */}
          <View
            style={{
              width: SIZE.width(100),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(7),
              marginBottom: SIZE.height(5),
            }}>
            <AppText
              onPress={onForgotPass}
              style={{
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
        {/* Phần nút ấn */}
        <View
          style={{
            flex: 1,
            backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
            alignItems: 'center',
          }}>
          {/* Phần mess thông báo mật khẩu không chính xác */}
          <AppText
            style={{
              marginTop: SIZE.width(4),
              fontFamily: 'irohamaru-Medium',
              color: COLOR.COFFEE_RED,
              textAlign: 'center',
              marginHorizontal: SIZE.width(5),
            }}>
            {messCheckPassOrAPI}
          </AppText>
          {/* Phần mess thông báo sai mật khẩu mypage: */}
          <AppTextButton
            ref={submitBtn}
            onPress={checkPassMypageAPI}
            title={'認証'}
            style={{
              height: SIZE.height(7.5),
              marginTop: SIZE.width(3),
              backgroundColor: COLOR.COFFEE_YELLOW,
              width: SIZE.width(70),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              fontSize: SIZE.H5 * 1.2,
              color: COLOR.white,
              fontFamily: 'irohamaru-Medium',
            }}></AppTextButton>

          {/* Nút ấn quay lại màn hình Mypage: */}
          <AppText
            onPress={() => {
              navigation.navigate(keyNavigation.MY_PAGE);
            }}
            style={{
              fontSize: SIZE.H5 * 1.2,
              color: COLOR.COFFEE_BROWN,
              fontFamily: 'irohamaru-Medium',
              marginTop: SIZE.width(7),
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: COLOR.COFFEE_BROWN,
            }}>
            マイアカウントTOPにもどる
          </AppText>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
export default MypagePassConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  textTitle: {
    fontSize: SIZE.H5 * 1.2,
    color: COLOR.COFFEE_BROWN_LIGHT,
    margin: SIZE.width(4),
  },
  //Khung chứa toàn bộ itemInput:
  boxItem: {
    height: SIZE.width(13),
    marginRight: SIZE.width(3),
    flexDirection: 'row',
    marginLeft: SIZE.width(3),
    marginTop: SIZE.width(7),
    borderWidth: SIZE.width(0.2),
    borderColor: COLOR.COFFEE_LIGHT,
    borderRadius: SIZE.width(1),
  },
  messValidateInfo: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: SIZE.width(1),
    marginLeft: SIZE.width(4),
    marginBottom: SIZE.width(1),
  },
  //Khung chứa ô nhập mật khẩu:
  boxInputPass: {
    width: SIZE.width(82),
    height: SIZE.width(13),
    color: COLOR.grey_900,
    paddingLeft: SIZE.width(3),
    fontSize: SIZE.H5 * 1.2,
  },
});
