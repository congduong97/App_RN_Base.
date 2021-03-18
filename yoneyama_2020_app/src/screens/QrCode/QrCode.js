//Library:
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useNavigation} from '@react-navigation/core';
import {View, Text, Alert} from 'react-native';

//Setup:
import {FetchApi} from '../../utils';

//Component:
import {ContextContainer} from '../../contexts/AppContext';
import {AppContainer} from '../../elements';
import QRCodeScanner from '../../elements/QRCodeScanner';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from '../../utils/constants/System';
import {STRING} from '../../utils/constants/String';

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
        goBackAndMessage('QRコードは無効です');
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

  return (
    <AppContainer
      haveTitle
      goBackScreen
      nameScreen={name}
      style={{backgroundColor: colorApp.backgroundColor}}>
      <View style={{flex: 1, backgroundColor: 'white'}}>
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
          style={{margin: 16, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>QRコードを読み取ってください。</Text>
        </View>
      </View>
    </AppContainer>
  );
}

export default QrCode;
