import React from "react";
import { Image, Text } from "react-native";
import { ImagesUrl } from "../../../commons";
import { ScreensView } from "../../../components";
import styles from "./styles";

export default function AboutScreen(props) {
  return (
    <ScreensView titleScreen={"Thông tin phiên bản"} styleContent={styles.styleContent}>
      <Image source={ImagesUrl.logoBKAV} style={styles.stImage} />
      <Text style={{ ...styles.styleTextContent, alignSelf: "center" }}>
        {"App ĐL-BKAV-YEN BAI"}
      </Text>
      <Text
        style={{
          ...styles.styleTextContent,
          alignSelf: "center",
          marginTop: 8,
        }}
      >
        {"version 1.0"}
      </Text>
    </ScreensView>
  );
}
