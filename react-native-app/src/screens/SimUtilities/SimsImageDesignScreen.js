import CameraRoll from '@react-native-community/cameraroll';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {createRef} from 'react';
import {
  Alert,
  FlatList,
  ImageBackground,
  Keyboard,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import {useMergeState} from '../../AppProvider';
import {Color, Font} from '../../commons/constants';
import {windowSize} from '../../commons/utils/devices';
import {ScreensView} from '../../components';
import {ColorsImgeSim} from '../../models/ConfigsData';

export default function SimsImageDesignScreen(props) {
  const route = useRoute();
  const navigation = useNavigation();
  const data = route.params;
  let viewShot = createRef();
  const [stateScreen, setStateScreen] = useMergeState({
    titleVisible: true,
    text: false,
    background: '',
    color: '#ee0000',
  });
  const {titleVisible, text, background, color} = stateScreen;

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const onValueChange = (value) => {
    setStateScreen({titleVisible: value});
  };

  const selectImage = () => {
    try {
      const options = {
        title: 'Select image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      return new Promise((res, rej) => {
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            res(null);
          } else if (response.error) {
            res(null);
          } else if (response.customButton) {
            res(null);
          } else {
            const {uri} = response;
            setStateScreen({background: uri});
          }
        });
      });
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onCapture = () => {
    Keyboard.dismiss();
    viewShot.capture().then(async (uri) => {
      if (Platform.OS === 'android') {
        const permission = await hasAndroidPermission();
        if (!permission) {
          Alert.alert('', 'Lưu ảnh không thành công do không được cập quyền!');
        } else {
          saveImage(uri);
        }
      } else {
        saveImage(uri);
      }
    });
  };

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

  const onChangeColor = (colorChange) => {
    setStateScreen({color: colorChange});
  };
  const onChangeText = (text) => setStateScreen({text});

  const navigateToColorPicker = () => {
    navigateToColorPickerScreen(navigation.dispatch, {color, onChangeColor});
  };

  const handleCapture = (e) => {
    const {State: TextInputState} = TextInput;
    const focusField = TextInputState.currentlyFocusedInput
      ? TextInputState.currentlyFocusedInput()
      : TextInputState.currentlyFocusedField();
    const {target} = e.nativeEvent;
    if (focusField != null && target !== focusField) {
      Keyboard.dismiss();
    }
  };

  ////////////

  const renderItem = ({item}) => (
    <View style={styles.centerContainer}>
      <Text style={styles.alias}>{item.alias}</Text>
    </View>
  );

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

  return (
    <ScreensView
      isScroll={false}
      titleScreen={'Tạo ảnh SIM'}
      nameIconRight={'camera-filled'}
      onPressRight={onCapture}>
      <View style={styles.container}>
        <ViewShot
          ref={(com) => {
            viewShot = com;
          }}
          options={{format: 'jpg', quality: 1}}>
          <ImageBackground
            source={{uri: background || null}}
            style={{width: windowSize.width}}>
            <ScrollView
              contentContainerStyle={imageBackgroundContainer(background)}>
              {titleVisible && (
                <Text style={[styles.title, {color}]}>{text}</Text>
              )}
              <FlatList
                renderItem={renderItem}
                data={data}
                keyExtractor={(item) => item.number}
                numColumns={3}
                style={{width: windowSize.width}}
              />
            </ScrollView>
          </ImageBackground>
        </ViewShot>
        <View style={{flex: 1}} />
      </View>
      <View style={styles.padding}>
        <View style={styles.row1}>
          <Text style={styles.text}>Hiển thị tiêu đề</Text>
          <Switch value={titleVisible} onValueChange={onValueChange} />
        </View>
        <Text style={styles.text}>Tiêu đề</Text>
        <TextInput
          autoCorrect={false}
          onChangeText={onChangeText}
          style={styles.textInput}
          underlineColorAndroid="transparent"
        />
        <View style={styles.padding} onPress={navigateToColorPicker}>
          <Text style={styles.textChangeColor}>Thay màu tiêu đề</Text>
        </View>
        <FlatList
          renderItem={renderColor}
          data={ColorsImgeSim}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.padding} onPress={selectImage}>
          <Text style={styles.textChangeColor}>Thay ảnh nền</Text>
        </TouchableOpacity>
      </View>
    </ScreensView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centerContainer: {
    width: windowSize.width / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {width: windowSize.width * 0.5, height: windowSize.width * 0.5},
  alias: {
    fontWeight: 'bold',
    lineHeight: 20,
    fontFamily: Font.AvenirBoldCondensed,
  },
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
  text: {fontSize: 16, marginBottom: 10},
  padding: {padding: 10},
  textInput: {
    color: Color.Black,
    borderWidth: 1,
    borderColor: Color.Border,
    borderRadius: 5,
    height: 40,
  },
  textChangeColor: {color: Color.MayaBlue, fontSize: 16},
  title: {
    lineHeight: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
  },
});

const imageBackgroundContainer = (background) => ({
  alignItems: 'center',
  paddingBottom: 10,
  backgroundColor: background ? 'transparent' : '#fff',
});
