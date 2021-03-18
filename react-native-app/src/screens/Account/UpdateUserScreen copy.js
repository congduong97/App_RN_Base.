import React, {useMemo, useRef, useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Color, Size} from '../../commons/constants';
import {ratioW, setHeight, setWidth} from '../../commons/utils/devices';
import {validateImageUri} from '../../commons/utils/validate';
import {Button, InputView, ScreensView} from '../../components';
import {requestUpdateProfile} from '../../networking/Account';
import models from '../../models';
import API from '../../networking';
import styles from './styles';
import Userkey from './Userkey';
import UserObject from './UserObject';
import cmndFront from '../../../assets/images/cmnd-front.jpg';
import cmndBack from '../../../assets/images/cmnd-back.jpg';
import ModalSelectUpLoadImage from '../../components/ModalSelectUpLoadImage';

const iconSize = 18;

function UpdateUserScreen(props) {
  const {} = props;
  const linkAvatarDefault =
    'https://www.vippng.com/png/detail/355-3554387_create-digital-profile-icon-blue-profile-icon-png.png';
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userInfo = models.getUserInfo();
  const [avatarUser, setStateAvatarUser] = useState(
    userInfo && userInfo?.avatar
      ? validateImageUri(userInfo.avatar)
      : linkAvatarDefault,
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const refUserData = useRef(new UserObject(userInfo));
  const userDataCurrent = useMemo(() => refUserData.current, [userDataCurrent]);
  const refModalSelectUpLoadImage = useRef(null);
  const typeUpLoadCmt = useRef();
  const [imgCmtUp, setStateCmtUp] = useState({});
  const [imgCmtDown, setStateCmtDown] = useState({});

  //ọi API update form thông tin:
  const handleOnPress = ({data, id}) => {
    if (id == 'Type-Cancel') {
      navigation.goBack();
    }
    if (id == 'Type-Update') {
      requestUpdateProfile(dispatch, userDataCurrent);
    }
  };

  const handleChangeValue = ({id, data}) => {
    if (id == Userkey.DateOfBirth) {
      return;
    } else {
      userDataCurrent[id] = data;
    }
  };

  const onOpenSheetUpload = (type) => () => {
    typeUpLoadCmt.current = type;
    refModalSelectUpLoadImage.current.openSheetPreview();
  };

  //Lấy ảnh được chọn:
  const getImgSelect = (img) => {
    if (typeUpLoadCmt.current == 'cmt_up') {
      userDataCurrent[Userkey.cmnd1] = {
        uri: `${img.url}`,
      };
      setStateCmtUp(img);
    } else if (typeUpLoadCmt.current == 'cmt_down') {
      userDataCurrent[Userkey.cmnd2] = {
        uri: `${img.url}`,
      };
      setStateCmtDown(img);
    } else {
      userDataCurrent[Userkey.Avatar] = {
        uri: `${img.url}`,
      };
      setStateAvatarUser(`${img.url}`);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    userDataCurrent[Userkey.DateOfBirth] = `${date}`;
    hideDatePicker();
  };

  const renderImgCmt = (type) => {
    if (type == 'cmt_up') {
      if (imgCmtUp && imgCmtUp.url) {
        return {uri: imgCmtUp.url};
      } else {
        if (userInfo && userInfo.cmnd1) {
          userInfo.cmnd1_update = `${userInfo.cmnd1}`;
          return {uri: `${userInfo.cmnd1}`};
        }
        return cmndFront;
      }
    } else if (type == 'cmt_down') {
      if (imgCmtDown && imgCmtDown.url) {
        return {uri: imgCmtDown.url};
      } else {
        if (userInfo && userInfo.cmnd2) {
          userInfo.cmnd2_update = `${userInfo.cmnd1}`;
          return {uri: `${userInfo.cmnd2}`};
        }
        return cmndBack;
      }
    }
  };

  const CmndItem = ({title, name}) => {
    return (
      <TouchableOpacity onPress={onOpenSheetUpload(name)}>
        <View style={styles.cmndItem}>
          <Image
            source={renderImgCmt(name)}
            style={{
              width: setWidth(200),
              height: setHeight(200),
              borderRadius: 5,
            }}
          />
          <Text style={styles.cmndText}>{title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const CmndContainer = (props) => {
    return (
      <View style={styles.cmndContainer}>
        <Text style={[styles.cmndText, styles.cmndTextEx]}>
          {'Chứng minh nhân dân'}
        </Text>
        <View style={styles.cmndGroup}>
          <CmndItem
            uri={cmndFront}
            name="cmt_up"
            title="Mặt trước"
            {...props}
          />
          <CmndItem uri={cmndBack} name="cmt_down" title="Mặt sau" {...props} />
        </View>
      </View>
    );
  };

  return (
    <ScreensView
      isScroll={true}
      titleScreen={'Cập nhật thông tin'}
      styleContent={styles.styleContains}
      renderFooter={<RenderButtonFooter handleOnPress={handleOnPress} />}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.avatarContainer}>
          <Image
            resizeMode="cover"
            source={{uri: avatarUser}}
            PlaceholderContent={<ActivityIndicator />}
            style={styles.styleAvatar}
          />
          <TouchableOpacity
            style={styles.avatarCamera}
            onPress={onOpenSheetUpload('update_avatar')}>
            <AntDesign name="camera" size={20} color="#2FA7C5" />
          </TouchableOpacity>
        </View>
      </View>
      <InputView
        id={Userkey.FullName}
        iconLeft={'user'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        label={'Họ tên:'}
        placeholder="Nhập họ tên..."
        value={userDataCurrent[Userkey.FullName]}
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <TouchableOpacity
        disabled={true}
        onPress={() => {
          // showDatePicker();
        }}
        style={[
          styles.containsInputView,
          {
            flexDirection: 'row',
            borderWidth: 0.75,
            borderRadius: 4,
          },
        ]}>
        <InputView
          isShowClean={false}
          editable={false}
          id={Userkey.DateOfBirth}
          iconLeft={'birthday-cake'}
          iconLeftSize={iconSize}
          label={'Ngày sinh:'}
          offsetLabel={-4}
          style={{flex: 1, borderWidth: 0}}
          styleViewLabel={styles.styleViewLabel}
          iconLeftColor={Color.colorIcon}
          styleTextInput={{fontWeight: 'bold'}}
          styleInput={{borderWidth: 0}}
          value={userDataCurrent[Userkey.DateOfBirth]}
          placeholder="Ngày sinh"
          returnKeyType="next"
        />
        <View
          style={{
            width: Size.width(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <FontAwesome name={'calendar'} size={21} color={'grey'}></FontAwesome>
        </View>
      </TouchableOpacity>

      <InputView
        isShowClean={false}
        id={Userkey.Phone}
        iconLeft={'telephone'}
        offsetLabel={-4}
        editable={false}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Phone]}
        label={'Số điện thoại:'}
        placeholder="Nhập số điện thoại."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />

      <InputView
        id={Userkey.Email}
        iconLeft={'email'}
        offsetLabel={-4}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Email]}
        label={'Email:'}
        placeholder="Nhập Email"
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />

      <InputView
        id={Userkey.Address}
        iconLeft={'home-address'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Address]}
        label={'Địa chỉ nhà:'}
        placeholder="Nhập địa chỉ"
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.Area}
        iconLeft={'home-address'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Area]}
        label={'Phường/xã, Quận/Huyện, Tỉnh /Thành:'}
        placeholder="Phường/xã, Quận/Huyện, Tỉnh /Thành"
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.Zalo}
        iconLeft={'zalo'}
        offsetLabel={-4}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Zalo]}
        label={'Liên kết Zalo:'}
        placeholder="Nhập liên kết Zalo..."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.Facebook}
        iconLeft={'facebook'}
        offsetLabel={-4}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.Facebook]}
        label={'Liên kết Facebook:'}
        placeholder="Nhập liên kết Facebook..."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.BankName}
        iconLeft={'bank'}
        offsetLabel={-4}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.BankName]}
        label={'Tên Ngân hàng:'}
        placeholder="Nhập Tên ngân hàng..."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.BankAccount}
        iconLeft={'credit-card'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.BankAccount]}
        label={'Số tài khoản Ngân hàng:'}
        placeholder="Nhập Số tài khoản/Số thẻ Ngân hàng..."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <InputView
        id={Userkey.BankAccountName}
        iconLeft={'card-id'}
        iconLeftSize={iconSize}
        offsetLabel={-4}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        styleInput={styles.styleInput}
        styleViewLabel={styles.styleViewLabel}
        value={userDataCurrent[Userkey.BankAccountName]}
        label={'Tên Chủ tài khoản:'}
        placeholder="Chủ tài khoản."
        onChangeText={handleChangeValue}
        returnKeyType="next"
      />
      <CmndContainer userDataCurrent={userDataCurrent} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <ModalSelectUpLoadImage
        ref={refModalSelectUpLoadImage}
        getImgSelect={getImgSelect}></ModalSelectUpLoadImage>
    </ScreensView>
  );
}

function RenderButtonFooter(props) {
  const {handleOnPress} = props;
  return (
    <View style={styles.styleViewButton}>
      <Button
        id={'Type-Cancel'}
        onPress={handleOnPress}
        color={'#fff'}
        title="Huỷ bỏ"
        style={styles.styleButtonCancel}
        titleStyle={{color: 'white', fontSize: 16}}
      />
      <View style={{width: 10 * ratioW}} />
      <Button
        id={'Type-Update'}
        onPress={handleOnPress}
        color={Color.MayaBlue}
        title="Thay đổi"
        style={{flex: 1, marginVertical: 20}}
      />
    </View>
  );
}

export default UpdateUserScreen;
