import { StyleSheet } from "react-native";
import {
  Colors,
  Dimension,
  Fonts,
  SCREEN_WIDTH,
  fontsValue,
} from "../../../commons";

export default StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    marginTop: Dimension.margin2x,
    paddingBottom: fontsValue(50),
  },
  stImgae: {
    width: fontsValue(SCREEN_WIDTH - 220),
    height: fontsValue(SCREEN_WIDTH - 220),
    alignSelf: "center",
    marginVertical: fontsValue(12),
  },
  styleTextView: {
    color: 'black',
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stylesText: {
    // marginHorizontal: fontsValue(20),
    marginTop: fontsValue(16),
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    // paddingHorizontal: fontsValue(24),
    textAlign: "center",
    letterSpacing: fontsValue(0.4),
    lineHeight: fontsValue(20),
  },
  stylesText1: {
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },

  stButtonSelectbox: {
    marginHorizontal: 12,
    marginTop: 16,
    // height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
    zIndex: 1,
    flex: 1
  },

  stContainButton: {
    flex: 1,
    marginBottom: 8,
  },
  stTitleButton: {
    marginTop: 8,
    color: Colors.textLabel,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stValueButton: {
    marginTop: 8,
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
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
  },
  stInputTime: {
    // flex: 1,
    marginTop: fontsValue(40),
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
    position: "relative",
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
  textDotToolbarSelect: {
    backgroundColor: Colors.colorMain,
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4
  },
  styleViewItemResultPatient: {
    backgroundColor: 'white',
    marginBottom: 12,
    paddingHorizontal: 12,
    marginHorizontal:16,
    marginVertical:15,
    // elevation: 3,
    borderRadius: 12,
    // borderWidth: 0.5,
    // borderColor: Colors.colorBorder,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containsInputView: {
    marginHorizontal: Dimension.margin,
    marginVertical: Dimension.margin,
  },
  styleTextInput: {
    color: "black",
  },
  styleInput: {
    borderWidth: 0,
  },
  styleViewLabel: {
    backgroundColor: "white",
    paddingHorizontal: 3,
  },
  stylesLine: {
    height: 1,
    backgroundColor: "#e6e6e6",
    alignSelf: 'stretch',
  },
  autocompleteContainer: {
    backgroundColor: '#ffffff',
    
  },
  inputContainerStyle: {
    borderWidth: 0,
  },
  viewSelectItemCodePatient: {
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#e6e6e6',
    flexDirection: 'row',
    paddingHorizontal: 12
  },
  itemText: {
    fontSize: 15,
  },

  styleHeader: {
    height: Platform.OS === "ios" ? 200 : 180,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    elevation: 3,
    shadowOpacity: 5,
    justifyContent: "flex-start",
  },
  styleViewSearch: {
    // flexDirection: "row",
    // backgroundColor: "#f2f2f2",
    // borderRadius: 12,
    alignItems: "center",

  },
  itemTableResult: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  itemTableResultTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  styleTextInputElement: {
    flexDirection: 'row',
    borderColor: Colors.colorBorder,
    // borderColor: configs.colorBorder,
    borderWidth: 0.5,
    borderRadius: 12,
    alignItems: 'center',
  },
  stContentEmpty: { justifyContent: "center" },
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
