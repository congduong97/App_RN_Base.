//Library:
import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

//Setup:
import {SIZE, COLOR, isIos, FetchApi} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';

//Component:
import {AppImage, AppText, Loading} from '../../../elements';
import {ContextContainer} from '../../../contexts/AppContext';

function IntroCertificateMember() {
  const [seenContent, setStateSeenContent] = useState(true);
  const [data, setData] = useState([]);
  const [getHeightImageBanner, setStateHeightImageBanner] = useState(0);
  const [getHeightImgIntro, setStateHeightImageIntro] = useState(0.489);
  const [linkImgIntro, setStateLinkImgIntro] = useState('');
  const {colorApp} = useContext(ContextContainer);
  const [loading, setStateLoading] = useState(true);
  const [error, setStateError] = useState({
    errorView: false,
    maintain: false,
  });
  const navigation = useNavigation();
  const timer = useRef(0);
  //Ấn vào để xem thêm  nội dung:
  const pressSeenContent = () => {
    setStateSeenContent(!seenContent);
  };

  useEffect(() => {
    onDidMount();
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  const onDidMount = async () => {
    setStateLoading(true);
    await getCertificateMemberAPI();
    timer.current = setTimeout(() => {
      setStateLoading(false);
    }, 1000);
  };
  //Lấy thông tin thẻ chứng nhận thành viên:
  const getCertificateMemberAPI = async () => {
    const response = await FetchApi.getCertificate();
    if (response && response.status_code == 200 && response.code == 1000) {
      setData(response.data);
      setStateError({...error, errorView: false});
      getSizeImgLocal(response.data.introduceImageUrl);
      if (response.data.notLinkedCardImageUrl) {
        getSizeImageIntro(response.data.notLinkedCardImageUrl);
      }
      setStateLinkImgIntro(response.data.introduceImageUrl);
      return;
    }
    if (response.status_code >= 500) {
      setStateError({...error, maintain: true});
      return;
    } else {
      setStateError({...error, errorView: true});
      return;
    }
  };

  //Lấy size ảnh :
  const getSizeImgLocal = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = (height / width) * SIZE.width(100);
      setStateHeightImageBanner(heightImg);
    });
  };
  const getSizeImageIntro = (link) => {
    Image.getSize(link, (width, height) => {
      const heightImg = height / width;
      setStateHeightImageIntro(heightImg);
    });
  };
  //Ấn vào ra màn hình Mypge:
  const goToMyPage = () => {
    navigation.navigate(keyNavigation.MY_PAGE);
  };

  //Hiển thị tên của icon:
  const nameIcon = () => {
    if (seenContent) {
      return 'up';
    } else {
      return 'down';
    }
  };

  //Ấn vào liên kết thẻ thành viên:
  const pressLinkCardMember = () => {
    navigation.navigate(keyNavigation.LINKING_CARD, {key: 'NEWLINKING'});
  };

  //Hiển thị ảnh giới thiệu:
  const renderImageIntro = () => {
    return (
      <View
        style={{
          width: SIZE.width(100),
          backgroundColor: '#47362B',
          alignItems: 'center',
        }}>
        <AppImage
          style={{
            height: SIZE.width(85) * getHeightImgIntro,
            width: SIZE.width(85),
            marginVertical: SIZE.width(7.5),
          }}
          source={{uri: data.notLinkedCardImageUrl}}
        />
      </View>
    );
  };
  //Hiển thị dòng chữ vàng và nút liên kết thẻ:
  const renderTextYellowAndButtonLinkCard = () => {
    return (
      <View style={styles.textAndButtonLinkCard}>
        <AppText style={styles.textYellow}>
          お手持ちのKOMECAを登録するとバリュー残高や
        </AppText>
        <AppText style={{...styles.textYellow, marginTop: 0}}>
          ポイント残高がアプリ上で確認できるようになります
        </AppText>
        <TouchableOpacity
          onPress={pressLinkCardMember}
          style={{
            ...styles.buttonLinkCard,
            backgroundColor: colorApp.backgroundColorButton,
          }}>
          <AppText
            style={{
              ...styles.textButtonLinkCard,
              color: colorApp.textColorButton,
            }}>
            KOMECAを登録する
          </AppText>
        </TouchableOpacity>
        {/* Phần nút bấm để xem thêm ảnh */}
        {buttonSeenImageIntro()}
      </View>
    );
  };

  //Phần ảnh giới thiệu và nút ấn chuyển đến màn hình Mypage:
  const renderImageBanner = () => {
    if (seenContent && getHeightImageBanner) {
      return (
        <View>
          {linkImgIntro ? (
            <AppImage
              resizeMode='contain'
              source={{uri: linkImgIntro}}
              style={{
                width: SIZE.width(100),
                height: getHeightImageBanner,
                marginBottom: SIZE.width(10),
              }}></AppImage>
          ) : null}
        </View>
      );
    }
    return null;
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
          marginTop: SIZE.width(4),
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
    return (
      <View style={{flex: 1, backgroundColor: COLOR.white}}>
        {/* Hiển thị ảnh giới thiệu: */}
        {renderImageIntro()}
        {/* Phần chữ vàng và nút bấm liên kết thẻ: */}
        {renderTextYellowAndButtonLinkCard()}
        {/* Phần ảnh và nút chuyển đến màn mypage: */}
        {renderImageBanner()}
      </View>
    );
  };
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: SIZE.height(8),
        flexGrow: 1,
      }}>
      {renderContent()}
    </ScrollView>
  );
}

export default IntroCertificateMember;

const styles = StyleSheet.create({
  imgIntro: {
    height: SIZE.height(30),
    width: SIZE.width(85),
    marginVertical: SIZE.width(5),
  },
  textAndButtonLinkCard: {
    minHeight: SIZE.height(20),
    width: SIZE.width(100),
    backgroundColor: COLOR.grey_100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textYellow: {
    fontSize: SIZE.H5,
    color: COLOR.COFFEE_YELLOW,
    lineHeight: SIZE.width(6),
    marginLeft: SIZE.width(4),
    marginRight: SIZE.width(4),
    fontFamily: 'irohamaru-Medium',
    marginTop: SIZE.width(4),
    textAlign: 'center',
  },
  buttonLinkCard: {
    height: SIZE.height(7),
    width: SIZE.width(70),
    backgroundColor: COLOR.COFFEE_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZE.width(8),
    marginBottom: SIZE.height(3),
  },
  textButtonLinkCard: {
    fontSize: SIZE.H5 * 1.2,
    fontFamily: 'irohamaru-Medium',
    color: COLOR.white,
  },
});
