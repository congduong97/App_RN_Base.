//Library:
import React, {useContext, useRef, useLayoutEffect} from 'react';
import {View, TouchableOpacity, Animated, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

//Setup:
import {SIZE, ForgotModalService, AsyncStoreKey} from '../../../utils';
import {ContextContainer} from '../../../contexts/AppContext';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {checkUserLogin} from '../../../utils/modules/CheckLogin';

//Component:
import {AppText} from '../../../elements/AppText';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

const HomeNotice = ({notice, refreshNotiHome}) => {
  const {colorApp} = useContext(ContextContainer);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  if (notice == undefined) {
    refreshNotiHome();
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      actionAnimation();
    }, 500);
    return () => {};
  }, []);

  const actionAnimation = () => {
    // Will change fadeAnim value to 1 in 5 seconds:
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  //Kiểm tra mã hexa thì cho active cấu hình màu sắc noti quan trọng:
  const checkValidColorItemActive = (colorHexa) => {
    if (colorHexa && colorHexa.slice(0, 1) == '#' && colorHexa.length > 4) {
      return colorHexa;
    } else {
      return colorApp.textColor;
    }
  };

  //Ấn vào mở noti Home:
  const onPressItem = (item) => async () => {
    if (item.typeOpenNoti === 'VIEW_DETAIL') {
      navigation.navigate(keyNavigation.NOTIFICATION_DETAIL, {
        data: {
          item,
          nameScreenDetail: 'お知らせ',
        },
      });
      return;
    }
    if (item.typeOpenNoti === 'OPEN_WEBVIEW') {
      if (item.typeOpenLink === 'BROWSER') {
        Linking.canOpenURL(item.linkWebview).then((supported) => {
          if (supported) {
            Linking.openURL(item.linkWebview);
          } else {
            openUlrBrowser(item.linkWebview);
          }
        });
        return;
      }
      navigation.navigate(keyNavigation.WEBVIEW, {
        data: {url: item.linkWebview},
      });
      return;
    }
    if (item.typeOpenNoti === 'OPEN_PDF') {
      if (item.typeOpenLink === 'BROWSER') {
        Linking.canOpenURL(item.pdfUrl).then((supported) => {
          if (supported) {
            Linking.openURL(item.pdfUrl);
          } else {
            openUlrBrowser(item.pdfUrl);
          }
        });
        return;
      }
      navigation.navigate(keyNavigation.WEBVIEW, {
        data: {url: item.pdfUrl},
      });
    } else {
      if (checkUserLogin(item.menuEntity.function)) {
        //MyPage:
        if (item.menuEntity.function === keyNavigation.MY_PAGE) {
          ForgotModalService.showModal('mypage');
          return;
        }
        //Chuyển đến màn hình Store và Active vào TabBookMark:
        if (item.menuEntity.function === 'BOOKMARK_STORE') {
          navigation.navigate(keyNavigation.STORE, {
            keyActiveBookMark: 'BOOKMARK_STORE',
          });
          return;
        }
        //Thẻ thành viên:
        if (item.menuEntity.function === keyNavigation.CERTIFICATE_MEMBER) {
          const initSecure = await AsyncStorage.getItem(
            AsyncStoreKey.memmber_secure,
          );
          if (initSecure === 'secure') {
            navigation.navigate(keyNavigation.APP_INPUT_PASSWORD, {
              mode: 'memmber',
            });
          } else {
            navigation.navigate(item.menuEntity.function, {
              itemMenu: item.menuEntity,
            });
          }
        } else {
          navigation.navigate(item.menuEntity.function, {
            itemMenu: item.menuEntity,
          });
        }
      }
    }
  };

  return (
    <View style={[{margin: SIZE.width(1)}]}>
      <AppText
        style={{
          color: colorApp.backgroundColorButton,
          fontSize: 15,
          alignSelf: 'center',
          marginTop: SIZE.width(1),
        }}>
        ブランドの切り替えはこちらのタブをご選択
      </AppText>
      {notice === null || (notice && notice.length === 0) ? null : (
        <Animated.View
          style={[
            {
              borderWidth: 1,
              borderColor: colorApp.borderColorOutlineButton,
              marginVertical: SIZE.width(2),
              justifyContent: 'center',
            },
          ]}>
          <View style={{paddingVertical: SIZE.width(1.5)}}>
            {notice &&
              notice.map((item, index) => {
                if (item.type === 'IMPORTANT') {
                  const colorTitle = checkValidColorItemActive(item.color);
                  return (
                    <TouchableOpacity
                      onPress={onPressItem(item)}
                      key={item.id + ''}
                      style={{
                        flexDirection: 'row',
                        paddingBottom: SIZE.width(1.5),
                        paddingHorizontal: SIZE.width(2),
                        minHeight: SIZE.width(5),
                        paddingTop: index >= 1 ? SIZE.width(3) : SIZE.width(0),
                        alignItems: 'center',
                      }}>
                      <AppText style={{fontSize: SIZE.H5, marginRight: 10}}>
                        {moment(new Date(item.startTime)).format('YYYY/MM/DD')}
                      </AppText>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: SIZE.width(70),
                        }}>
                        <AppText
                          style={{
                            fontSize: SIZE.H5,
                            color: colorTitle,
                            textDecorationLine: 'underline',
                            textDecorationStyle: 'solid',
                            textDecorationColor: colorTitle,
                          }}>
                          {item.title}
                        </AppText>
                      </View>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    onPress={onPressItem(item)}
                    key={item.id + ''}
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: SIZE.width(2),
                      minHeight: SIZE.width(5),
                      paddingTop: index >= 1 ? SIZE.width(3) : SIZE.width(0),
                      alignItems: 'center',
                    }}>
                    <AppText style={{fontSize: SIZE.H5, marginRight: 10}}>
                      {moment(new Date(item.startTime)).format('YYYY/MM/DD')}
                    </AppText>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: SIZE.width(70),
                      }}>
                      <AppText
                        style={{
                          fontSize: SIZE.H5,
                          color: colorApp.textColor,
                          textDecorationLine: 'underline',
                          textDecorationStyle: 'solid',
                          textDecorationColor: colorApp.textColor,
                        }}>
                        {item.title}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(HomeNotice);
