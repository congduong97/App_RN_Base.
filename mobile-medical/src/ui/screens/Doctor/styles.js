import { StyleSheet } from "react-native";
import {
    Colors, Dimension, Fonts,
    SCREEN_WIDTH,
} from "../../../commons";

export default StyleSheet.create({
    stValueButton: {
        // marginTop: 8,
        color: Colors.colorText,
        fontSize: Dimension.fontSize16,
        fontFamily: Fonts.SFProDisplaySemibold,
    },
    stButtonSelectbox: {
        marginHorizontal: 10,
        marginTop: 16,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: Colors.colorBg2,
    },
    stTitleButton: {
        marginTop: 8,
        color: Colors.colorTitleScreen,
        fontSize: Dimension.fontSize12,
        fontFamily: Fonts.SFProDisplayRegular,
    },
});
