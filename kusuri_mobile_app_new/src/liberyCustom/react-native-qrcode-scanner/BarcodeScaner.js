'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
  Easing,
  View,
  Text,
  Platform,
  PermissionsAndroid, Alert
} from 'react-native';

import Permissions from 'react-native-permissions';
import { RNCamera as Camera } from 'react-native-camera';
import { STRING } from '../../const/String';
import { isIOS,DEVICE_WIDTH } from '../../const/System';

const PERMISSION_AUTHORIZED = 'authorized';
const CAMERA_PERMISSION = 'camera';

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front', 'back']),
    customMarker: PropTypes.element,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    markerStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    bottomContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
    cameraProps: PropTypes.object,
  };

  static defaultProps = {
    onRead: () => console.log('QR code scanned!'),
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: 'back',
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          カメラが許可されていません
</Text>
      </View>
    ),
    pendingAuthorizationView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          ...
        </Text>
      </View>
    ),
    permissionDialogTitle: STRING.notification,
    permissionDialogMessage: STRING.need_enable_camera,
    checkAndroid6Permissions: false,
    cameraProps: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      scanning: false,
      fadeInOpacity: new Animated.Value(0),
      isAuthorized: false,
      isAuthorizationChecked: false,
      disableVibrationByUser: false,
    };

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

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

  componentDidMount() {
    if (this.props.fadeIn) {
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(this.state.fadeInOpacity, {
          toValue: 1,
          easing: Easing.inOut(Easing.quad),
        }),
      ]).start();
    }
  }

  disable() {
    this.setState({ disableVibrationByUser: true });
  }
  enable() {
    this.setState({ disableVibrationByUser: false });
  }

  _setScanning(value) {
    this.setState({ scanning: value });
  }

  _handleBarCodeRead(e) {
    if (!this.state.scanning && !this.state.disableVibrationByUser) {
      if (this.props.vibrate) {
        Vibration.vibrate();
      }
      this._setScanning(true);
      this.props.onRead(e);
      if (this.props.reactivate) {
        setTimeout(
          () => this._setScanning(false),
          this.props.reactivateTimeout
        );
      }
    }
  }

  _renderTopContent() {
    if (this.props.topContent) {
      return this.props.topContent;
    }
    return null;
  }

  _renderBottomContent() {
    if (this.props.bottomContent) {
      return this.props.bottomContent;
    }
    return null;
  }

  _renderCameraMarker() {
    if (this.props.showMarker) {
      if (this.props.customMarker) {
        return this.props.customMarker;
      } 
        return (
          <View style={styles.rectangleContainer}>
            <View style={[styles.rectangle, this.props.markerStyle ? this.props.markerStyle : null]} />
          </View>
        );
    }
    return null;
  }

  _renderCamera() {
    const {
      notAuthorizedView,
      pendingAuthorizationView,
      cameraType,
    } = this.props;
    const { isAuthorized, isAuthorizationChecked } = this.state;
    if (isAuthorized) {
      if (this.props.fadeIn) {
        return (
          <Animated.View
            style={{
              opacity: this.state.fadeInOpacity,
              backgroundColor: 'transparent',
            }}
          >
            <Camera
              style={[styles.camera, this.props.cameraStyle]}
              onBarCodeRead={this._handleBarCodeRead.bind(this)}
              type={this.props.cameraType}
              {...this.props.cameraProps}
            >
              {this._renderCameraMarker()}
            </Camera>
          </Animated.View>
        );
      }
      return (
        <Camera
          type={cameraType}
          style={[styles.camera, this.props.cameraStyle]}
          onBarCodeRead={this._handleBarCodeRead.bind(this)}
          {...this.props.cameraProps}
        >
          {this._renderCameraMarker()}
        </Camera>
      );
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView;
    } 
      return notAuthorizedView;
  }

  reactivate() {
    this._setScanning(false);
  }

  render() {
    return (
      <View style={[styles.mainContainer, this.props.containerStyle]}>
        <View style={[styles.infoView, this.props.topViewStyle]}>
          {this._renderTopContent()}
        </View>
        {this._renderCamera()}
        <View style={[styles.infoView, this.props.bottomViewStyle]}>
          {this._renderBottomContent()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH
  },

  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: DEVICE_WIDTH,
    width: DEVICE_WIDTH
  },

  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
});
