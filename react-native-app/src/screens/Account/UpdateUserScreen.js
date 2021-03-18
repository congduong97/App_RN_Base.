import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useRef, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import cmndBack from '../../../assets/images/cmnd-back.jpg';
import cmndFront from '../../../assets/images/cmnd-front.jpg';
import {useMergeState} from '../../AppProvider';
import {Color, Dimension} from '../../commons/constants';
import {ratioW, setHeight, setWidth} from '../../commons/utils/devices';
import {convertTimeDate, FORMAT_YYYY_MM_DD} from '../../commons/utils/format';
import {validateImageUri} from '../../commons/utils/validate';
import {
  Button,
  DateTimePicker,
  InputView,
  ScreensView,
  TouchableOpacityEx,
} from '../../components';
import SheetAreaView from '../ChooseArea';
import ActionSheet, {ActionSheetType} from '../../components/ActionSheet';
import models from '../../models';
import {requestUpdateProfile} from '../../networking/Account';
import AvatarView from './AvatarView';
import Userkey from './Userkey';
import UserObject from './UserObject';

const iconSize = 18;

const CmndItem = ({id, title, uri, onChange}) => {
  const [uriID, setUriID] = useState(uri);
  const refActionSheet = useRef();
  const selectPhotoTapped = ({id, data}) => {
    refActionSheet && refActionSheet.current.open();
  };
  const onReponsePicture = ({data}) => {
    onChange &&
      onChange({
        id,
        data: {
          uri: data?.uri,
          name: data?.fileName,
          type: data?.type,
        },
      });
    setUriID({uri: data?.uri});
  };
  return (
    <TouchableOpacityEx
      id={id}
      onPress={selectPhotoTapped}
      style={styles.cmndItem}>
      <Image
        source={uriID}
        style={{
          width: setWidth(200),
          height: setHeight(200),
          borderRadius: 5,
        }}
      />
      <Text style={styles.cmndText}>{title}</Text>
      <ActionSheet
        id={id}
        ref={refActionSheet}
        actionType={ActionSheetType.ChoosePicture}
        onReponse={onReponsePicture}
      />
    </TouchableOpacityEx>
  );
};

const IDView = (props) => {
  const {userInfo, onChange} = props;
  let uriIDFront = validateImageUri(userInfo.cmnd1, cmndFront);
  let uriIDBackside = validateImageUri(userInfo.cmnd2, cmndBack);
  return (
    <View style={styles.cmndContainer}>
      <Text style={[styles.cmndText, styles.cmndTextEx]}>
        {'Chứng minh nhân dân'}
      </Text>
      <View style={styles.cmndGroup}>
        <CmndItem
          id={Userkey.cmnd1}
          title="Mặt trước"
          uri={uriIDFront}
          onChange={onChange}
        />
        <CmndItem
          id={Userkey.cmnd2}
          title="Mặt sau"
          uri={uriIDBackside}
          onChange={onChange}
        />
      </View>
    </View>
  );
};

function UpdateUserScreen(props) {
  const {} = props;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userInfo = models.getUserInfo();
  const refUserData = useRef(new UserObject(userInfo));
  const userDataCurrent = useMemo(() => refUserData.current, [userDataCurrent]);
  const [reRender, setRerender] = useState({});
  console.log('userDataCurrent', userDataCurrent);
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
      userDataCurrent[id] = convertTimeDate(data, FORMAT_YYYY_MM_DD);
    } else if (id === Userkey.Area) {
      userDataCurrent[Userkey.Province] = data?.provinceId;
      userDataCurrent[Userkey.District] = data?.districtId;
      userDataCurrent[Userkey.Ward] = data?.wardId;
      userDataCurrent[Userkey.AreaFullName] = data?.areaFullName;
    } else {
      userDataCurrent[id] = data;
    }
    console.log(userDataCurrent);
    setRerender(!reRender);
  };

  return (
    <ScreensView
      isScroll={true}
      titleScreen={'Cập nhật thông tin'}
      styleContent={styles.styleContains}
      renderFooter={<RenderButtonFooter handleOnPress={handleOnPress} />}>
      <AvatarView
        id={Userkey.Avatar}
        isEdit={true}
        avatarUrl={userInfo?.avatar}
        pictureData={userDataCurrent?.avatar?.uri}
        onPress={handleChangeValue}
      />
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

      <DateTimePicker
        id={Userkey.DateOfBirth}
        style={styles.containsInputView}
        styleInput={styles.styleInput}
        iconLeft={'birthday-cake'}
        iconLeftSize={iconSize}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold'}}
        placeholder="Ngày sinh"
        styleViewLabel={styles.styleViewLabel}
        label={'Ngày sinh:'}
        offsetLabel={-4}
        placeholderTextColor={Color.placeholderTextColor}
        textColor={Color.colorText}
        styleTextButton={styles.stValue}
        onChange={handleChangeValue}
        value={userDataCurrent[Userkey.DateOfBirth]}
      />

      <InputView
        isShowClean={false}
        id={Userkey.Phone}
        iconLeft={'telephone'}
        offsetLabel={-4}
        editable={false}
        iconLeftSize={iconSize}
        style={styles.containsInputView}
        iconLeftColor={Color.colorIcon}
        styleTextInput={{fontWeight: 'bold', color: Color.colorTextDisable}}
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
      <SheetAreaView
        id={Userkey.Area}
        initName={userDataCurrent[Userkey.AreaFullName]}
        onReponse={handleChangeValue}
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
      <IDView userInfo={userDataCurrent} onChange={handleChangeValue} />
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

const styles = StyleSheet.create({
  styleContains: {
    backgroundColor: 'white',
    padding: Dimension.padding15,
  },

  cmndContainer: {
    position: 'relative',
    borderColor: '#8B95A0',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 20,
  },
  cmndGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cmndItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  cmndText: {
    color: '#8B95A0',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  cmndTextEx: {
    position: 'absolute',
    top: 0,
    left: 6,
    transform: [
      {
        translateY: -12,
      },
    ],
    backgroundColor: '#fff',
    color: '#546D9A',
    paddingHorizontal: 4,
    textDecorationLine: 'none',
    fontSize: 14,
  },
  containsInputView: {
    // marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },

  styleInput: {},

  styleViewLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },

  styleViewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },

  styleButtonCancel: {
    flex: 1,
    marginVertical: Dimension.margin20,
    backgroundColor: Color.Border,
  },
  avatarContainer: {
    position: 'relative',
    // backgroundColor: '#f00',
    marginVertical: 25,
  },

  stLabel: {
    color: Color.lableColor,
    fontSize: Dimension.fontSize,
  },
  stValue: {},
});
