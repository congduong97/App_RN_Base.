import React from "react";
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { Dimension, Fonts, Colors } from "../../../commons";
import { TouchableOpacityEx } from "../../../components";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Permissions, { PERMISSIONS, RESULTS } from "react-native-permissions";
export default function ChoosePictureView(props) {
  const {
    id: idView,
    title = "Chọn ảnh từ:",
    styleTitle,
    titleCancel = "Quay lại",
    styleTitleCancel,
    bottomSheet,
    onPressCancel,
    styleButton,
    heightButton = Dimension.heightDefault,
    onResponses,
  } = props;
  /////

  const handleOnPress = async ({ id }) => {
    if (Platform.OS == "android") {
      if (id == "ShowCamera") {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: "Đặt lịch khám",
              message:
                "Bạn chưa cấp quyền camera cho ứng dụng. Vui lòng cấp quyền cho máy ảnh",
              buttonPositive: "Cấp quyền",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            launchCamera(
              {
                mediaType: "photo",
                includeBase64: false,
              },
              (response) => {
                onResponses && onResponses({ id: idView, data: response });
              }
            );
          }else{
            Alert.alert(
              "Bạn chưa cấp quyền camera cho ứng dụng",
              "Vui lòng cấp quyền cho máy ảnh",
              [
                {
                  text: "Hủy bỏ",
                  style: "cancel",
                },
                {
                  text: "Đồng ý",
                  onPress: () => Permissions.openSettings(),
                }
              ],
              { cancelable: false }
            );
          }
        } catch (err) {
          console.log("Lỗi cấp quyền camera");
        }
        onPressCancel && onPressCancel();
        bottomSheet && bottomSheet.close();
      }
      if (id === "ShowGallery") {
        launchImageLibrary(
          {
            mediaType: "photo",
            includeBase64: false,
          },
          (response) => {
            onResponses && onResponses({ id: idView, data: response });
          }
        );
      } else {
        onPressCancel && onPressCancel();
        bottomSheet && bottomSheet.close();
      }
    } else {
      if (id === "ShowCamera") {
        await Permissions.request(PERMISSIONS.IOS.CAMERA).then((response) => {
          if (response == RESULTS.GRANTED) {
            launchCamera(
              {
                mediaType: "photo",
                includeBase64: false,
              },
              (response) => {
                onResponses && onResponses({ id: idView, data: response });
              }
            );
          } else {
            Alert.alert(
              "Bạn chưa cấp quyền camera cho ứng dụng",
              "Vui lòng cấp quyền cho máy ảnh",
              [
                {
                  text: "Hủy bỏ",
                  style: "cancel",
                },
                {
                  text: "Đồng ý",
                  onPress: () => Permissions.openSettings(),
                },
              ],
              { cancelable: false }
            );
          }
        });
      }
      if (id === "ShowGallery") {
        launchImageLibrary(
          {
            mediaType: "photo",
            includeBase64: false,
          },
          (response) => {
            onResponses && onResponses({ id: idView, data: response });
          }
        );
      } else {
        onPressCancel && onPressCancel();
        bottomSheet && bottomSheet.close();
      }
    }
  };

  ////
  return (
    <View style={styles.stContain}>
      <View style={styles.stContainContent}>
        <View
          style={{ ...styles.stContainButton, ...styleButton, heightButton }}
        >
          <Text
            style={{
              ...styles.stText,
              ...styles.stTitle,
              ...styleTitle,
            }}
          >
            {title}
          </Text>
        </View>
        <TouchableOpacityEx
          id={"ShowGallery"}
          onPress={handleOnPress}
          style={{ ...styles.stContainButton, ...styleButton, heightButton }}
        >
          <Text style={{ ...styles.stText, ...styles.stTextGallery }}>
            {"Thư viện ảnh"}
          </Text>
        </TouchableOpacityEx>
        <TouchableOpacityEx
          id={"ShowCamera"}
          onPress={handleOnPress}
          style={{ ...styles.stContainButton, ...styleButton, heightButton }}
        >
          <Text style={{ ...styles.stText, ...styles.stTextTake }}>
            {"Chụp ảnh mới"}
          </Text>
        </TouchableOpacityEx>
      </View>
      <TouchableOpacityEx
        id={"Cancel"}
        onPress={handleOnPress}
        style={{
          ...styles.stContainButtonCancel,
          ...styleButton,
          heightButton,
        }}
      >
        <Text
          style={{
            ...styles.stText,
            ...styles.stTitleCancel,
            ...styleTitleCancel,
          }}
        >
          {titleCancel}
        </Text>
      </TouchableOpacityEx>
    </View>
  );
}

const styles = StyleSheet.create({
  stContain: {},
  stContainContent: {
    margin: Dimension.margin,
    borderRadius: Dimension.radius,
    backgroundColor: "white",
    borderTopRightRadius: Dimension.radius,
    borderTopLeftRadius: Dimension.radius,
  },
  stText: {
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize16,
  },
  stTextGallery: {
    color: "red",
    fontFamily: Fonts.SFProDisplaySemibold,
  },
  stTextTake: {
    color: "blue",
    fontFamily: Fonts.SFProDisplaySemibold,
  },
  stTitle: {
    fontSize: Dimension.fontSize14,
    color: Colors.colorTitleScreen,
  },
  stTitleCancel: {
    fontSize: Dimension.fontSize14,
  },
  stContainButton: {
    justifyContent: "center",
    // backgroundColor: "white",
    height: Dimension.heightButton,
    borderTopColor: "#B0B3C750",
    borderTopWidth: 0.5,
  },
  stContainButtonCancel: {
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: Dimension.radius,
    height: Dimension.heightButton,
    margin: Dimension.margin,
  },
});
