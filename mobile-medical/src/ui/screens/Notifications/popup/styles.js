import { StyleSheet } from "react-native";
import { Dimension, Colors, Fonts } from "../../../../commons";

export default StyleSheet.create({
  stContain: {
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: Dimension.padding2x,
    padding: Dimension.margin2x,
  },
  stTextTitle: {
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSize20,
    textAlign: "center",
    letterSpacing: -0.3,
    fontFamily: Fonts.SFProDisplaySemibold,
  },
  stTextContent: {
    color: Colors.textLabel,
    marginTop: Dimension.margin2x,
    fontSize: Dimension.fontSize16,
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: Dimension.lineHeightPopup,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stFooterButton: {
    marginTop: Dimension.margin2x,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stButtonConfirm: {
    flex: 1,
    marginBottom: Dimension.margin,
    marginHorizontal: Dimension.margin,
  },
  stHtml: {
    fontSize: 16, 
    color: Colors.textLabel,
    marginTop: Dimension.margin2x
  }
});
