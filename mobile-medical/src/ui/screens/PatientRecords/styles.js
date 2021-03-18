import { StyleSheet, Dimensions } from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";

export default StyleSheet.create({
  styleContent: {
    flex: 1,
    backgroundColor: "white",
  //  marginTop: Dimension.margin,
  },
  containsInputView: {
    marginHorizontal: Dimension.margin,
    marginVertical: Dimension.margin,
  },
  styleIconMenu: {
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },

  styleViewLabel: {
    backgroundColor: "white",
    paddingHorizontal: 3,
  },
  styleTextInput: {
    color: "black",
  },
  styleInput: {
    borderWidth: 0,
  },
  styleHead: {
    backgroundColor: Colors.colorMain,
    height: "40%",
    width: "100%",
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
    position: "absolute",
    top: 0,
    left: 0,
  },

  styleViewAvatar: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
  },
  styleAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  styleIconCameara: {
    position: "absolute",
    bottom: -4,
    right: -4,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 18,
    elevation: 3,
    shadowColor: "gray",
  },
  stButtonSelectbox: {
    marginHorizontal: 10,
    marginTop: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  stContainButton: {
    flex: 1,
    marginBottom: 8,
  },
  stTitleButton: {
    marginTop: 8,
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stValueButton: {
    marginTop: 8,
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
  },
  stylesLine: {
    height: 1,
    width: "95%",
    backgroundColor: "#e6e6e6",
    alignSelf: "center",
  },
  styleButton: {
    backgroundColor: "#00C6AD",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 12,
    borderRadius: 12,
  },
  stylesTextView: {
    marginTop: 24,
  },
  styleViewSearch: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginTop: 12,
  },
  lineSeparator: {
    height: 16,
  },

  stContentEmpty: { justifyContent: "center" },
  stImageEmpty: {
    marginTop: 60,
    marginLeft: fontsValue(60),
  //  width: "60%",
    height: SCREEN_WIDTH * 0.6,
    alignSelf: "center",
  },
  stTextTitleEmpty: {
    textAlign: "center",
    fontSize: Dimension.fontSize18,
    fontFamily: Fonts.SFProDisplaySemibold,
    color: Colors.colorTextMenu,
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
  },
});
