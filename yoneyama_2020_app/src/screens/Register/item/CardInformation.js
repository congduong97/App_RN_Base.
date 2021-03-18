import React, {
  useState,
  useContext,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Setup:
import {AppText} from '../../../elements/AppText';
import {SIZE, COLOR, FetchApi, isIos} from '../../../utils';

//Component:
import AppDateInput from '../../../elements/AppDateInput';
import {TouchableCo} from '../../../elements/TouchableCo';
import {ContextContainer} from '../../../contexts/AppContext';

function CardInformationUser(props, ref) {
  //Vaiable:
  let inputZipcode = useRef('');
  let inputDateOfBirth = useRef('');
  let inputGender = useRef('');
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
  const datepicker = useRef(null);
  const {colorApp} = useContext(ContextContainer);
  const [gender, setStateGender] = useState('性別を入力');
  const [zipcode, setStateZipcode] = useState('');
  const [messZipcode, setStateMessZipcode] = useState('');
  const [bookingGender, setStateBookingGender] = useState(false);
  const [chooseBirthday, setStateChooseBirthday] = useState(false);
  const {getGender, getZipCode, getBirthday, checkValidZipCodeAPI} = props;
  let heightAbsolute = dataGender.length * SIZE.width(3.6) - SIZE.width(21.1);

  useImperativeHandle(ref, () => ({
    setStateBookingGender,
  }));
  //Hiển thị modal chọn ngày tháng năm:
  const showDatePicker = () => {
    datepicker.current.showDatePicker();
  };

  //Chọn ngày tháng năm sinh:
  const onSelectBirth = (date) => {
    inputDateOfBirth.current = date.replace(/\//g, '');
    getBirthday(date);
    setStateChooseBirthday(true);
  };

  //Thay đổi mã zipcode:
  const changeZipcode = (zipcode) => {
    let numberZipCodeConvert = numberZipCode(zipcode);
    let zipCode = zipcode.replace(/-/g, '');
    inputZipcode.current = zipCode;
    getZipCode(zipCode);
    if (!zipcode) {
      setStateMessZipcode('');
      checkValidZipCodeAPI('USABLE_ZIPCODE');
    }
    if (zipCode && zipCode.length > 0 && zipCode.length < 7) {
      checkValidZipCodeAPI('CAN_NOT_USE_ZIPCODE');
      setStateMessZipcode('郵便番号は7桁数字で入力してください。');
    }
    if (inputZipcode.current && inputZipcode.current.length == 7) {
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
      setStateMessZipcode('');
      checkValidZipCodeAPI('USABLE_ZIPCODE');
    } else {
      checkValidZipCodeAPI('CAN_NOT_USE_ZIPCODE');
      setStateMessZipcode('郵便番号に誤りがあります。');
    }
  };

  //mask numbers xxx-xxxx
  const numberZipCode = (number) => {
    if (number) {
      return number
        .replace(/\D+/g, '')
        .replace(/([0-9]{1,3})([0-9]{4}$)/gi, '$1$2');
    } else {
      return '';
    }
  };

  //Cảnh báo sai validate zipcode:
  const showWarningValidateZipcode = (mess) => {
    return (
      <AppText
        style={{
          color: COLOR.red,
          fontSize: 12,
          marginTop: SIZE.width(1),
          marginBottom: SIZE.width(1.5),
          marginRight: SIZE.width(2),
        }}>
        {mess}
      </AppText>
    );
  };

  //Lắng nghe sự kiện người dùng bắt đầu chọn giới tính:
  const clickGender = () => {
    setStateBookingGender(!bookingGender);
  };

  //Chọn giới tính Nam hoặc Nữ:
  const chooseGenderItem = (item) => {
    inputGender.current = item.value;
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
            height: SIZE.width(8.2),
            backgroundColor: '#D9EAD3',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: index == 0 || 1 ? 1 : 0,
            borderBottomColor: index == 0 || 1 ? COLOR.grey_400 : null,
          }}>
          <AppText style={{color: '#0000FF', fontSize: SIZE.H5}}>
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
      <View style={{marginBottom: SIZE.width(1)}}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {/* Đăng kí giới tính */}
          {boxInputTitle('性別')}
          {/* Chọn giới tính */}
          <TouchableOpacity onPress={clickGender} style={{flex: 1}}>
            <View
              style={{
                height: SIZE.width(10),
                flexDirection: 'row',
                backgroundColor: '#EAECF0',
                marginLeft: SIZE.width(1),
                marginRight: SIZE.width(2),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <AppText
                style={{
                  marginLeft: SIZE.width(3),
                  color:
                    gender != '性別を入力' ? COLOR.grey_900 : COLOR.grey_500,
                }}>
                {gender}
              </AppText>
              {showIconDown()}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Hiển thị icon sổ xuống:
  const showIconDown = () => {
    return (
      <AntDesign
        style={{marginRight: SIZE.width(3)}}
        name="caretdown"
        color="black"
        size={18}
      />
    );
  };

  //Chọn ngày tháng năm sinh:
  const birthDayUser = () => {
    return (
      <View>
        <View style={{flexDirection: 'row', height: SIZE.width(10)}}>
          {boxInputTitle('生年月日')}
          {/* Chọn ngày tháng năm sinh */}
          <TouchableCo
            style={{
              flex: 1,
              alignItems: 'flex-start',
            }}
            onPress={showDatePicker}>
            <AppDateInput
              stylesIcon={{top: SIZE.width(2), right: SIZE.width(0.2)}}
              iconDown
              noIcon
              ref={datepicker}
              placeholderTextColor={COLOR.grey_500}
              style={{
                width: SIZE.width(56),
                borderWidth: 0,
                borderRadius: 0,
                marginLeft: SIZE.width(1),
                backgroundColor: '#EAECF0',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}
              inputStyle={{
                height: SIZE.width(10),
                paddingTop: SIZE.width(3),
                paddingLeft: 2,
                marginLeft: SIZE.width(2),
                color: chooseBirthday ? COLOR.grey_900 : COLOR.grey_500,
              }}
              onChangeData={onSelectBirth}
            />
          </TouchableCo>
        </View>
      </View>
    );
  };

  //Nhập mã zip-code:
  const zipCodeUser = () => {
    return (
      <View>
        <View
          style={{
            height: SIZE.width(10),
            flexDirection: 'row',
            marginTop: SIZE.width(1),
            marginBottom: SIZE.width(1),
          }}>
          {boxInputTitle('郵便番号')}
          <TextInput
            placeholderTextColor={COLOR.grey_500}
            placeholder={'郵便番号を入力'}
            keyboardType="numeric"
            maxLength={7}
            onChangeText={(text) => changeZipcode(text)}
            value={zipcode}
            style={{
              flex: 1,
              color: COLOR.grey_900,
              backgroundColor: '#EAECF0',
              justifyContent: 'center',
              marginLeft: SIZE.width(1),
              marginRight: SIZE.width(2),
              paddingLeft: SIZE.width(3),
              fontSize: SIZE.H5,
              paddingTop: isIos ? 0 : SIZE.width(2),
            }}
          />
        </View>
        {messZipcode ? showWarningValidateZipcode(messZipcode) : null}
      </View>
    );
  };

  //Sinh mã Member Code:
  const memberCode = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: SIZE.width(10),
        }}>
        {boxInputTitleMemberCode('デジタルカード番号')}
        <View style={{justifyContent: 'center'}}>
          <AppText
            style={{
              fontSize: SIZE.H6 * 1.5,
              color: COLOR.COLOR_RED,
              marginLeft: SIZE.width(3),
            }}>
            自動発行されます
          </AppText>
        </View>
      </View>
    );
  };

  //Khung tiêu đề ô input:
  const boxInputTitle = (name, size) => {
    return (
      <View style={styles.boxGreen}>
        <AppText style={styles.textTitleInput}>{name}</AppText>
      </View>
    );
  };

  //Khung tiêu đề ô input của memberCode:
  const boxInputTitleMemberCode = (name, size) => {
    return (
      <View style={styles.boxGreen}>
        <AppText style={styles.textTitleInputMemberCode}>{name}</AppText>
      </View>
    );
  };

  //Render:
  return (
    <View
      style={{
        width: SIZE.width(96),
        marginTop: SIZE.width(1),
        marginLeft: SIZE.width(3),
        backgroundColor: colorApp.backgroundColor,
      }}>
      {/* Đăng kí giới tính */}
      {chooseGender()}
      {/* Đăng kí ngày tháng năm sinh */}
      {birthDayUser()}
      {/* Đăng kí mã bưu điện zip-code */}
      {zipCodeUser()}
      {/* Vùng sinh mã memberCode  */}
      {memberCode()}
      {/* Vùng chọn giới tính: */}
      {bookingGender ? (
        <View
          style={{
            position: 'absolute',
            minHeight: SIZE.width(10),
            width: SIZE.width(56),
            top: -heightAbsolute,
            right: SIZE.width(1.8),
            borderWidth: 1,
            borderColor: COLOR.black,
            marginRight: 1,
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
    height: SIZE.width(10.5),
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
