//Library:
import React, {useRef, useState, useContext} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Entypo from 'react-native-vector-icons/Entypo';

//Setup:
import {SIZE, COLOR, FetchApi, isIos, ToastService} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';

// Component
import {AppText} from '../../elements/AppText';
import {AppContainer, AppTextButton} from '../../elements';
import AppDateInput from '../../elements/AppDateInput';

//Services:
import {STRING} from '../../utils/constants/String';

function LoginHaveBirthday() {
  const {colorApp} = useContext(ContextContainer);
  const typeLogin = 'SPECIAL_LOGIN';
  const phone = useRef('');
  const password = useRef('');
  const inputDateOfBirth = useRef('');
  const loginBtnRef = useRef(null);
  const datepicker = useRef(null);
  const navigation = useNavigation();
  const [userName, setStateUserName] = useState('');
  const [passWord, setStatePassWord] = useState('');
  const [megUserName, setStateMegUserName] = useState('');
  const [megBirthDay, setStateMegBirthday] = useState('');
  const [megPass, setStateMegPass] = useState('');
  const [chooseBirthday, setStateChooseBirthday] = useState(false);
  const [showPass, setStateShowPass] = useState(false);
  const {goBack} = navigation;
  const goBackScreen = () => {
    goBack();
  };

  //Nhập tài khoản:
  const onChangeUserName = (value) => {
    phone.current = value;
    setStateUserName(value);
    setStateMegUserName('');
  };

  //Nhập mật khẩu:
  const onChangePass = (pass) => {
    password.current = pass;
    setStateMegPass('');
    setStatePassWord(pass);
  };

  //Chọn ngày tháng năm:
  const showDatePicker = () => {
    datepicker.current.showDatePicker();
    setStateMegBirthday('');
  };

  //Lấy ngày tháng năm sinh:
  const onSelectBirth = (date) => {
    setStateChooseBirthday(true);
    inputDateOfBirth.current = date;
  };

  //Hiển thị chữ giới thiệu:
  const renderTextTitle = () => {
    return (
      <>
        <AppText style={styles.textScreen}>
          紛失など携帯電話番号が変更となり、SMSが以前の携帯電話番号で受信できずログインできない方は、こちらからログイン可能です。
        </AppText>
        <AppText style={{...styles.textScreen, marginTop: SIZE.width(3)}}>
          下部、注意事項をご確認の上、ログイン後、マイページから新しい携帯電話番号へご変更をお願いいたします。
        </AppText>
      </>
    );
  };

  //Kiểm tra tài khoản:
  const checkValidAccount = () => {
    if (!phone.current) {
      setStateMegUserName('本項目は必須です。');
    }
    if (phone.current && phone.current.length < 11) {
      setStateMegUserName('11桁で入力してください。');
    }
    if (!password.current) {
      setStateMegPass('本項目は必須です。');
    }
    if (!inputDateOfBirth.current) {
      setStateMegBirthday('本項目は必須です。');
    }
  };

  //Đăng nhập:
  const pressLogin = async () => {
    checkValidAccount();
    if (
      phone.current &&
      password.current &&
      phone.current.length == 11 &&
      inputDateOfBirth.current
    ) {
      loginBtnRef.current.setLoadingValue(true);
      const response = await FetchApi.login(
        phone.current,
        password.current,
        typeLogin,
        inputDateOfBirth.current,
      );
      if (response.success) {
        response.data.password = password.current;
        navigation.replace(keyNavigation.MAIN_NAVIGATOR, {
          screen: keyNavigation.CHANGE_PHONE_NUMBER,
          params: {phoneAccuracy: phone.current, accountLogin: response.data},
        });
      } else {
        ToastService.showToast(STRING.wrong_phone_or_pass);
      }
      loginBtnRef.current.setLoadingValue(false);
    }
  };

  //Phần chữ màu đỏ cảnh báo cuối màn hình:
  const renderTextImportant = () => {
    return (
      //Khung chữ chú ý:
      <View style={styles.containerImpotent}>
        <AppText
          style={{
            marginTop: SIZE.width(3),
            marginLeft: SIZE.width(4),
            marginBottom: SIZE.width(1),
            color: COLOR.red,
          }}>
          ご注意
        </AppText>
        <AppText style={styles.textImpotent}>
          本機能よりログイン後、ご登録の携帯電話番号を変更されませんと、アカウントが無効となる可能性があります。ログイン後、マイページから携帯電話番号をご変更いただきますようお願いいたします。
        </AppText>
      </View>
    );
  };

  //Tên của itcon nhập mật khẩu cũ:
  const showEye = () => {
    if (showPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };

  //Hiển thị mật khẩu rõ:
  const showPassWord = () => {
    setStateShowPass(!showPass);
  };
  //Nhập mật khẩu:
  const inputPass = () => {
    return (
      <>
        <View
          style={{
            height: SIZE.width(13),
            width: SIZE.width(92),
            borderWidth: 1,
            borderColor: COLOR.grey_700,
            marginLeft: SIZE.width(4),
            borderRadius: 8,
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <TextInput
            textContentType={'password'}
            keyboardType={'ascii-capable'}
            numberOfLines={1}
            secureTextEntry={showPass ? false : true}
            placeholder="パスワードを半角英数で入力"
            placeholderTextColor={'grey'}
            value={passWord}
            style={{
              height: SIZE.width(13),
              width: SIZE.width(78),
              borderColor: COLOR.grey_700,
              paddingLeft: SIZE.width(2),
              borderRadius: 8,
            }}
            onChangeText={(text) => onChangePass(text)}
          />
          <TouchableOpacity
            onPress={showPassWord}
            style={{
              width: SIZE.width(13),
              height: SIZE.width(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {passWord ? (
              <Entypo name={showEye()} color="black" size={SIZE.H4} />
            ) : null}
          </TouchableOpacity>
        </View>
      </>
    );
  };

  //Thông báo lỗi nhập tài khoản:
  const megValid = (mess) => {
    return <AppText style={styles.megValid}>{mess}</AppText>;
  };
  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen="ログイン"
      style={{backgroundColor: colorApp.backgroundColor}}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        {renderTextTitle()}
        {/* Nhập tài khoản: */}
        <AppText style={{...styles.textTitleInput, marginTop: SIZE.width(3)}}>
          携帯電話番号
        </AppText>
        <TextInput
          maxLength={11}
          placeholder="携帯電話番号をハイフンなしで入力"
          keyboardType="numeric"
          placeholderTextColor={'grey'}
          defaultValue={userName}
          style={styles.input}
          onChangeText={(text) => onChangeUserName(text)}
        />
        {megUserName ? megValid(megUserName) : null}
        {/* Nhập mật khẩu */}
        <AppText
          style={{
            ...styles.textTitleInput,
            marginTop: SIZE.width(3),
            marginBottom: SIZE.width(2),
          }}>
          パスワード
        </AppText>
        {inputPass()}
        {/* Thông báo sai validPass */}
        {megPass ? megValid(megPass) : null}
        {/* Chọn ngày tháng năm sinh: */}
        <AppText style={{...styles.textTitleInput, marginTop: SIZE.width(3)}}>
          生年月日
        </AppText>
        <TouchableOpacity onPress={showDatePicker}>
          <AppDateInput
            noIcon
            sizeIcon={22}
            iconDown
            ref={datepicker}
            placeholder={'生年月日を選択'}
            onChangeData={onSelectBirth}
            stylesIcon={{
              marginLeft: isIos ? SIZE.width(54) : SIZE.width(50),
              marginTop: SIZE.width(-1),
            }}
            inputStyle={{
              height: SIZE.width(8),
              paddingTop: SIZE.width(2),
              paddingLeft: SIZE.width(1),
              marginLeft: SIZE.width(2),
              color: chooseBirthday ? COLOR.grey_900 : COLOR.grey_500,
            }}
            style={{
              ...styles.inputDate,
              alignContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        {megBirthDay ? megValid(megBirthDay) : null}
        {/* Kẻ ngang */}
        <View style={styles.holiView} />
        {/* Nút Login */}
        <AppTextButton
          ref={loginBtnRef}
          style={{
            height: SIZE.width(12),
            width: SIZE.width(92),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SIZE.width(4),
            borderRadius: 8,
            marginLeft: SIZE.width(4),
            backgroundColor: colorApp.backgroundColorButton,
          }}
          title={'ログイン'}
          textStyle={{
            color: colorApp.textColorButton,
            fontWeight: 'bold',
            fontSize: SIZE.H4 * 0.9,
          }}
          onPress={pressLogin}
        />
        {/* Nút quay lại */}
        <AppTextButton
          style={styles.buttonGoback}
          title={'戻る'}
          textStyle={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: SIZE.H4 * 0.9,
          }}
          onPress={goBackScreen}
        />
        {/* Chữ chú ý */}
        {/* {renderTextImportant()} */}
        <View style={{height: SIZE.width(10), width: SIZE.width(100)}} />
      </ScrollView>
    </AppContainer>
  );
}
const styles = StyleSheet.create({
  textTitleInput: {
    fontSize: isIos ? SIZE.H5 * 1.2 : SIZE.H5,
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    marginTop: SIZE.width(3),
  },
  textScreen: {
    fontSize: isIos ? SIZE.H5 * 1.2 : SIZE.H5,
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    marginTop: SIZE.width(3),
  },
  input: {
    height: SIZE.width(13),
    width: SIZE.width(92),
    borderWidth: 1,
    borderColor: COLOR.grey_700,
    marginLeft: SIZE.width(4),
    borderRadius: 8,
    marginTop: SIZE.width(2),
    paddingLeft: SIZE.width(3),
    fontSize: isIos ? SIZE.H5 * 1.2 : SIZE.H5,
  },
  inputDate: {
    height: SIZE.width(13),
    width: SIZE.width(92),
    borderWidth: 1,
    borderColor: COLOR.grey_700,
    marginLeft: SIZE.width(4),
    borderRadius: 8,
    marginTop: SIZE.width(2),
  },
  holiView: {
    height: 1,
    width: SIZE.width(92),
    marginLeft: SIZE.width(4),
    marginTop: SIZE.width(5),
    backgroundColor: COLOR.grey_500,
  },
  buttonGoback: {
    height: SIZE.width(12),
    width: SIZE.width(92),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(4),
    borderRadius: 8,
    marginLeft: SIZE.width(4),
    backgroundColor: '#D9D9D9',
  },
  megValid: {
    fontSize: 14,
    color: COLOR.red,
    marginLeft: SIZE.width(5),
    marginTop: SIZE.width(1.5),
  },
  containerImpotent: {
    borderColor: COLOR.red,
    borderWidth: 1,
    marginTop: SIZE.width(4),
    marginLeft: SIZE.width(3),
    marginRight: SIZE.width(3),
  },
  textImpotent: {
    padding: SIZE.width(1),
    color: COLOR.red,
    fontSize: SIZE.H5,
    marginLeft: SIZE.width(3),
    marginRight: SIZE.width(3),
    marginBottom: SIZE.width(2),
  },
});

export default LoginHaveBirthday;
