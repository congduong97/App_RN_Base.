//Library:
import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  AppState,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import IconMaitain from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';

//Setup:
import {COLOR, STRINGS, SIZE, APP_ID, APP_ID1, AsyncStoreKey} from '../utils';

//Component:
import {AppImage} from './AppImage';
import {AppText} from './AppText';
import ShowTimeQRCode from './TimeCountQR';

//Services:
import {AccountService} from '../utils/services/AccountService';

export class NetworkError extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      resetTimeQR: true,
      goto_certificate: false,
      ojbImg: {
        certificateImage: '',
        barcodeUrlImg: '',
      },
    };
  }

  componentDidMount() {
    this.checkInfoImg();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  //Hiển thị mã numbersCodeMember x-xxxxxx-xxxxxx:
  numberMemberCodeConvert = (number) => {
    console.log('numbernumbernumbernumber', number);
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

  //Kiểm tra xem từ backGround sang ForceGround thay đổi độ sáng màn hình:
  handleAppStateChange = (appState) => {
    if (appState == 'active') {
      this.setState({resetTimeQR: true});
    } else {
      this.setState({resetTimeQR: false});
    }
  };

  //Lấy thông tin ảnh trước khi mất mạng lần đầu vào app đã lưu ở local mà chưa kịp vào thẻ chứng nhận thành viên:
  checkInfoImg = async () => {
    const goto_certificate = await AsyncStorage.getItem(
      AsyncStoreKey.goto_certificate_screen,
    );
    const certificateImageUrlImg = await AsyncStorage.getItem(
      AsyncStoreKey.certificateImageUrl,
    );
    const barcodeUrlImg = await AsyncStorage.getItem(AsyncStoreKey.barcodeUrl);
    if (!goto_certificate) {
      this.setState({
        ojbImg: {
          certificateImage: certificateImageUrlImg,
          barcodeUrlImg: barcodeUrlImg,
        },
      });
    } else {
      this.setState({goto_certificate: true});
    }
  };

  renderIcon = () => {
    const {iconName, iconSize, disableIcon} = this.props;
    if (disableIcon) {
      return null;
    }
    if (iconName === 'gears') {
      return (
        <IconMaitain
          name={iconName}
          size={iconSize || 80}
          color={COLOR.COLOR_GRAY}
        />
      );
    }
    return (
      <Feather
        name={iconName || 'wifi-off'}
        size={iconSize || 80}
        color={COLOR.COLOR_GRAY}
      />
    );
  };

  //Hiển thị vùng đếm thời gian thực:
  showRunTime = () => {
    const {resetTimeQR} = this.state;
    if (resetTimeQR) {
      return <ShowTimeQRCode until={new Date().getTime()} />;
    } else {
      return null;
    }
  };

  //Hiển thị thông tin ảnh
  checkRenderInfoImg = () => {
    const getAccountLogin = AccountService.getAccount();
    const {ojbImg, goto_certificate} = this.state;
    if (getAccountLogin) {
      return (
        <View style={{alignItems: 'center'}}>
          {/* Ảnh giới thiệu  */}
          <AppImage
            resizeMethod={'contain'}
            source={{
              uri:
                ojbImg && !goto_certificate && ojbImg.certificateImage
                  ? ojbImg.certificateImage
                  : getAccountLogin.certificateImageUrl,
            }}
            style={{
              width: SIZE.width(96),
              height: SIZE.height(30),
            }}></AppImage>
          <AppText
            style={{
              fontSize: SIZE.H5,
              color: COLOR.color_bottom_app1,
              marginTop: 20,
            }}>
            時間が動いていることを確認しスキャンしてください
          </AppText>
          {this.showRunTime()}
          {/* Ảnh barcode: */}
          <FastImage
            style={{
              width: SIZE.width(100),
              height: ((SIZE.width(100) / 2) * 70) / 155,
              marginVertical: 10,
            }}
            source={{
              uri:
                ojbImg && !goto_certificate && ojbImg.barcodeUrlImg
                  ? ojbImg.barcodeUrlImg
                  : getAccountLogin.barcodeUrl,
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
          {/* Mã barcode */}
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.3,
              color: COLOR.COLOR_BLACK,
              fontWeight: '500',
            }}>
            {this.numberMemberCodeConvert(getAccountLogin.memberCode)}
          </AppText>
        </View>
      );
    }
  };
  render() {
    const {onPress, textStyle, title} = this.props;
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View
          activeOpacity={0.2}
          style={[styles.wrapperCenter, this.props.style]}>
          <View style={[styles.wrapperCenter]}>
            {this.renderIcon()}
            <AppText style={[styles.textError, textStyle]}>
              {title || STRINGS.please_try_again_later}
            </AppText>
          </View>
          {this.checkRenderInfoImg()}
          <TouchableOpacity
            onPress={onPress}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(84),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(4),
              borderRadius: 8,
              backgroundColor:
                APP_ID == APP_ID1
                  ? COLOR.color_bottom_app1
                  : COLOR.main_color_light_2,
            }}>
            <AppText style={{fontSize: SIZE.H4 * 0.9, color: COLOR.red_light}}>
              再読込み
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wrapperCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  textError: {
    // paddingHorizontal: 16,
    marginTop: 20,
    color: COLOR.COLOR_GRAY,
    fontSize: 20,
    textAlign: 'center',
  },
});
