import { StyleSheet } from "react-native";
import { Colors } from "../../commons";

export default StyleSheet.create({
  viewContainer: {
    alignSelf: "stretch",
    height: 45,
    // backgroundColor: "#345",
    flex: 1
  },
  stContainModal: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderBottomColor: "#345",
  },
  viewContainerButton: {
    flex: 1,
    flexDirection:'row',
    justifyContent: "space-between",
    alignItems:'center',
    height: 45,
    fontWeight: "700",
    width: '100%',
  },
  stTextButtonSelected: {
    alignContent: "center",
    fontSize: 16,
    alignItems: "center",
    marginHorizontal: 5,
  },
  stHeaderPicker: {
    position: "absolute",
    top: 0,
    flexDirection: "row",
    alignSelf: "stretch",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundSearch,
    paddingHorizontal: 12,
  },
  styContainPickerIOS: {
    height: 500,
    width: "100%",
    justifyContent: "center",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    // backgroundColor: '#345',
  },

  stTextActionHeader: {
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 16,
    color: Colors.Indigo,
    fontWeight: "700",
    paddingVertical: 15,
  },
});
