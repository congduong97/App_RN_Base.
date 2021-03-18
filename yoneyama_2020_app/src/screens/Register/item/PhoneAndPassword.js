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
import {SIZE, COLOR, FetchApi, isIos, ToastService} from '../../../utils';
import {Validate} from '../../../utils/modules/Validate';

//Services:
import {ServicesCheckValidateForm} from '../util/ServicesCheckValidateForm';

function PhoneAndPassword(props, ref) {
  //Vaiable:
  let phoneInput = useRef('');
  let phoneInputConfirm = useRef('');
  let passWordInput = useRef('');
  let passwordConfirm = useRef('');
  const {
    getPassword,
    getValidateNumberPhone,
    getnumberPhone,
    getValidatePassword,
    checkValidPhoneAPI,
    checkValidPassWord,
    onHideChoseSex,
  } = props;
  const [phoneLogin, setStatePhoneLogin] = useState('');
  const [phoneConfirm, setStatePhoneConfirm] = useState('');
  const [passwordLogin, setStatePasswordLogin] = useState('');
  const [passConfirm, setStatePassConfirm] = useState('');
  const [messNumberPhone, setStateMegNumberPhone] = useState('');
  const [messPhoneConfirm, setStateMegPhoneConfirm] = useState('');
  const [messPassword, setStateMessPassWord] = useState('');
  const [megPassConfirm, setStateMegPassConfirm] = useState('');
  const [showPass, setStateShowPass] = useState(false);
  const [showConfirmPass, setStateShowConfirmPass] = useState(false);
  const messPhoneRegis = useRef('入力間違い防止のため再度ご入力ください。');

  useEffect(() => {
    ServicesCheckValidateForm.onChange('CheckNumberPhoneAndPass', (event) => {
      if (event && event.clickButtonregistration == 'CLICK_REGISTER_ACCOUNT') {
        checkValidPhoneAndPass();
      }
    });
    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({
    checkValidPhoneUseAPI,
    messHaveAccount,
  }));

  //Nhâp số điện thoại sẽ đăng kí:
  const onChangeNumberPhone = (phoneNumber) => {
    let numberPhoneConvert = numberToPhoneConvert(phoneNumber);
    setStatePhoneLogin(numberPhoneConvert);
    phoneInput.current = phoneNumber.replace(/-/g, '');
    //Số điện thoại bắt đầu không phải là số  0 :
    //Lớn hơn 0 và nhỏ hơn 11 số:
    if (
      phoneInput.current &&
      phoneInput.current.length > 0 &&
      phoneInput.current.length < 11
    ) {
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
      setStateMegNumberPhone('11桁で入力してください。');
    }

    if (phoneNumber && phoneNumber.slice(0, 1) !== '0') {
      setStateMegNumberPhone('電話番号のフォマットは正しいくないです');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    } else {
      if (
        phoneInputConfirm.current &&
        phoneNumber.replace(/-/g, '') == phoneInputConfirm.current
      ) {
        setStateMegPhoneConfirm('');
      }
      if (
        phoneInputConfirm.current &&
        phoneNumber.replace(/-/g, '') != phoneInputConfirm.current
      ) {
        checkValidPhoneAPI('CAN_NOT_USE_PHONE');
        setStateMegPhoneConfirm('携帯電話番号が一致していません。');
      }
    }

    //Số điện thoại bắt đầu là số 0 và độ dài < 11:
    if (
      phoneNumber &&
      phoneNumber.slice(0, 1) == '0' &&
      phoneNumber.length < 11 &&
      phoneNumber.length > 0
    ) {
      setStateMegNumberPhone('11桁で入力してください。');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    //Đủ 11 số và bắt đầu là số 0 thì gọi API kiểm tra valid số điện thoại tồn tại hay chưa?
    if (
      phoneInput.current &&
      phoneInput.current.length == 11 &&
      phoneInput.current.slice(0, 1) == '0'
    ) {
      checkValidPhoneUseAPI();
    } else {
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
  };

  //Gọi API kiểm tra số điện thoại có tồn tại trên hệ thông chưa:
  const checkValidPhoneUseAPI = async () => {
    if (phoneLogin) {
      const response = await FetchApi.isExistPhoneNumber(phoneInput.current);
      if (response && response.data && response.success) {
        if (phoneInput.current == phoneInputConfirm.current) {
          checkValidPhoneAPI('USABLE_PHONE');
          getnumberPhone(phoneInputConfirm.current);
          setStateMegNumberPhone('');
          getValidateNumberPhone(true);
        } else {
          checkValidPhoneAPI('CAN_NOT_USE_PHONE');
          setStateMegNumberPhone('');
        }
      } else {
        if (response && response.message == 'Network request failed') {
          ToastService.showToast(
            'ネットワークに接続できませんでした。後でやり直してください。',
          );
          setStateMegNumberPhone('');
        } else {
          checkValidPhoneAPI('CAN_NOT_USE_PHONE');
          setStateMegNumberPhone('すでに登録済みの会員番号です');
        }
      }
    }
  };

  //Nhâp số điện thoại xác thực:
  const onChangeNumberConfirmPhone = (phoneNumberConfirm) => {
    let numberPhoneConfirm = numberToPhoneConvert(phoneNumberConfirm);
    phoneInputConfirm.current = phoneNumberConfirm.replace(/-/g, '');
    if (!phoneInput.current) {
      setStateMegNumberPhone('本項目は必須です。');
    }
    //Số điện thoại bắt đầu không phải là số  0 :
    if (
      phoneNumberConfirm &&
      phoneNumberConfirm.slice(0, 1) !== '0' &&
      phoneInput.current
    ) {
      setStateMegPhoneConfirm('電話番号のフォマットは正しいくないです');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }

    //Số điện thoại đăng kí tồn tại và đủ 11 số và số điện thoại xác thực >0 && <11 số:
    if (
      phoneInput.current &&
      phoneInput.current.length == 11 &&
      phoneInputConfirm.current &&
      phoneInputConfirm.current.length > 0 &&
      phoneInputConfirm.current.length < 11
    ) {
      setStateMegPhoneConfirm('携帯電話番号が一致していません。');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    if (
      (phoneInputConfirm.current && phoneInputConfirm.current.length != 11) ||
      phoneInputConfirm.current.slice(0, 1) !== '0'
    ) {
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
      // setStateMegPhoneConfirm('11桁で入力してください。');
    } else {
      checkPhoneRegisLikePhoneConfirm();
    }
    setStatePhoneConfirm(numberPhoneConfirm);
  };

  //Đối ứng số điện thoại xác thực và số đăng kí.
  const checkPhoneRegisLikePhoneConfirm = () => {
    if (
      phoneInput.current == phoneInputConfirm.current &&
      messNumberPhone == 'すでに登録済みの会員番号です'
    ) {
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
      setStateMegPhoneConfirm('すでに登録済みの会員番号です');
      return;
    }
    if (
      phoneInput.current == phoneInputConfirm.current &&
      phoneInput.current.slice(0, 1) == '0' &&
      phoneInputConfirm.current.slice(0, 1) == '0'
    ) {
      //Đẩy số điện thoại đã validate và đẩy ra ngoài:
      getValidateNumberPhone(true);
      getnumberPhone(phoneInputConfirm.current);
      checkValidPhoneAPI('USABLE_PHONE');
      setStateMegPhoneConfirm('');
    } else {
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
      setStateMegPhoneConfirm('携帯電話番号が一致していません。');
    }
  };

  //Mật khẩu đăng nhập:
  const inputPass = (inputPassword) => {
    passWordInput.current = inputPassword;
    const checkValidPass = Validate.password(inputPassword);
    setStatePasswordLogin(inputPassword);
    //Không có số điện thoại đăng kí:
    if (!phoneInput.current) {
      setStateMegNumberPhone('本項目は必須です');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    //Không có số điện thoại xác thực:
    if (!phoneInputConfirm.current) {
      setStateMegPhoneConfirm('本項目は必須です');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    //Không có mật khẩu xác thực:
    if (!passwordConfirm.current) {
      // setStateMegPassConfirm('本項目は必須です');
      checkValidPassWord('CAN_NOT_USE_PASS');
    }
    //Có mật khẩu xác thực và mật khẩu đăng kí không giống:
    if (passwordConfirm.current && inputPassword !== passwordConfirm.current) {
      checkValidPassWord('CAN_NOT_USE_PASS');
    }
    //Kiểm tra validate:
    if (!checkValidPass.status) {
      setStateMessPassWord(checkValidPass.message);
    } else {
      setStateMessPassWord('');
      if (passwordConfirm.current) {
        if (inputPassword == passwordConfirm.current) {
          setStateMessPassWord('');
          setStateMegPassConfirm('');
          checkValidPassWord('USABLE_PASS');
          getValidatePassword(true);
          getPassword(passwordConfirm.current);
        } else {
          setStateMegPassConfirm('パスワードに誤りがあります。');
          checkValidPassWord('CAN_NOT_USE_PASS');
        }
      }
    }
  };

  //Thông báo người dùng đang nhập sai định dạng mật khẩu:
  const alertErrorPassword = (checkPasswordValidate) => {
    if (!checkPasswordValidate.status) {
      setStateMessPassWord(checkPasswordValidate.message);
      checkValidPassWord('CAN_NOT_USE_PASS');
    } else {
      setStateMessPassWord(null);
    }
  };

  //Nhập mật khẩu xác thực:
  const inPutConfirmPass = (inputPassConfirm) => {
    passwordConfirm.current = inputPassConfirm;
    const checkValidPassConfirm = Validate.password(inputPassConfirm);
    setStatePassConfirm(inputPassConfirm);
    //Không nhập số điện thoại:
    if (!phoneInput.current) {
      setStateMegNumberPhone('本項目は必須です');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    //Không có số điện thoại xác thực:
    if (!phoneInputConfirm.current) {
      setStateMegPhoneConfirm('本項目は必須です');
      checkValidPhoneAPI('CAN_NOT_USE_PHONE');
    }
    //Không có mật khẩu đăng kí:
    if (!passWordInput.current) {
      setStateMessPassWord('本項目は必須です');
      checkValidPassWord('CAN_NOT_USE_PASS');
    }

    //Có mật khẩu đăng kí và mật khẩu xác thực không giống:
    if (passWordInput.current && inputPassConfirm !== passWordInput.current) {
      checkValidPassWord('CAN_NOT_USE_PASS');
    }
    if (checkValidPassConfirm && !checkValidPassConfirm.status) {
      setStateMegPassConfirm('パスワードに誤りがあります。');
      checkValidPassWord('CAN_NOT_USE_PASS');
    } else {
      if (
        passWordInput.current &&
        inputPassConfirm === passWordInput.current &&
        !messPassword
      ) {
        if (messNumberPhone || messPhoneConfirm) {
          checkValidPhoneAPI('CAN_NOT_USE_PHONE');
          getPassword(passWordInput.current);
          getValidatePassword(true);
          setStateMegPassConfirm('');
          setStateMessPassWord('');
        } else {
          checkValidPassWord('USABLE_PASS');
          getPassword(passWordInput.current);
          getValidatePassword(true);
          setStateMegPassConfirm('');
          setStateMessPassWord('');
        }
      } else {
        setStateMegPassConfirm('パスワードに誤りがあります。');
      }
    }
  };

  //Kiểm tra mật khẩu xác thực lại có giống nhau không:
  const checkValidPassConfirm = () => {
    if (passWordInput.current != passwordConfirm.current) {
      setStateMegPassConfirm('パスワードに誤りがあります。');
    } else {
      setStateMegPassConfirm('');
    }
  };

  //mask numbers xxx-xxxx-xxxx
  const numberToPhoneConvert = (number) => {
    let num = number.replace(/-/g, '');
    if (num) {
      if (num.length > 4 && num.length < 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1$2');
      } else if (num.length > 4 && num.length == 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{3})([0-9]{4}$)/gi, '$1$2');
      } else if (num.length > 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{1,3})([0-9]{4})([0-9]{4}$)/gi, '$1$2$3');
      }
    } else {
      return;
    }
  };

  //Kiểm tra tài khoản và mật khẩu validate:
  const checkValidPhoneAndPass = () => {
    //Kiểm tra validate số điện thoại:
    if (!phoneInput.current) {
      setStateMegNumberPhone('本項目は必須です。');
    } else {
      let checkPhoneValidate = Validate.phoneNumber(phoneInput.current);
      alertErrorNumberPhone(checkPhoneValidate);
    }
    //Kiểm tra validate số điện thoại xác thực:
    if (!phoneInputConfirm.current) {
      setStateMegPhoneConfirm('本項目は必須です。');
    } else {
      checkPhoneRegisLikePhoneConfirm();
    }
    //Kiểm tra validate mật khẩu:
    if (!passWordInput.current) {
      setStateMessPassWord('本項目は必須です。');
    } else {
      let checkPasswordValidate = Validate.password(passWordInput.current);
      alertErrorPassword(checkPasswordValidate);
    }
    //Kiểm tra mật khẩu xác thực:
    if (!passwordConfirm.current) {
      setStateMegPassConfirm('本項目は必須です。');
    } else {
      checkValidPassConfirm();
    }
  };

  //Cảnh báo sai định dạng số điện thoại:
  const alertErrorNumberPhone = (checkPhoneValidate) => {
    if (!checkPhoneValidate.status) {
      setStateMegNumberPhone(checkPhoneValidate.content);
    } else {
      setStateMegNumberPhone(null);
    }
  };

  //Cảnh báo sai validate :
  const showErrorValidate = (messError) => {
    return <AppText style={styles.messValidateInfo}>{messError}</AppText>;
  };

  //Hiển thị mess nhập số điện thoại sẽ đăng kí :
  const showMessRegis = () => {
    return (
      <AppText style={styles.megPhoneRegister}>
        {messPhoneRegis.current}
      </AppText>
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
    setStateMegNumberPhone('すでに登録済みの会員番号です');
  };

  //Ấn nút hiển thị mật khẩu xác thực:
  const pressShowPassConfirm = () => {
    setStateShowConfirmPass(!showConfirmPass);
  };

  //Container Item:
  const boxTitleInput = (name) => {
    return (
      <View
        style={{
          width: SIZE.width(37),
          backgroundColor: '#D9EAD3',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AppText style={styles.textTitleInput}>{name}</AppText>
      </View>
    );
  };

  //Container Item:
  const boxTitleInputConfirmPhone = (name) => {
    return (
      <View
        style={{
          width: SIZE.width(37),
          backgroundColor: '#D9EAD3',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AppText style={styles.textTitleInputPhone}>{name}</AppText>
      </View>
    );
  };

  //Khung nhập số điện thoại:
  const inputNumberPhone = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          {/* Phần ô màu xanh chứa cả lưu ý bắt buộc */}
          {boxTitleInput('携帯電話番号')}
          {/* Phần nhập số điện thoại: */}
          <TextInput
            placeholderTextColor={COLOR.grey_500}
            placeholder={'電話番号を入力'}
            numberOfLines={1}
            maxLength={11}
            value={phoneLogin}
            onChangeText={(text) => onChangeNumberPhone(text)}
            keyboardType={'numeric'}
            style={styles.boxInputPhone}
            onFocus={onHideChoseSex}
          />
        </View>
        {messNumberPhone ? showErrorValidate(messNumberPhone) : null}
        {showMessRegis()}
      </View>
    );
  };

  //Khung nhập lại số điện thoại đăng kí:
  const inputConfirmPhone = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          {/* Phần ô màu xanh chứa cả lưu ý bắt buộc */}
          {boxTitleInputConfirmPhone('携帯電話番号 再入力')}
          {/* Phần nhập số điện thoại: */}
          <TextInput
            placeholderTextColor={COLOR.grey_500}
            placeholder={'電話番号を入力'}
            numberOfLines={1}
            maxLength={11}
            value={phoneConfirm}
            onChangeText={(phone) => onChangeNumberConfirmPhone(phone)}
            keyboardType={'numeric'}
            style={styles.boxInputPhone}
            onFocus={onHideChoseSex}
          />
        </View>
        {messPhoneConfirm ? showErrorValidate(messPhoneConfirm) : null}
      </View>
    );
  };

  //Khung nhập mật khẩu:
  const inputPassword = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          {boxTitleInput('パスワード')}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EAECF0',
              alignItems: 'center',
              marginLeft: SIZE.width(1),
            }}>
            {/* Phần nhập mật khẩu: */}
            <TextInput
              blurOnSubmit={false}
              onSubmitEditing={() => Keyboard.dismiss()}
              textContentType={'password'}
              keyboardType={'ascii-capable'}
              placeholderTextColor={COLOR.grey_500}
              placeholder={'パスワードを入力'}
              numberOfLines={1}
              maxLength={32}
              defaultValue={passwordLogin}
              onChangeText={(text) => inputPass(text)}
              secureTextEntry={showPass ? false : true}
              style={styles.boxInputPass}
              onFocus={onHideChoseSex}
            />
            {passwordLogin ? (
              <TouchableOpacity
                onPress={pressShowPass}
                style={{width: SIZE.width(8)}}>
                <Entypo name={showEye()} color="black" size={18} />
              </TouchableOpacity>
            ) : (
              <View style={{width: SIZE.width(8)}} />
            )}
          </View>
        </View>
        {messPassword ? showErrorValidate(messPassword) : null}
      </View>
    );
  };

  //Khung nhập mật khẩu xác nhận:
  const inputPasswordConfirm = () => {
    return (
      <View>
        <View style={styles.boxItem}>
          {boxTitleInput('パスワード確認')}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EAECF0',
              alignItems: 'center',
              marginLeft: SIZE.width(1),
            }}>
            {/* Phần nhập mật khẩu xác nhận: */}
            <TextInput
              blurOnSubmit={false}
              onSubmitEditing={() => Keyboard.dismiss()}
              textContentType={'password'}
              keyboardType={'ascii-capable'}
              placeholderTextColor={COLOR.grey_500}
              placeholder={'パスワードを入力'}
              numberOfLines={1}
              maxLength={32}
              defaultValue={passConfirm}
              onChangeText={(text) => inPutConfirmPass(text)}
              secureTextEntry={showConfirmPass ? false : true}
              style={styles.boxInputPass}
              onFocus={onHideChoseSex}
            />
            {passConfirm ? (
              <TouchableOpacity
                onPress={pressShowPassConfirm}
                style={{width: SIZE.width(8)}}>
                <Entypo name={showEyeConfirm()} color="black" size={18} />
              </TouchableOpacity>
            ) : (
              <View style={{width: SIZE.width(8)}} />
            )}
          </View>
        </View>
        {megPassConfirm ? showErrorValidate(megPassConfirm) : null}
      </View>
    );
  };

  return (
    <View
      style={{
        width: SIZE.width(97),
        marginLeft: SIZE.width(3),
      }}>
      {/* Nhập số điện thoại */}
      {inputNumberPhone()}
      {/* Nhập số điện thoại xác thực */}
      {inputConfirmPhone()}
      {/* Nhập mật khẩu */}
      {inputPassword()}
      {/* Xác nhận mật khẩu */}
      {inputPasswordConfirm()}
    </View>
  );
}
const styles = StyleSheet.create({
  messValidateInfo: {
    color: COLOR.red,
    fontSize: 12,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
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
    height: SIZE.width(10.5),
    width: SIZE.width(90),
    flexDirection: 'row',
    marginTop: SIZE.width(1),
  },
  //Khung chứa ô input số điện thoại:
  boxInputPhone: {
    width: SIZE.width(56),
    marginLeft: SIZE.width(1),
    color: COLOR.grey_900,
    backgroundColor: '#EAECF0',
    paddingLeft: SIZE.width(2),
    fontSize: SIZE.H5,
  },
  //Khung chứa ô nhập mật khẩu:
  boxInputPass: {
    width: SIZE.width(48),
    color: COLOR.grey_900,
    paddingLeft: SIZE.width(2),
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
const ContainerPhoneAndPassword = forwardRef(PhoneAndPassword);
export {ContainerPhoneAndPassword};
