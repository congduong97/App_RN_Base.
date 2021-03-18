//Library:
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import moment from 'moment';

//Setup:
import {COLOR, SIZE, FetchApi, isIos} from '../../../utils';
import {ContextContainer} from '../../../contexts/AppContext';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../../elements/AppText';
import ChangePass from '../items/ChangePass';
import AppDateInput from '../../../elements/AppDateInput';
import {AccountService} from '../../../utils/services/AccountService';

function CardInformationUser(props, ref) {
  let [dataInformationUser, setStateDataInformationUSer] = useState({
    numberPhone: '',
    passWord: '',
    gender: '',
    birthDay: '',
    zipCode: '',
    memberCode: '',
  });
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const [zipCode, setStateZipCode] = useState('');
  const [messZipcode, setStateMessZipCode] = useState('');
  const [updateGender, setStateUpdateGener] = useState(false);
  const [gender, setStateGender] = useState('  ');
  const formInputPass = useRef(null);
  const datepicker = useRef(null);

  const {
    getDataListCheckBox,
    getGender,
    getZipCode,
    getPassUpdate,
    getBirthday,
    getInfoAPI,
    checkZipCodeAPI,
    checkValidPass,
  } = props;
  const dataGender = [
    {
      value: '男性',
    },
    {
      value: '女性',
    },
    {
      value: '未設定',
    },
  ];
  useEffect(() => {
    getInformationMyPageAPI();
    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({
    checkUpdateInfoAPI,
    offFormChooseGender,
  }));

  //Bắt sự kiện update thành công:
  const checkUpdateInfoAPI = (success) => {
    if (success) {
      formInputPass.current.resetInputPass();
    }
  };

  //Lấy thông tin người dùng:
  const getInformationMyPageAPI = async () => {
    const response = await FetchApi.getInfoMypage();
    let information = {
      numberPhone: response.data.phone,
      gender: `${response.data.gender}`,
      birthDay: response.data.birthday,
      zipCode: response.data.zipCode,
      memberCode: response.data.memberCode,
    };

    //Đẩy thông tin API ra MyPage.
    getInfoAPI(information);
    getDataListCheckBox(response.data.listFavoriteCategory);
    setStateDataInformationUSer(information);
    setStateZipCode(response.data.zipCode);
    showGenderAPI(`${response.data.gender}`);
  };

  //Hiển thị giới tính:
  const showGenderAPI = (gender) => {
    if (gender == 'UNDEFINE') {
      setStateGender('未設定');
    } else if (gender == 'MALE') {
      setStateGender('男性');
    } else {
      setStateGender('女性');
    }
  };

  //Check zipcode mới có tồn tại trên hệ thống không?
  const checkValidZipCodeAPI = async (zipcode) => {
    const response = await FetchApi.validateZipcode(zipcode);
    if (response && response.status_code == 200 && response.code == 1000) {
      getZipCode(zipcode);
      checkZipCodeAPI('CAN_USE_ZIPCODE');
      setStateMessZipCode('');
    } else {
      setStateMessZipCode('郵便番号に誤りがあります。');
      checkZipCodeAPI('CAN_NOT_USE');
    }
  };

  //Chọn giới tính Nam hoặc Nữ:
  const chooseGenderItem = (item) => {
    getGender(item.value);
    dataInformationUser.gender = item.value;
    setStateGender(item.value);
    setStateUpdateGener(false);
  };

  //Thay đổi zipcode:
  const changeZipCode = (value) => {
    setStateZipCode(numberZipCode(value));
    if (!value) {
      getZipCode('');
    }
    if (value && value.length == 7) {
      const zipCodeFormat = value.replace(/-/g, '');
      checkValidZipCodeAPI(zipCodeFormat);
    }
  };

  //Thay đổi giới tính:
  const chooseGender = () => {
    setStateUpdateGener(true);
  };

  //Tắt form chọn giới tính:
  const offFormChooseGender = () => {
    setStateUpdateGener(false);
  };

  //Hiển thị số điện thoại dạng ****-****-***
  const numberPhoneConvert = () => {
    if (dataInformationUser.numberPhone) {
      return dataInformationUser.numberPhone.slice(8, 11);
    }
  };

  //Hiển thị zipCode dạng ***-****:
  const numberZipCode = (number) => {
    if (number) {
      return number
        .replace(/\D+/g, '')
        .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1$2');
    } else {
      return '';
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
          marginRight: SIZE.width(2),
        }}>
        {mess}
      </AppText>
    );
  };

  //Dropdown lựa chọn giới tính:
  const showDropDownChooseGener = () => {
    return (
      <View
        style={{
          position: 'absolute',
          minHeight: SIZE.width(18),
          width: SIZE.width(58.4),
          right: SIZE.width(2),
          top: SIZE.width(66.3),
        }}>
        {listGender()}
      </View>
    );
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
        }}>
        <AppText
          style={{
            fontSize:
              name.length > 7 ? (isIos ? SIZE.H5 : SIZE.H5 * 0.88) : SIZE.H5,
            color: COLOR.text_registration,
            marginLeft: SIZE.width(2),
          }}>
          {name}
        </AppText>
      </View>
    );
  };

  //Hiển thị số điện thoại:
  const renderNumberPhone = () => {
    return (
      <View
        style={{
          height: SIZE.width(10.5),
          marginLeft: SIZE.width(2),
          marginRight: SIZE.width(4),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {renderContent('携帯電話番号')}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <AppText
              style={{
                fontSize: SIZE.H5 * 1.1,
                marginLeft: SIZE.width(2),
                color: '#6D6D6D',
              }}>
              ＊＊＊-＊＊＊＊-＊{numberPhoneConvert()}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  //Giới tính:
  const showGender = () => {
    return (
      <TouchableOpacity onPress={chooseGender} style={styles.buttonChangeValue}>
        <AppText style={styles.textInfo}>{gender}</AppText>
      </TouchableOpacity>
    );
  };

  //Chọn thay đổi ngày tháng năm sinh:
  const onSelectBirth = (date) => {
    getBirthday(date);
  };

  //Hiển thị modal chọn ngày tháng năm:
  const showDatePicker = () => {
    datepicker.current.showDatePicker();
  };

  // Ngày sinh:
  const showBirthday = () => {
    return (
      <TouchableOpacity
        onPress={showDatePicker}
        style={styles.buttonChangeValue}>
        <AppDateInput
          stylesIcon={{top: SIZE.width(1.5), right: SIZE.width(0.2)}}
          iconDown
          noIcon
          ref={datepicker}
          onChangeData={onSelectBirth}
          placeholder={
            dataInformationUser.birthDay
              ? moment(new Date(dataInformationUser.birthDay)).format(
                  'YYYY年MM月DD日',
                )
              : '   '
          }
          style={{
            width: SIZE.width(59),
            borderWidth: 0,
            borderRadius: 0,
            marginLeft: SIZE.width(0),
            backgroundColor: '#F3F3F3',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
          inputStyle={{
            height: SIZE.width(8),
            paddingTop: 8,
            paddingLeft: 2,
            marginLeft: SIZE.width(2),
            color: COLOR.grey_900,
          }}
        />
      </TouchableOpacity>
    );
  };

  //Hiển thị zipCode:
  const showZipCode = () => {
    return (
      <TouchableOpacity style={styles.buttonChangeValue}>
        <TextInput
          keyboardType={'numeric'}
          onChangeText={(value) => changeZipCode(value)}
          maxLength={7}
          style={styles.textInfo}>
          {numberZipCode(zipCode)}
        </TextInput>
      </TouchableOpacity>
    );
  };

  //Hiển thị mã numbersCodeMember x-xxxxxx-xxxxxx:
  const numberMemberCodeConvert = (number) => {
    let num = number.replace(/-/g, '');
    if (num) {
      if (num.length > 4 && num.length < 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1-$2');
      } else if (num.length > 4 && num.length == 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{3})([0-9]{4}$)/gi, '$1-$2');
      } else if (num.length > 8) {
        return num
          .replace(/\D+/g, '')
          .replace(/([0-9]{1,3})([0-9]{6})([0-9]{6}$)/gi, '$1-$2-$3');
      }
    } else {
      return;
    }
  };

  //Hiển thị mã thành viên:
  const showMemberCode = () => {
    return (
      <View
        style={{
          ...styles.buttonChangeValue,
          backgroundColor: colorApp.backgroundColor,
        }}>
        <AppText style={styles.textInfo}>
          {numberMemberCodeConvert(dataInformationUser.memberCode)}
        </AppText>
      </View>
    );
  };

  //Danh sách lựa chọn giới tính:
  const listGender = () => {
    let listGenderHaveChoose = dataGender.map((item, index) => {
      return (
        <TouchableOpacity
          key={`${index}`}
          onPress={() => chooseGenderItem(item, index)}
          style={{
            height: SIZE.width(10.5),
            backgroundColor: '#D9EAD3',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: index == 0 || 1 ? 2 : 0,
            borderBottomColor: index == 0 || 1 ? COLOR.grey_400 : null,
          }}>
          <AppText style={{color: '#0000FF'}}>{item.value}</AppText>
        </TouchableOpacity>
      );
    });
    return listGenderHaveChoose;
  };

  //Khung hiển thị các thông tin gồm: Giới tính, ngày sinh, mã ZipCode và mã memberCode.
  const renderPersonalInfo = () => {
    return (
      <View style={styles.containerPersonalInfo}>
        {/* Giới tính */}
        <View style={styles.boxInfoItem}>
          {renderContent('性別')}
          <View
            style={{
              flex: 1,
              height: SIZE.width(10.5),
              justifyContent: 'center',
            }}>
            {showGender()}
          </View>
        </View>

        {/* Ngày thánh năm sinh:*/}
        <View style={styles.boxInfoItem}>
          {renderContent('生年月日')}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            {showBirthday()}
          </View>
        </View>

        {/* Mã ZipCode  */}
        <View style={styles.boxInfoItem}>
          {renderContent('郵便番号')}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            {showZipCode()}
          </View>
        </View>
        {messZipcode ? showWarningWrongValid(messZipcode) : null}

        {/* Hiển thị mã thành viên: */}
        <View style={styles.boxInfoItem}>
          {renderContent('デジタルカード番号')}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            {showMemberCode()}
          </View>
        </View>
      </View>
    );
  };

  //Chuyển sang màn hình đổi số điện thoại:
  const onPressChangePhoneNumber = () => {
    const accountLogin = AccountService.getAccount();
    navigation.navigate(keyNavigation.CHANGE_PHONE_NUMBER, {
      phoneAccuracy: dataInformationUser.numberPhone,
      accountLogin: accountLogin,
    });
  };

  return (
    <View>
      {/* Hiển thị số điện thoại: */}
      {renderNumberPhone()}
      <View
        style={{
          width: SIZE.width(100),
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: SIZE.width(2),
        }}>
        <View style={{width: SIZE.width(12)}} />
        <TouchableOpacity
          onPress={onPressChangePhoneNumber}
          style={{
            justifyContent: 'center',
            marginRight: SIZE.width(2),
          }}>
          <AppText
            style={{
              color: COLOR.COLOR_BLUE,
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: COLOR.COLOR_BLUE,
              fontSize: SIZE.H5 * 1.1,
            }}>
            携帯電話番号のご変更はこちら
          </AppText>
        </TouchableOpacity>
      </View>
      {/* Khung đổi mật khẩu */}
      <ChangePass
        ref={formInputPass}
        offFormChooseGender={offFormChooseGender}
        getPassUpdate={getPassUpdate}
        checkValidPass={checkValidPass}
      />
      {/* Khung hiển thị thông tin cá nhân: */}
      {renderPersonalInfo()}
      {/* Khung chọn giới tính */}
      {updateGender ? showDropDownChooseGener() : null}
    </View>
  );
}
const styles = StyleSheet.create({
  //Khung to nhất bao các thông tin cá nhân gồm : giới tính => MemberCode.
  containerPersonalInfo: {
    minHeight: SIZE.width(36),
    width: SIZE.width(96),
    alignContent: 'space-between',
    marginLeft: SIZE.width(2),
  },
  boxInfoItem: {
    height: SIZE.width(10.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(1),
  },
  //Thay đổi thông tin người dùng:
  buttonChangeValue: {
    height: SIZE.width(10.5),
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
  },
  //Text thông tin :
  textInfo: {
    color: COLOR.grey_900,
    marginLeft: SIZE.width(3),
  },
});
CardInformationUser = forwardRef(CardInformationUser);
export {CardInformationUser};
