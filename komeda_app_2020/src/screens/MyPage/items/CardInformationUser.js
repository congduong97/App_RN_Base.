//Library:
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  useContext,
} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/core';

//Setup:
import {COLOR, SIZE, FetchApi} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppText} from '../../../elements/AppText';
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';
import {AppTextButton, ErrorView, Loading} from '../../../elements';
import {NetworkError} from '../../../elements/NetworkError';
import {ContextContainer} from '../../../contexts/AppContext';
import {STRING} from '../../../utils/constants/String';
function CardInformationUser(props, ref) {
  let [dataInformationUser, setStateDataInformationUSer] = useState({
    userName: '',
    passWord: '',
    gender: '',
    birthDay: '',
    zipCode: '',
    memberCode: '',
    pinCode: '',
  });
  const navigation = useNavigation();
  const formInputPass = useRef(null);
  const [loading, setStateLoading] = useState(true);
  const [error, setStateError] = useState({
    maintain: false,
    network: false,
  });
  const [gender, setStateGender] = useState('');
  const {colorApp} = useContext(ContextContainer);
  //Animation:
  const animatedValue = useRef(new Animated.Value(0.01)).current;
  const translate_Animation_Object = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-SIZE.width(100), 0, SIZE.width(100)],
  });
  const opacity_Animation_Object = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  useEffect(() => {
    getInformationMyPageAPI();
    Animated.timing(animatedValue, {
      toValue: 0.5,
      duration: 777,
      useNativeDriver: true,
    }).start(() => {});
    ServicesUpdateComponent.onChange('UpdateInfor', (event) => {
      if (event == 'CHANGE_EMAIL_SUCCESS' || 'CHANGE_INFO_SUCCESS') {
        getInformationMyPageAPI();
      }
    });

    return () => {};
  }, []);

  useImperativeHandle(ref, () => ({
    checkUpdateInfoAPI,
  }));

  //B???t s??? ki???n update th??nh c??ng:
  const checkUpdateInfoAPI = (success) => {
    if (success) {
      formInputPass.current.resetInputPass();
    }
  };
  const onLinkingCard = () => {
    navigation.navigate(keyNavigation.LINKING_CARD, {key: 'NEWLINKING'});
  };
  //L???y th??ng tin ng?????i d??ng:
  const getInformationMyPageAPI = async () => {
    const response = await FetchApi.getInfoMypage();
    if (response && response.code === 1000) {
      let information = {
        userName: `${response.data.email}`,
        gender: `${response.data.gender}`,
        birthDay: response.data.birthday,
        zipCode: response.data.zipCode,
        memberCode: response.data.memberCode,
        pinCode: response.data.pinCode,
      };
      setStateDataInformationUSer(information);
      showGenderAPI(response.data.gender);
      setStateError({network: false, maintain: false});
      setStateLoading(false);
    } else {
      if (response.status_code >= 500) {
        setStateLoading(false);
        setStateError({network: false, maintain: true});
      } else {
        setStateLoading(false);
        setStateError({network: true, maintain: false});
      }
    }
  };

  //Hi???n th??? gi???i t??nh:
  const showGenderAPI = (gender) => {
    if (gender == 'UNDEFINE') {
      setStateGender('?????????');
    } else if (gender == 'MALE') {
      setStateGender('??????');
    } else {
      setStateGender('??????');
    }
  };

  //???n v??o n??t update th??ng tin MyPage:
  const pressButtonUpdateInfo = (keyActiveButton) => () => {
    switch (keyActiveButton) {
      case 'CHANGE_PASS_WORD_MY_PAGE':
        navigation.navigate(keyNavigation.CHANGE_PASSWORD, {
          key: 'CHANGE_PASS_MY_PAGE',
        });
        break;
      case 'CHANGE_CARD_KOMECA_INFO_MY_PAGE':
        navigation.navigate(keyNavigation.LINKING_CARD, {
          key: 'UPDATELINKING',
          memberCode: dataInformationUser.memberCode,
        });
        break;
      case 'DISABLE_ACCOUNT':
        navigation.navigate(keyNavigation.LINKING_CARD, {
          key: 'UPDATELINKING',
          memberCode: dataInformationUser.memberCode,
        });
        break;

      default:
        navigation.navigate(keyNavigation.MY_PAGE_PASS_CONFIRM, {
          keyActiveButton: keyActiveButton,
          userInformation: dataInformationUser,
        });
    }
  };

  //???n v??o n??t v?? hi???u h??a t??i kho???n:
  const pressDisableAccount = () => {
    navigation.navigate(keyNavigation.DISABLE_ACCOUNT);
  };

  //N??t s???a ?????i th??ng tin c?? nh??n Mypage:
  const buttonUpdateInfo = (keyActiveButton) => {
    return (
      <TouchableOpacity
        onPress={pressButtonUpdateInfo(keyActiveButton)}
        style={{
          height: SIZE.height(4.5),
          width: SIZE.width(17),
          marginRight: SIZE.width(4.26),
          borderWidth: SIZE.width(0.5),
          borderColor: colorApp.borderColorOutlineButton,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <AppText
          style={{
            color: colorApp.textColorOutlineButton,
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5 * 1.2,
          }}>
          ??????
        </AppText>
      </TouchableOpacity>
    );
  };

  //Hi???n th??? t??i kho???n ????ng nh???p:
  const renderUserNameOrPassWord = (content, keyActiveButton) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          height: SIZE.height(10.3),
          width: SIZE.width(100),
          backgroundColor: COLOR.white,
        }}>
        <AppText
          style={{
            flex: 1,
            fontSize: SIZE.H5 * 1.2,
            color: '#6D6D6D',
            marginLeft: SIZE.width(4.2),
          }}>
          {content}
        </AppText>
        {/* N??t s???a ?????i th??ng tin : */}
        {buttonUpdateInfo(keyActiveButton)}
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
      return '?????????';
    }
  };

  //Khung hi???n th??? c??c th??ng tin g???m: Gi???i t??nh, ng??y sinh, m?? ZipCode v?? m?? memberCode.
  const renderPersonalInfo = (keyActiveButton) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLOR.white,
        }}>
        <View style={styles.containerPersonalInfo}>
          <AppText style={{...styles.textInfo, marginTop: SIZE.width(0)}}>
            ????????????: {dataInformationUser.birthDay ? '????????????' : '?????????'}???
          </AppText>
          <AppText style={styles.textInfo}>?????? : {gender}</AppText>
          <AppText style={styles.textInfo}>
            ???????????????{numberZipCode(dataInformationUser.zipCode)}
          </AppText>
        </View>
        {/* N??t s???a ?????i th??ng tin : */}
        {buttonUpdateInfo(keyActiveButton)}
      </View>
    );
  };

  //Th??? li??n k???t th??nh vi??n:
  const cardKOMECAInfo = (keyActiveButton) => {
    if (dataInformationUser.pinCode) {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: COLOR.white,
          }}>
          <View
            style={{
              ...styles.containerPersonalInfo,
              minHeight: SIZE.height(12),
            }}>
            <AppText style={{...styles.textInfo, marginTop: SIZE.width(1)}}>
              ??????????????? ??? {dataInformationUser.memberCode}
            </AppText>
          </View>
          {/* N??t s???a ?????i th??ng tin th??? th??nh vi??n : */}
          {buttonUpdateInfo(keyActiveButton)}
        </View>
      );
    }
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLOR.white,
          paddingHorizontal: SIZE.width(4),
          paddingVertical: SIZE.width(8),
        }}>
        <AppText style={{fontSize: SIZE.H5}}>
          KOMECA??????????????????????????????
        </AppText>
        <AppTextButton
          onPress={onLinkingCard}
          title={'????????????'}
          textStyle={{fontSize: SIZE.H5 * 1.2, color: colorApp.textColorButton}}
          style={{
            minHeight: SIZE.height(5),
            width: SIZE.width(35),
            borderRadius: 0,
            backgroundColor: colorApp.backgroundColorButton,
          }}
        />
      </View>
    );
  };

  //Hi???n th??? ti??u ????? ph???n s??? ????ng k??:
  const renderTitleFormMyPage = (title, top, color) => {
    return (
      <View
        style={{
          height: SIZE.width(10),
          width: SIZE.width(100),
          backgroundColor: color ? color : COLOR.COFFEE_BROWN,
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

  //Ch???c n??ng v?? hi???u h??a t??i kho???n:
  const disableAccount = () => {
    return (
      <View
        style={{
          height: SIZE.height(15),
          width: SIZE.width(100),
          alignItems: 'center',
          borderTopWidth: SIZE.width(0.2),
          borderTopColor: COLOR.grey_300,
          backgroundColor: colorApp.backgroundColor,
        }}>
        <TouchableOpacity
          hitSlop={{right: 30, top: 30, left: 30, bottom: 30}}
          onPress={pressDisableAccount}>
          <AppText
            style={{
              fontSize: SIZE.H5 * 0.95,
              color: '#EF6572',
              marginTop: SIZE.height(2),
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: '#EF6572',
              fontWeight: 'bold',
            }}>
            ????????????????????????
          </AppText>
        </TouchableOpacity>

        <AppText
          style={{
            color: COLOR.grey_400,
            fontSize: SIZE.H6,
            paddingVertical: SIZE.height(1),
          }}>
          ????????????????????????????????????????????????????????????????????????????????????
        </AppText>
        <AppText style={{color: COLOR.grey_400, fontSize: SIZE.H6}}>
          ??????????????????????????????????????????????????????????????????????????????
        </AppText>
      </View>
    );
  };

  //Hi???n th??? n???i dung:
  const renderContent = () => {
    if (loading) {
      return <Loading></Loading>;
    }
    if (error.network) {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={() => getInformationMyPageAPI()}
        />
      );
    }

    if (error.maintain) {
      return (
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName={STRING.server_maintain}
          onPress={() => getInformationMyPageAPI()}
        />
      );
    }
    return (
      <>
        {/* Ti??u ????? t??i kho???n */}
        {renderTitleFormMyPage('?????????????????????', 0)}
        {/* Hi???n th??? s??? ??i???n tho???i: */}
        {renderUserNameOrPassWord(
          dataInformationUser.userName,
          'CHANGE_EMAIL_MY_PAGE',
        )}
        {/* Ti??u ????? ph???n ?????i m???t kh???u */}
        {renderTitleFormMyPage('???????????????', 0)}
        {/* Hi???n th??? m???t kh???u */}
        {renderUserNameOrPassWord('********', 'CHANGE_PASS_WORD_MY_PAGE')}
        {/* Ti??u ????? ph???n th??ng tin kh??c */}
        {renderTitleFormMyPage('?????????', 0)}
        {/* Khung hi???n th??? th??ng tin c?? nh??n: */}
        {renderPersonalInfo('CHANGE_PERSONAL_INFO_MY_PAGE')}
        {/* Ti??u ????? ph???n th??? li??n k???t th??? th??nh vi??n*/}
        {renderTitleFormMyPage('KOMECA', 0, '#47362B')}
        {/* Th??ng tin li??n k???t th??? th??nh vi??n */}
        {cardKOMECAInfo('CHANGE_CARD_KOMECA_INFO_MY_PAGE')}
        {/* Ch???c n??ng v?? hi???u h??a t??i kho???n */}
        {disableAccount()}
      </>
    );
  };

  return (
    <Animated.View
      style={[
        {
          minHeight: SIZE.height(80),
          backgroundColor: COLOR.COFFEE_GRAY_LIGHT,
        },
        {
          transform: [{translateX: translate_Animation_Object}],
          opacity: opacity_Animation_Object,
        },
      ]}>
      {renderContent()}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  //Khung to nh???t bao c??c th??ng tin c?? nh??n g???m : gi???i t??nh => MemberCode.
  containerPersonalInfo: {
    minHeight: SIZE.height(15),
    marginLeft: SIZE.width(4),
    justifyContent: 'center',
  },
  boxInfoItem: {
    height: SIZE.width(10.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(1),
  },
  //Thay ?????i th??ng tin ng?????i d??ng:
  buttonChangeValue: {
    height: SIZE.width(10.5),
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
  },
  //Text th??ng tin :
  textInfo: {
    fontSize: SIZE.H5 * 1.1,
    marginTop: SIZE.width(3),
    color: COLOR.COFFEE_BROWN_LIGHT,
  },
});
CardInformationUser = forwardRef(CardInformationUser);
export {CardInformationUser};
