import CameraRoll from '@react-native-community/cameraroll';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {createRef, useEffect, useRef} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {useMergeState} from '../../AppProvider';
import {Color, Font} from '../../commons/constants';
import {ratioW, windowSize} from '../../commons/utils/devices';
import {formatMoney} from '../../commons/utils/format';
import {ScreensView} from '../../components';
import {ColorsImgeSim} from '../../models/ConfigsData';
import DraggableBox from './DraggableBox';

const getContentStyle = (id, scale) => {
  switch (id) {
    case 'template2':
      return {alignItems: 'flex-end', marginTop: 400 * scale.current};
    case 'template3':
      return {alignItems: 'flex-end', marginTop: 450 * scale.current};
    case 'template4':
      return {alignItems: 'flex-end', marginTop: 228 * scale.current};
    case 'template5':
      return {alignItems: 'flex-end', marginTop: 350 * scale.current};
    case 'template6':
      return {alignItems: 'flex-end', marginTop: 580 * scale.current};
    case 'template7':
      return {alignItems: 'flex-end', marginTop: 20 * scale.current};
    case 'template8':
      return {alignItems: 'flex-end', marginTop: 148 * scale.current};
    default:
      return {alignItems: 'flex-end', marginTop: 0};
  }
};

export default function SimImageDesignScreen(props) {
  let viewShot = createRef();
  const route = useRoute();
  const navigation = useNavigation();
  const {simData, templateData} = route.params;
  const {id, template} = templateData;
  const scale = useRef(1);
  const [stateScreen, setStateScreen] = useMergeState({
    wContainer: 0,
    hContainer: 0,
    w: 0,
    h: 0,
    priceVisible: true,
    price: formatMoney(simData.websitePrice),
    color: '#fff',
  });

  const {
    wContainer,
    hContainer,
    priceVisible,
    price,
    w,
    h,
    color,
  } = stateScreen;

  const onLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    setStateScreen({wContainer: width, hContainer: height});
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const openGallery = () => {
    navigation.goBack();
  };

  useEffect(() => {
    hasAndroidPermission();
    if (id === 'template6') {
      setStateScreen({color: '#000'});
    }
  }, []);

  useEffect(() => {
    const {width: widthImage, height: heightImage} = Image.resolveAssetSource(
      template,
    );
    if (wContainer && hContainer) {
      const originRatio = widthImage / heightImage;
      const containerRatio = wContainer / hContainer;

      if (originRatio < containerRatio) {
        scale.current = hContainer / heightImage;
        setStateScreen({w: hContainer * originRatio, h: hContainer});
      } else {
        scale.current = wContainer / widthImage;
        setStateScreen({w: wContainer, h: wContainer / originRatio});
      }
    }
  }, [template, wContainer, hContainer, w, h]);

  async function saveImage(uri) {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    CameraRoll.save(uri, {type: 'photo'})
      .then(() => {
        Alert.alert('', 'Đã lưu ảnh thành công');
      })
      .catch((err) => console.log(err));
  }

  const onCapture = () => {
    viewShot.capture().then(async (uri) => {
      if (Platform.OS === 'android') {
        const permission = await hasAndroidPermission();
        if (!permission) {
          Alert.alert(
            '',
            'Đã lưu ảnh không thành công do không được cập quyền!',
          );
        } else {
          saveImage(uri);
        }
      } else {
        saveImage(uri);
      }
    });
  };

  const onValueChange = (value) => {
    setStateScreen({priceVisible: value});
  };

  /////////
  const renderColor = ({item}) => (
    <TouchableOpacity
      style={[
        styles.colorContainer,
        {
          backgroundColor: item.toLowerCase(),
          borderColor:
            item.toLowerCase() === color
              ? Color.MayaBlue
              : item === 'White'
              ? '#000'
              : item.toLowerCase(),
        },
      ]}
      onPress={() => setStateScreen({color: item.toLowerCase()})}
    />
  );

  const aliasStyle = {
    color,
    fontWeight: 'bold',
    fontSize: Platform.OS === 'ios' ? 40 * ratioW : 36 * ratioW,
    fontFamily: Font.AvenirBoldCondensed,
  };
  const priceStyle = {
    color,
    fontSize: Platform.OS === 'ios' ? 14 * ratioW : 12 * ratioW,
    fontFamily: Font.AvenirBoldCondensed,
  };
  const imageStyle = {width: w, height: h, alignItems: 'center'};
  const contentStyle = getContentStyle(id, scale);
  return (
    <ScreensView
      isScroll={false}
      titleScreen={'Tạo ảnh SIM'}
      nameIconRight={'camera-filled'}
      onPressRight={onCapture}>
      <View style={styles.centerContainer} onLayout={onLayout}>
        <ViewShot
          ref={(com) => {
            viewShot = com;
          }}
          options={{format: 'jpg', quality: 0.9}}>
          <ImageBackground source={template} style={imageStyle}>
            <View style={contentStyle}>
              <DraggableBox>
                <Text style={aliasStyle}>{simData.alias}</Text>
              </DraggableBox>
              {priceVisible && (
                <DraggableBox>
                  <Text style={priceStyle}>{price}</Text>
                </DraggableBox>
              )}
            </View>
          </ImageBackground>
        </ViewShot>
      </View>
      <View style={styles.padding}>
        <View style={styles.row1}>
          <Text style={styles.text}>Hiển thị giá</Text>
          <Switch value={priceVisible} onValueChange={onValueChange} />
        </View>
        <View style={styles.row2}>
          <Text style={styles.text}>Giá bán</Text>
          <TextInput
            style={[styles.text, styles.textInput]}
            defaultValue={price}
            onChangeText={(text) => setStateScreen({price: text})}
          />
        </View>
        <TouchableOpacity style={styles.row2} onPress={openGallery}>
          <Text style={styles.text}>Chọn ảnh nền</Text>
        </TouchableOpacity>
        <View style={styles.row2}>
          <Text style={styles.text}>Chọn màu chữ</Text>
        </View>
        <FlatList
          style={{marginTop: 10}}
          renderItem={renderColor}
          data={ColorsImgeSim}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  image: {width: windowSize.width * 0.5, height: windowSize.width * 0.5},
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerIcon: {width: 25, height: 25, tintColor: 'white'},
  text: {fontSize: 18},
  padding: {padding: 10},
  colorContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
  },
  textInput: {
    textAlign: 'right',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: Color.Border,
    width: windowSize.width * 0.4,
    padding: 5,
  },
});
