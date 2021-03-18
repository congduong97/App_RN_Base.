//Library:
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HTML from 'react-native-render-html';

//Setup:
import {SIZE, COLOR} from '../../../utils/resources';
import {FetchApi} from '../../../utils/modules';
import {STRING} from '../../../utils/constants/String';

//Component:
import {ErrorView, AppImage, Loading} from '../../../elements';
import {AppText} from '../../../elements/AppText';
import {NetworkError} from '../../../elements/NetworkError';
import {ContextContainer} from '../../../contexts/AppContext';
import {useNavigation} from '@react-navigation/native';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Services:
import {AccountService} from '../../../utils/services/AccountService';
import ServicesUpdatePointAndMoneyHome from '../../../utils/services/ServicesUpdatePointAndMoneyHome';
import {openUlrBrowser} from '../../../utils/modules/OpenURL';

//Thẻ thành viên đã liên kết:
const CardCertificateMember = () => {
  const [data, setData] = useState([]);
  const [seenContent, setStateSeenContent] = useState(true);
  const [getHeightImageBanner, setStateHeightImageBanner] = useState(0);
  const [getHeightImageIntro, setStateHeightImageIntro] = useState(0.489);
  const [getHeightImgBarCode, setStateImgBarCode] = useState(0);
  const [getSizeImgBarcodeMember, setStateSizeBarCodeMember] = useState(0);
  const [loading, setStateLoading] = useState(true);
  const [linkImgIntro, setStateLinkImgIntro] = useState('');
  const [ojbBarCodeFake, setStateOjbBarCode] = useState({});
  const {colorApp} = useContext(ContextContainer);
  const navigation = useNavigation();
  const [dataPointAndMoney, setStateDataPointAndMoney] = useState({
    money: 0,
    point: 0,
  });
  const [error, setStateError] = useState({
    errorView: false,
    maintain: false,
  });
  const timer = useRef(0);
  useEffect(() => {
    onDidMount();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  //Cấu hình độ sáng và gọi API lấy thông tin thẻ thành viên:
  const onDidMount = async () => {
    setStateLoading(true);
    await getFakeBarCodeAPI();
    await getAuthState();
    await getCertificateMemberAPI();
    timer.current = setTimeout(() => {
      setStateLoading(false);
    }, 1000);
  };

  //Lấy số lượng point và monney nếu người dùng đã login:
  const getAuthState = async () => {
    const acc = AccountService.getAccount();
    if (acc) {
      if (acc.money !== null && acc.point !== null) {
        const response = await FetchApi.getBalanceAndPoint();
        console.log('FetchApi.getBalanceAndPoint', response);
        if (response.success && response.data) {
          ServicesUpdatePointAndMoneyHome.set(response.data);
          setStateDataPointAndMoney(response.data);
        } else {
          ServicesUpdatePointAndMoneyHome.set({money: 0, point: 0});
          setStateDataPointAndMoney({money: 0, point: 0});
        }
      }
    }
  };

  const getFakeBarCodeAPI = async () => {
    const response = await FetchApi.getFakeBarCode();
    if (response && response.code === 1000) {
      setStateOjbBarCode({
        uriImg: response.data.barCodeUrl,
        showBarCode: response.data.enableBarcodeUrl,
      });
      if (response.data.barCodeUrl) {
        getSizeImgBarCode(response.data.barCodeUrl);
      }
    }
  };

  //Hiển thị tên của icon:
  const nameIcon = () => {
    if (seenContent) {
      return 'up';
    } else {
      return 'down';
    }
  };

  //Ấn vào để xem thêm  nội dung hoặc ảnh giới thiệu:
  const pressSeenContent = () => {
    setStateSeenContent(!seenContent);
  };

  //Lấy size ảnh:
  const getSizeImgLocal = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = (height / width) * SIZE.width(100);
      setStateHeightImageBanner(heightImg);
    });
  };
  //Lấy size ảnh trên:
  const getSizeImageIntro = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = height / width;
      setStateHeightImageIntro(heightImg);
    });
  };
  //Lấy size ảnh barcode:
  const getSizeImgBarCode = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = (height / width) * SIZE.width(100);
      setStateImgBarCode(heightImg);
    });
  };
  //Lấy size ảnh chuẩn của ảnh member code:
  const getSizeImgBarCodeMember = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = (height / width) * SIZE.width(100);
      setStateSizeBarCodeMember(heightImg);
    });
  };

  //Mở trang web thẻ chứng nhận thành viên:
  const pressOpentWebClup = () => {
    navigation.navigate(keyNavigation.WEBVIEW, {
      data: {url: 'http://komeda.club/'},
    });
  };

  //Lấy thông tin thẻ chứng nhận thành viên:
  const getCertificateMemberAPI = async () => {
    const response = await FetchApi.getCertificate();
    if (response && response.status_code == 200 && response.code == 1000) {
      if (response.data.introduceImageUrl) {
        getSizeImgLocal(response.data.introduceImageUrl);
      }
      if (response.data.linkedCardImageUrl) {
        getSizeImageIntro(response.data.linkedCardImageUrl);
      }
      if (response.data.barcodeUrl) {
        getSizeImgBarCodeMember(response.data.barcodeUrl);
      }

      setData(response.data);
      setStateLinkImgIntro(response.data.introduceImageUrl);
      setStateError({error: false, errorView: false});
      return;
    }
    if (response.status_code >= 500) {
      setStateError({...error, maintain: true});
      return;
    } else {
      setStateError({...error, errorView: true});
    }
  };

  //Hiển thị ảnh giới thiệu:
  const renderImageIntro = () => {
    return (
      <View
        style={{
          width: SIZE.width(100),
          backgroundColor: '#47362B',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {data.linkedCardImageUrl ? (
          <AppImage
            style={{
              height: SIZE.width(85) * getHeightImageIntro,
              width: SIZE.width(85),
              marginVertical: SIZE.width(7.5),
            }}
            source={{uri: data.linkedCardImageUrl}}
          />
        ) : null}
      </View>
    );
  };

  //Hiển thị bảng member thông tin point :
  const renderPoint = () => {
    return (
      <View style={{height: SIZE.height(15), backgroundColor: COLOR.white}}>
        {/* Hiển thị số point phía trên */}
        <View
          style={{
            flex: 1,
            borderBottomColor: COLOR.grey_300,
            borderBottomWidth: SIZE.width(0.2),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopWidth: ojbBarCodeFake.showBarCode ? 1 : 0,
            borderTopColor: ojbBarCodeFake.showBarCode ? COLOR.grey_300 : null,
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.2,
              fontFamily: 'irohamaru-Medium',
              marginLeft: SIZE.width(4),
              color: COLOR.COFFEE_BROWN_LIGHT,
            }}>
            ご利用可能残高
          </AppText>
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.2,
              fontFamily: 'irohamaru-Medium',
              marginRight: SIZE.width(4),
              color: COLOR.COFFEE_BROWN_LIGHT,
            }}>
            {dataPointAndMoney.money}円
          </AppText>
        </View>
        {/* Hiển thị phần point phía dưới */}
        <View
          style={{
            flex: 1,
            borderBottomColor: COLOR.grey_300,
            borderBottomWidth: SIZE.width(0.2),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.2,
              fontFamily: 'irohamaru-Medium',
              marginLeft: SIZE.width(4),
              color: COLOR.COFFEE_BROWN_LIGHT,
            }}>
            ポイント残高
          </AppText>
          <AppText
            style={{
              fontSize: SIZE.H5 * 1.2,
              fontFamily: 'irohamaru-Medium',
              marginRight: SIZE.width(4),
              color: COLOR.COFFEE_BROWN_LIGHT,
            }}>
            {dataPointAndMoney.point}pt
          </AppText>
        </View>
      </View>
    );
  };
  const convertHtmlContent = (content) => {
    const customContent = content
      ? content
          .replace(/(<p><em>)/gm, '<em>')
          .replace(/(<\/p><\/em>)/gm, '</em>')
          .replace(/(<p><i>)/gm, '<i>')
          .replace(/(<\/p><\/i>)/gm, '</i>')
          .replace(/(\r\n)/gm, '')
      : '';

    return `<div>${customContent}</div>`;
  };

  //Hiển thị dòng chữ vàng và nút liên kết thẻ:
  const renderTextYellowAndButtonGoWebClub = () => {
    return (
      <View style={styles.textAndButtonLinkCard}>
        {/* Thời gian update thông tin mới */}
        <AppText
          style={{
            ...styles.textYellow,
            color: COLOR.grey_500,
            fontSize: SIZE.H6 * 1.3,
            fontFamily: 'irohamaru-Medium',
            marginTop: SIZE.width(3),
          }}>
          最終更新日 {data.updatedTime}
        </AppText>
        {/* Chữ màu vàng chú ý */}
        {!!data.textNote && (
          <View
            style={{
              paddingHorizontal: SIZE.width(4),
              backgroundColor: '#FDE7E9',
              marginTop: SIZE.height(1.5),
              width: SIZE.width(100),
            }}>
            <HTML
              tagsStyles={{
                h6: {
                  lineHeight: 20,
                  fontSize: SIZE.H5 * 1.15,
                  fontFamily: 'irohamaru-Regular',
                },
                div: {
                  overflow: 'hidden',
                },
                p: {
                  lineHeight: 36,
                  fontSize: SIZE.H4,
                  fontFamily: 'irohamaru-Regular',
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
              html={convertHtmlContent(data.textNote)}
              imagesMaxWidth={Dimensions.get('window').width}
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
        )}
        <AppText style={{...styles.textYellow, marginTop: SIZE.width(4)}}>
          チャージはマイページから行えます
        </AppText>
        <TouchableOpacity
          onPress={pressOpentWebClup}
          style={{
            ...styles.buttonLinkCard,
            backgroundColor: colorApp.backgroundColorButton,
          }}>
          <AppText
            style={{
              ...styles.textButtonLinkCard,
              color: colorApp.textColorButton,
            }}>
            KOMECA マイページへ
          </AppText>
        </TouchableOpacity>
        {/* Phần nút bấm để xem thêm ảnh */}
        {buttonSeenImageIntro()}
      </View>
    );
  };

  //Phần hiển thị chữ ấn sổ xuống
  const buttonSeenImageIntro = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={pressSeenContent}
        style={{
          height: SIZE.height(8),
          width: SIZE.width(100),
          backgroundColor: COLOR.white,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          // marginTop: SIZE.width(4),
        }}>
        <AppText
          style={{
            marginLeft: SIZE.width(4),
            fontFamily: 'irohamaru-Medium',
            fontSize: SIZE.H5 * 1.2,
            color: COLOR.COFFEE_BROWN_LIGHT,
          }}>
          KOMECA（コメカ）とは？
        </AppText>
        <AntDesign
          name={nameIcon()}
          size={25}
          color={COLOR.COFFEE_YELLOW}
          style={{marginRight: SIZE.width(4)}}
        />
      </TouchableOpacity>
    );
  };

  //Phần ảnh giới thiệu và nút ấn chuyển đến màn hình Mypage:
  const renderImageBanner = () => {
    if (seenContent) {
      return (
        <View>
          {linkImgIntro ? (
            <AppImage
              resizeMode='contain'
              source={{uri: linkImgIntro}}
              style={{
                width: SIZE.width(100),
                height: getHeightImageBanner,
                marginBottom: SIZE.width(4),
              }}></AppImage>
          ) : null}
        </View>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Loading />
        </View>
      );
    }
    //Mất mạng:
    if (error.errorView) {
      return (
        <NetworkError
          title={STRING.network_error_try_again_later}
          onPress={() => getCertificateMemberAPI()}
        />
      );
    }

    //Server đang bảo trì:
    if (error.maintain) {
      return (
        <View style={{flex: 1, height: SIZE.height(80)}}>
          <ErrorView
            textStyle={{fontSize: SIZE.H4}}
            icon={{name: 'ios-settings'}}
            errorName={STRING.server_maintain}
            onPress={onDidMount}
          />
        </View>
      );
    }

    //Hiển thị ảnh barcode:
    const renderFakeImg = () => {
      if (ojbBarCodeFake.showBarCode) {
        if (data.barcodeUrl) {
          return (
            <View>
              <AppImage
                resizeMode='contain'
                source={{uri: data.barcodeUrl}}
                style={{
                  width: SIZE.width(100),
                  height: getSizeImgBarcodeMember,
                  marginTop: SIZE.height(2),
                  marginBottom: SIZE.height(2),
                }}></AppImage>
              <AppText
                style={{
                  textAlign: 'center',
                  marginBottom: SIZE.width(3),
                  fontFamily: 'irohamaru-Medium',
                  fontSize: SIZE.H5 * 1.2,
                }}>
                {data.memberCode}
              </AppText>
            </View>
          );
        } else {
          if (ojbBarCodeFake.uriImg) {
            return (
              <View>
                <AppImage
                  resizeMode='contain'
                  source={{uri: ojbBarCodeFake.uriImg}}
                  style={{
                    width: SIZE.width(100),
                    height: getHeightImgBarCode,
                    marginTop: SIZE.height(2),
                    marginBottom: SIZE.height(2),
                  }}></AppImage>
                <AppText
                  style={{
                    textAlign: 'center',
                    marginBottom: SIZE.width(3),
                    fontFamily: 'irohamaru-Medium',
                    fontSize: SIZE.H5 * 1.2,
                  }}>
                  {data.memberCode}
                </AppText>
              </View>
            );
          }
        }
      }
      return null;
    };

    return (
      <View style={{flex: 1, backgroundColor: COLOR.white}}>
        {/* Hiển thị ảnh giới thiệu: */}
        {renderImageIntro()}
        {/* Hiển thị ảnh fake barCode: */}
        {renderFakeImg()}
        {/* Hiển thị point thành viên */}
        {renderPoint()}
        {/* Phần chữ vàng và nút bấm vào mypage */}
        {renderTextYellowAndButtonGoWebClub()}
        {/* Phần ảnh và nút chuyển đến màn mypage: */}
        {renderImageBanner()}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}>
      {renderContent()}
    </ScrollView>
  );
};

export default CardCertificateMember;

const styles = StyleSheet.create({
  textAndButtonLinkCard: {
    width: SIZE.width(100),
    backgroundColor: COLOR.grey_300,
    alignItems: 'center',
  },
  textYellow: {
    fontSize: SIZE.H5,
    color: COLOR.COFFEE_YELLOW,
    lineHeight: SIZE.width(6),
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    fontFamily: 'irohamaru-Medium',
    textAlign: 'center',
  },
  buttonLinkCard: {
    height: SIZE.height(7),
    width: SIZE.width(70),
    marginTop: SIZE.width(3),
    backgroundColor: COLOR.COFFEE_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZE.width(4),
  },
  textButtonLinkCard: {
    fontSize: SIZE.H5 * 1.2,
    fontFamily: 'irohamaru-Medium',
    color: COLOR.white,
  },
});
