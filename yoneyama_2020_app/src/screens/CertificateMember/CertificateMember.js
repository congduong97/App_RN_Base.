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

  //Cập nhật ảnh các thông tin ảnh giới thiệu, ảnh barCode, số hiển thị:
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

  //Kiểm tra có bật point Ảo không?
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

  //Lấy thông tin thẻ chứng nhận thành viên:
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

  //Kiểm tra xem từ backGround sang ForceGround thay đổi độ sáng màn hình:
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

  //Mở MyPage:
  const onPressOpenMyPage = () => {
    SystemSetting.setAppBrightness(brightnessOpenApp.current);
    ForgotModalService.showModal('mypage');
  };

  //Hiển thị thời gian:
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

  //Hiển thị vùng đếm thời gian thực:
  const showRunTime = () => {
    if (resetTimeQR) {
      return <ShowTimeQRCode until={new Date().getTime()} />;
    } else {
      return null;
    }
  };

  //Hiển thị ảnh kèm theo bộ đếm thời gian:
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
            時間が動いていることを確認しスキャンしてください
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
    //Mất mạng:
    if (error.errorView) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => getCertificateMemberAPI()}
        />
      );
    }

    //Server đang bảo trì:
    if (error.maintain) {
      return (
        <ErrorView
          textStyle={{fontSize: SIZE.H4}}
          icon={{name: 'ios-settings'}}
          errorName="只今、システムメンテナンス中です。"
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
            <AppText style={{textAlign: 'center'}}>ポイント数</AppText>
            <AppText style={{textAlign: 'center'}}>927pt</AppText>
          </View>
        ) : null}
        <View style={styles.buttonView}>
          <AppTextButton
            title={'マイページはこちら'}
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
      nameScreen={'会員証'}
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
