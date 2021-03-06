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

  //L???y c??c th??ng tin c?? b???n ng?????i d??ng ??i???n v??o Form ????ng k?? sau khi ???? check Validate.
  //L???y s??? ??i???n tho???i ????ng k??:
  const getUserName = (userNameLogin) => {
    memberRegistrationInfo.current.userName = userNameLogin;
  };

  //L???y m???t kh???u ????ng k?? ????ng nh???p:
  const getPassword = (pass) => {
    memberRegistrationInfo.current.password = pass;
  };

  //L???y gi???i t??nh:
  const getGender = (gender) => {
    if (gender == '??????') {
      memberRegistrationInfo.current.gender = 'MALE';
    }
    if (gender == '??????') {
      memberRegistrationInfo.current.gender = 'FEMALE';
    }
    if (gender == '?????????') {
      memberRegistrationInfo.current.gender = 'UNDEFINE';
    }
  };

  //Kh??ng cho ???n ????ng k?? khi t??i kho???n ???? t???n t???i:
  const disableButtonRegister = (check) => {
    disableButtonActive.current = check;
  };

  //L???y ng??y th??ng n??m sinh:
  const getBirthday = (birthday) => {
    memberRegistrationInfo.current.birthday = birthday;
  };

  //L???y zipcode:
  const getZipCode = (zipcode) => {
    memberRegistrationInfo.current.zipCode = zipcode;
  };

  //Ki???m tra tr???ng th??i validate c???a th??ng tin:
  //Validtate t??i kho???n ????ng k??:
  const getValidUserName = (active) => {
    checkValidateInformationUserForm.current.validateNumberPhone = active;
  };

  //Validate m???t kh???u:
  const getValidatePassword = (active) => {
    checkValidateInformationUserForm.current.validatePassword = active;
  };

  //Validate ng??y sinh:
  const getValidateBirthDay = (active) => {
    checkValidateInformationUserForm.current.validateBirthDay = active;
  };

  //Validate m?? zipcode:
  const getValidateZipCode = (active) => {
    checkValidateInformationUserForm.current.validateZipCode = active;
  };

  //Cu???n l??n n???u th??ng tin ???????c valid:
  const activeScrollViewToTop = () => {
    ref.current.scrollTo({x: 0, y: 0, animated: true});
  };

  //M???t m???ng ?????y ra ngo??i n??y:
  const checkNetErrorRegis = (event) => {
    if (event == 'NETWORK_ERROR') {
      setStateMessValid(STRING.network_error_try_again_later);
    }
  };
  //G??n c??c gi?? tr??? v??o c??c OJB t????ng ???ng:
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

  //L???y c??c mess th??ng b??o sai valid c???a c??c th??nh ph???n ????ng k??:
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

  //Ph???n ch??? ch?? ?? m??u ????? b??o l???i Valid:
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

  //Th???c hi???n qu?? tr??nh ki???m tra validate l???n cu???i:
  const checkValidateInformationRegistration = () => {
    if (
      checkValidateInformationUserForm.current.validateNumberPhone &&
      checkValidateInformationUserForm.current.validatePassword
    ) {
      return true;
    }
    return false;
  };
  //T???t l???a ch???n gi???i t??nh:
  const offBoxChooseGender = () => {
    refCardInfomation.current.focusZipCodeOffChooseGender();
  };

  //Th???c hi???n qu?? tr??nh ????ng k?? t??i kho???n: (??i???u ki???n ph???i nh???p ????? th??ng tin)
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
            {/* B???ng ????ng nh???p s??? ??i???n tho???i v?? m???t kh???u */}
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
            {/* ????ng k?? th??ng tin ng?????i d??ng */}
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
            {/* Hi???n th??? ch??? ????? valid: ho???c th??ng b??o l???i */}
            {renderMegErrorMessValid()}
            {/* Hi???n th??? n??t ????ng k?? ng?????i d??ng sau khi ????? ??i???n ?????y ????? th??ng tin */}
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
                ??????
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
      <AppHeader title={'??????????????????'} leftGoBack />
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
