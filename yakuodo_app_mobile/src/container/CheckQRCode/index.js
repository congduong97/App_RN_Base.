import React, {Component} from 'react';

import {StyleSheet, Text, View, Alert} from 'react-native';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import QRCodeScanner from '../../liberyCustom/react-native-qrcode-scanner';
import {COLOR_WHITE, APP_COLOR} from '../../const/Color';
import {
  tab,
  screen,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  tracker,
  isIOS,
  APP_ID,
} from '../../const/System';
import {Api} from '../../service';
import {ButtonLogin} from '../LoginScreen/Item/ButtonLogin';
import {STRING} from '../../const/String';
import {getUserInfo} from '../../service/addListener';
import Permissions from 'react-native-permissions';
import {
  openURLwithDeepLinkCoupon,
  checkQRCoupon,
} from '../HomeScreen/SetUpDeepLink';
import {API_URL} from '../../const/Url';
import {checkBlackList} from '../Account/util/checkBlackList';

export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.checkMemberInBlackList();
  }
  checkMemberInBlackList = async () => {
    try {
      const blackList = await checkBlackList();
      if (blackList) {
        return;
      }
    } catch (error) {}
  };

  componentWillUnmount() {}

  onSuccess = async e => {
    // console.log(e);
    try {
      // if (
      //   e.data.includes(`${API_URL.URL_DOMAIN}/api/v1/app/${APP_ID}/checkQPON?`)
      // ) {
      //   checkQRCoupon(e.data);
      //   return;
      // }
      // if (e.data.includes(`${API_URL.URL_DOMAIN}/deeplink`)) {
      //   this.props.navigation.goBack('');
      //   openURLwithDeepLinkCoupon(e.data, true);
      //   return;
      // }
      // console.log('code', e.data);
      const response = await Api.checkQRCode(e.data);
      // console.log('resQr', response);
      if (response.code === 200 && response.res.status.code === 1000) {
        Alert.alert('SUCCESS');
        this.props.navigation.goBack('');
      } else if (response.code === 200 && response.res.status.code === 1043) {
        Alert.alert('het han');
        this.props.navigation.goBack('');
      } else if (response.code === 200 && response.res.status.code === 1042) {
        Alert.alert('khong ton tai');
        this.props.navigation.goBack('');
      }
    } catch (e) {
      Alert.alert(STRING.an_error_occurred);
      this.props.navigation.goBack('');
    }
  };

  render() {
    const {goBack} = this.props.navigation;
    const {iconUrlQrScreen, nameQrScreen} = tab.screenTab;
    return (
      <View style={{flex: 1, backgroundColor: COLOR_WHITE}}>
        <HeaderIconLeft
          title={nameQrScreen}
          imageUrl={iconUrlQrScreen}
          goBack={goBack}
        />
        <QRCodeScanner
          cameraStyle={{height: DEVICE_HEIGHT, width: DEVICE_WIDTH}}
          ref={node => {
            this.scanner = node;
          }}
          checkAndroid6Permissions
          style={{backgroundColor: COLOR_WHITE, height: DEVICE_HEIGHT}}
          onRead={e => this.onSuccess(e)}
        />
        <View
          style={{margin: 16, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: COLOR_WHITE}}>
            QRコードを読み取ってください。
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
