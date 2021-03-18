import { StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "../../../commons";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  styleText: {
    fontSize: 14,
    color: Colors.colorText1,
    fontFamily: "SFProText-Regular",
  },
});
