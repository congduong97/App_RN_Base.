import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {COLOR, SIZE} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {AppText} from '../../../elements';

const HomeAuth = ({authState, point, money}) => {
  const navigation = useNavigation();

  const onLogin = () => {
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.LOGIN,
    });
  };
  const onRegister = () => {
    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
      screen: keyNavigation.REGISTER,
    });
  };
  const renderContent = () => {
    switch (authState) {
      case 'LOGINED':
        return (
          <ImageBackground
            source={require('../../../utils/images/logined.png')}
            style={{
              resizeMode: 'cover',
              justifyContent: 'center',
              marginHorizontal: 6,
              borderRadius: 6,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
                  screen: keyNavigation.LINKING_CARD,
                  params: {
                    key: 'NEWLINKING',
                  },
                });
              }}
              style={{
                flex: 1,
                padding: 8,
                backgroundColor: COLOR.BG_TRANSPARENT_30,
              }}>
              <AppText
                style={{
                  color: COLOR.white,
                  fontFamily: 'irohamaru-Medium',
                  fontSize: SIZE.H4,
                }}>
                KOMECA連携で、もっと便利に
              </AppText>
              <AppText
                style={{
                  color: COLOR.white,
                  fontSize: SIZE.H6,
                  marginVertical: 6,
                }}>
                連携すると残高やポイントがアプリ上で一目でわかるようになります
              </AppText>
              <TouchableOpacity
                style={{
                  backgroundColor: COLOR.white,
                  alignSelf: 'flex-end',
                  padding: 4,
                  borderRadius: 2,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
                      screen: keyNavigation.LINKING_CARD,
                      params: {
                        key: 'NEWLINKING',
                      },
                    });
                  }}
                  hitSlop={{top: 16, left: 16, right: 16, bottom: 16}}>
                  <AppText
                    style={{
                      color: '#68463A',
                      fontSize: SIZE.H7,
                    }}>
                    もっと詳しく
                  </AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            </TouchableOpacity>
          </ImageBackground>
        );

      case 'LINKED_CARD':
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(keyNavigation.MAIN_NAVIGATOR, {
                screen: keyNavigation.CERTIFICATE_MEMBER,
              });
            }}
            style={{
              overflow: 'hidden',
              marginHorizontal: 6,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              width: SIZE.device_width - 12,
            }}>
            <View
              style={{
                backgroundColor: '#AD081E',
                padding: 12,
                borderRadius: 6,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  padding: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: COLOR.white,
                }}>
                <Image
                  resizeMode='contain'
                  style={{
                    width: SIZE.width(14),
                    height: 0.6 * SIZE.width(14),
                  }}
                  source={require('../../../utils/images/komeda.png')}
                />
              </View>
              <AppText
                style={{
                  color: COLOR.white,
                  fontFamily: 'irohamaru-Medium',
                  fontSize: SIZE.H6,
                  marginTop: 3,
                }}>
                残高照会
              </AppText>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <View style={{flex: 1, marginLeft: SIZE.width(3)}}>
                <AppText
                  style={{
                    color: '#AD081E',
                    fontSize: SIZE.H6 * 1.2,
                    textAlign: 'left',
                    // fontFamily: 'irohamaru-Medium',
                  }}>
                  ご利用可能残高
                </AppText>

                <AppText
                  style={{
                    marginLeft: SIZE.width(10),
                    textAlign: 'left',
                    fontSize:
                      point && point > 9999 ? SIZE.H4 * 1.2 : SIZE.H3 * 1.2,
                    color: '#4D4D4D',
                    fontFamily: 'irohamaru-Medium',
                    // marginTop: 16,
                  }}>
                  {money || 0}{' '}
                  <AppText
                    style={{
                      fontWeight: '400',
                      fontSize: SIZE.H5,
                      color: '#4D4D4D',
                    }}>
                    円
                  </AppText>
                </AppText>
              </View>

              <View
                style={{
                  flex: 1,
                }}>
                <AppText
                  style={{
                    marginLeft: -SIZE.width(14),
                    color: '#AD081E',
                    fontSize: SIZE.H6 * 1.2,
                    textAlign: 'left',
                  }}>
                  ポイント残高
                </AppText>
                <AppText
                  style={{
                    //marginTop: 16,
                    fontSize:
                      point && point > 9999 ? SIZE.H4 * 1.2 : SIZE.H3 * 1.2,
                    color: '#4D4D4D',
                    textAlign: 'left',
                    fontFamily: 'irohamaru-Medium',
                  }}>
                  {point || 0}{' '}
                  <AppText
                    style={{
                      fontSize: SIZE.H5,
                      fontWeight: '400',
                      color: '#4D4D4D',
                    }}>
                    pt
                  </AppText>
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        );
      default:
        return (
          <View
            style={{
              marginHorizontal: 6,
              borderRadius: 6,
              paddingVertical: 18,
              paddingHorizontal: 14,
              backgroundColor: '#68463A',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity style={styles.btn} onPress={onLogin}>
              <AppText style={styles.text}>ログイン</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onRegister}>
              <AppText style={styles.text}>新規会員登録</AppText>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return <View>{renderContent()}</View>;
};
const styles = StyleSheet.create({
  text: {
    color: '#68463A',
    fontSize: SIZE.H5 * 1.2,
    fontFamily: 'irohamaru-Medium',
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: COLOR.white,
    paddingVertical: 10,
    width: SIZE.width(40),
    borderRadius: 4,
  },
});

export default HomeAuth;
