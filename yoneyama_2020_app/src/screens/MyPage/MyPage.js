//Lybrary:
import React, {useState, useContext, useRef, useEffect} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {COLOR, SIZE, FetchApi, ToastService} from '../../utils';
import {AppText} from '../../elements/AppText';

//Component:
import {CardInformationUser} from './items/CardInformationUser';
import {AppContainer, TouchableCo} from '../../elements';
import {CheckBoxFavorite} from './items/CheckBoxFavorite';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {ContextContainer} from '../../contexts/AppContext';
import {STRING} from '../../utils/constants/String';

//Services:
import {ServicesActiveUpdateInfo} from './util/ServicesActiveUpdateInfo';
import {AccountService} from '../../utils/services/AccountService';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';

//Services:
import CurrentScreenServices from '../../navigators/services/CurrentScreenServices';

const MyPage = () => {
  const typeAction = 'UPDATE_INFO';
  const useAccessToken = true;
  const {colorApp} = useContext(ContextContainer);
  const [dataCheckBoxUser, setStatedataCheckBoxUser] = useState([]);
  const navigation = useNavigation();
  const [canUpdateInfo, setStateUpdate] = useState(true);
  const refScroll = useRef(null);
  const checkResetPass = useRef(true);
  const cardInforUser = useRef(null);
  const memberRegistration = useRef({
    phoneNumber: '',
    password: '',
    gender: '0',
    birthday: '',
    zipCode: '',
    memberCode: '',
    listFavoriteCategory: [],
  });
  useEffect(() => {
    CurrentScreenServices.set(keyNavigation.MY_PAGE);
    return () => {};
  }, []);

  //Nút chuyển tài khoản trên header:
  const renderRightHeader = () => {
    return (
      <TouchableCo onPress={pressLogout}>
        <AppText style={styles.textRightHeader}>ログアウト</AppText>
      </TouchableCo>
    );
  };

  //Lấy thông tin cơ bản người dùng từ API:
  const getInfoAPI = (dataUser) => {
    memberRegistration.current.phoneNumber = dataUser.numberPhone;
    memberRegistration.current.gender = dataUser.gender;
    memberRegistration.current.birthday = dataUser.birthDay;
    memberRegistration.current.memberCode = dataUser.memberCode;
    memberRegistration.current.zipCode = dataUser.zipCode;
  };

  //Update giới tính:
  const getGender = (gender) => {
    if (gender == '男性') {
      memberRegistration.current.gender = 'MALE';
    } else if (gender == '女性') {
      memberRegistration.current.gender = 'FEMALE';
    } else {
      memberRegistration.current.gender = 'UNDEFINE';
    }
  };

  //Update mã zipCode:
  const getZipCode = (zipcode) => {
    memberRegistration.current.zipCode = zipcode;
  };

  //Zipcode valid API sai:
  const checkZipCodeAPI = (checkValid) => {
    if (checkValid == 'CAN_USE_ZIPCODE') {
      setStateUpdate(true);
    } else {
      setStateUpdate(false);
    }
  };

  //Update ngày sinh:
  const getBirthday = (birthday) => {
    memberRegistration.current.birthday = birthday;
  };

  //Lấy mật khẩu :
  const getPassUpdate = (passUpdate) => {
    memberRegistration.current.password = passUpdate;
  };

  //Kiểm tra validat mật khẩu có thể update:
  const checkValidPass = (checkPass) => {
    if (checkPass && checkPass == 'CAN_USE_NEWPASS') {
      checkResetPass.current = true;
    } else {
      refScroll.current.scrollTo({x: 0, y: 0, animated: true});
      checkResetPass.current = false;
    }
  };

  //Lấy danh sách checkbox của người dùng:
  const getDataListCheckBox = (listCheckbox) => {
    setStatedataCheckBoxUser(listCheckbox);
    let checkedIds = [];
    (listCheckbox || []).forEach((item) => {
      checkedIds = checkedIds.concat(
        (item.children || [])
          .filter((child) => child.status)
          .map((child) => child.id),
      );
    });
    memberRegistration.current.listFavoriteCategory = checkedIds;
  };

  //Lấy data của checkbox đã thay đổi:
  const getFavoriteUse = (item, value) => {
    let checkedIds = memberRegistration.current.listFavoriteCategory || [];
    let index = checkedIds.indexOf(item.id);
    if (index === -1) {
      checkedIds.push(item.id);
    } else {
      checkedIds.splice(index, 1);
    }
    memberRegistration.current.listFavoriteCategory = checkedIds;
  };

  //Ấn nút đổi tài khoản:
  const pressLogout = () => {
    navigation.navigate(keyNavigation.GUIDE);
  };

  //Thông báo cập nhật thông tin thành công:
  const alertUpdateSuccess = () => {
    ToastService.showToast(STRING.update_info_mypage_success);
  };

  //Thông báo cập nhật thông tin không thành công:
  const alertUpdateFalse = () => {
    ToastService.showToast('エラーが発生しました。変更できないです。');
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

  //Phần bottom title đóng khung:
  const renderEndBoxTitile = () => {
    return (
      <View
        style={{
          minHeight: SIZE.width(35),
          width: SIZE.width(96),
          borderWidth: 1,
          borderColor: '#EA9999',
          marginLeft: SIZE.width(2),
          marginTop: SIZE.width(2),
        }}>
        <AppText
          style={{
            marginLeft: SIZE.width(2),
            color: COLOR.red,
            fontWeight: 'bold',
            marginTop: SIZE.width(3),
            marginBottom: SIZE.width(3),
            fontSize: SIZE.H5 * 1.2,
          }}>
          ご注意事項 ＊必ずご確認ください
        </AppText>
        <AppText
          style={{
            marginLeft: SIZE.width(2),
            color: COLOR.red,
            textDecorationLine: 'underline',
            fontSize: SIZE.H5,
          }}>
          すべての情報のご登録を推奨しております。
        </AppText>
        <AppText
          style={{
            marginLeft: SIZE.width(2),
            marginRight: SIZE.width(2),
            color: COLOR.red,
            marginBottom: SIZE.width(3),
            fontSize: SIZE.H5,
          }}>
          任意情報のご入力がない場合、ご本人様確認ができないため、お問い合わせにお答えできません。
        </AppText>
        <AppText
          style={{
            marginLeft: SIZE.width(2),
            marginRight: SIZE.width(2),
            color: COLOR.red,
            marginBottom: SIZE.width(3),
            fontSize: SIZE.H5,
          }}>
          端末紛失など携帯電話番号が変わり、ログインできない場合、生年月日が必須となります。生年月日のご登録がなくログインできない場合のアカウント復旧はできませんのでご注意ください。
        </AppText>
      </View>
    );
  };

  //Update thông tin API:
  const updateInfoAPI = async () => {
    setStateUpdate(false);
    const response = await FetchApi.registerOrUpdateMemberAPI(
      memberRegistration.current.phoneNumber,
      memberRegistration.current.password,
      memberRegistration.current.gender,
      memberRegistration.current.birthday,
      memberRegistration.current.zipCode,
      memberRegistration.current.listFavoriteCategory,
      typeAction,
      useAccessToken,
    );
    if (response && response.message == 'Network request failed') {
      ToastService.showToast(
        'ネットワークに接続できませんでした。後でやり直してください。',
      );
    }
    if (response && response.status_code == 200 && response.code == 1000) {
      const accoutLogin = AccountService.getAccount();
      const passUpdate = memberRegistration.current.password
        ? memberRegistration.current.password
        : accoutLogin.password;
      accoutLogin.password = passUpdate;
      AccountService.updateAccount(accoutLogin);
      cardInforUser.current.checkUpdateInfoAPI(true);
      alertUpdateSuccess();
    } else {
      cardInforUser.current.checkUpdateInfoAPI(false);
      alertUpdateFalse();
    }
    setStateUpdate(true);
  };

  //Call API cập nhật thông tin MyPage:
  const pressUpdateInfoMyPage = () => {
    ServicesActiveUpdateInfo.set('UPDATE_INFO_MYPAGE');
    //Trường hợp không sửa đổi gì pass thì biến này mặc định là true.
    //Nếu thay đổi pass thì bắt đầu nhảy vào các hàm kiểm tra logic về thay đổi pass => thay đổi biến này để thực hiên việc update Info.
    if (checkResetPass.current) {
      updateInfoAPI();
    }
  };

  //Tắt form chọn giới tính:
  const offFormChooseGender = () => {
    cardInforUser.current.offFormChooseGender();
  };

  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen={'マイページ'}
      rightTitle={renderRightHeader()}
      style={{flex: 1, backgroundColor: colorApp.backgroundColor}}>
      <ScrollView showsVerticalScrollIndicator={false} ref={refScroll}>
        <TouchableOpacity onPress={offFormChooseGender} activeOpacity={1}>
          <AppText style={styles.title}>基本情報</AppText>
          {/* Bảng thông tin cơ bản của người dùng */}
          <CardInformationUser
            ref={cardInforUser}
            getGender={getGender}
            getZipCode={getZipCode}
            getPassUpdate={getPassUpdate}
            getBirthday={getBirthday}
            getInfoAPI={getInfoAPI}
            getDataListCheckBox={getDataListCheckBox}
            checkZipCodeAPI={checkZipCodeAPI}
            checkValidPass={checkValidPass}
          />
          {/* Phần chữ chú ý màu đỏ */}
          {textAttention()}
          {/* Phần checkbox Favorite của người dùng lúc đăng kí */}
          <CheckBoxFavorite
            dataCheckBoxUser={dataCheckBoxUser}
            getFavoriteUse={getFavoriteUse}
          />
          {/* Khung chữ dưới cùng */}
          {renderEndBoxTitile()}
          {/* Nút cập nhập thông tin: */}
          <TouchableCo
            disable={canUpdateInfo ? false : true}
            onPress={pressUpdateInfoMyPage}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(92),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(4),
              borderRadius: 8,
              marginLeft: SIZE.width(4),
              backgroundColor: canUpdateInfo
                ? colorApp.backgroundColorButton
                : COLOR.grey_500,
              marginBottom: SIZE.width(10),
            }}>
            <AppText
              style={{
                fontSize: 18,
                color: canUpdateInfo ? colorApp.textColorButton : COLOR.black,
              }}>
              変更
            </AppText>
          </TouchableCo>
        </TouchableOpacity>
      </ScrollView>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  textRightHeader: {
    fontSize: SIZE.H5,
    color: COLOR.black,
    textDecorationLine: 'underline',
  },
  header: {
    backgroundColor: COLOR.main_color_bold,
    marginBottom: 2,
  },
  title: {
    alignSelf: 'center',
    fontSize: SIZE.H4,
    color: COLOR.main_color,
    marginVertical: 12,
  },
});

export default withInteractionsManaged(MyPage);
