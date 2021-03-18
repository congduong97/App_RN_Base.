import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors, Dimension, Fonts, fontsValue } from "../../../commons";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  styleContent: {
    backgroundColor: "white",
    padding: Dimension.padding2x,
  },
  container: {
    flex: 1,
  },
  styleText: {
    fontSize: 14,
    color: Colors.colorText1,
    fontFamily: "SFProText-Regular",
  },
  stylesIconLeft: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    color: "#9AA6B4",
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
  stylesLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#e6e6e6",
    alignSelf: "center",
  },
  styleContainerTextView: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  styleViewTextView: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  styleContentTextView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    // paddingHorizontal: 12
  },
  styleLabel: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize14,
    color: "black",
    // width: "40%",
  },

  styleValue: {
    fontSize: Dimension.fontSize14,
    fontFamily: Fonts.SFProDisplayRegular,
    color: 'black',
    flex: 1,
    textAlign: "right",
  },

  ///

  stContainBox: {
    height: fontsValue(86),
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "black",
    // elevation: 3,
    justifyContent: "center",
    paddingTop: Dimension.margin2x,
    paddingHorizontal: Dimension.padding2x,
  },
  stInputTime: {
    borderWidth: 0,
    borderBottomColor: Colors.colorBg2,
    borderBottomWidth: 2,
    position: "relative",
  },
  stInputReason: {
    marginTop: 40,
    position: "relative",
    borderColor: Colors.colorBg2,
    borderWidth: 0.75,
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

  stContainContent: {
    minHeight: 150,
    marginVertical: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    backgroundColor: "white",
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "black",
    // elevation: 3,
    paddingTop: Dimension.margin2x,
    paddingHorizontal: Dimension.padding2x,
  },
});
