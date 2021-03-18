//Library:
import React, {useContext, useRef, useLayoutEffect, useState} from 'react';
import {View, ScrollView} from 'react-native';

//Setup:
import {SIZE, FetchApi} from '../../utils';
import {ContextContainer} from '../../contexts/AppContext';
import {keyNavigation} from '../../navigators/utils/KeyNavigation';

//Component:
import {AppContainer, Loading} from '../../elements';
import {GetTimeJapan} from '../../utils/modules/GetTimeJapan';
import {AppText} from '../../elements/AppText';
import WebViewComponent from '../../elements/WebViewComponent';
import {AppImageZoom} from '../../elements/AppImageZoom';
import {NetworkError} from '../../elements/NetworkError';

//Service:
import ServicesUpdateComponent from '../../utils/services/ServicesUpdateComponent';
import ServicesChangeIconBagger from '../../utils/services/ServicesChangeIconBagger';
import CurrentScreenServices from '../../navigators/services/CurrentScreenServices';

const PushNotiDetail = ({navigation, route}) => {
  const {id} = route.params;
  const {colorApp} = useContext(ContextContainer);
  const dataDetail = useRef();
  const error = useRef();
  const timeCount = useRef(0);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    CurrentScreenServices.set(keyNavigation.DETAIL_PUSH);
    timeCount.current = setTimeout(() => {
      ServicesUpdateComponent.set('READ_DETAIL_PUSH_NOTI');
    }, 1800);
    ServicesChangeIconBagger.set(0);
    getDetailData();
    return () => {
      clearTimeout(timeCount.current);
    };
  }, []);

  const getDetailData = async () => {
    if (!loading) {
      setLoading(true);
    }
    error.current = undefined;
    const response = await FetchApi.openPushNotiItem(id);
    if (response && response.success) {
      dataDetail.current = response.data;
    } else if (response.status_code >= 500) {
      error.current = 'server_maintain';
    } else {
      error.current = 'network';
    }
    setLoading(false);
  };

  //Nội dung chi tiếp push:
  const renderContent = () => {
    if (error.current) {
      return (
        <NetworkError
          title={
            'ただいま大変混み合っております。しばらく経ってから再度お試しください。'
          }
          onPress={() => getDetailData()}
        />
      );
    }
    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View>
              {dataDetail.current.imageUrl ? (
                <AppImageZoom
                  useAutoHight
                  url={dataDetail.current.imageUrl}
                  resizeMode={'cover'}
                  style={{
                    marginTop: SIZE.width(3),
                    marginLeft: SIZE.width(2),
                    width: SIZE.width(96),
                    borderRadius: SIZE.width(5),
                  }}
                />
              ) : null}
              {/* Thời gian  */}
              <AppText
                style={{
                  marginLeft: SIZE.width(2),
                  marginTop: SIZE.width(3),
                  color: colorApp.textColor,
                  fontSize: SIZE.H5 * 1.2,
                  fontWeight: 'bold',
                }}>
                {GetTimeJapan.convertTimeJaPanCreateTime(
                  dataDetail.current.pushTime,
                )}
              </AppText>
              {/* Tiêu đề */}
              <AppText
                style={{
                  fontSize: SIZE.H5 * 1.2,
                  fontWeight: 'bold',
                  marginTop: SIZE.width(2),
                  marginLeft: SIZE.width(2),
                }}>
                {dataDetail.current.title}
              </AppText>
              {/* Miêu tả ngắn */}
              <AppText
                style={{
                  fontSize: SIZE.H6,
                  marginLeft: SIZE.width(2),
                  marginRight: SIZE.width(2),
                  marginTop: SIZE.width(2),
                }}>
                {dataDetail.current.shortDescription}
              </AppText>
              {/* Viền xanh */}
              <View
                style={{
                  height: SIZE.width(0.8),
                  width: SIZE.width(94),
                  borderRadius: 5,
                  marginTop: SIZE.width(3),
                  marginLeft: SIZE.width(3),
                  backgroundColor: colorApp.backgroundColorButton,
                }}
              />
              {/* Khung HTML */}
              <View
                style={{
                  marginTop: SIZE.width(5),
                  marginLeft: SIZE.width(5),
                  marginRight: SIZE.width(5),
                }}>
                <WebViewComponent
                  html={dataDetail.current.longDescription}
                  navigation={navigation}
                />
              </View>
            </View>
          </ScrollView>
        )}
      </>
    );
  };

  return (
    <AppContainer
      haveTitle
      nameScreen="お知らせ"
      goBackScreen
      style={{backgroundColor: colorApp.backgroundColor}}>
      {renderContent()}
    </AppContainer>
  );
};

export default PushNotiDetail;
