//Library:
import React, {useState, useLayoutEffect, useRef} from 'react';
import {
  View,
  Linking,
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  SIZE,
  FetchApi,
  ForgotModalService,
  AsyncStoreKey,
} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';

//Component:
import {AppImageButton, Loading} from '../../../elements';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const HomeSlider = ({slider, index, getSlide}) => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const notDataReloadAPI = useRef(0);
  const disableClickItem = useRef(false);
  const timerClick = useRef(0);

  useLayoutEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setLoading(true);
      }, 100);
    }
    const timer = setTimeout(() => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          15,
          LayoutAnimation.Types.easeOut,
          LayoutAnimation.Properties.scaleY,
        ),
      );
      setLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timerClick);
    };
  }, [index]);

  //Xem chi tiết slider.
  const onPressItem = (item) => async () => {
    if (!disableClickItem.current) {
      disableClickItem.current = true;
      FetchApi.openHomeSlide(item.id);
      timerClick.current = setTimeout(() => {
        disableClickItem.current = false;
      }, 1000);
      if (item.typeOpen === 1) {
        if (item.typeOpenLink === 1) {
          navigation.navigate(keyNavigation.WEBVIEW, {data: {url: item.link}});
        } else {
          Linking.canOpenURL(item.link).then((supported) => {
            if (supported) {
              Linking.openURL(item.link);
            } else {
              openUlrBrowser(item.link);
            }
          });
        }
      } else if (item.typeOpen === 4) {
        if (item.typeOpenLink === 1) {
          navigation.navigate(keyNavigation.WEBVIEW, {
            data: {url: item.pdfUrl},
          });
        } else {
          Linking.canOpenURL(item.pdfUrl).then((supported) => {
            if (supported) {
              Linking.openURL(item.pdfUrl);
            } else {
              openUlrBrowser(item.pdfUrl);
            }
          });
        }
      } else if (item.typeOpen === 2) {
        switch (item.customMenuDataDtoForApp.typeFunctionMenu) {
          case 'LINK_FUNCTION':
            if (checkUserLogin(item.customMenuDataDtoForApp.function)) {
              //Mypage:
              if (
                item.customMenuDataDtoForApp.function === keyNavigation.MY_PAGE
              ) {
                ForgotModalService.showModal('mypage');
                return;
              }
              //Bookmark:
              if (item.customMenuDataDtoForApp.function === 'BOOKMARK_STORE') {
                navigation.navigate(keyNavigation.STORE, {
                  keyActiveBookMark: 'BOOKMARK_STORE',
                });
                return;
              }
              //Certificate Member:
              if (
                item.customMenuDataDtoForApp.function ===
                keyNavigation.CERTIFICATE_MEMBER
              ) {
                const initSecure = await AsyncStorage.getItem(
                  AsyncStoreKey.memmber_secure,
                );
                if (initSecure === 'secure') {
                  navigation.navigate(keyNavigation.APP_INPUT_PASSWORD, {
                    mode: 'memmber',
                  });
                } else {
                  navigation.navigate(item.customMenuDataDtoForApp.function, {
                    itemMenu: item.customMenuDataDtoForApp,
                  });
                }
              } else {
                navigation.navigate(item.customMenuDataDtoForApp.function, {
                  itemMenu: item.customMenuDataDtoForApp,
                });
              }
            }
            break;
          case 'WEB_VIEW':
            if (item.typeOpen === 'WEBVIEW') {
              navigation.navigate(keyNavigation.WEBVIEW, {
                data: {url: item.url},
              });
            } else if (item.typeOpen === 'BROWSER') {
              Linking.canOpenURL(item.url).then((supported) => {
                if (supported) {
                  Linking.openURL(item.url);
                } else {
                  openUlrBrowser(item.url);
                }
              });
            }
            break;
        }
      } else {
        return;
      }
    }
  };

  //Item Slider:
  const itemSlider = () => {
    return slider.map((item) => (
      <AppImageButton
        onPress={onPressItem(item)}
        key={`${item.key}`}
        source={{uri: item.url}}
        style={{
          width: SIZE.width(100),
          height: SIZE.width(56.25),
        }}
      />
    ));
  };

  if (loading) {
    return (
      <View style={{width: SIZE.width(100), height: SIZE.width(56.25)}}>
        <Loading />
      </View>
    );
  }
  if ((slider && slider.length == 0) || !slider) {
    //Nếu vào App lần đầu không có slider gọi lại API check lại 1 lần.
    if (notDataReloadAPI.current == 0) {
      getSlide();
      notDataReloadAPI.current = 1;
    }
    return null;
  }
  if (slider && slider.length > 0) {
    return (
      <>
        <Swiper
          style={{height: SIZE.width((100 / 16) * 9)}}
          autoplay={true}
          dotStyle={{
            height: 10,
            width: 10,
            borderRadius: 5,
            marginBottom: -SIZE.width(22),
            marginLeft: 5,
          }}
          activeDotStyle={{
            height: 10,
            width: 10,
            borderRadius: 5,
            marginBottom: -SIZE.width(22),
            marginLeft: 5,
          }}
          activeDotColor="orange">
          {itemSlider()}
        </Swiper>
        {slider && slider.length === 1 && (
          <View
            style={{
              position: 'absolute',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginTop: 16,
              alignSelf: 'center',
              top: SIZE.width(56.25),
              backgroundColor: 'orange',
            }}
          />
        )}
      </>
    );
  }
};

export default React.memo(HomeSlider);

//Lưu ý :
//Slider của app này không còn được lấy trong useContext vì nó sẽ được hiển thị chỉ định cho từng user theo favorite và categori:
