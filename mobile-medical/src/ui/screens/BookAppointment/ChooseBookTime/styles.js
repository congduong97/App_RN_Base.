import { StyleSheet, Platform, Dimensions } from "react-native";
import {
  Colors,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  Dimension,
  Fonts,
} from "../../../../commons";
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  styleText: {
    fontSize: 14,
    color: Colors.colorText1,
    fontFamily: "SFProText-Regular",
  },

  styleViewContentHeath: {
    borderRadius: 12,
    backgroundColor: "white",
    margin: 16,
    flexDirection: "row",
    padding:Dimension.margin
    // maxHeight: 120,
    // shadowOpacity: 0.25,
    // shadowRadius: 5,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowColor: "black",
    // elevation: 3,
  },
  stHeathLogo: {
    width: 90,
    height: 90,
    borderRadius: 12,
    // margin: Platform.OS === 'ios' ? 20 : 12,
  },

  stContainHeathName: {
    justifyContent: "flex-start",
    marginLeft: 8,
    flex: 1,
    height: "100%",
    paddingVertical: 16,
  },
  stTextHeathName: {
    fontSize: 16,
    color: "black",
    fontWeight: "900",
  },
  stTextHeathAddress: {
    color: "#747F9E",
    fontSize: 12,
    marginTop: 8,
    paddingRight: 8,
  },
  stylesButton: {
    paddingVertical: 12,
    backgroundColor: Colors.colorMain,
    borderRadius: 12,
    marginTop: 24,
    marginHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  ///
  stContainCalendar: {
    paddingHorizontal: 12,
    elevation: 0,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.colorBg2,
  },
  stContainDesCalendar: {
    marginTop: Dimension.margin,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  stContainTextDes: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  stDotDis: {
    height: 12,
    width: 12,
    borderRadius: 12,
    marginRight: 4,
  },
  stTextDes: {
    fontSize: Dimension.fontSize10,
    color: Colors.colorTextDes,
  },
  ///\
  stTextSessionDay: {
    flex: 1,
    color: Colors.colorTextMenu,
    fontSize: Dimension.fontSizeHeaderPopup,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stTextOption: {
    color: Colors.colorMain,
    fontSize: Dimension.fontSize12,
    fontFamily: Fonts.SFProDisplayRegular,
  },
  stHeaderSession: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 12,
  },
  stContainTextName: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    height: 18,
  },
  stTextName: {
    fontSize: Dimension.fontSize12,
    color: "#747F9E",
    fontFamily: Fonts.SFProDisplayRegular,
  },

  stTextValue: {
    fontSize: Dimension.fontSize12,
    color: "#747F9E",
    fontFamily: Fonts.SFProDisplayRegular,
    marginLeft: 2,
  },
  stylesIconLeft: {
    // width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    color: "#9AA6B4",
  },
});
