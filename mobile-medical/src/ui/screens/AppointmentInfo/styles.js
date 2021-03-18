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
    paddingHorizontal: Dimension.margin3x,
    paddingBottom: 20,
  },
  styleIconMenu: {
    marginHorizontal: 5,
    justifyContent: "center",
    // alignItems: "center",
    // width: Dimension.sizeIconHeader,
    // height: Dimension.sizeIconHeader,
    alignContent: "center",
    // backgroundColor: Colors.colorBtBack,
    borderRadius: 10,
  },
  stImageAvatar: {
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    width: Dimension.sizeIconHeader,
    height: Dimension.sizeIconHeader,
    alignContent: "center",
    borderRadius: 10,
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
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  stImageQRCode: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
    marginTop: Dimension.margin2x,
    alignSelf: "center",
  },

  styleTextContent: {
    color: Colors.colorTitleScreen,
    lineHeight: 24,
    fontSize: Dimension.fontSizeHeader,
    marginTop: 5,
    alignSelf: "center",
  },
  stContainRow: {
    marginLeft: Dimension.margin,
    alignItems: "center",
  },
  stContainTextRow: {
    flexDirection: "row",
    paddingVertical: 2,
    // flex: 1,
  },
  stTextTitle: {
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: Colors.textLabel,
    width: 115,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  stTextValue: {
    lineHeight: 24,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin,
    color: 'black',
    flex: 1,
    letterSpacing: 0.5,
  },
  stContainButtonFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
    paddingVertical: Dimension.padding,
    marginBottom: Platform.OS === "ios" ? 30 : 10,
  },
  stButtonSendToMail: {
    backgroundColor: "white",
    alignSelf: "center",
    marginHorizontal: Dimension.margin,
    flex: 1,
  },
  textDotToolbarSelect: {
    backgroundColor: Colors.colorMain,
    width: 6,
    height: 6,
    borderRadius: 3,
    // marginTop: 4
  },
  textToolbar: {
    color: Colors.colorBorder,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  textToolbarSelect: {
    color: Colors.colorMain,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTitleButton: {
    marginTop: 8,
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  styleViewItemResultPatient: {
    backgroundColor: 'white',
    marginBottom: 4,
    // paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  styelBorderContent:{
    marginTop: Dimension.margin,
    marginBottom: 5,
 
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    paddingVertical:22,
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "#000000",
    // elevation: 3,
  },

  stIconSearch: {
    backgroundColor: Colors.colorBtBack,
    height: "100%",
    width: Platform.OS === "ios" ? 56 : 40,
  },

  stInput: {
    margin: Dimension.margin,
    // marginTop: Dimension.margin2x,
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
});
