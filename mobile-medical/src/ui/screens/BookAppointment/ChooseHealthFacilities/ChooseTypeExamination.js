import React, {
    forwardRef,
    useImperativeHandle,
    useEffect,
    useRef,
} from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Colors, Dimension, Fonts, fontsValue, NavigationKey, } from "../../../../commons";
import { TextView, TouchableOpacityEx } from "../../../../components";
import { IconViewType } from "../../../../components/IconView";
import RBSheet from "react-native-raw-bottom-sheet";

export default function PopupChoiceView(props) {
    const { typeDialog, refDialog, onPress, dataSelected, keyCheck } = props;
    let titleDialog = "";
    titleDialog = "Chọn loại Đặt lịch";

    const refBottomSheet = useRef(ref);
    const [stateScreen, setStateScreen] = useMergeState({
        sheetHeight: 0,
    });
    const { sheetHeight } = stateScreen;
    useImperativeHandle(ref, () => ({
        open: () => {
            onOpenSheet();
        },
        close: () => {
            onCloseSheet();
        },
    }));
    useEffect(() => {
        sheetHeight > 0
            ? refBottomSheet.current.open()
            : refBottomSheet.current.close();
    }, [sheetHeight]);

    function onOpenSheet() {
        setStateScreen({ sheetHeight: 220 });
    }

    const onCloseSheet = () => {
        setStateScreen({ sheetHeight: 0 });
    };
    /////
    const onResponses = ({ data }) => {
        onReponse && onReponse({ id: idView, data });
        ////
        setStateScreen({ sheetHeight: 0 });
    };
    ////////////

    const handleOnPress = (index) => {
        onPress && onPress(index);
        refDialog.hideDialog();
    };

    const renderContentSheet = () => {
        return (
            <View style={styles.stContain}>
                <View style={styles.stContainContent}>
                    <View
                        style={{ ...styles.stContainButton }}
                    >
                        <Text
                            style={{
                                ...styles.stText,
                                ...styles.stTitle,
                            }}
                        >
                            {"title"}
                        </Text>
                    </View>
                    <TouchableOpacityEx
                        id={"ShowGallery"}
                        onPress={handleOnPress}
                        style={{ ...styles.stContainButton }}
                    >
                        <Text style={{ ...styles.stText, ...styles.stTextGallery }}>
                            {"Thư viện ảnh"}
                        </Text>
                    </TouchableOpacityEx>
                    <TouchableOpacityEx
                        id={"ShowCamera"}
                        onPress={handleOnPress}
                        style={{ ...styles.stContainButton, ...styleButton }}
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
        )
    };

    return (
        // <>
        //     <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>

        //     <TouchableOpacity style={styles.styContain} onPress={() => onSelectedItem(NavigationKey.NextToBookByDay)}>
        //         <Text>{'Đăng ký khám theo ngày'}</Text>
        //     </TouchableOpacity>
        //     <TouchableOpacity style={styles.styContain} onPress={() => onSelectedItem(NavigationKey.NextToBookByDoctor)}>
        //         <Text>{'Đăng ký khám theo bác sỹ'}</Text>
        //     </TouchableOpacity>
        //     <TouchableOpacity style={{
        //         backgroundColor: 'red',
        //         padding: 12,
        //         margin: 12,
        //         borderRadius: 12,
        //         alignItems: 'center'
        //     }} onPress={() => onSelectedItem(NavigationKey.Cancel)}>
        //         <Text style={{ color: 'white' }}>{'Thoát'}</Text>
        //     </TouchableOpacity>
        // </>

        <RBSheet
            ref={refBottomSheet}
            animationType="fade"
            height={sheetHeight}
            openDuration={200}
            closeOnPressMask={false}
            closeOnPressBack={true}
            onClose={onCloseSheet}
            customStyles={{
                wrapper: {
                    backgroundColor: "#00000050",
                },
                container: {
                    backgroundColor: "transparent",
                    borderTopRightRadius: Dimension.radius,
                    borderTopLeftRadius: Dimension.radius,
                },
            }}
        >
            {renderContentSheet()}
        </RBSheet>
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
