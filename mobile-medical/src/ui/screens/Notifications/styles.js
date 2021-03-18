import { StyleSheet } from "react-native";
import {
  Dimension,
  Colors,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";

export default StyleSheet.create({
  styleContent: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingBottom: Dimension.margin2x,
  },
  lineSeparator: {
    height: Dimension.margin2x,
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
    letterSpacing: fontsValue(0.5),
    lineHeight: fontsValue(24),
  },
  stList: {
    marginTop: Dimension.margin2x,
    //  marginBottom: fontsValue(100),
  }
});
