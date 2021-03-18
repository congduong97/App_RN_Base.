import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList, Image, ToastAndroid, Dimensions, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
    Colors,
    Dimension,
    Fonts,
} from "../../../../commons";
import {
    convertDateFormatVN,
    isCompareTime,
    FORMAT_DD_MM_YYYY
} from "../../../../commons/utils/DateTime";
import { TextView, ButtonView, InputView, IconView } from "../../../../components";
import models from "../../../../models";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-simple-toast";
import { useApp, useMergeState } from "../../../../AppProvider";

export default function ChoiceValueView(props) {
    const { itemSelect, refDialog, onPress } = props;
    const [stateScreen, setStateScreen] = useMergeState({
    });
    const { } = stateScreen;


    let titleDialog = "";
    let dataChoice = [];
    titleDialog = "Chọn thời gian";
    dataChoice = []

    const onPressCancel = () => {
        refDialog.hideDialog();
    };

    const onPressAccept = () => {
        onPress && onPress("TypeCancel");
        refDialog.hideDialog();
    };

    return (
        <>
            <Text style={styles.stTextTitleDialog}>{titleDialog}</Text>
            <Text style={[styles.stText]}>{"Nếu bạn hủy lịch quá 03 lần/ngày hoặc 05 lần/tuần. Tài khoản của bạn sẽ bị khóa trong vòng 15 ngày. Bạn chắc chắn muốn hủy ?"}</Text>

            <View style={styles.stFooterBotton}>
                <ButtonView
                    title={"Thoát"}
                    style={styles.stBottonCancel}
                    textColor={Colors.textLabel}
                    onPress={onPressCancel}
                />
                <ButtonView
                    title={"Hủy lịch"}
                    style={[styles.stBottonChoose, { backgroundColor: '#FF6F5B' }]}
                    onPress={onPressAccept}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    stText: {
        fontSize: 14,
        fontFamily: Fonts.SFProDisplayRegular,
        color: Colors.textLabel,
        textAlign: 'center',
        paddingHorizontal: 15
    },
    stTextTitleDialog: {
        marginBottom: 16,
        color: Colors.colorTextenu,
        fontSize: Dimension.fontSizeHeader,
        fontFamily: Fonts.SFProDisplayRegular,
        // fontWeight: "bold",
        textAlign: "center",
        letterSpacing: -0.3,
        marginTop: 20,
    },

    styleTextInputElement: {
        flexDirection: 'row',
        borderColor: Colors.colorBorder,
        // borderColor: configs.colorBorder,
        borderWidth: 0.5,
        borderRadius: 12,
        alignItems: 'center',
    },

    stBottonCancel: {
        flex: 1,
     
        backgroundColor: "#6E6E6E16",
        marginRight: 8,
    },

    stBottonChoose: {
        flex: 1,
    },
    stFooterBotton: {
        flexDirection: "row",
        marginBottom: 16,
        paddingHorizontal: 16,
        marginTop: 40
    },
    styleTextLabel: {
        backgroundColor: "transparent",
        fontSize: 10,
        color: Colors.textLabel,
        fontStyle: 'italic',
        marginLeft: 8
    },
});
