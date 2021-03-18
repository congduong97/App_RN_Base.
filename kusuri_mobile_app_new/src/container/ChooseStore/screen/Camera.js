import React, { Component } from "react";
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Linking,
  Platform,
  AppState,
} from "react-native";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_WHITE,
  APP_COLOR,
} from "../../../const/Color";
import {
  DEVICE_WIDTH,
  menuInApp,
  sizePage,
  keyAsyncStorage,
  isIOS,
  styleInApp,
} from "../../../const/System";
import { NetworkError, Loading, HeaderIconLeft } from "../../../commons";
import { STRING } from "../util/string";
import { RNCamera } from "react-native-camera";
import Navigation from "../../../service/NavigationService";
import { chooseStoreService } from "../util/service";
import { SIZE } from "../../../const/size";
import Permissions from "react-native-permissions";
import { checkPermissionCamera } from "../../../util/module/CheckPermissionCamera";
import ImageResizer from "react-native-image-resizer";
export default class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: null,
      isLoading: false,
      numberPicture: 0, // so anh chup khi vao man camera
      isPermissionCamera: true,
      appState: AppState.currentState,
    };
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "didFocus",
      async () => {
        let isPermissionCamera = await checkPermissionCamera();
        // console.log("dssd", isPermissionCamera);
        this.setState({
          isPermissionCamera,
        });
        if (chooseStoreService.getListImage().length == 0) {
          this.setState({
            uri: null,
          });
        }
      }
    );
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    this.focusListener.remove();
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      let isPermissionCamera = await checkPermissionCamera();
      this.setState({
        isPermissionCamera,
      });
    }
    this.setState({ appState: nextAppState });
  };

  takePicture = async () => {
    this.setState({
      ...this.state,
      isLoading: true,
    });
    try {
      if (this.camera) {
        const options = {
          base64: false,
          mirrorImage: false,
          fixOrientation: true,
          forceUpOrientation: true,
          orientation: 1,
        };
        const data = await this.camera.takePictureAsync(options);
        const newImage = await ImageResizer.createResizedImage(
          data.uri,
          900,
          1200,
          "JPEG",
          90
        );
        chooseStoreService.setUriImage(newImage);
        //console.log("image", newImage);
        this.setState({
          ...this.state,
          uri: newImage.uri,
          numberPicture: this.state.numberPicture + 1,
        });
        console.log(this.state.numberPicture, "numberPicture");
        console.log(
          chooseStoreService.getListImage().length,
          "leng ListPicture"
        );
      }
      this.setState({
        ...this.state,
        isLoading: false,
      });
    } catch (error) {
      console.log("error", error);
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  };

  backInCamera = async () => {
    const listImage = chooseStoreService.getListImage();
    const { numberPicture } = this.state;
    console.log("length", numberPicture, listImage.length);
    if (numberPicture - 1 >= 0 && listImage.length - 1 >= 0) {
      this.setState({
        ...this.state,
        uri: listImage[listImage.length - 1].uri,
      });
    } else {
      this.props.navigation.goBack();
    }
  };
  renderCameraImage = () => {
    return (
      <RNCamera
        ref={(ref) => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          marginHorizontal: SIZE.width(20),
          marginVertical: SIZE.width(10),
        }}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      >
        {({ camera, status, recordAudioPermissionStatus }) => {
          console.log(this.state.isPermissionCamera, "isPermissionCamera");
          if (!this.state.isPermissionCamera) {
            return (
              <View
                style={{
                  flex: 1,
                  margin: -SIZE.width(5),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLOR_WHITE,
                }}
              >
                {/* {this.alertForLocationPermission()} */}
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: SIZE.width(5),
                    borderRadius: 3,
                    backgroundColor: "#06B050",
                  }}
                  onPress={() => {
                    console.log(isIOS);
                    isIOS ? Permissions.openSettings() : Linking.openSettings();
                  }}
                >
                  <Text
                    style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}
                  >
                    カメラを許可する
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
          if (this.state.isLoading) {
            return (
              <View
                style={{
                  flex: 1,
                  marginHorizontal: -SIZE.width(16),
                  marginVertical: -SIZE.width(5),
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: COLOR_WHITE,
                }}
              >
                <Loading />
              </View>
            );
          }
          return (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          );
        }}
      </RNCamera>
    );
  };
  renderCamera() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styleInApp.hkgpronw6_16, styles.textContent]}>
          {STRING.please_take_photo}
        </Text>
        <Text style={[styleInApp.hkgpronw3_13, styles.textGuide]}>
          {STRING.guide_take_photo}
        </Text>
        {this.renderCameraImage()}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: SIZE.width(6),
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => this.backInCamera()}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}>
              戻る
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCamera}
            onPress={() => {
              if (this.state.isPermissionCamera) {
                this.takePicture();
              }
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}>
              撮影する
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderPicture() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={[styleInApp.hkgpronw6_16, styles.textContent]}>
          {STRING.please_check_prescription}
        </Text>
        <Text
          style={[
            styleInApp.hkgpronw3_16,
            { alignSelf: "center", marginTop: 10 },
          ]}
        >
          {chooseStoreService.getListImage().length}
          {STRING.page}
        </Text>
        <Image
          style={{
            flex: 1,
            marginHorizontal: SIZE.width(5),
            marginVertical: 20,
          }}
          source={{ uri: this.state.uri }}
          resizeMode={"contain"}
        />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: SIZE.width(6),
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={styles.re_take_photo}
            onPress={() => {
              chooseStoreService.deleteLastImage();
              this.setState({
                ...this.state,
                uri: null,
                numberPicture: this.state.numberPicture - 1,
              });
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: "#fff" }]}>
              {STRING.re_take_photo}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continue_take_photo}
            onPress={() => {
              if (chooseStoreService.getListImage().length < 10) {
                this.setState({
                  ...this.state,
                  uri: null,
                });
              } else {
                Alert.alert("処方せんは10枚までとなります。");
              }
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: "#06B050" }]}>
              {STRING.continue_take_photo}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.complete_take_photo}
            onPress={() => {
              this.props.navigation.push("DETAIL_ORDER_PRESCRIPTION");
            }}
          >
            <Text style={[styleInApp.hkgpronw6_14, { color: "#fff" }]}>
              {STRING.complete_take_photo}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  renderContent() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.uri ? this.renderPicture() : this.renderCamera()}
      </View>
    );
  }
  goBack = () => {
    if (this.state.uri) {
      console.log("dsd");
      chooseStoreService.deleteLastImage();
      this.setState({
        ...this.state,
        uri: null,
        numberPicture: this.state.numberPicture - 1,
      });
    } else {
      this.backInCamera();
    }
  };
  render() {
    return (
      <View
        style={[
          styles.wrapperContainer,
          { backgroundColor: APP_COLOR.BACKGROUND_COLOR },
        ]}
      >
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />
        <HeaderIconLeft
          // title={"fhdhdhdy"}
          goBack={this.goBack}
          imageUrl={menuInApp.iconNotification}
        />
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    flex: 1,
  },
  textContent: {
    marginTop: 30,
    marginLeft: 20,
  },
  textGuide: {
    marginTop: 10,
    marginHorizontal: SIZE.width(5),
  },
  btnCamera: {
    flex: 1,
    backgroundColor: "#06B050",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginLeft: 7,
  },
  btnBack: {
    flex: 1,
    backgroundColor: "#646464",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginRight: SIZE.width(2),
  },
  complete_take_photo: {
    flex: 1,
    backgroundColor: "#06B050",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginLeft: SIZE.width(1),
  },
  re_take_photo: {
    flex: 1,
    backgroundColor: "#646464",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    marginRight: SIZE.width(1),
  },
  continue_take_photo: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#06B050",
    marginHorizontal: SIZE.width(1),
  },
});
