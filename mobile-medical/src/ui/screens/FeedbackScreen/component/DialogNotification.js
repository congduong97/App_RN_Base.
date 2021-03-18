import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import {
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    Colors,
    Dimension,
    Fonts,
} from "../../../../commons";
import { TextView, ButtonView } from "../../../../components";

export default function DialogNotification(props) {
    const { typeDialog, refDialog, onPress } = props;

    const onPressCancel = () => {
        refDialog.hideDialog();
    }

    const onPressAccept = () => {
        refDialog.hideDialog();
    }

    return (
        <>
            <Text style={styles.stTextTitleDialog}>{"Thông báo"}</Text>
            <Text style={[styles.stTextItem, {
                width: '100%',
                textAlign: 'center',
                paddingHorizontal: 24,
                paddingBottom: 12,
            }]}>{"Cám ơn bạn đã gửi góp ý cho  chúng tôi. Chúng tôi sẽ xử lý trong thời gian sớm nhất"}</Text>

            <View style={[styles.stFooterBotton, {justifyContent: 'center'}]}>
                <ButtonView
                    title={"Đóng"}
                    style={[styles.stBottonCancel, { flex: 0.5 }]}
                    textColor={Colors.colorMain}
                    onPress={onPressCancel}
                />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    stContainsItem: {
        paddingHorizontal: 16,
        flexDirection: "row",
        paddingVertical: 12,
        alignItems: "center",
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

    styContainText: {
        marginLeft: 5,
        flex: 1,
    },

    stTextItem: {
        color: Colors.colorTitleScreen,
        fontSize: Dimension.fontSizeMenu,
        fontFamily: Fonts.SFProDisplayRegular,
    },

    stBottonCancel: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.colorMain,
        backgroundColor: "white",
        marginRight: 8,
    },

    stBottonChoose: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: 'red'
    },

    stFooterBotton: {
        flexDirection: "row",
        marginBottom: 16,
        paddingHorizontal: 16,
    },
});
