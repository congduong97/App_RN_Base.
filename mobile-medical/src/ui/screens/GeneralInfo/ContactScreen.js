import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AppNavigate from "../../../navigations/AppNavigate";
import { Colors, Dimension, ImagesUrl } from "../../../commons";
import { ScreensView, ButtonView, TextView } from "../../../components";
import styles from "./styles";

export default function ContactScreen(props) {
  return (
    <ScreensView titleScreen={"Liên hệ"} styleContent={styles.styleContent}>
      <Image source={ImagesUrl.logoBKAV} style={styles.stImage} />
      <TextView
        style={{
          ...styles.stContainMenuRow,
          marginTop: Dimension.margin2x,
          borderBottomWidth: 0,
          paddingLeft: 0
        }}
        styleValue={{...styles.stTextMenu, color: Colors.textLabel}}
        value={"Phường Đồng Tâm - Thành phố Yên Bái"}
        nameIconLeft={"ic-pin"}
        colorIconLeft={Colors.textLabel}
        sizeIconLeft={24}
      />
      <TextView
        style={{ ...styles.stContainMenuRow, borderBottomWidth: 0, paddingLeft: 0 }}
        styleValue={{...styles.stTextMenu, color: Colors.textLabel}}
        value={"facebook/benhviendakhoayenbai"}
        nameIconLeft={"ic-facebook"}
        colorIconLeft={Colors.textLabel}
        sizeIconLeft={24}
      />
      <TextView
        style={{ ...styles.stContainMenuRow, borderBottomWidth: 0, paddingLeft: 0 }}
        styleValue={{...styles.stTextMenu, color: Colors.textLabel}}
        value={"0243.368.156"}
        nameIconLeft={"phone-call"}
        colorIconLeft={Colors.colorText}
        sizeIconLeft={24}
      />
    </ScreensView>
  );
}
