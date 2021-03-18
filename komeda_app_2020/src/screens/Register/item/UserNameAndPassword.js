//Library:
import React, {
  useEffect,
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, COLOR, FetchApi, isIos} from '../../../utils';
import {Validate} from '../../../utils/modules/Validate';

//Services:
import {ServicesCheckValidateForm} from '../util/ServicesCheckValidateForm';
import {STRING} from '../../../utils/constants/String';

function PhoneAndPassword(props, ref) {
  //Vaiable:
  let userNameAccount = useRef('');
  let passWordAccount = useRef('');
  let passwordConfirmAccount = useRef('');
  const {
    getUserName,
    getPassword,
    getValidUserName,
    getValidatePassword,
    checkNetErrorRegis,
    getMessValid,
    offBoxChooseGender,
    disableButtonRegister,
  } = props;
  const keyGetMessValid = {
    keyEmail: 'EMAIL_INPUT',
    keyPassWord: 'PASSWORD_INPUT',
    keyPassWordConfirm: 'PASSWORD_CONFIRM_INPUT',
  };
  const [userName, setStateUserName] = useState('');
  const [passWord, setStatePassWord] = useState('');
  const [passConfirm, setStatePassConfirm] = useState('');
  const [messUserName, setStateMegUserName] = useState('');
  const messPassword = useRef('');
  const [showPass, setStateShowPass] = useState(false);
  const [showConfirmPass, setStateShowConfirmPass] = useState(false);

  useEffect(() => {
    ServicesCheckValidateForm.onChange('CheckNumberPhoneAndPass', (event) => {
      if (event && event.clickButtonregistration == 'CLICK_REGISTER_ACCOUNT') {
        checkUserNameAPI(true);
        checkValidUserameAndPass();
      }
    });
    return () => {};
  }, []);

  //Đẩy ref ra ngoài:
  useImperativeHandle(ref, () => ({
    checkUserNameAPI,
    messHaveAccount,
  }));

  //Kiểm tra tài khoản và mật khẩu validate khi chưa nhập thông tin gì ấn vào đăng kí:
  const checkValidUserameAndPass = () => {
    //Kiểm tra validate tài khoản:
    if (!userNameAccount.current) {
      setStateMegUserName(STRING.compulsory_fields);
      getMessValid(STRING.need_input_email, keyGetMessValid.keyEmail);
    } else {
      checkStatusValidInputUserName();
    }
    //Kiểm tra validate mật khẩu:
    if (!passWordAccount.current) {
      messPassword.current = STRING.compulsory_fields;
      getMessValid(STRING.need_input_password, keyGetMessValid.keyPassWord);
    } else {
      checkStatusValidPassInput();
    }
    //Kiểm tra mật khẩu xác thực:
    if (!passwordConfirmAccount.current) {
      getMessValid(
        STRING.need_input_pass_confirm,
        keyGetMessValid.keyPassWordConfirm,
      );
    } else {
      checkValidPassConfirm();
    }
  };

  //1.(Phần kiểm tra valid và thông báo mess lỗi):
  //Kiểm tra tài khoản đăng kí:
  const checkStatusValidInputUserName = () => {
    let checkUserNameValid = Validate.email(userNameAccount.current);
    showMessWrongUserName(checkUserNameValid);
  };

  //Kiểm tra mật khẩu :
  const checkStatusValidPassInput = () => {
    let checkPasswordValidate = Validate.password(passWordAccount.current);
    if (!checkPasswordValidate.status) {
      messPassword.current = checkPasswordValidate.message;
      getMessValid(checkPasswordValidate.message, keyGetMessValid.keyPassWord);
    } else {
      messPassword.current = '';
      getMessValid('', keyGetMessValid.keyPassWord);
    }
  };

  //Kiểm tra mật khẩu xác thực lại có giống nhau không:
  const checkValidPassConfirm = () => {
    if (messUserName) {
      if (
        passWordAccount.current != passwordConfirmAccount.current &&
        passWordAccount.current.length > 0 &&
        passwordConfirmAccount.current.length > 0
      ) {
        getValidatePassword(false);
        getMessValid(
          STRING.pass_confirm_wrong,
          keyGetMessValid.keyPassWordConfirm,
        );
      } else {
        getMessValid('', keyGetMessValid.keyPassWordConfirm);
        getPassword(passwordConfirmAccount.current);
        getValidatePassword(true);
      }
    } else {
      if (
        passWordAccount.current != passwordConfirmAccount.current &&
        passWordAccount.current.length > 0 &&
        passwordConfirmAccount.current.length > 0
      ) {
        getValidatePassword(false);
        getMessValid(
          STRING.pass_confirm_wrong,
          keyGetMessValid.keyPassWordConfirm,
        );
      } else {
        if (passWordAccount.current.length > 7 && !messPassword.current) {
          getMessValid('', keyGetMessValid.keyPassWordConfirm);
          getPassword(passwordConfirmAccount.current);
          getValidatePassword(true);
        } else {
          getValidatePassword(false);
          getMessValid('', keyGetMessValid.keyPassWordConfirm);
        }
      }
    }
  };

  //2.Phần nhập thông tin tài khoản và mật khẩu đăng kí:
  //Nhâp tài khoản đăng kí:
  const onChangeUserName = (inputUserName) => {
    userNameAccount.current = inputUserName;
    setStateUserName(inputUserName);
    if (!inputUserName) {
      getValidUserName(false);
    }
  };

  //Mật khẩu đăng nhập:
  const onChangePass = (inputPassword) => {
    setStatePassWord(inputPassword);
    passWordAccount.current = inputPassword;
    checkStatusValidPassInput();
    if (!inputPassword) {
      messPassword.current = '';
      getMessValid('', keyGetMessValid.keyPassWord);
    } else {
      if (
        passwordConfirmAccount.current &&
        passwordConfirmAccount.current != passWordAccount.current
      ) {
        getValidatePassword(false);
        getMessValid(
          STRING.pass_confirm_wrong,
          keyGetMessValid.keyPassWordConfirm,
        );
      } else {
        if (!userNameAccount.current) {
          setStateMegUserName(STRING.compulsory_fields);
          getMessValid(STRING.need_input_email, keyGetMessValid.keyEmail);
        }
        if (
          passwordConfirmAccount.current &&
          inputPassword == passwordConfirmAccount.current
        ) {
          getMessValid('', keyGetMessValid.keyPassWordConfirm);
        }
        if (
          passwordConfirmAccount.current &&
          inputPassword != passwordConfirmAccount.current
        ) {
          getValidatePassword(false);
          getMessValid(
            STRING.pass_confirm_wrong,
            keyGetMessValid.keyPassWordConfirm,
          );
        }
      }
    }
  };

  //Nhập mật khẩu xác thực:
  const onChangePassConfirm = (inputPassConfirm) => {
    passwordConfirmAccount.current = inputPassConfirm;
    setStatePassConfirm(inputPassConfirm);
    if (!passWordAccount.current) {
      messPassword.current = STRING.compulsory_fields;
      getMessValid(STRING.need_input_password, keyGetMessValid.keyPassWord);
    }
    if (!userNameAccount.current) {
      setStateMegUserName(STRING.compulsory_fields);
      getMessValid(STRING.need_input_email, keyGetMessValid.keyEmail);
    }
    if (!passwordConfirmAccount.current) {
      getValidatePassword(false);
    }
    checkValidPassConfirm();
  };

  //3.Hiển thị thông báo lỗi cho người dùng biết các thông tin đang bị sai:

  //Thông báo người dùng đang nhập sai định dạng tài khoản:
  const showMessWrongUserName = (checkUserNameValidate) => {
    if (!checkUserNameValidate.status) {
      setStateMegUserName(checkUserNameValidate.message);
      getMessValid(checkUserNameValidate.message, keyGetMessValid.keyEmail);
    } else {
      getMessValid('', keyGetMessValid.keyEmail);
    }
    getValidUserName(checkUserNameValidate.status);
  };

  //Kiểm tra validate và gọi API kiểm tra tài khoản đã tồn tại trên hệ thống chưa:
  const checkUserNameAPI = async (eventClickButton) => {
    disableButtonRegister(false);
    if (userNameAccount.current) {
      let checkUserNameValid = Validate.email(userNameAccount.current);
      showMessWrongUserName(checkUserNameValid);
      //Đồng thời kiểm tra mật khẩu sửa đổi:
      if (
        passWordAccount.current &&
        passwordConfirmAccount.current &&
        passWordAccount.current != passwordConfirmAccount.current &&
        eventClickButton
      ) {
        getValidatePassword(false);
      }
      if (checkUserNameValid.status) {
        const response = await FetchApi.validateEmailAPI(
          userNameAccount.current,
        );
        if (response && response.status_code == 502) {
          getMessValid(STRING.server_maintain, keyGetMessValid.keyEmail);
          getValidUserName(false);
        }
        //Mất mang:
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          checkNetErrorRegis('NETWORK_ERROR');
          getMessValid(
            STRING.network_error_try_again_later,
            keyGetMessValid.keyEmail,
          );
          getValidUserName(false);
        }
        //Call thành công và response.data ==true là được phép đăng kí:
        if (
          response &&
          response.code == 1000 &&
          response.status_code == 200 &&
          response.data
        ) {
          setStateMegUserName('');
          getMessValid('', keyGetMessValid.keyEmail);
          getValidUserName(true);
          getUserName(userNameAccount.current);
          checkNetErrorRegis('NETWORK_SUCCESS');
        }
        //Call thành công và response.data ==false là có trong hệ thống và không được dùng:
        if (
          response &&
          response.code == 1000 &&
          response.status_code == 200 &&
          !response.data
        ) {
          disableButtonRegister(true);
          setStateMegUserName(STRING.username_already_exists_in_data);
          getMessValid(
            STRING.username_already_exists_in_data,
            keyGetMessValid.keyEmail,
          );
          getValidUserName(false);
          checkNetErrorRegis('NETWORK_SUCCESS');
        }
      }
    }
  };

  //Hiển thị tiêu đề phần sẽ đăng kí:
  const renderTitleFormLogin = (title, top) => {
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

  //Tên của itcon nhập mật khẩu:
  const showEye = () => {
    if (showPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };

  //Tên icon của nhập lại mật khẩu:
  const showEyeConfirm = () => {
    if (showConfirmPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };

  //Ấn nút: hiển thị mật khẩu.
  const pressShowPass = () => {
    setStateShowPass(!showPass);
  };

  //Tài khoản đã được đăng kí :
  const messHaveAccount = () => {
    setStateMegUserName(STRING.username_already_exists_in_data);
    getMessValid(
      STRING.username_already_exists_in_data,
      keyGetMessValid.keyEmail,
    );
  };

  //Ấn nút hiển thị mật khẩu xác thực:
  const pressShowPassConfirm = () => {
    setStateShowConfirmPass(!showConfirmPass);
  };

  //Nhập tài khoản đăng kí:
  const setUserName = () => {
    return (
      <View>
        <TextInput
          keyboardType={'email-address'}
          textContentType={'password'}
          autoCapitalize={'none'}
          onFocus={offBoxChooseGender}
          onBlur={checkUserNameAPI}
          placeholderTextColor={COLOR.grey_500}
          placeholder={'メールアドレス入力'}
          numberOfLines={1}
          value={userName}
          onChangeText={(text) => onChangeUserName(text)}
          style={styles.boxInputPhone}
        />
      </View>
    );
  };

  //Khung nhập mật khẩu:
  const setPassWord = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Phần nhập mật khẩu: */}
            <TextInput
              keyboardType={'ascii-capable'}
              textContentType={'password'}
              blurOnSubmit={false}
              onFocus={offBoxChooseGender}
              onSubmitEditing={() => Keyboard.dismiss()}
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
                  height: SIZE.width(12),
                  width: SIZE.width(12),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Entypo name={showEye()} color={COLOR.COFFEE_BROWN} size={18} />
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
        </View>
      </View>
    );
  };
  const textNote = () => {
    return (
      <>
        <AppText
          style={{
            marginHorizontal: SIZE.width(4),
            marginTop: SIZE.width(2),
            color: COLOR.COFFEE_RED,
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5 * 0.92,
          }}>
          パスワードは8文字以上32文字以内かつ英数それぞれ1文字以上含め入力してください。
        </AppText>
      </>
    );
  };
  //Khung nhập mật khẩu xác nhận:
  const setPasswordConfirm = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* Phần nhập mật khẩu xác nhận: */}
            <TextInput
              keyboardType={'ascii-capable'}
              textContentType={'password'}
              onFocus={offBoxChooseGender}
              blurOnSubmit={false}
              onSubmitEditing={() => Keyboard.dismiss()}
              placeholderTextColor={COLOR.grey_500}
              placeholder={'パスワード再入力'}
              numberOfLines={1}
              maxLength={32}
              defaultValue={passConfirm}
              onChangeText={(text) => onChangePassConfirm(text)}
              secureTextEntry={showConfirmPass ? false : true}
              style={styles.boxInputPass}
              autoCapitalize='none'
            />
            {passConfirm ? (
              <TouchableOpacity
                onPress={pressShowPassConfirm}
                style={{
                  width: SIZE.width(12),
                  height: SIZE.width(12),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Entypo
                  name={showEyeConfirm()}
                  color={COLOR.COFFEE_BROWN}
                  size={18}
                />
              </TouchableOpacity>
            ) : (
              <View style={{width: SIZE.width(12)}} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* Tiêu đề phần tài khoản: */}
      {renderTitleFormLogin('メールアドレス', 0)}
      {/* Nhập số điện thoại */}
      {setUserName()}
      {/* Tiêu đề phần nhập mật khẩu: */}
      {renderTitleFormLogin('パスワード', 3)}
      {/* Nhập mật khẩu */}
      {setPassWord()}
      {textNote()}
      {/* Xác thực mật khẩu */}
      {setPasswordConfirm()}
    </View>
  );
}
const styles = StyleSheet.create({
  messValidateInfo: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
    marginLeft: SIZE.width(4),
  },
  megPhoneRegister: {
    color: COLOR.red,
    fontSize: SIZE.H6 * 1.1,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
  },
  itemInput: {
    height: SIZE.width(10),
  },
  //Khung chứa toàn bộ itemInput:
  boxItem: {
    marginRight: SIZE.width(3),
    height: SIZE.width(12),
    flexDirection: 'row',
    marginLeft: SIZE.width(3),
    marginTop: SIZE.width(3),
    borderWidth: SIZE.width(0.2),
    borderColor: COLOR.COFFEE_LIGHT,
    borderRadius: SIZE.width(1),
  },
  //Khung chứa ô input số điện thoại:
  boxInputPhone: {
    marginTop: SIZE.width(3),
    marginLeft: SIZE.width(3),
    height: SIZE.width(12),
    width: SIZE.width(94),
    color: COLOR.grey_900,
    paddingLeft: SIZE.width(2),
    borderWidth: SIZE.width(0.2),
    borderColor: COLOR.COFFEE_LIGHT,
    fontSize: SIZE.H5,
    borderRadius: SIZE.width(1),
  },
  //Khung chứa ô nhập mật khẩu:
  boxInputPass: {
    width: SIZE.width(82),
    height: SIZE.width(12),
    color: COLOR.grey_900,
    paddingLeft: SIZE.width(3),
    fontSize: SIZE.H5,
  },
  //Chữ trong khung màu xanh:
  textTitleInput: {
    fontSize: SIZE.H5,
    color: COLOR.text_registration,
    marginLeft: SIZE.width(2),
  },
  //Chữ trong khung màu xanh của nhập lại số đt:
  textTitleInputPhone: {
    fontSize: isIos ? SIZE.H5 : 12,
    color: COLOR.text_registration,
    marginLeft: SIZE.width(1.5),
  },
});
const ContainerUserNameAndPassword = forwardRef(PhoneAndPassword);
export {ContainerUserNameAndPassword};
