//Library:
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Text, Alert} from 'react-native';

//Setup:
import {FetchApi, SIZE, COLOR} from '../../utils';

//Component:
import {ContextContainer} from '../../contexts/AppContext';
import QRCodeScanner from '../../elements/QRCodeScanner';
import {DEVICE_HEIGHT, DEVICE_WIDTH, isIos} from '../../utils/constants/System';
import {STRING} from '../../utils/constants/String';
import {AppHeader} from '../../elements';

function QrCode({route}) {
  const {colorApp} = useContext(ContextContainer);
  const [name, setStateNameScreen] = useState('');
  const [showCamera, setStateShowCamera] = useState(true);
  const timeCount = useRef(0);
  const navigation = useNavigation();

  useEffect(() => {
    getNameScreen();
    return () => {
      clearTimeout(timeCount.current);
    };
  }, []);

  const getNameScreen = () => {
    const {itemMenu} = route.params;
    if (itemMenu) {
      setStateNameScreen(itemMenu.name);
    }
  };

  const goBackAndMessage = (message) => {
    setStateShowCamera(false);
    navigation.goBack();
    Alert.alert(message);
  };

  const checkQrCodeAPI = async (link) => {
    const response = await FetchApi.checkQrCode(link);
    if (response && response.status_code == 200) {
      if (response.code == 1000) {
        goBackAndMessage(response.data);
      } else if (response.code == 1051 || response.code == 1052) {
        goBackAndMessage('対象期間外のQRコードです');
      } else {
        goBackAndMessage('エラーが発生しました！');
      }
    } else {
      goBackAndMessage('エラーが発生しました！');
    }
  };

  const onSuccess = async (e) => {
    try {
      if (e.data.includes('qrCode/checkQrCode?')) {
        checkQrCodeAPI(e.data);
        return;
      } else {
        goBackAndMessage(STRING.an_error_occurred);
      }
    } catch (error) {
      goBackAndMessage(STRING.an_error_occurred);
    }
  };
  const leftGoBack = () => {
    setStateShowCamera(false);
    timeCount.current = setTimeout(() => {
      navigation.goBack();
    }, 150);
  };

  return (
    <View style={{backgroundColor: colorApp.backgroundColor}}>
      <AppHeader title={name} onPressLeft={leftGoBack} leftGoBack />
      <View style={{flex: 1}}>
        {showCamera && (
          <QRCodeScanner
            cameraStyle={{height: DEVICE_HEIGHT, width: DEVICE_WIDTH}}
            checkAndroid6Permissions
            style={{backgroundColor: 'white', height: DEVICE_HEIGHT}}
            onRead={(e) => onSuccess(e)}
            onDenyPermission={() => navigation.goBack()}
          />
        )}
        <View
          style={{
            width: SIZE.width(100),
            justifyContent: 'center',
            alignItems: 'center',
            top: SIZE.height(70),
            position: 'absolute',
            alignItems: 'center',
          }}>
          <Text
            style={{color: COLOR.COFFEE_BROWN, fontFamily: 'irohamaru-Medium'}}>
            QRコードを読み取ってください。
          </Text>
        </View>
      </View>
    </View>
  );
}

export default QrCode;
