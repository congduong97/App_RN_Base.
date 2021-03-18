import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dimension, Fonts, Colors, fontsValue, NavigationKey } from "../../../commons";
import { TouchableOpacityEx } from "../../../components";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export default function ChoosePictureView(props) {
    const {
        id: idView,
        title = "Chọn loại đặt lịch khám:",
        styleTitle,
        titleCancel = "Thoát",
        styleTitleCancel,
        bottomSheet,
        onPressCancel,
        styleButton,
        heightButton = Dimension.heightDefault,
        onResponses,
        dataOptions
    } = props;

    /////

    const handleOnPress = ({ id }) => {
        onResponses && onResponses(id);
        bottomSheet && bottomSheet.close();
    };
    ////
    return (
        <View style={styles.stContain}>
            <View style={{ flex: 1 }}></View>
            <View style={styles.stContainContent}>
                {/* <View
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
                </View> */}

                {dataOptions.map((item) => {
                    return (
                        <TouchableOpacityEx
                            id={item.id}
                            onPress={handleOnPress}
                            style={{ ...styles.stContainButton, ...styleButton, heightButton }}
                        >
                            <Text style={{ ...styles.stText, ...styles.stTextGallery }}>
                                {item.title}
                            </Text>
                        </TouchableOpacityEx>
                    )
                })}

                {/* <TouchableOpacityEx
                    id={NavigationKey.NextToBookByDay}
                    onPress={handleOnPress}
                    style={{ ...styles.stContainButton, ...styleButton, heightButton }}
                >
                    <Text style={{ ...styles.stText, ...styles.stTextGallery }}>
                        {"Đăng ký khám theo ngày"}
                    </Text>
                </TouchableOpacityEx>
                <TouchableOpacityEx
                    id={NavigationKey.NextToBookByDoctor}
                    onPress={handleOnPress}
                    style={{ ...styles.stContainButton, ...styleButton, heightButton }}
                >
                    <Text style={{ ...styles.stText, ...styles.stTextTake }}>
                        {"Đăng ký khám theo bác sỹ"}
                    </Text>
                </TouchableOpacityEx> */}
            </View>

            <TouchableOpacityEx
                id={NavigationKey.Cancel}
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
    stContain: { flex: 1 },
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
        color: "black",
        fontFamily: Fonts.SFProDisplaySemibold,
    },
    stTextTake: {
        color: "black",
        fontFamily: Fonts.SFProDisplaySemibold,
    },
    stTitle: {
        fontSize: Dimension.fontSize14,
        color: Colors.colorTitleScreen,
    },
    stTitleCancel: {
        color: Colors.colorMain,
        fontSize: Dimension.fontSize16,
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
