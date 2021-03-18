import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Alert, Image, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
import {Color, Font, Icon} from '../../commons/constants';
import {
  isValidPhoneNumber,
  validateEmail,
  validatePhone,
} from '../../commons/utils/validate';
import {InputView, ScreensView, TextView} from '../../components';
import API from '../../networking';
import styles from './styles';
const SignUpKey = {
  fullName: 'fullName',
  phone: 'phone',
  email: 'email',
  password: 'password',
  rePassword: 'rePassword',
};

export default function SignUpScreen(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const refSignUp = useRef({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });
  useEffect(() => {
    return () => {
      refSignUp.current = {};
    };
  }, []);
  ///
  const handleOnPress = async () => {
    if (
      refSignUp.current[SignUpKey.fullName] &&
      validateEmail(refSignUp.current[SignUpKey.email]) &&
      validatePhone(refSignUp.current[SignUpKey.phone]) &&
      refSignUp.current[SignUpKey.password] ===
        refSignUp.current[SignUpKey.rePassword] &&
      refSignUp.current[SignUpKey.password].length >= 6
    ) {
      let signUpSuccess = await API.requestSignUp(dispatch, refSignUp.current);
      if (signUpSuccess) {
        Alert.alert(
          'Sim Thành Đạt - Thông Báo',
          'Tài khoản đã được tạo thành công và đang chờ duyệt.',
          [
            {
              text: 'Đóng',
              onPress: () => navigation.goBack(),
            },
          ],
          {
            cancelable: false,
          },
        );
      } else {
        Toast.show('Đăng kí thất bại');
      }
    } else {
      Alert.alert(
        'Thông báo lỗi',
        'Các trường thông tin chưa đúng. Xin mời kiểm tra lại.',
        [
          {
            text: 'Đóng',
            // onPress: () => navigation.goBack(),
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };
  const handleChangeValue = ({id, data}) => {
    refSignUp.current[id] = data;
  };
  const handleCheckInput = ({id, data}) => {
    if (id === SignUpKey.fullName) {
      return data && data;
    } else if (id === SignUpKey.email) {
      return validateEmail(data);
    } else if (id === SignUpKey.phone) {
      return isValidPhoneNumber(data);
    } else if (id === SignUpKey.password || id === SignUpKey.rePassword) {
      return (
        data.length >= 6 &&
        refSignUp.current[SignUpKey.password] ===
          refSignUp.current[SignUpKey.rePassword]
      );
    }
  };
  ///
  return (
    <ScreensView titleScreen={'Đăng Ký'} bgColorStatusBar="transparent">
      <Image
        source={Icon.logo}
        style={[styles.logoImage, {marginBottom: 0, marginTop: 20}]}
      />
      <View style={styles.containsForm}>
        <InputView
          id={SignUpKey.fullName}
          iconLeft={'user'}
          iconLeftSize={18}
          isShowLabel
          label={
            <Text>
              {'Họ và Tên ('}
              <Text style={{color: 'red'}}>*</Text>)
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập họ và tên..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="next"
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Không được để trống '}
        />
        <InputView
          id={SignUpKey.phone}
          iconLeft={'telephone'}
          iconLeftSize={18}
          isShowLabel
          label={
            <Text>
              {'Số điện thoại ('}
              <Text style={{color: 'red'}}>*</Text>)
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập số điện thoại..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          keyboardType="numeric"
          returnKeyType="next"
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Số điện thoại không đúng định dạng'}
        />
        <InputView
          id={SignUpKey.email}
          iconLeft={'email'}
          iconLeftSize={18}
          isShowLabel
          label={
            <Text>
              {'Email ('}
              <Text style={{color: 'red'}}>*</Text>)
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập Email..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="next"
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Email không đúng định dạng'}
        />

        <InputView
          id={SignUpKey.password}
          iconLeft={'padlock'}
          iconLeftSize={18}
          isShowLabel
          label={
            <Text>
              {'Mật khẩu ('}
              <Text style={{color: 'red'}}>*</Text>)
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Nhập mật khẩu..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="done"
          secureTextEntry={true}
          // isError={isError}
          // onCausedError={handleCheckInput}
          // labelError={'Mật khẩu không đúng định dạng'}
        />
        <InputView
          id={SignUpKey.rePassword}
          iconLeft={'padlock'}
          iconLeftSize={18}
          isShowLabel
          label={
            <Text>
              {'Xác nhận mật khẩu ('}
              <Text style={{color: 'red'}}>*</Text>)
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleInput={[styles.styleInput, {borderRadius: 30}]}
          styleTextInput={{
            fontWeight: 'bold',
            fontFamily: Font.FiraSansRegular,
          }}
          styleViewLabel={[styles.styleViewLabel, {marginLeft: 15}]}
          iconLeftColor={Color.colorIcon}
          placeholder="Xác nhận mật khẩu..."
          placeholderTextColor={Color.colorText}
          onChangeText={handleChangeValue}
          returnKeyType="done"
          secureTextEntry={true}
          // isError={isError}
          onCausedError={handleCheckInput}
          labelError={'Mật khẩu phải lớn >= 6 ký tự'}
        />
        <TextView
          id={'Type-SignUp'}
          onPress={handleOnPress}
          style={styles.styleButton}
          styleValue={styles.styleTextButton}
          value={'ĐĂNG KÝ'}
        />
      </View>
    </ScreensView>
  );
}
