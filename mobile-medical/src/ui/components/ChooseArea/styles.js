import { StyleSheet, Platform } from "react-native";
import { Dimension, Colors, Fonts, fontsValue } from "../../../commons";

export default StyleSheet.create({
  stContain: {
    flex: 1,
    paddingBottom: fontsValue(30),
  },
  stContainRow: {
    height: Dimension.heightInputView,
    marginHorizontal: Dimension.margin,
    alignItems: "center",
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 0.5,
  },
  stTextValue: {
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProTextLight,
  },
  /////

  stInput: {
    margin: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },

  styleContainInput: {
    height: fontsValue(46),
    borderColor: Colors.colorBorder,
  },
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },
});
