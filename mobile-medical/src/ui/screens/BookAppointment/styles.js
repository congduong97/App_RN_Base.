import { Platform, StyleSheet } from "react-native";
import { Dimension, Colors, Fonts, SCREEN_WIDTH } from "../../../commons";

export default StyleSheet.create({
  containsInputView: {
    marginHorizontal: Dimension.margin,
    marginVertical: Dimension.margin,
  },

  styleViewLabel: {
    backgroundColor: "white",
    paddingHorizontal: 3,
  },
  stylesLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#e6e6e6",
    alignSelf: "center",
  },
  stylesIconLeft: {
    marginRight: 8,
  },
  styleButton: {
    backgroundColor: "#00C6AD",
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 12,
    borderRadius: 12,
  },
  styleLinearGra: {
    height: "25%",
    width: "100%",
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    position: "absolute",
    top: 0,
    left: 0,
  },
  styleContent: {
    // flex:1,s
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x,
    paddingTop: Platform.OS === "ios" ? 50 : 12,
    paddingBottom: Platform.OS === "ios" ? 80 : 40,
    // elevation: 5,
    // shadowOpacity: 1,
  },

  styleHeader: {
    height: Platform.OS === "ios" ? 200 : 180,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    elevation: 3,
    shadowOpacity: 5,
    justifyContent: "flex-start",
    
  },

  styleToolbar: {
    // paddingHorizontal: 16,
  },
  ////
  stRowSelectbox: {
    flexDirection: "row",
    marginHorizontal: Dimension.margin,
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
    flex: 1,
    marginRight: Dimension.margin2x,
    color: Colors.colorText,
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    justifyContent: "center",
    alignSelf: "center",
  },
  stValueButton: {
    color: Colors.colorText,
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplaySemibold,
  },
  stInputTime: {
    flex: 1,
    marginTop: 40,
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 1,
    position: "relative",
  },
  stInputReason: {
    marginTop: 40,
    position: "relative",
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 0.75,
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
  stContainCheckbox: {
    marginLeft: Dimension.margin5,
    justifyContent: "center",
  },

  stButtonSend: {
    marginTop: 30,
    // marginBottom: 70,
  },

  autocompleteContainer: {
    backgroundColor: '#ffffff',
  },
  inputContainerStyle: {
    borderWidth: 0,
  },
  styleTextMaLanKham: {
    marginTop: 8,
    color: Colors.colorTitleScreen,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stButtonSelectbox: {
    marginHorizontal: 12,
    marginTop: 16,
    // height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  viewSelectItemCodePatient: {
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#e6e6e6',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  stTextValue:{
    fontSize:Dimension.fontSize14,
    fontFamily:Fonts.SFProDisplayRegular
  }
});
