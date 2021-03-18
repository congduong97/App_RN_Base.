"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  StyleSheet,
  Dimensions,
  Vibration,
  Animated,
  Easing,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
  Text,
} from "react-native";

import Permissions from "react-native-permissions";
import { RNCamera as Camera } from "react-native-camera";
import { SIZE } from "../../../const/size";
import { STRING } from "../../../const/String";

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(["front", "back"]),
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
    onDenyPermission: PropTypes.func,
  };

  static defaultProps = {
    onRead: () => {
      console.log("QR code scanned!");
    },
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: "back",
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            marginTop: SIZE.height(5),
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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
          }}
        />
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
      timeCountCheckPermission: 0,
      listRawDataQRScanner: [],
      arrayQRCodeScannerSuccess: [],
    };

    this.handleBarCodeRead = this.handleBarCodeRead.bind(this);
  }

  componentDidMount() {
    let { timeCountCheckPermission } = this.state;
    timeCountCheckPermission = setTimeout(() => {
      this.checkPermission();
    }, 1000);
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

  componentWillUnmount() {
    const { timeCountCheckPermission } = this.state;
    clearTimeout(timeCountCheckPermission);
  }

  checkPermission() {
    const isIos = Platform.OS === "ios";
    if (isIos) {
      Permissions.request("camera").then((response) => {
        this.setState({
          isAuthorized: response,
          isAuthorizationChecked: true,
        });
        if (response != "authorized" && response != "granted") {
          setTimeout(() => {
            Alert.alert(
              STRING.notification,
              STRING.need_enable_camera_with_setting_android,
              [
                { text: STRING.cancel, onPress: this.props.onDenyPermission },
                {
                  text: STRING.ok,
                  onPress: () =>
                    isIos ? Permissions.openSettings() : () => {},
                },
              ],
              { cancelable: false }
            );
          }, 100);
        }
      });
    } else if (
      Platform.OS === "android" &&
      this.props.checkAndroid6Permissions
    ) {
      if (Platform.Version < 23) {
        this.setState({ isAuthorized: true, isAuthorizationChecked: true });
      } else {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: this.props.permissionDialogTitle,
          message: this.props.permissionDialogMessage,
        }).then((response) => {
          const isAuthorized =
            Platform.Version >= 23
              ? response === "granted" || response === "authorized"
              : response === true;
          this.setState({ isAuthorized, isAuthorizationChecked: true });
          if (response == "never_ask_again") {
            setTimeout(() => {
              Alert.alert(
                STRING.notification,
                `${STRING.need_enable_camera_with_setting_android}`,
                [
                  {
                    text: "キャンセル",
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    style: "cancel",
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ],
                { cancelable: false }
              );
            }, 100);
          } else if (response == "denied") {
            this.props.onDenyPermission();
          }
        });
      }
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true });
    }
  }

  disable() {
    this.setState({ disableVibrationByUser: true });
  }
  enable() {
    this.setState({ disableVibrationByUser: false });
  }

  setScanning(value) {
    this.setState({ scanning: value });
  }

  handleBarCodeRead(dataQRCode) {
    const { onRead, getArrayQRCodeScannerSuccess } = this.props;
    const { listRawDataQRScanner, arrayQRCodeScannerSuccess } = this.state;
    const { rawData } = dataQRCode;
    if (dataQRCode && rawData) {
      try {
        if (listRawDataQRScanner.indexOf(rawData) == -1) {
          console.log("Đã quét dc mã QR code:", dataQRCode);
          Vibration.vibrate();
          listRawDataQRScanner.push(`${rawData}`);
          arrayQRCodeScannerSuccess.push(dataQRCode.data);
          onRead(dataQRCode);
          getArrayQRCodeScannerSuccess(
            arrayQRCodeScannerSuccess,
            listRawDataQRScanner.length
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    }
   
  }

  renderTopContent() {
    if (this.props.topContent) {
      return this.props.topContent;
    }
    return null;
  }

  renderBottomContent() {
    if (this.props.bottomContent) {
      return this.props.bottomContent;
    }
    return null;
  }

  renderCameraMarker() {
    if (this.props.showMarker) {
      if (this.props.customMarker) {
        return this.props.customMarker;
      } else {
        return (
          <View style={styles.rectangleContainer}>
            <View
              style={[
                styles.rectangle,
                this.props.markerStyle ? this.props.markerStyle : null,
              ]}
            />
          </View>
        );
      }
    }
    return null;
  }

  renderCamera() {
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
              backgroundColor: "transparent",
            }}
          >
            <Camera
              captureAudio={false}
              style={[styles.camera, this.props.cameraStyle]}
              onBarCodeRead={this.handleBarCodeRead.bind(this)}
              type={this.props.cameraType}
              {...this.props.cameraProps}
            >
              {this.renderCameraMarker()}
            </Camera>
          </Animated.View>
        );
      }
      return (
        <Camera
          type={cameraType}
          style={[styles.camera, this.props.cameraStyle]}
          onBarCodeRead={this.handleBarCodeRead.bind(this)}
          {...this.props.cameraProps}
        >
          {this.renderCameraMarker()}
        </Camera>
      );
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView;
    } else {
      return notAuthorizedView;
    }
  }

  reactivate() {
    this.setScanning(false);
  }

  render() {
    return (
      <View style={[styles.mainContainer, this.props.containerStyle]}>
        <View style={[styles.infoView, this.props.topViewStyle]}>
          {this.renderTopContent()}
        </View>
        {this.renderCamera()}
        <View style={[styles.infoView, this.props.bottomViewStyle]}>
          {this.renderBottomContent()}
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
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },

  camera: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: Dimensions.get("window").width,
    width: Dimensions.get("window").width,
  },

  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: "#00FF00",
    backgroundColor: "transparent",
  },
});
