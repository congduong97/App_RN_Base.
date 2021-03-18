import React from "react";
import { StyleSheet, Text, View, PermissionsAndroid, Platform } from "react-native";
import { Dimension, Fonts, Colors, fontsValue } from "../../../commons";
import { TouchableOpacityEx } from "../../../components";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';

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
        if (Platform.OS !== 'ios') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Đặt lịch khám",
                        message: "Bạn chưa cấp quyền camera cho ứng dụng. Vui lòng cấp quyền cho máy ảnh",
                        // buttonNeutral: "Ask Me Later",
                        // buttonNegative: "Từ chối",
                        buttonPositive: "Cấp quyền"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                } else {
                    console.log("Camera permission denied");
                }
            } catch (err) {
                console.warn(err);
            }
        }

        if (id === "ShowGallery") {
            //   launchImageLibrary(
            //     {
            //       // mediaType: "photo",
            //       includeBase64: false,
            //       // maxHeight: 200,
            //       // maxWidth: 200,
            //     },
            //     (response) => {
            //       onResponses && onResponses({ id: idView, data: response });
            //     }
            //   );
            ImagePicker.openPicker({
                // mediaType: "photo",
                multiple: true
            }).then(images => {
                console.log("images123:   ", images)
                onResponses && onResponses({ id: 2, data: images });
            });
        } else if (id === "ShowCamera") {
            launchCamera(
                {
                    mediaType: "photo",
                    includeBase64: false,
                    // maxHeight: 200,
                    // maxWidth: 200,
                },
                (response) => {
                    console.log("response:   ", response)
                    onResponses && onResponses({ id: 1, data: response });
                }
            );
        } else {
            onPressCancel && onPressCancel();
            bottomSheet && bottomSheet.close();
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
