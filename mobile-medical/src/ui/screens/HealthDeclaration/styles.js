import { Platform, StyleSheet } from "react-native";
import {
  Dimension,
  Colors,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";

export default StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: 20,
  },
  stylesText: {
    marginTop: Dimension.margin2x,
    color: Colors.colorCancel,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    textAlign: "center",
    lineHeight: fontsValue(20),
    letterSpacing: fontsValue(0.5),
  },
  stylesTextContent: {
    marginTop: Dimension.margin2x,
    color: Colors.textLabel,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    lineHeight: fontsValue(20),
    letterSpacing: fontsValue(0.5),
  },
  textDisable: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
    marginHorizontal: Dimension.margin5,
  },

  stInput: {
    borderColor: Colors.colorBg2,
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
  },
  stInputTime: {
    // flex: 1,
    marginTop: Dimension.fontSize24,
    borderWidth: 0,
    position: "relative",
  },

  stInputContent: {
    marginTop: 40,
    position: "relative",
    borderColor: Colors.colorBg2,
    borderWidth: 0.75,
  },
  stContainCheckbox: {
    justifyContent: "center"
  },
  stValueButton: {
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSize14,
    paddingLeft: 3
  },
  stRowSelectbox: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  stTitleButton: {
    flex: 1,
    marginRight: Dimension.margin2x,
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    justifyContent: "center",
    alignSelf: "center"
  },
  stContentEmpty: { justifyContent: "center" },
  stImageEmpty: {
    marginTop: -56,
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    alignSelf: "center",
  },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginBottom: Dimension.margin,
    marginTop: -18,
  },
  stTextContentEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.textLabel,
    letterSpacing: 0.5,
    lineHeight: 24,
  },


  stIconSearch: {
    // backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },

  stInput1: {
    margin: Dimension.margin,
    // marginTop: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  styleContainInput: {
    height: fontsValue(46),
    borderColor: Colors.colorBorder,
  },
});
