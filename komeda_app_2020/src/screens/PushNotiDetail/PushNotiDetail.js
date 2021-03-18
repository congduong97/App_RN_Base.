//Library:
import React, {useContext, useRef, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet, Linking, Image} from 'react-native';
import moment from 'moment';
import {SIZE, FetchApi, COLOR, isIos} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {AppHeader, Loading, ErrorView, AppText} from '../../elements';
import {NetworkError} from '../../elements/NetworkError';
import HTML from 'react-native-render-html';
import {STRING} from '../../utils/constants/String';
import {useForceUpdate} from '../../hooks/forceupdate';
import BadgeAndroid from 'react-native-android-badge';
import PushNotification from 'react-native-push-notification';
import {PushNotificationService} from '../../utils/services/PushNotificationService';
import NotifService from '../../utils/services/NotifService';
import {openUlrBrowser} from '../../utils/modules/OpenURL';

const PushNotiDetail = ({navigation, route}) => {
  const {data, id} = route.params;
  const {colorApp} = useContext(ContextContainer);
  const dataDetail = useRef(null);
  const error = useRef();
  const [loading, setLoading] = useState(true);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    console.log(data, 'res push detail');
    if (data.success) {
      dataDetail.current = data.data;
    } else if (data.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    PushNotificationService.setCountNewNotification(0);
    setBadge(0);
    new NotifService().cancelAll();
    setLoading(false);
    forceUpdate();
  }, []);
  const setBadge = (countNoti) => {
    if (isIos) {
      PushNotification.setApplicationIconBadgeNumber(countNoti);
    } else {
      BadgeAndroid.setBadge(countNoti);
    }
  };
  const getDetailData = async () => {
    if (!loading) {
      setLoading(true);
    }
    error.current = undefined;

    const response = await FetchApi.openPushNotiItem(id);
    if (response.success) {
      dataDetail.current = response.data;
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  const convertHtmlContent = (content) => {
    const customContent = content
      ? content
          .replace(/(<label>)/gm, '<span>')
          .replace(/(<p><em>)/gm, '<em>')
          .replace(/(<\/p><\/em>)/gm, '</em>')
          .replace(/(<p><i>)/gm, '<i>')
          .replace(/(<\/p><\/i>)/gm, '</i>')
          .replace(/(\r\n)/gm, '')
      : '';

    return `<div>${customContent}</div>`;
  };

  //Nội dung chi tiếp push:
  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (error.current === 'network') {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={getDetailData}
        />
      );
    }
    if (error.current == 'server_maintain') {
      return (
        <ErrorView
          icon={{name: 'ios-settings'}}
          errorName={STRING.server_maintain}
          onPress={getDetailData}
        />
      );
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}
        style={{
          backgroundColor: '#F0F0F0',
          padding: 12,
          //flex: 1,
        }}>
        <View
          style={{
            padding: 20,
            backgroundColor: COLOR.white,
            borderWidth: 1,
            borderColor: '#DADADA',
            minHeight: SIZE.height(75),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <AppText style={{color: '#A6A6A6', fontSize: SIZE.H5}}>
              {moment(new Date(dataDetail.current.pushTime)).format(
                'YYYY.MM.DD',
              )}
            </AppText>
            {dataDetail.current.typeNotification === 'IMPORTANT' && (
              <AppText
                style={{
                  borderRadius: 5,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  fontSize: SIZE.H6,
                  color: '#EF6572',
                  borderWidth: 1,
                  borderColor: '#EF6572',
                  marginLeft: 20,
                }}>
                重要なお知らせ
              </AppText>
            )}
          </View>
          <AppText
            style={{
              fontSize: SIZE.H4,
              lineHeight: 30,
              fontFamily: 'irohamaru-Medium',
            }}>
            {dataDetail.current.title}
          </AppText>
          <View
            style={{
              height: 1.5,
              backgroundColor: '#DADADA',
              marginVertical: 20,
              overflow: 'hidden',
            }}
          />

          <HTML
            style={{alignSelf: `center`}}
            //ignoredStyles={['height']}
            tagsStyles={{
              div: {
                overflow: 'hidden',
              },
              p: {
                fontFamily: 'irohamaru-Medium',
                lineHeight: 36,
                fontSize: SIZE.H4 * 0.9,

                color: '#4D4D4D',
              },
              em: {
                fontSize: SIZE.H4,
                fontStyle: 'italic',
                color: '#4D4D4D',
              },
              i: {
                fontSize: SIZE.H4,
                fontStyle: 'italic',
                color: '#4D4D4D',
              },
            }}
            renderers={{
              img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                if (Object.keys(convertedCSSStyles).length === 0) {
                  return (
                    <Image
                      key={`${Math.random()}`}
                      resizeMode='stretch'
                      source={{uri: htmlAttribs.src}}
                      style={{
                        width: undefined,
                        height: undefined,
                      }}
                    />
                  );
                }

                const maxWidth = SIZE.device_width - 64;

                let customWidth = convertedCSSStyles.width;
                let customHeight = convertedCSSStyles.height;

                if (isNaN(convertedCSSStyles.width)) {
                  customWidth =
                    (parseFloat(convertedCSSStyles.width) * maxWidth) / 100;
                }

                if (isNaN(convertedCSSStyles.height)) {
                  customHeight =
                    (parseFloat(convertedCSSStyles.height) * maxWidth) / 100;
                }

                const ratio = customWidth / customHeight;

                if (customWidth > maxWidth) {
                  customWidth = maxWidth;
                }
                return (
                  <Image
                    key={`${Math.random()}`}
                    resizeMode='stretch'
                    source={{uri: htmlAttribs.src}}
                    style={{
                      width: customWidth,
                      height: undefined,
                      aspectRatio: ratio,
                    }}
                  />
                );
              },
            }}
            html={convertHtmlContent(dataDetail.current.longDescription)}
            imagesMaxWidth={SIZE.device_width - 64}
            onLinkPress={(e, href) => {
              Linking.canOpenURL(href).then((supported) => {
                if (supported) {
                  Linking.openURL(href);
                } else {
                  openUlrBrowser(href);
                }
              });
            }}
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title={'お知らせ詳細'} leftGoBack />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: COLOR.white,
  },
});

export default PushNotiDetail;
