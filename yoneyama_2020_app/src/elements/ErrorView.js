//Library:
import React, {useEffect, useContext, useState} from 'react';
import {View, Dimensions, AppState, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {COLOR, SIZE, APP_ID1, AsyncStoreKey} from '../utils';
import {ContextContainer} from '../contexts/AppContext';

//Component:
import {TouchableCo} from './TouchableCo';
import {AppIcon} from './AppIcon';
import {AppText} from './AppText';
import {AppImage} from './AppImage';
import ShowTimeQRCode from './TimeCountQR';

//Services:
import {BottomService} from '../navigators/services/BottomService';
import {AppIdService} from '../utils/services/AppIdService';
import {AccountService} from '../utils/services/AccountService';

const {width, height} = Dimensions.get('window');

const ErrorView = (props) => {
  const {icon, errorName, onPress, style, textStyle, displayBottom} = props;
  const {colorApp} = useContext(ContextContainer);
  const appId = AppIdService.get();
  const [resetTimeQR, setStateResetTimeQR] = useState(true);
  const [gotoCertificate, setStateGotoCertificate] = useState(false);
  const [ojbImg, setStateOjbImg] = useState({
    certificateImage: '',
    barcodeUrlImg: '',
  });

  useEffect(() => {
    checkInfoImg();
    AppState.addEventListener('change', handleAppStateChange);
    BottomService.setDisplay(displayBottom || true);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      BottomService.setDisplay(true);
    };
  }, []);

  //Kiểm tra xem từ backGround sang ForceGround thay đổi độ sáng màn hình:
  const handleAppStateChange = (appState) => {
    if (appState == 'active') {
      setStateResetTimeQR(true);
    } else {
      setStateResetTimeQR(false);
    }
  };

  const renderIcon = () => {
    if (icon) {
      const {type, name} = icon;
      return (
        <AppIcon
          icon={name}
          type={type}
          iconSize={SIZE.H1 * 2.5}
          iconColor={appId === APP_ID1 ? COLOR.main_color : COLOR.main_color_2}
        />
      );
    }
    return null;
  };
  const renderTitle = () => {
    if (errorName) {
      return (
        <View style={{alignItems: 'center'}}>
          <AppText
            style={[{color: COLOR.main_color, fontSize: SIZE.H5}, textStyle]}>
            {errorName}
          </AppText>
        </View>
      );
    }
  };

  //Hiển thị vùng đếm thời gian thực:
  const showRunTime = () => {
    if (resetTimeQR) {
      return <ShowTimeQRCode until={new Date().getTime()} />;
    } else {
      return null;
    }
  };

  //Lấy thông tin ảnh trước khi mất mạng lần đầu vào app đã lưu ở local mà chưa kịp vào thẻ chứng nhận thành viên:
  const checkInfoImg = async () => {
    const goto_certificate = await AsyncStorage.getItem(
      AsyncStoreKey.goto_certificate_screen,
    );
    const certificateImageUrlImg = await AsyncStorage.getItem(
      AsyncStoreKey.certificateImageUrl,
    );
    const barcodeUrlImg = await AsyncStorage.getItem(AsyncStoreKey.barcodeUrl);
    if (!goto_certificate) {
      setStateOjbImg({
        certificateImage: certificateImageUrlImg,
        barcodeUrlImg: barcodeUrlImg,
      });
    } else {
      setStateGotoCertificate(true);
    }
  };

  //Hiển thị mã numbersCodeMember x-xxxxxx-xxxxxx:
  const numberMemberCodeConvert = (number) => {
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

  const renderInfoAccountLogin = () => {
    const getAccountLogin = AccountService.getAccount();

    if (getAccountLogin) {
      return (
        <View style={{alignItems: 'center', marginTop: SIZE.height(3)}}>
          {/* Ảnh giới thiệu  */}
          <AppImage
            resizeMethod={'contain'}
            source={{
              uri:
                ojbImg && !gotoCertificate && ojbImg.certificateImage
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
          {showRunTime()}
          {/* Ảnh barcode: */}
          <FastImage
            style={{
              width: SIZE.width(100),
              height: ((SIZE.width(100) / 2) * 70) / 155,
              marginVertical: 10,
            }}
            source={{
              uri:
                ojbImg && !gotoCertificate && ojbImg.barcodeUrlImg
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
            {numberMemberCodeConvert(getAccountLogin.memberCode)}
          </AppText>
        </View>
      );
    }
    return null;
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View>
        <View
          style={[
            {
              height,
              width,
              backgroundColor: COLOR.white,
              justifyContent: 'center',
              alignItems: 'center',
            },
            style,
          ]}>
          {/* Icon */}
          {renderIcon()}
          {/* Nội dung */}
          {renderTitle()}
          {/* Hiển thị thông tin người dùng đã login */}
          {renderInfoAccountLogin()}
          {/* Nút bấm để load lại dữ liệu */}
          <TouchableCo
            onPress={onPress}
            style={{
              height: SIZE.width(12),
              width: SIZE.width(84),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: SIZE.width(4),
              borderRadius: 8,
              backgroundColor: colorApp.backgroundColorButton
                ? colorApp.backgroundColorButton
                : COLOR.color_bottom_app1,
            }}>
            <AppText style={{fontSize: SIZE.H4 * 0.9, color: COLOR.red_light}}>
              再読込み
            </AppText>
          </TouchableCo>
        </View>
      </View>
    </ScrollView>
  );
};

export {ErrorView};
