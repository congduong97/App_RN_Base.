//Library:
import React, {useEffect, useRef, useContext, useState} from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {AppText} from '../../elements/AppText';
import {SIZE, COLOR, FetchApi, ToastService} from '../../utils';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';
import {STRING} from '../../utils/constants/String';

//Component:
import {AppContainer} from '../../elements';
import {ContainerPhoneAndPassword} from './item/PhoneAndPassword';
import {ContainerCardInformationUser} from './item/CardInformation';
import {CheckBoxFavorite} from './item/CheckBoxFavorite';

//Services:
import {ServicesCheckValidateForm} from './util/ServicesCheckValidateForm';
import {NetworkError} from '../../elements/NetworkError';

//Class:
function MemberRegistration() {
  const typeAction = 'REGISTER';
  const nameScreen = '登録';
  const useAccessToken = false;
  const refPhonePass = useRef(null);
  const refCardInformation = useRef(null);
  const navigation = useNavigation();
  const {colorApp} = useContext(ContextContainer);
  const [isActiveButton, setStateIsActiveButton] = useState(true);
  const [errorNetWork, setStateError] = useState(false);
  const ref = useRef(null);
  const timeCount = useRef(0);

  let memberRegistrationInfo = useRef({
    phoneNumber: '',
    password: '',
    gender: 'UNDEFINE',
    birthday: '',
    zipCode: '',
    listFavoriteCategory: [],
  });

  let checkValidateInformationUserForm = useRef({
    validateGender: false,
    validateNumberPhone: false,
    validatePassword: false,
    validateBirthDay: false,
    validateZipCode: false,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeCount.current);
    };
  }, []);

  //Tiêu đề form đăng kí:
  const titleFormRegis = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <AppText
          style={{
            fontSize: SIZE.H4,
            color: '#6AA84F',
            marginBottom: SIZE.width(2),
            fontWeight: 'bold',
            marginTop: SIZE.width(3),
          }}>
          基本情報
        </AppText>
      </View>
    );
  };

  //Kiểm tra mất mạng không ở danh sách lấy listFavorite:
  const checkNetWorkListFavotite = (netWork) => {
    if (netWork == 'NETWORK_ERROR') {
      setStateError(true);
    } else {
      setStateError(false);
    }
  };

  //Lấy các thông tin cơ bản người dùng điền vào Form đăng kí sau khi đã check Validate.
  //Lấy số điện thoại đăng kí:
  const getnumberPhone = (phoneNumber) => {
    memberRegistrationInfo.current.phoneNumber = phoneNumber;
  };

  //Lấy mật khẩu đăng kí đăng nhập:
  const getPassword = (password) => {
    memberRegistrationInfo.current.password = password;
  };

  //Lấy giới tính:
  const getGender = (gender) => {
    if (gender == '男性') {
      memberRegistrationInfo.current.gender = 'MALE';
    }
    if (gender == '女性') {
      memberRegistrationInfo.current.gender = 'FEMALE';
    }
    if (!gender || gender == '未設定') {
      memberRegistrationInfo.current.gender = 'UNDEFINE';
    }
  };

  //Lấy ngày tháng năm sinh:
  const getBirthday = (birthday) => {
    memberRegistrationInfo.current.birthday = birthday;
  };

  //Lấy zipcode:
  const getZipCode = (zipcode) => {
    memberRegistrationInfo.current.zipCode = zipcode;
  };

  //Lấy danh sách sở thích người dùng:
  const getFavoriteUse = (dataCheckbox) => {
    let listFavoriteCategoryAPI = [];
    for (let index = 0; index < dataCheckbox.length; index++) {
      const element = dataCheckbox[index].id;
      listFavoriteCategoryAPI.push(element);
    }
    let listFavorite = listFavoriteCategoryAPI.toString();
    memberRegistrationInfo.current.listFavoriteCategory = listFavorite;
  };

  //Kiểm tra Avtive nút theo trạng thái API active nút đăng kí:
  //Số điện thoại:
  const checkValidPhoneAPI = (mess) => {
    if (mess == 'USABLE_PHONE') {
      setStateIsActiveButton(true);
    } else {
      setStateIsActiveButton(false);
    }
  };

  //Mật khẩu:
  const checkValidPassWord = (mess) => {
    if (mess == 'USABLE_PASS') {
      setStateIsActiveButton(true);
    } else {
      setStateIsActiveButton(false);
    }
  };

  //Zipcode:
  const checkValidZipCodeAPI = (mess) => {
    if (mess == 'USABLE_ZIPCODE') {
      setStateIsActiveButton(true);
    } else {
      setStateIsActiveButton(false);
    }
  };

  //+Kiểm tra trạng thái validate của thông tin:
  //Validtate số điện thoại:
  const getValidateNumberPhone = (active) => {
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

  //Phần chữ chú ý màu đỏ:
  const textAttention = () => {
    return (
      <View
        style={{
          marginLeft: SIZE.width(3),
          marginRight: SIZE.width(3),
          marginTop: SIZE.width(3),
          borderWidth: 1,
          borderColor: COLOR.COLOR_RED,
          justifyContent: 'center',
        }}>
        <AppText
          style={{
            fontSize: SIZE.H4,
            color: COLOR.COLOR_RED,
            marginTop: SIZE.width(2),
            fontWeight: 'bold',
            marginLeft: SIZE.width(2),
          }}>
          ご注意事項
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: COLOR.COLOR_RED,
            textDecorationLine: 'underline',
            textDecorationStyle: 'solid',
            textDecorationColor: COLOR.COLOR_RED,
            marginLeft: SIZE.width(2),
            marginTop: SIZE.width(2),
          }}>
          すべての情報のご登録を推奨しております。
        </AppText>
        <AppText
          style={{
            fontSize: SIZE.H5 * 1.1,
            color: COLOR.COLOR_RED,
            marginLeft: SIZE.width(2),
            marginBottom: SIZE.width(2.5),
            marginRight: SIZE.width(2),
            marginTop: SIZE.width(0.5),
          }}>
          任意情報のご入力がない場合、ご本人様確認ができないため、お問い合わせにお答えできません。
        </AppText>
      </View>
    );
  };

  //Tiêu đề khung lựa chọn sở thích:
  const renderTitleCheckBox = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          marginTop: SIZE.width(2),
        }}>
        <AppText
          style={{
            fontSize: SIZE.H4,
            color: '#6AA84F',
            fontWeight: 'bold',
          }}>
          興味のあるカテゴリ
        </AppText>
      </View>
    );
  };

  //Khung lựa chọn:
  const framesTitleCheckBox = () => {
    return (
      <View
        style={{
          minHeight: SIZE.width(5),
          width: SIZE.width(88),
          borderWidth: 1.5,
          borderColor: '#6AA84F',
          marginLeft: SIZE.width(6),
          marginTop: SIZE.width(2),
        }}>
        <AppText
          style={{
            fontSize: SIZE.H5,
            color: '#000000',
            padding: SIZE.width(2),
            fontWeight: '400',
          }}>
          ご選択いただいた情報の最新情報をプッシュ通知、お知らせにて
          タイムリーに配信いたします。
        </AppText>
      </View>
    );
  };

  //Thực hiện quá trình kiểm tra validate lần cuối:
  const checkValidateInformationRegistration = () => {
    if (
      checkValidateInformationUserForm.current.validateNumberPhone &&
      checkValidateInformationUserForm.current.validatePassword &&
      memberRegistrationInfo.current.phoneNumber &&
      memberRegistrationInfo.current.phoneNumber.length == 11
    ) {
      return true;
    }
    return false;
  };
  //Cho ấn lại nút đăng kí:
  const setTimeActiveButtonRegis = () => {
    timeCount.current = setTimeout(() => {
      setStateIsActiveButton(true);
    }, 1000);
  };
  const onHideChoseSex = () => {
    refCardInformation.current.setStateBookingGender(false);
  };
  //Thực hiện quá trình đăng kí tài khoản: (Điều kiện phải nhập đủ thông tin)
  const startRegistrationAccount = async () => {
    setStateIsActiveButton(false);
    timeCount.current = setTimeout(() => {
      ServicesCheckValidateForm.set({
        clickButtonregistration: 'CLICK_REGISTER_ACCOUNT',
      });
    }, 350);
    const {
      phoneNumber,
      password,
      gender,
      birthday,
      zipCode,
      listFavoriteCategory,
    } = memberRegistrationInfo.current;
    let checker = checkValidateInformationRegistration();
    if (checker) {
      const response = await FetchApi.registerOrUpdateMemberAPI(
        phoneNumber,
        password,
        gender,
        birthday,
        zipCode,
        listFavoriteCategory,
        typeAction,
        useAccessToken,
      );
      if (response && response.status_code == 200 && response.code == 1000) {
        //Yêu cầu các param gửi sang màn hình OTP dùng chung gồm:
        //+Số điện thoại: phoneNumber.
        //+Mã người dùng: memberId.
        //+Key màn hình để biết từ màn nào truyền sang :otpType.
        navigation.replace(keyNavigation.ACTIVE_OTP, {
          phoneNumber: phoneNumber,
          passWord: password,
          memberId: response.data.memberId,
          otpType: typeAction,
        });
        return;
      }
      if (response && response.status_code == 500) {
        ToastService.showToast(STRING.maintail);
      }
      if (response && response.message == 'Network request failed') {
        setTimeActiveButtonRegis();
        ToastService.showToast(
          'ネットワークに接続できませんでした。後でやり直してください。',
        );
        return;
      } else {
        if (response && response.status_code == 200 && response.code == 1047) {
          activeScrollViewToTop();
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
            response.code == 1051
          ) {
            ToastService.showToast(
              '電話番号は正しくありません、OTPを送信できません。',
            );
          }
        }
        setTimeActiveButtonRegis();
      }
    } else {
      activeScrollViewToTop();
      setTimeActiveButtonRegis();
    }
  };

  //Render content:
  const renderContent = () => {
    if (errorNetWork) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => checkNetWorkListFavotite()}
        />
      );
    }
    return (
      <ScrollView ref={ref} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={1} onPress={onHideChoseSex}>
          {/* Tên màn hình */}
          {titleFormRegis()}
          {/* Bảng đăng nhập số điện thoại và mật khẩu */}
          <ContainerPhoneAndPassword
            ref={refPhonePass}
            getnumberPhone={getnumberPhone}
            getPassword={getPassword}
            getValidateNumberPhone={getValidateNumberPhone}
            getValidatePassword={getValidatePassword}
            checkValidPhoneAPI={checkValidPhoneAPI}
            checkValidPassWord={checkValidPassWord}
            onHideChoseSex={onHideChoseSex}
          />
          {/* Đăng kí thông tin người dùng */}
          <ContainerCardInformationUser
            ref={refCardInformation}
            getGender={getGender}
            getBirthday={getBirthday}
            getZipCode={getZipCode}
            getValidateBirthDay={getValidateBirthDay}
            getValidateZipCode={getValidateZipCode}
            checkValidZipCodeAPI={checkValidZipCodeAPI}
          />
          {/* Chữ đỏ lưu ý  */}
          {textAttention()}
          {/* Title phần đăng kí checkbox */}
          {renderTitleCheckBox()}
          {/* Khung chứa nội dung lưu ý checkbox */}
          {framesTitleCheckBox()}
          {/* Phần đăng kí sở thích */}
          <CheckBoxFavorite
            getFavoriteUse={getFavoriteUse}
            checkNetWorkListFavotite={checkNetWorkListFavotite}
          />
          {/* Hiển thị nút đăng kí người dùng sau khi đẵ điền đầy đủ thông tin */}
          <TouchableOpacity
            onPress={startRegistrationAccount}
            disabled={isActiveButton ? false : true}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(86),
              backgroundColor: isActiveButton
                ? colorApp.backgroundColorButton
                : COLOR.grey_500,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: SIZE.width(7),
              borderRadius: 8,
              marginTop: SIZE.width(3),
            }}>
            <AppText
              style={{
                color: colorApp.textColorButton,
                fontSize: SIZE.H4,
                padding: 5,
              }}>
              登録
            </AppText>
          </TouchableOpacity>
          <View style={{height: SIZE.width(12)}} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  //Render:
  return (
    <AppContainer
      haveTitle
      goBackScreen
      haveBottom
      nameScreen={nameScreen}
      style={{backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
}
export default MemberRegistration;
