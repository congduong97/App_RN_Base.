import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Triangle from "react-native-triangle";

export default class CouponUsed extends Component {
  render() {
    return (
      <>
        <View
          style={{
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "rgba(211,211,211,0.7)",

            left: -5,
            top: 0,
            right: -5,
            bottom: 0
          }}
        >
          <Triangle
            width={60}
            height={60}
            color={"#F71701"}
            direction={"up-left"}
          />
          <View style={styles.usedText}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 11 }}>
              利用済み
            </Text>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  usedText: {
    position: "absolute",
    width: 80,
    height: 80,
    transform: [{ rotate: "-45deg" }, { translateX: 15 }, { translateY: 7 }]
  }
});
