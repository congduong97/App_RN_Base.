//Lbrary:
import React, {useRef, useState, useEffect} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputBirthday from './items/InputBirthday';
import InputZipCode from './items/InputZipCode';

//Setup:
import {SIZE, COLOR, FetchApi, isIos} from '../../utils';

//Component:
import {AppHeader, AppText, AppTextButton} from '../../elements';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {STRING} from '../../utils/constants/String';

function ChangePersonalInfo({navigation, route}) {
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

  const {personalInformation} = route.params;
  const genderAccount = useRef(personalInformation.gender);
  const birthdayAccount = useRef(personalInformation.birthDay);
  const zipCodeAccount = useRef(personalInformation.zipCode);
  const ChangeInfoRef = useRef(null);
  const [gender, setStateGender] = useState('');
  const [bookingGender, setStateBookingGender] = useState(false);
  const isActiveButton = useRef(true);
  let heightAbsoliute = isIos
    ? dataGender.length * SIZE.width(3.6) - SIZE.width(72.4)
    : dataGender.length * SIZE.width(3.6) - SIZE.width(78.4);
  const [messAPI, setStateMessAPI] = useState('');

  //Lắng nghe sự kiện người dùng bắt đầu chọn giới tính:
  const clickGender = () => {
    setStateBookingGender(!bookingGender);
  };

  useEffect(() => {
    showGender();
    return () => {};
  }, []);

  //Hiển thị giới tính:
  const showGender = () => {
    if (personalInformation.gender == 'UNDEFINE') {
      setStateGender('未設定');
    }
    if (personalInformation.gender == 'MALE') {
      setStateGender('男性');
    }
    if (personalInformation.gender == 'FEMALE') {
      setStateGender('女性');
    }
  };

  //Lấy ngày tháng năm sinh:
  const getBirthday = (day) => {
    birthdayAccount.current = day;
  };

  //Kiểm tra valid API zipcode:
  const checkStatusZipCodeAPI = (validZip) => {
    if (validZip == 'USABLE_ZIPCODE') {
      isActiveButton.current = true;
    } else {
      isActiveButton.current = false;
    }
  };

  //Lấy mã zipcode :
  const getZipCode = (zipCode) => {
    zipCodeAccount.current = zipCode;
  };

  //Bỏ chọn giới tính:
  const notChooseGender = () => {
    setStateBookingGender(false);
  };
  //Lấy mess sai valid:
  const getMessError = (mess) => {
    if (mess) {
      setStateMessAPI(mess);
    } else {
      setStateMessAPI('');
    }
  };

  //Fetch API update thông tin cá nhân:
  const updateInfo = async () => {
    ChangeInfoRef.current.setLoadingValue(true);
    if (isActiveButton.current) {
      const response = await FetchApi.updateInfoMypage(
        birthdayAccount.current,
        genderAccount.current,
        zipCodeAccount.current,
      );
      if (response && response.status_code == 200 && response.code == 1000) {
        setStateMessAPI('');
        navigation.navigate(keyNavigation.CONFIRM_MESS, {
          key: 'CHANGE_INFO_MY_PAGE',
        });
      } else {
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          setStateMessAPI(STRING.network_error_try_again_later);
        } else {
          setStateMessAPI(STRING.have_error_happy_waiting);
        }
      }
    }
    ChangeInfoRef.current.setLoadingValue(false);
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
              fontSize: SIZE.H5 * 1.2,
            }}>
            {gender}
          </AppText>
          {showIconDown()}
        </View>
      </TouchableOpacity>
    );
  };

  //Hiển thị tiêu đề phần sẽ thay đổi:
  const renderTitleFormMyPage = (title, top) => {
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

  //Chọn giới tính Nam hoặc Nữ:
  const chooseGenderItem = (gender) => {
    setStateGender(gender.value);
    if (gender.value == '男性') {
      genderAccount.current = 'MALE';
    }
    if (gender.value == '女性') {
      genderAccount.current = 'FEMALE';
    }
    if (gender.value == '未設定') {
      genderAccount.current = 'UNDEFINE';
    }
    setStateBookingGender(false);
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

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{flex: 1}}
      onPress={notChooseGender}>
      <ScrollView style={{flex: 1}}>
        <AppHeader title={'その他'} leftGoBack></AppHeader>
        {/* Tiêu đề phần sửa thông tin */}
        {renderTitleFormMyPage('その他')}
        {/* Chọn ngày sinh */}
        <InputBirthday
          getBirthday={getBirthday}
          defaultBirthday={personalInformation.birthDay}></InputBirthday>
        {/* Chọn giới tính */}
        {chooseGender()}
        {/* Nhập mã zip-code */}
        <InputZipCode
          zipCodeDefault={personalInformation.zipCode}
          getZipCode={getZipCode}
          getMessError={getMessError}
          checkStatusZipCodeAPI={checkStatusZipCodeAPI}></InputZipCode>
        {/* Phần mess thông báo mật khẩu không chính xác */}
        <View
          style={{
            width: SIZE.width(100),
            backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
            alignItems: 'center',
            marginTop: SIZE.width(3),
          }}>
          <AppText
            style={{
              fontFamily: 'irohamaru-Medium',
              color: COLOR.COFFEE_RED,
              alignSelf: 'center',
              marginHorizontal: SIZE.width(5),
            }}>
            {messAPI}
          </AppText>
        </View>

        {/* Nút ấn update thông tin cá nhân */}
        <AppTextButton
          ref={ChangeInfoRef}
          style={{
            height: SIZE.height(7.5),
            width: SIZE.width(72),
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SIZE.width(3),
            borderRadius: 0,
            marginLeft: SIZE.width(14),
            backgroundColor: COLOR.COFFEE_YELLOW,
            borderWidth: SIZE.width(0),
          }}
          title={'変更'}
          textStyle={{
            color: COLOR.white,
            fontSize: SIZE.H4 * 0.9,
            fontFamily: 'irohamaru-Medium',
          }}
          onPress={updateInfo}
        />
        {/* Khung lựa chọn giới tính */}
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
      </ScrollView>
    </TouchableOpacity>
  );
}
export default ChangePersonalInfo;
