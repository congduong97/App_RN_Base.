import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLOR_GRAY, COLOR_YELLOW, APP_COLOR } from "../../../const/Color";
import { STRING } from "../../../const/String";
import { versionApp } from "../../../const/System";
export const ItemApp = () => (
  <View
    style={[styles.wrappperContaner, { borderColor: APP_COLOR.COLOR_TEXT }]}
  >
    <View style={styles.top}>
      <Image
        style={styles.image}
        resizeMode={"contain"}
        source={require("../images/playstore-icon.png")}
      />
      <View style={styles.wrappperTextTop}>
        <Text>{"クスリのアオキ 公式アプリ"}</Text>
        <Text>{`${STRING.version} ${versionApp}`}</Text>
      </View>
    </View>
    <Text style={styles.textBottom}>
      {"このアプリはクスリのアオキ公式アプリです。"}
    </Text>
  </View>
);
const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
  wrappperContaner: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: COLOR_YELLOW,
  },
  wrappperTextTop: {
    paddingLeft: 16,
    flexDirection: "column",
    justifyContent: "center",
    height: 50,
  },
  top: {
    flexDirection: "row",
  },
  textBottom: {
    fontSize: 14,
    color: COLOR_GRAY,
    marginTop: 5,
  },
});
