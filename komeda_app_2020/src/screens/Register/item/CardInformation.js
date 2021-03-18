import React, {useState, useImperativeHandle, useRef, forwardRef} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, COLOR, FetchApi, isIos} from '../../../utils';

//Component:
import AppDateInput from '../../../elements/AppDateInput';
import {TouchableCo} from '../../../elements/TouchableCo';
import {STRING} from '../../../utils/constants/String';

function CardInformationUser(props, ref) {
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
  const keyGetMessValid = {
    keyEmail: 'EMAIL_INPUT',
    keyPassWord: 'PASSWORD_INPUT',
    keyZipCode: 'ZIP_CODE_INPUT',
  };
  const {
    getGender,
    getZipCode,
    getBirthday,
    getMessValid,
    memberRegistrationInfo,
    disableButtonActive,
  } = props;
  const datepicker = useRef(null);
  let zipCodeAccount = useRef('');
  let birthDayAccount = useRef('');
  let genderAccount = useRef('');
  const [gender, setStateGender] = useState('性別を入力');
  const [zipcode, setStateZipcode] = useState('');
  const [bookingGender, setStateBookingGender] = useState(false);
  const [chooseBirthday, setStateChooseBirthday] = useState(false);
  let heightAbsoliute = dataGender.length * SIZE.width(3.6) - SIZE.width(35.8);

  //Đẩy ref ra ngoài:
  useImperativeHandle(ref, () => ({
    focusZipCodeOffChooseGender,
  }));

  //Hiển thị modal chọn ngày tháng năm:
  const showDatePicker = () => {
    datepicker.current.showDatePicker();
  };

  //Chọn ngày tháng năm sinh:
  const onSelectBirth = (date) => {
    birthDayAccount.current = date.replace(/\//g, '');
    getBirthday(date);
    setStateChooseBirthday(true);
  };

  //Thay đổi mã zipcode:
  const changeZipcode = (zipcode) => {
    let numberZipCodeConvert = numberZipCode(zipcode);
    let zipCode = zipcode.replace(/-/g, '');
    zipCodeAccount.current = zipCode;
    getZipCode(zipCode);
    if (!zipcode) {
      getMessValid('', keyGetMessValid.keyZipCode);
    }
    if (zipCode && zipCode.length > 0 && zipCode.length < 7) {
      getMessValid(STRING.zipcode_7_char, keyGetMessValid.keyZipCode);
    }
    if (zipCodeAccount.current && zipCodeAccount.current.length == 7) {
      checkValidateZipcodeAPI(zipCode);
    }
    setStateZipcode(numberZipCodeConvert);
  };

  //checkValidateZipcode API:
  const checkValidateZipcodeAPI = async (zipCode) => {
    const response = await FetchApi.validateZipcode(zipCode);
    if (
      response &&
      response.status_code == 200 &&
      response.code == 1000 &&
      response.data
    ) {
      getMessValid('', keyGetMessValid.keyZipCode);
    } else {
      if (
        response &&
        response.message == STRING.network_error_try_again_later
      ) {
        getMessValid(
          STRING.network_error_try_again_later,
          keyGetMessValid.keyZipCode,
        );
      } else {
        if (!memberRegistrationInfo.userName) {
          getMessValid(STRING.need_input_email, keyGetMessValid.keyEmail);
        }
        if (disableButtonActive && !memberRegistrationInfo.userName) {
          getMessValid(
            STRING.username_already_exists_in_data,
            keyGetMessValid.keyEmail,
          );
        }

        if (!memberRegistrationInfo.password) {
          getMessValid(STRING.need_input_password, keyGetMessValid.keyPassWord);
        }
        getMessValid(STRING.zipcode_input_wrong, keyGetMessValid.keyZipCode);
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

  //mask numbers xxx-xxxx
  const numberZipCode = (number) => {
    if (number) {
      return number
        .replace(/\D+/g, '')
        .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1-$2');
    } else {
      return '';
    }
  };

  //Lắng nghe sự kiện người dùng bắt đầu chọn giới tính:
  const clickGender = () => {
    setStateBookingGender(!bookingGender);
  };

  //Chọn giới tính Nam hoặc Nữ:
  const chooseGenderItem = (item) => {
    genderAccount.current = item.value;
    getGender(item.value);
    setStateBookingGender(false);
    setStateGender(item.value);
  };

  //Danh sách lựa chọn giới tính:
  const listGender = () => {
    let listGenderHaveChoose = dataGender.map((item, index) => {
      return (
        <TouchableOpacity
          key={`${index}`}
          onPress={() => chooseGenderItem(item)}
          style={{
            height: SIZE.width(10),
            backgroundColor: COLOR.COLOR_BROWN,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: index == 0 || 1 ? 1 : 0,
            borderBottomColor: index == 0 || 1 ? COLOR.grey_400 : null,
          }}>
          <AppText style={{color: COLOR.COFFEE_MILK, fontSize: SIZE.H5 * 1.2}}>
            {item.value}
          </AppText>
        </TouchableOpacity>
      );
    });
    return listGenderHaveChoose;
  };

  //Lựa chọn giới tính:
  const chooseGender = () => {
    return (
      <TouchableOpacity onPress={clickGender}>
        <View
          style={{
            height: SIZE.width(12),
            width: SIZE.width(94),
            marginTop: SIZE.width(3),
            flexDirection: 'row',
            marginLeft: SIZE.width(3),
            borderWidth: SIZE.width(0.2),
            borderColor: COLOR.COFFEE_BROWN,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: SIZE.width(1),
          }}>
          <AppText
            style={{
              marginLeft: SIZE.width(3),
              color: gender != '性別を入力' ? COLOR.grey_900 : COLOR.grey_500,
            }}>
            {gender}
          </AppText>
          {showIconDown()}
        </View>
      </TouchableOpacity>
    );
  };

  //Hiển thị icon sổ xuống:
  const showIconDown = () => {
    return (
      <AntDesign
        style={{marginRight: SIZE.width(2.4)}}
        name='caretdown'
        color='black'
        size={18}
      />
    );
  };

  //Chọn ngày tháng năm sinh:
  const birthDayUser = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZE.width(3),
          }}>
          {/* Chọn ngày tháng năm sinh */}
          <TouchableCo onPress={showDatePicker}>
            <AppDateInput
              stylesIcon={{
                top: SIZE.width(3),
                right: SIZE.width(0.2),
              }}
              iconDown
              noIcon
              ref={datepicker}
              placeholderTextColor={COLOR.grey_500}
              style={{
                height: SIZE.width(12),
                width: SIZE.width(94),
                borderWidth: 0,
                borderRadius: 0,
                marginLeft: SIZE.width(3),
                borderWidth: SIZE.width(0.2),
                borderColor: COLOR.COFFEE_BROWN,
                justifyContent: 'space-between',
                flexDirection: 'row',
                borderRadius: SIZE.width(1),
              }}
              inputStyle={{
                height: SIZE.width(10),
                paddingTop: SIZE.width(4),
                paddingLeft: 2,
                marginLeft: SIZE.width(2),
                color: chooseBirthday ? COLOR.grey_900 : COLOR.grey_500,
              }}
              onChangeData={onSelectBirth}
            />
          </TouchableCo>
        </View>
        <AppText
          style={{
            marginLeft: SIZE.width(4),
            marginTop: SIZE.width(2),
            color: COLOR.COFFEE_RED,
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5,
          }}>
          生年月日は登録後のご変更はできません。
        </AppText>
      </View>
    );
  };

  //Ấn vào nhập mã zipcode tắt phần chọn giới tính đi:
  const focusZipCodeOffChooseGender = () => {
    setStateBookingGender(false);
  };

  //Nhập mã zip-code:
  const zipCodeUser = () => {
    return (
      <View>
        <TextInput
          keyboardType='numeric'
          onFocus={focusZipCodeOffChooseGender}
          placeholderTextColor={COLOR.grey_500}
          placeholder={'郵便番号を入力'}
          maxLength={8}
          onChangeText={(text) => changeZipcode(text)}
          value={zipcode}
          style={{
            height: SIZE.width(12),
            color: COLOR.grey_900,
            justifyContent: 'center',
            paddingLeft: SIZE.width(3),
            fontSize: SIZE.H5,
            paddingTop: isIos ? 0 : SIZE.width(2),
            marginLeft: SIZE.width(3),
            marginTop: SIZE.width(3),
            width: SIZE.width(94),
            borderWidth: SIZE.width(0.2),
            borderColor: COLOR.COFFEE_BROWN,
            borderRadius: SIZE.width(1),
          }}
        />
      </View>
    );
  };

  //Render:
  return (
    <View
      style={{
        width: SIZE.width(100),
        marginTop: SIZE.width(3),
      }}>
      {/* Tiêu đề phần đăng kí thông tin khác */}
      {renderTitleFormLogin('その他', 0)}
      {/* Đăng kí ngày tháng năm sinh */}
      {birthDayUser()}
      {/* Đăng kí giới tính */}
      {chooseGender()}
      {/* Đăng kí mã bưu điện zip-code */}
      {zipCodeUser()}
      {/* Vùng chọn giới tính: */}
      {bookingGender ? (
        <View
          style={{
            position: 'absolute',
            minHeight: SIZE.width(10),
            width: SIZE.width(94.2),
            top: -heightAbsoliute,
            right: SIZE.width(1.8),
            borderWidth: 1,
            borderColor: COLOR.black,
            marginRight: SIZE.width(1.1),
          }}>
          {listGender()}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  messValidateInfo: {
    color: COLOR.red,
    marginTop: SIZE.width(2),
    marginBottom: SIZE.width(1),
    fontSize: 12,
  },
  //Khung chứa toàn bộ itemInput:
  boxItem: {
    height: SIZE.width(12),
    width: SIZE.width(90),
    flexDirection: 'row',
    marginTop: SIZE.width(1),
  },
  //Khung chứa ô input số điện thoại:
  boxInputPhone: {
    width: SIZE.width(56),
    marginLeft: SIZE.width(1),
    color: '#939393',
    backgroundColor: '#EAECF0',
    paddingLeft: SIZE.width(2),
    fontSize: SIZE.H5,
  },
  //Khung chứa ô nhập mật khẩu:
  boxInputPass: {
    width: SIZE.width(48),
    color: '#939393',
    paddingLeft: SIZE.width(2),
    fontSize: SIZE.H5,
  },
  //Chữ trong khung màu xanh:
  textTitleInput: {
    fontSize: SIZE.H5,
    color: COLOR.text_registration,
    marginLeft: SIZE.width(2),
  },
  //Chữ trong khung mày xanh của memberCode:
  textTitleInputMemberCode: {
    fontSize: isIos ? SIZE.H5 : 12,
    color: COLOR.text_registration,
    marginLeft: SIZE.width(2),
  },
  //Khung tiêu đề màu xanh của các ô Input:
  boxGreen: {
    height: SIZE.width(10),
    width: SIZE.width(37),
    backgroundColor: '#D9EAD3',
    justifyContent: 'center',
  },
});
const ContainerCardInformationUser = forwardRef(CardInformationUser);
export {ContainerCardInformationUser};
