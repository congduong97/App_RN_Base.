import { StyleSheet } from "react-native";
import { Colors, Dimension, Fonts, SCREEN_WIDTH } from "../../../commons";

export default StyleSheet.create({
  styleText: {
    fontSize: 14,
    color: Colors.colorText1,
    fontFamily: "SFProText-Regular",
  },
  stImageEmpty: {
    marginTop: 60,
    width: "60%",
    height: SCREEN_WIDTH * 0.6,
    alignSelf: "center",
  },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextenu,
    letterSpacing: 0.5,
    lineHeight: 27,
    marginTop: Dimension.margin,
  },
  stTextContentEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.textLabel,
    letterSpacing: 0.5,
    paddingHorizontal: 12
  },
  styleViewItemList: {
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 12,
    elevation: 3,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.colorBorder,
  },
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
  stylesLine: {
    height: 1,
    width: "95%",
    backgroundColor: "#e6e6e6",
    alignSelf: "center",
  },
  styleTextInput: {
    color: "black",
  },
  styleInput: {
    borderWidth: 0,
  },
  containsInputView: {
    marginHorizontal: Dimension.margin,
    marginVertical: Dimension.margin,
  },
});
