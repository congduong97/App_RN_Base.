import React, { Component } from "react";
import {
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";
import Permissions from "react-native-permissions";
import RBSheet from "react-native-raw-bottom-sheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { STRING } from "../const/String";
import { SIZE } from "../const/size";
import AsyncStorage from "@react-native-community/async-storage";
import { keyAsyncStorage } from "../const/System";
// onChangeValue - get response afer choose image or take photo

export class PicturePicker extends Component {
  showRBSheet = () => {
    this.RBSheetRef.open();
  };

  pressTakePhotoCamera = () => {
    setTimeout(async () => {
      launchCamera(
        {
          mediaType: "photo",
          includeBase64: false,
          maxHeight: SIZE.height(100),
          maxWidth: SIZE.width(100),
          quality: 1,
        },
        async (response) => {
          // console.log("image___", newImage);
          let arrUrlImageSaveWhenTakePhoto = await AsyncStorage.getItem(
            keyAsyncStorage.arrUrlImageSaveWhenTakePhoto
          );
          console.log("newArray", arrUrlImageSaveWhenTakePhoto);
          let newArray = !!JSON.parse(arrUrlImageSaveWhenTakePhoto)
            ? JSON.parse(arrUrlImageSaveWhenTakePhoto)
            : [];

          console.log("image___", response.uri);
          newArray.push(response.uri);
          console.log(" abc.push(newImage.uri)", newArray);

          await AsyncStorage.setItem(
            keyAsyncStorage.arrUrlImageSaveWhenTakePhoto,
            JSON.stringify(newArray)
          );

          this.props.onChangeValue(response);
          console.log("responseImg", response);
        }
      );
    }, 100);
  };

  takePhoto = () => {
    this.RBSheetRef.close();
    const isIos = Platform.OS === "ios";
    if (isIos) {
      try {
        Permissions.request("camera").then((response) => {
          if (response != "authorized" && response != "granted") {
            setTimeout(() => {
              Alert.alert(
                STRING.notification,
                STRING.need_enable_camera,
                [
                  { text: STRING.cancel, onPress: () => {} },
                  {
                    text: STRING.ok,
                    onPress: () =>
                      isIos ? Permissions.openSettings() : () => {},
                  },
                ],
                { cancelable: false }
              );
            }, 100);
            return false;
          } else {
            this.pressTakePhotoCamera();
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    } else if (Platform.OS === "android") {
      try {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA).then(
          (response) => {
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
              return false;
            } else {
              this.pressTakePhotoCamera();
            }
          }
        );
      } catch (error) {}
    } else {
      this.pressTakePhotoCamera();
    }
  };

  chooseImage = () => {
    this.RBSheetRef.close();
    setTimeout(() => {
      launchImageLibrary(
        {
          mediaType: "photo",
          includeBase64: false,
          maxHeight: 200,
          maxWidth: 200,
        },
        (response) => {
          if (response.didCancel || response.errorCode) {
            return;
          }
          this.props.onChangeValue(response);
        }
      );
    }, 100);
  };

  render() {
    return (
      <RBSheet
        ref={(ref) => (this.RBSheetRef = ref)}
        animationType="slide"
        closeOnPressMask={false}
        closeOnPressBack={false}
        closeDuration={50}
        customStyles={{
          container: {
            flex: 1,
            backgroundColor: "transparent",
            padding: 16,
          },
        }}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#EFEFEF",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              paddingVertical: 16,
              opacity: 0.9,
              borderBottomWidth: 1,
              borderColor: "#CECECE",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
            }}
            onPress={this.takePhoto}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#2a5aad",
                textAlign: "center",
              }}
            >
              Take Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#EFEFEF",
              borderBottomRightRadius: 6,
              borderBottomLeftRadius: 6,
              paddingVertical: 16,
              opacity: 0.9,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,

              elevation: 3,
            }}
            onPress={this.chooseImage}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#2a5aad",
                textAlign: "center",
              }}
            >
              Choose from Library
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#F7F7F7",
              borderRadius: 6,
              paddingVertical: 16,
              marginTop: 12,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
            }}
            onPress={() => {
              this.RBSheetRef.close();
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "#2a5aad",
                textAlign: "center",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </RBSheet>
    );
  }
}

export default PicturePicker;
