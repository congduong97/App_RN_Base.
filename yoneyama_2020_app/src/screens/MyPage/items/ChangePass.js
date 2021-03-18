//Library:
import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

//Setup:
import {SIZE, COLOR, Validate} from '../../../utils';

//Component:
import {AppText} from '../../../elements/AppText';

//Service:
import {AccountService} from '../../../utils/services/AccountService';
import {ServicesActiveUpdateInfo} from '../util/ServicesActiveUpdateInfo';

function ChangePass(props, ref) {
  const {getPassUpdate, checkValidPass, offFormChooseGender} = props;
  const passSaveLocal = useRef('');
  const passOld = useRef('');
  const passNew = useRef('');
  const confirmPass = useRef('');
  const [showOldPass, setStateShowOldPass] = useState(false);
  const [showNewPass, setStateShowNewPass] = useState(false);
  const [showConfirmNewPass, setStateShowConfirmNewPass] = useState(false);
  const [passLocal, setStatePassLocal] = useState('');
  const [newPass, setStateNewPass] = useState('');
  const [newPassConfirm, setStateNewPassConfirm] = useState('');
  const [megOldPass, setStateMegOldPass] = useState('');
  const [megNewPass, setStateMegNewPass] = useState('');
  const [megNewPasConfirm, setStateMegNewPassConfirm] = useState('');

  useEffect(() => {
    getPassSaveLocal();
    ServicesActiveUpdateInfo.onChange('checkUpdatePass', (update) => {
      if (update === 'UPDATE_INFO_MYPAGE') {
        checkValidInputPass();
      }
    });
    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({
    resetInputPass,
  }));

  //Reset lại toàn bộ pass khi mà update thành công:
  const resetInputPass = () => {
    if (passOld.current && passNew.current && confirmPass.current) {
      passSaveLocal.current = confirmPass.current;
      passOld.current = '';
      passNew.current = '';
      confirmPass.current = '';
      setStatePassLocal('');
      setStateNewPass('');
      setStateNewPassConfirm('');
    }
  };

  //Kiểm tra valid các mật khẩu:
  const checkValidInputPass = () => {
    //CASE 1: Nhập mật khẩu cũ và không nhập mật khẩu mới:
    if (passOld.current && !passNew.current && !confirmPass.current) {
      //CASE 1.1: Mật khẩu cũ trùng mật khẩu lưu:
      if (passOld.current === passSaveLocal.current) {
        checkValidPass('CAN_USE_NEWPASS');
        setStateMegOldPass('');
        setStateMegNewPass('');
        setStateMegNewPassConfirm('');
      }

      //CASE 1.2: Mật khẩu cũ khác mật khẩu được lưu:
      if (passOld.current !== passSaveLocal.current) {
        checkValidPass('WRONG_PASS');
        setStateMegOldPass('現在のパスワードが正しくありません。');
        setStateMegNewPass('');
        setStateMegNewPassConfirm('');
      }
      return;
    }

    //CASE 2 : Nhập mật khẩu mới mà không nhập mật khẩu cũ:
    if (passNew.current && confirmPass.current && !passOld.current) {
      checkValidPass('WRONG_PASS');
      setStateMegOldPass(
        'パスワードを変更したい場合、現在パスワードを入力は必須です。',
      );
      setStateMegNewPass('');
      setStateMegNewPassConfirm('');
      return;
    }
    //CASE 2.2:Nhập mật khẩu cũ, không nhập mật khẩu mới và có nhập lại mật khẩu xác thưc:
    if (
      passOld.current === passSaveLocal.current &&
      !passNew.current &&
      confirmPass.current
    ) {
      checkValidPass('WRONG_PASS');
      setStateMegOldPass('');
      setStateMegNewPass('本項目は必須です。');
      setStateMegNewPassConfirm('');
    }

    //CASE 2.3 :Nhập mật khẩu cũ, nhập mật khẩu mới mà không nhập mật khẩu xác thực:
    if (passOld.current && passNew.current && !confirmPass.current) {
      checkValidPass('WRONG_PASS');
      setStateMegOldPass('');
      setStateMegNewPass('');
      setStateMegNewPassConfirm('本項目は必須です。');
    }

    //CASE 3:Nhập đủ 3 mật khẩu:
    if (passOld.current && passNew.current && confirmPass.current) {
      // CASE 3-1: Mật khẩu cũ nhập vào không đúng mật khẩu được lưu Local:
      if (passOld.current !== passSaveLocal.current) {
        checkValidPass('WRONG_PASS');
        setStateMegOldPass('現在のパスワードが正しくありません。');
        setStateMegNewPass('');
        setStateMegNewPassConfirm('');
        return;
      }

      //CASE 3-2: Mật khẩu cũ nhập vào trùng mật khẩu được lưu và mật khẩu mới nhập vào trùng tiếp mật khẩu được lưu:
      if (
        passOld.current === passSaveLocal.current &&
        passNew.current === passOld.current
      ) {
        checkValidPass('WRONG_PASS');
        setStateMegOldPass('');
        setStateMegNewPass(
          '現在のパスワード、変更後パスワードが同一です。異なるパスワードを入力してください。',
        );
        setStateMegNewPassConfirm('');
        return;
      }

      //CASE 3-3: Mật khẩu cũ trùng mật khẩu được lưu, mật khẩu mới khác mật khẩu được lưu và mật khẩu xác thực lại ko giống mật khẩu mới:
      if (
        passOld.current === passSaveLocal.current &&
        passNew.current !== passSaveLocal.current &&
        confirmPass.current !== passNew.current
      ) {
        checkValidPass('WRONG_PASS');
        setStateMegOldPass('');
        setStateMegNewPass('');
        setStateMegNewPassConfirm('変更後パスワードが一致していません。');
        return;
      }

      //CASE 3-4:Mật khẩu cũ giống mật khẩu được lưu,mật khẩu mới khác mật khẩu được lưu và mật khẩu nhập lại bằng mật khẩu mới:
      if (
        passOld.current === passSaveLocal.current &&
        passNew.current !== passSaveLocal.current &&
        confirmPass.current === passNew.current
      ) {
        checkValidUpdatePass();
      }
    }
  };

  //Kiểm tra tiếp mật khẩu này có được phép valid để update không?
  const checkValidUpdatePass = () => {
    let checkValidNewPass = Validate.password(confirmPass.current);
    if (checkValidNewPass && !checkValidNewPass.status) {
      checkValidPass('WRONG_PASS');
      setStateMegNewPass(checkValidNewPass.message);
    } else {
      checkValidPass('CAN_USE_NEWPASS');
      getPassUpdate(confirmPass.current);
      setStateMegOldPass('');
      setStateMegNewPass('');
      setStateMegNewPassConfirm('');
    }
  };

  //Cảnh báo sai validate:
  const showWarningWrongValid = (mess) => {
    return (
      <AppText
        style={{
          color: COLOR.red,
          marginTop: SIZE.width(2),
          marginBottom: SIZE.width(1),
          fontSize: 12,
          lineHeight: SIZE.width(4),
        }}>
        {mess}
      </AppText>
    );
  };

  //Tên của itcon nhập mật khẩu cũ:
  const showEye = () => {
    if (showOldPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };
  //Tên icon nhập mật khẩu mới:
  const showEyeNewPass = () => {
    if (showNewPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };
  //Tên icon nhập lại mật khẩu:
  const showEyeNewPassConfirm = () => {
    if (showConfirmNewPass) {
      return 'eye';
    }
    return 'eye-with-line';
  };
  //Lấy mật khẩu được lưu dưới máy:
  const getPassSaveLocal = () => {
    const account = AccountService.getAccount();
    passSaveLocal.current = account ? account.password : '';
  };

  //Nhập mật khẩu cũ:
  const onChangePassOld = (oldPass) => {
    passOld.current = oldPass;
    if (oldPass == passSaveLocal.current) {
      setStateMegOldPass('');
    }
    setStatePassLocal(oldPass);
  };

  //Nhập mật khẩu mới:
  const onChangeNewPass = (newPass) => {
    if (newPass === confirmPass.current && !megNewPasConfirm) {
      setStateMegNewPass('');
    } else {
      if (confirmPass.current && newPass == confirmPass.current) {
        setStateMegNewPassConfirm('');
        setStateMegNewPass('');
      }
      if (confirmPass.current && newPass.length > confirmPass.current.length) {
        setStateMegNewPassConfirm('変更後パスワードが一致していません。');
      }
    }
    passNew.current = newPass;
    setStateNewPass(newPass);
  };

  //Nhập lại mật khẩu mới:
  const onChangeConfirmNewPass = (confirmNewPass) => {
    if (passNew.current && confirmNewPass == passNew.current) {
      setStateMegNewPassConfirm('');
    }
    confirmPass.current = confirmNewPass;
    setStateNewPassConfirm(confirmNewPass);
  };
  //Xem mật khẩu cũ:
  const seenOldPass = () => {
    setStateShowOldPass(!showOldPass);
  };
  //Xem mật khẩu mới:
  const seenNewPass = () => {
    setStateShowNewPass(!showNewPass);
  };

  //Xem mật khẩu nhập lại:
  const seenNewPassConfirm = () => {
    setStateShowConfirmNewPass(!showConfirmNewPass);
  };
  //Tắt form chọn giới tính:
  const offChooseGender = () => {
    offFormChooseGender();
  };

  //  Hiển thị tiêu đề thông tin
  const renderContent = (name) => {
    return (
      <View
        style={{
          height: SIZE.width(10.5),
          width: SIZE.width(37),
          backgroundColor: '#D9EAD3',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: SIZE.width(1),
        }}>
        <AppText
          style={{
            fontSize: name.length > 9 ? SIZE.H5 * 0.83 : SIZE.H5,
            color: COLOR.text_registration,
            marginLeft: SIZE.width(2),
          }}>
          {name}
        </AppText>
      </View>
    );
  };
  return (
    <View
      style={{
        marginTop: SIZE.width(3),
        marginLeft: SIZE.width(2),
        marginRight: SIZE.width(2),
        minHeight: SIZE.width(15),
      }}>
      {/* Mật khẩu cũ */}
      <View style={{flexDirection: 'row'}}>
        {renderContent('現在のパスワード')}
        <TextInput
          onFocus={offChooseGender}
          secureTextEntry={showOldPass ? false : true}
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          value={passLocal}
          onChangeText={(oldPass) => onChangePassOld(oldPass)}
          numberOfLines={1}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={seenOldPass}
          activeOpacity={0.8}
          style={styles.buttonEye}>
          {passLocal ? (
            <Entypo name={showEye()} color="black" size={18} />
          ) : null}
        </TouchableOpacity>
      </View>
      {megOldPass ? showWarningWrongValid(megOldPass) : null}
      {/* Mật khẩu mới */}
      <View style={{flexDirection: 'row'}}>
        {renderContent('変更後パスワード')}
        <TextInput
          onFocus={offChooseGender}
          secureTextEntry={showNewPass ? false : true}
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          value={newPass}
          onChangeText={(value) => onChangeNewPass(value)}
          numberOfLines={1}
          style={styles.input}
        />
        <TouchableOpacity onPress={seenNewPass} style={styles.buttonEye}>
          {newPass ? (
            <Entypo name={showEyeNewPass()} color="black" size={18} />
          ) : null}
        </TouchableOpacity>
      </View>
      {megNewPass ? showWarningWrongValid(megNewPass) : null}
      {/* Nhập lại mật khẩu mới */}
      <View style={{flexDirection: 'row'}}>
        {renderContent('変更後パスワード確認')}
        <TextInput
          onFocus={offChooseGender}
          secureTextEntry={showConfirmNewPass ? false : true}
          textContentType={'password'}
          keyboardType={'ascii-capable'}
          value={newPassConfirm}
          numberOfLines={1}
          onChangeText={(value) => onChangeConfirmNewPass(value)}
          style={styles.input}
        />
        <TouchableOpacity onPress={seenNewPassConfirm} style={styles.buttonEye}>
          {newPassConfirm ? (
            <Entypo name={showEyeNewPassConfirm()} color="black" size={18} />
          ) : null}
        </TouchableOpacity>
      </View>
      {megNewPasConfirm ? showWarningWrongValid(megNewPasConfirm) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    width: SIZE.width(50),
    backgroundColor: '#F3F3F3',
    marginTop: SIZE.width(1),
    paddingLeft: SIZE.width(2),
    height: SIZE.width(10.5),
    fontSize: SIZE.H5,
  },
  buttonEye: {
    width: SIZE.width(9),
    backgroundColor: '#F3F3F3',
    marginTop: SIZE.width(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
ChangePass = forwardRef(ChangePass);
export default ChangePass;
