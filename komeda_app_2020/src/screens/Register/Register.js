//Library:
import React, {useEffect, useRef, useContext, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/core';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';

//Setup:
import {AppText} from '../../elements/AppText';
import {SIZE, COLOR, FetchApi} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {AppHeader} from '../../elements';
import {ContainerUserNameAndPassword} from './item/UserNameAndPassword';
import {ContainerCardInformationUser} from './item/CardInformation';

//Services:
import {ServicesCheckValidateForm} from './util/ServicesCheckValidateForm';
import {STRING} from '../../utils/constants/String';
import {OtpService} from '../ActiveOTP/services/OtpService';
import {toASCII} from '../../utils/modules/Validate';
//Class:
function MemberRegistration() {
  const useAccessToken = false;
  const ref = useRef(null);
  const refPhonePass = useRef(null);
  const refCardInfomation = useRef(null);
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const [messValid, setStateMessValid] = useState('');
  const ojbMessEmail = useRef({mess: '', key: ''});
  const ojbMessPassWord = useRef({mess: '', key: ''});
  const ojbMessPassWordConfirm = useRef({mess: '', key: ''});
  const ojbMessZipCode = useRef({mess: '', key: ''});
  const disableButtonActive = useRef(true);
  const timer = useRef();
  let memberRegistrationInfo = useRef({
    userName: '',
    password: '',
    gender: 'UNDEFINE',
    birthday: '',
    zipCode: '',
  });

  const registeredFlag = useRef(false);

  const keyGetMessValid = {
    keyEmail: 'EMAIL_INPUT',
    keyPassWord: 'PASSWORD_INPUT',
    keyPassWordConfirm: 'PASSWORD_CONFIRM_INPUT',
    keyZipCode: 'ZIP_CODE_INPUT',
  };

  let checkValidateInformationUserForm = useRef({
    validateGender: false,
    validateNumberPhone: false,
    validatePassword: false,
    validateBirthDay: false,
    validateZipCode: false,
  });

  //Didmount:
  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
      OtpService.removeCount(toASCII(memberRegistrationInfo.current.userName));
    };
  }, []);

  //Lấy các thông tin cơ bản người dùng điền vào Form đăng kí sau khi đã check Validate.
  //Lấy số điện thoại đăng kí:
  const getUserName = (userNameLogin) => {
    memberRegistrationInfo.current.userName = userNameLogin;
  };

  //Lấy mật khẩu đăng kí đăng nhập:
  const getPassword = (pass) => {
    memberRegistrationInfo.current.password = pass;
  };

  //Lấy giới tính:
  const getGender = (gender) => {
    if (gender == '男性') {
      memberRegistrationInfo.current.gender = 'MALE';
    }
    if (gender == '女性') {
      memberRegistrationInfo.current.gender = 'FEMALE';
    }
    if (gender == '未設定') {
      memberRegistrationInfo.current.gender = 'UNDEFINE';
    }
  };

  //Không cho ấn đăng kí khi tài khoản đã tồn tại:
  const disableButtonRegister = (check) => {
    disableButtonActive.current = check;
  };

  //Lấy ngày tháng năm sinh:
  const getBirthday = (birthday) => {
    memberRegistrationInfo.current.birthday = birthday;
  };

  //Lấy zipcode:
  const getZipCode = (zipcode) => {
    memberRegistrationInfo.current.zipCode = zipcode;
  };

  //Kiểm tra trạng thái validate của thông tin:
  //Validtate tài khoản đăng kí:
  const getValidUserName = (active) => {
    checkValidateInformationUserForm.current.validateNumberPhone = active;
  };

  //Validate mật khẩu:
  const getValidatePassword = (active) => {
    checkValidateInformationUserForm.current.validatePassword = active;
  };

  //Validate ngày sinh:
  const getValidateBirthDay = (active) => {
    checkValidateInformationUserForm.current.validateBirthDay = active;
  };

  //Validate mã zipcode:
  const getValidateZipCode = (active) => {
    checkValidateInformationUserForm.current.validateZipCode = active;
  };

  //Cuộn lên nếu thông tin được valid:
  const activeScrollViewToTop = () => {
    ref.current.scrollTo({x: 0, y: 0, animated: true});
  };

  //Mất mạng đẩy ra ngoài này:
  const checkNetErrorRegis = (event) => {
    if (event == 'NETWORK_ERROR') {
      setStateMessValid(STRING.network_error_try_again_later);
    }
  };
  //Gán các giá trị vào các OJB tương ứng:
  const setOjbMess = (mess, key) => {
    //Email:
    if (key == keyGetMessValid.keyEmail) {
      ojbMessEmail.current.mess = mess;
      ojbMessEmail.current.key = keyGetMessValid.keyEmail;
    }
    //PassWork:
    if (key == keyGetMessValid.keyPassWord) {
      ojbMessPassWord.current.mess = mess;
      ojbMessPassWord.current.key = keyGetMessValid.keyPassWord;
    }
    //PassConfirm:
    if (key == keyGetMessValid.keyPassWordConfirm) {
      ojbMessPassWordConfirm.current.mess = mess;
      ojbMessPassWordConfirm.current.key = keyGetMessValid.keyPassWordConfirm;
    }
    //ZipCode:
    if (key == keyGetMessValid.keyZipCode) {
      ojbMessZipCode.current.mess = mess;
      ojbMessZipCode.current.key = keyGetMessValid.keyZipCode;
    }
  };

  //Lấy các mess thông báo sai valid của các thành phần đăng kí:
  const getMessValid = (mess, key) => {
    setOjbMess(mess, key);
    if (ojbMessEmail.current.mess) {
      setStateMessValid(ojbMessEmail.current.mess);
      return;
    } else {
      if (
        !ojbMessPassWord.current.mess &&
        !ojbMessPassWordConfirm.current.mess &&
        !ojbMessZipCode.current.mess
      ) {
        setStateMessValid('');
      }
    }
    if (ojbMessPassWord.current.mess) {
      setStateMessValid(ojbMessPassWord.current.mess);
      return;
    } else {
      if (!ojbMessPassWord.current.mess) {
        setStateMessValid('');
      }
    }
    if (ojbMessPassWordConfirm.current.mess) {
      setStateMessValid(ojbMessPassWordConfirm.current.mess);
      return;
    } else {
      setStateMessValid('');
    }
    if (
      ojbMessZipCode.current.mess &&
      !ojbMessPassWord.current.mess &&
      !ojbMessPassWordConfirm.current.mess
    ) {
      setStateMessValid(ojbMessZipCode.current.mess);
      return;
    } else {
      setStateMessValid('');
    }
  };

  //Phần chữ chú ý màu đỏ báo lỗi Valid:
  const renderMegErrorMessValid = () => {
    return (
      <View
        style={{
          width: SIZE.width(80),
          marginTop: SIZE.width(3),
          marginLeft: SIZE.width(10),
          marginRight: SIZE.width(10),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: COLOR.COFFEE_RED,
            fontFamily: 'irohamaru-Medium',
            textAlign: 'center',
          }}>
          {messValid}
        </AppText>
      </View>
    );
  };

  //Thực hiện quá trình kiểm tra validate lần cuối:
  const checkValidateInformationRegistration = () => {
    if (
      checkValidateInformationUserForm.current.validateNumberPhone &&
      checkValidateInformationUserForm.current.validatePassword
    ) {
      return true;
    }
    return false;
  };
  //Tắt lựa chọn giới tính:
  const offBoxChooseGender = () => {
    refCardInfomation.current.focusZipCodeOffChooseGender();
  };

  //Thực hiện quá trình đăng kí tài khoản: (Điều kiện phải nhập đủ thông tin)
  const startRegistrationAccount = async () => {
    if (!registeredFlag.current) {
      registeredFlag.current = true;
      timer.current = setTimeout(() => {
        registeredFlag.current = false;
      }, 2000);

      ServicesCheckValidateForm.set({
        clickButtonregistration: 'CLICK_REGISTER_ACCOUNT',
      });
      const {
        userName,
        password,
        gender,
        birthday,
        zipCode,
      } = memberRegistrationInfo.current;
      let checker = checkValidateInformationRegistration();
      const newUserName = toASCII(userName);
      if (checker) {
        OtpService.initCount(newUserName);
        const countOtp = OtpService.getCountOtp(newUserName);
        const listEmail = OtpService.get();
        if (newUserName in listEmail || countOtp === 2) {
          OtpService.updateCount(newUserName);
          navigation.navigate(keyNavigation.ACTIVE_OTP, {
            key: 'REGISTER',
            email: newUserName,
            password: password,
          });
          return;
        }
        const response = await FetchApi.registerMemberAPI(
          newUserName,
          password,
          gender,
          birthday,
          zipCode,
          useAccessToken,
        );
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          setStateMessValid(STRING.network_error_try_again_later);
          return;
        }
        if (response && response.status_code == 200 && response.code == 1000) {
          OtpService.updateCount(newUserName);
          setStateMessValid('');
          navigation.navigate(keyNavigation.ACTIVE_OTP, {
            key: 'REGISTER',
            email: newUserName,
            password: password,
          });

          return;
        }
        if (response && response.status_code >= 500) {
          setStateMessValid(STRING.server_maintain);
          return;
        } else {
          if (
            response &&
            response.status_code == 200 &&
            response.code == 1047
          ) {
            if (zipCode && zipCode.length < 7) {
              activeScrollViewToTop();
              setStateMessValid(STRING.zipcode_7_char);
              return;
            } else {
              activeScrollViewToTop();
              setStateMessValid(STRING.zipcode_input_wrong);
              return;
            }
          } else {
            if (
              response &&
              response.status_code == 200 &&
              response.code == 1044
            ) {
              activeScrollViewToTop();
              refPhonePass.current.messHaveAccount();
            }
            if (
              response &&
              response.status_code == 200 &&
              response.code == 1049
            ) {
              setStateMessValid(STRING.email_is_use);
            }
          }
        }
      } else {
        activeScrollViewToTop();
      }
    }
  };

  //Render content:
  const renderContent = () => {
    return (
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={1} onPress={offBoxChooseGender}>
          <ScrollView ref={ref} showsVerticalScrollIndicator={false}>
            {/* Bảng đăng nhập số điện thoại và mật khẩu */}
            <ContainerUserNameAndPassword
              ref={refPhonePass}
              getUserName={getUserName}
              getPassword={getPassword}
              getValidUserName={getValidUserName}
              getValidatePassword={getValidatePassword}
              checkNetErrorRegis={checkNetErrorRegis}
              getMessValid={getMessValid}
              offBoxChooseGender={offBoxChooseGender}
              disableButtonRegister={disableButtonRegister}
            />
            {/* Đăng kí thông tin người dùng */}
            <ContainerCardInformationUser
              ref={refCardInfomation}
              getGender={getGender}
              getBirthday={getBirthday}
              getZipCode={getZipCode}
              getValidateBirthDay={getValidateBirthDay}
              getValidateZipCode={getValidateZipCode}
              getMessValid={getMessValid}
              memberRegistrationInfo={memberRegistrationInfo.current}
              disableButtonActive={disableButtonActive.current}
            />
            {/* Hiển thị chữ đỏ valid: hoặc thông báo lỗi */}
            {renderMegErrorMessValid()}
            {/* Hiển thị nút đăng kí người dùng sau khi đẵ điền đầy đủ thông tin */}
            <TouchableOpacity
              onPress={startRegistrationAccount}
              style={{
                height: SIZE.height(7.5),
                width: SIZE.width(72),
                backgroundColor: colorApp.backgroundColorButton,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: SIZE.width(14),
                marginTop: SIZE.width(3),
              }}>
              <AppText
                style={{
                  color: colorApp.textColorButton,
                  fontSize: SIZE.H4,
                  padding: 5,
                  fontFamily: 'irohamaru-Medium',
                }}>
                登録
              </AppText>
            </TouchableOpacity>
            <View style={{height: SIZE.width(12)}} />
          </ScrollView>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  };

  //Render:
  return (
    <View style={styles.container}>
      <AppHeader title={'新規会員登録'} leftGoBack />
      {renderContent()}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F0F0F0',
  },
});
export default MemberRegistration;
