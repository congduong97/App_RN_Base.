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
    paddingHorizontal: Dimension.padding,
    paddingBottom: fontsValue(20),
  },
  lineSeparator: {
    height: Dimension.margin2x,
  },
  ////

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
  /////

  stInput: {
    marginVertical: 24,
    marginHorizontal: Dimension.margin,
    // backgroundColor: "#3456",
    borderRadius: Dimension.radiusButton,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.colorBg2,
  },

  styleContainInput: {
    height: fontsValue(46),
    borderRadius:fontsValue(16),
    backgroundColor:'#F8F8F8',
    borderColor:'white',
  },
  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },

  ///
  styleViewSearch: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 12,
  },
  styleViewItem: {
    flexDirection: 'row',
    padding: 12,
    elevation: 3,
    marginBottom: 12,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: Colors.colorBg2,
    borderRadius: 12,
    marginHorizontal: 4
  },
  styleText: {
    fontSize: 14,
    color: Colors.colorText1,
    fontFamily: "SFProText-Regular",
  },
  stTitleButton: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextLocation: {
    marginTop: 8,
    backgroundColor: Colors.colorBtBack,
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8
  },
  styleIconMenu: {
    position: "absolute",
    right: 16,
    top: -8,
    // marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    // width: Dimension.sizeIconHeader,
    // height: Dimension.sizeIconHeader,
    alignContent: "center",
    // backgroundColor: Colors.colorBtBack,
    // borderRadius: 10,
  },

});
