//Library:
import React, {useState, useEffect, useContext, useRef} from 'react';
import {StyleSheet, View, ScrollView, AppState} from 'react-native';
import HTML from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import SystemSetting from 'react-native-system-setting';
import AsyncStorage from '@react-native-community/async-storage';
import hexToRgba from 'hex-to-rgba';

//Setup:
import {SIZE, COLOR, STYLE} from '../../utils/resource';
import {FetchApi} from '../../utils/modules';
import {ContextContainer} from '../../contexts/AppContext';

//Component:
import {AppContainer, AppTextButton, ErrorView} from '../../elements';
import {AppText} from '../../elements/AppText';
import {ForgotModalService, AsyncStoreKey} from '../../utils';
import {withInteractionsManaged} from '../../HOC/withInteractionsManaged';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';
import {NetworkError} from '../../elements/NetworkError';
import {ShowTimeQRCode} from '../../elements/TimeCountQR';

//Services:
import {AccountService} from '../../utils/services/AccountService';
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import CurrentScreenServices from '../../navigators/services/CurrentScreenServices';

const CertificateMember = ({navigation}) => {
  const [data, setData] = useState([]);
  const {barcodeUrl, memberCode, note, imageUrl} = data || {};
  const {colorApp} = useContext(ContextContainer);
  const [showPointFake, setStateShowPointFake] = useState(false);
  const [resetTimeQR, setStateResetTimeQR] = useState(true);
  const currentScreenInStack = useRef(keyNavigation.CERTIFICATE_MEMBER);
  const [error, setStateError] = useState({
    errorView: false,
    maintain: false,
  });
  const brightnessOpenApp = useRef(0);
  const keyActiveBright = useRef('');

  useEffect(() => {
    ServicesUpdateComponent.onChange('ListtentActiveBright', (screen) => {
      if (screen && screen == keyNavigation.CERTIFICATE_MEMBER) {
        SystemSetting.setAppBrightness(1);
      } else {
        SystemSetting.setAppBrightness(brightnessOpenApp.current);
      }
    });
    CurrentScreenServices.onChange(
      'ListtentActiveBrightCertificate',
      (currentScreen) => {
        currentScreenInStack.current = currentScreen;
      },
    );
    checkFakePoint();
    onDidMount();
    return () => {
      ServicesUpdateComponent.remove('ListtentActiveBright');
      CurrentScreenServices.remove('ListtentActiveBrightCertificate');
      AppState.removeEventListener('change', handleAppStateChange);
      keyActiveBright.current = '';
      SystemSetting.setAppBrightness(brightnessOpenApp.current);
    };
  }, []);

  //C???p nh???t ???nh c??c th??ng tin ???nh gi???i thi???u, ???nh barCode, s??? hi???n th???:
  const updateInfoAccountWhenError = (
    barcodeUrl,
    accessTime,
    imageUrl,
    memberCode,
  ) => {
    const accountLogin = AccountService.getAccount();
    accountLogin.barcodeUrl = barcodeUrl;
    accountLogin.certificateImageUrl = imageUrl;
    accountLogin.memberCode = memberCode;
    accountLogin.accessTime = accessTime;
    AccountService.updateAccount(accountLogin);
  };

  //Ki???m tra c?? b???t point ???o kh??ng?
  const checkFakePoint = async () => {
    const checkPointFake = await AsyncStorage.getItem(
      AsyncStoreKey.setup_secu_and_certy,
    );
    let fakePoint = JSON.parse(checkPointFake);
    if (fakePoint && fakePoint.usingFakePointCertificate) {
      setStateShowPointFake(true);
    }
  };

  const onDidMount = () => {
    SystemSetting.getBrightness().then((brightness) => {
      if (brightness < 0.3) {
        brightnessOpenApp.current = 0.5;
      } else {
        brightnessOpenApp.current = brightness;
      }
    });
    SystemSetting.setAppBrightness(1);
    getCertificateMemberAPI();
    keyActiveBright.current = keyNavigation.CERTIFICATE_MEMBER;
    AppState.addEventListener('change', handleAppStateChange);
  };

  //Hi???n th??? m?? numbersCodeMember x-xxxxxx-xxxxxx:
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

  //L???y th??ng tin th??? ch???ng nh???n th??nh vi??n:
  const getCertificateMemberAPI = async () => {
    const response = await FetchApi.getCertificate();
    if (response && response.status_code == 200 && response.code == 1000) {
      setData(response.data);
      const {barcodeUrl, accessTime, imageUrl, memberCode} = response.data;
      if (barcodeUrl && accessTime && imageUrl && memberCode) {
        updateInfoAccountWhenError(
          barcodeUrl,
          accessTime,
          imageUrl,
          memberCode,
        );
        await AsyncStorage.setItem(
          AsyncStoreKey.goto_certificate_screen,
          'CERTIFICATE',
        );
        await AsyncStorage.setItem(
          AsyncStoreKey.certificateImageUrl,
          `${imageUrl}`,
        );
        await AsyncStorage.setItem(AsyncStoreKey.barcodeUrl, `${barcodeUrl}`);
      }
      setStateError({...error, errorView: false});
      return;
    }
    if (response.status_code >= 500) {
      setStateError({...error, maintain: true});
      return;
    } else {
      setStateError({...error, errorView: true});
    }
  };

  //Ki???m tra xem t??? backGround sang ForceGround thay ?????i ????? s??ng m??n h??nh:
  const handleAppStateChange = (appState) => {
    if (
      appState == 'active' &&
      keyActiveBright.current == keyNavigation.CERTIFICATE_MEMBER
    ) {
      if (currentScreenInStack.current !== keyNavigation.CERTIFICATE_MEMBER) {
        SystemSetting.setAppBrightness(brightnessOpenApp.current);
      } else {
        setStateResetTimeQR(true);
        SystemSetting.setAppBrightness(1);
      }
    } else {
      setStateResetTimeQR(false);
      SystemSetting.setAppBrightness(brightnessOpenApp.current);
    }
  };

  //M??? MyPage:
  const onPressOpenMyPage = () => {
    SystemSetting.setAppBrightness(brightnessOpenApp.current);
    ForgotModalService.showModal('mypage');
  };

  //Hi???n th??? th???i gian:
  const showMemberCodeConvert = () => {
    if (memberCode) {
      return (
        <AppText style={styles.codeText}>
          {numberMemberCodeConvert(memberCode)}
        </AppText>
      );
    }
    return null;
  };

  //Hi???n th??? v??ng ?????m th???i gian th???c:
  const showRunTime = () => {
    if (resetTimeQR) {
      return <ShowTimeQRCode until={new Date().getTime()} />;
    } else {
      return null;
    }
  };

  //Hi???n th??? ???nh k??m theo b??? ?????m th???i gian:
  const renderBarCode = () => {
    if (barcodeUrl) {
      return (
        <>
          <FastImage
            style={styles.topImage}
            source={{uri: imageUrl}}
            resizeMode={FastImage.resizeMode.contain}
          />
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: colorApp.backgroundColorButton,
              marginTop: 20,
            }}>
            ????????????????????????????????????????????????????????????????????????
          </AppText>
          {showRunTime()}
          <FastImage
            style={styles.centerImage}
            source={{uri: barcodeUrl}}
            resizeMode={FastImage.resizeMode.stretch}
          />
          {showMemberCodeConvert()}
        </>
      );
    }
    return null;
  };

  const renderContent = () => {
    //M???t m???ng:
    if (error.errorView) {
      return (
        <NetworkError
          title={
            '?????????????????????????????????????????????????????????????????????????????????????????????????????????'
          }
          onPress={() => getCertificateMemberAPI()}
        />
      );
    }

    //Server ??ang b???o tr??:
    if (error.maintain) {
      return (
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName="???????????????????????????????????????????????????"
          onPress={getCertificateMemberAPI}
        />
      );
    }

    return (
      <ScrollView
        style={{marginHorizontal: 20, marginVertical: 10}}
        showsVerticalScrollIndicator={false}>
        <View style={STYLE.center}>{renderBarCode()}</View>
        {showPointFake ? (
          <View
            style={{
              backgroundColor: hexToRgba(colorApp.backgroundColorButton, '0.4'),
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: SIZE.width(2),
              marginTop: SIZE.width(2),
            }}>
            <AppText style={{textAlign: 'center'}}>???????????????</AppText>
            <AppText style={{textAlign: 'center'}}>927pt</AppText>
          </View>
        ) : null}
        <View style={styles.buttonView}>
          <AppTextButton
            title={'???????????????????????????'}
            textStyle={{
              color: colorApp.backgroundColorButton,
              fontWeight: 'bold',
              fontSize: SIZE.H5 * 1.3,
              textDecorationLine: 'underline',
            }}
            onPress={onPressOpenMyPage}
          />
        </View>
        {note ? (
          <View
            style={[
              STYLE.border,
              styles.bottomView,
              {flex: 1, paddingHorizontal: 16, borderColor: 'red'},
            ]}>
            <HTML html={note} />
          </View>
        ) : null}
      </ScrollView>
    );
  };
  return (
    <AppContainer
      haveBottom
      goBackScreen
      haveTitle
      nameScreen={'?????????'}
      style={{flex: 1, backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
};

export default withInteractionsManaged(CertificateMember);

const styles = StyleSheet.create({
  topImage: {
    width: SIZE.width(100) / 1.1,
    height: ((SIZE.width(100) / 1.1) * 88) / 170,
  },
  centerText: {
    fontSize: SIZE.H5,
    color: COLOR.COLOR_GREEN,
    marginTop: 20,
  },
  centerDate: {
    fontSize: SIZE.H5,
    fontWeight: 'bold',
    color: COLOR.COLOR_BLACK,
    marginTop: 10,
  },
  centerImage: {
    width: SIZE.width(100),
    height: ((SIZE.width(100) / 2) * 70) / 155,
    marginVertical: 10,
  },
  buttonView: {
    alignItems: 'flex-end',
  },
  codeText: {
    fontSize: SIZE.H5 * 1.3,
    color: COLOR.COLOR_BLACK,
    fontWeight: '500',
  },
  bottomView: {
    minHeight: 20,
    marginVertical: 10,
  },
});
