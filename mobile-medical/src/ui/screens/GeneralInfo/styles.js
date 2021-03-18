import { StyleSheet } from "react-native";
import { fromPairs } from "lodash";
import { Dimension, Colors, Fonts, SCREEN_WIDTH } from "../../../commons";

export default StyleSheet.create({
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
    backgroundColor: "white",
    paddingHorizontal: Dimension.padding2x

  },


  stContainMenuRow: {
    // minHeight: Dimension.heightButton,

    paddingVertical: 8,
    alignItems: "center",
    paddingLeft: Dimension.margin3x,
    fontSize: Dimension.fontSize16
  },
  stTextMenu: {
    fontSize: Dimension.fontSize16,
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: Dimension.margin
  },
  ///
  styleTextContent: {
    marginTop: 32,
    color: Colors.textLabel,
    lineHeight: 24,
    fontSize: Dimension.fontSizeButton16,
  },
  stImage: {
    alignSelf: "center",
  },
  stContain: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: Dimension.radiusButton,
    // paddingBottom: Dimension.padding2x,
    // paddingTop: Dimension.padding,
    flexDirection: "column",
    paddingVertical: 20,
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "center",
    // shadowOpacity: 0.25,
    // shadowRadius: 16,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: "#000000",
    // elevation: 4,
    overflow: "visible"
  },

  stButtonConfirm: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: Dimension.margin,
    height: 44,
    fontSize: 16
  },
  stTextTitleConfirm: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize20,
    color: Colors.colorTextMenu,
    alignSelf: "center",
    marginTop: Dimension.margin2x,
  },
  stTextConfirm: {
    fontFamily: Fonts.SFProDisplayRegular,
    fontSize: Dimension.fontSize16,
    color: Colors.textLabel,
    alignSelf: "center",
    marginTop: Dimension.margin2x,
    paddingHorizontal: 20
  },
  stConfirmFooter: {
    marginTop: 57,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16
  },
});
