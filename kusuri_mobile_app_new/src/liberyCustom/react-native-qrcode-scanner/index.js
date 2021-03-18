import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, PermissionsAndroid, Platform, Alert, Dimensions } from 'react-native';
// eslint-disable-next-line import/no-unresolved
import { RNCamera } from 'react-native-camera';

const PERMISSION_AUTHORIZED = 'authorized';
const CAMERA_PERMISSION = 'camera';
import Permissions from 'react-native-permissions';

import { STRING } from '../../const/String';
import { isIOS } from '../../const/System';
import { COLOR_YELLOW, COLOR_WHITE, COLOR_GRAY } from '../../const/Color';
import BarcodeMask from './BarcodeMask';

// import { isArray } from 'util';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 5,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
    canDetectFaces: false,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    textBlocks: [],
    barcodes: [],
    isSucess: false,

  };
  componentDidMount() {
    if (Platform.OS === 'ios') {
      Permissions.request(CAMERA_PERMISSION).then(response => {
        this.setState({
          isAuthorized: response === PERMISSION_AUTHORIZED,
          isAuthorizationChecked: true,
        });
        if (response !== PERMISSION_AUTHORIZED) {
          setTimeout(() => {
            Alert.alert(
              STRING.notification,
              "会員カードに記載されているバーコードの読み取りなどでカメラ機能を利用します。アプリの設定画面から設定を変更することができます。",
              [{ text: STRING.cancel }, { text: STRING.ok, onPress: () => isIOS ? Permissions.openSettings() : () => { } }],
              { cancelable: false }
            );
          }, 100);
        }
      });
    } else if (
      Platform.OS === 'android' &&
      this.props.checkAndroid6Permissions
    ) {
      if (Platform.Version < 23) {
        this.setState({ isAuthorized: true, isAuthorizationChecked: true });
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: this.props.permissionDialogTitle,
          message: this.props.permissionDialogMessage,
        }).then(granted => {
          const isAuthorized =
            Platform.Version >= 23
              ? granted === PermissionsAndroid.RESULTS.GRANTED
              : granted === true;

          this.setState({ isAuthorized, isAuthorizationChecked: true });
          if (granted == 'never_ask_again') {
            setTimeout(() => {
              Alert.alert(
                STRING.notification,
                "会員カードに記載されているバーコードの読み取りなどでカメラ機能を利用します。アプリの設定画面から設定を変更することができます。",
              );
            }, 100);
          }
        });
      }
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true });
    }
  }



  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }




  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function () {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      // console.warn('takePicture ', data);
    }
  };

  takeVideo = async function () {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({ isRecording: true });
          const data = await promise;
          this.setState({ isRecording: false });
          // console.warn('takeVideo', data);
        }
      } catch (e) {
        // console.error(e);
      }
    }
  };

  // toggle = value => () => this.setState(prevState => ({ [value]: !prevState[value] }));







  barcodeRecognized = ({ barcodes }) => {
    // console.log('barcodes', barcodes)
    if (barcodes && Array.isArray(barcodes) && barcodes.length > 0) {
      for (let index = 0; index < barcodes.length; index++) {
        if (barcodes[index].data && !this.state.isSucess) {

          this.props.onRead(barcodes[index]);
          this.state.isSucess = true
          break;
        }

      }
    }
  }


  renderCamera() {
    const { canDetectFaces, canDetectText, canDetectBarcode, isAuthorized } = this.state;
    if (!isAuthorized) {
      return null;
    }
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={[styles.camera, this.props.cameraStyle]}

        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        // zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        // focusDepth={this.state.depth}
        trackingEnabled
        // faceDetectionLandmarks={
        //   RNCamera.Constants.FaceDetection.Landmarks
        //     ? RNCamera.Constants.FaceDetection.Landmarks.all
        //     : undefined
        // }
        // faceDetectionClassifications={
        //   RNCamera.Constants.FaceDetection.Classifications
        //     ? RNCamera.Constants.FaceDetection.Classifications.all
        //     : undefined
        // }
        // onFacesDetected={canDetectFaces ? this.facesDetected : null}
        // onTextRecognized={canDetectText ? this.textRecognized : null}
        defaultVideoQuality={RNCamera.Constants.VideoQuality['1080p']}
        captureAudio={false}
        onGoogleVisionBarcodesDetected={this.barcodeRecognized}
        googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.CODABAR}
      >


      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>
      {this.renderCamera()}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: isIOS ? 0 : 25,
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').width,
  },

});