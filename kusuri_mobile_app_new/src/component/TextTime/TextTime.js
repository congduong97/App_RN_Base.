import React, { PureComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { styleInApp } from "../../const/System";
const styles = StyleSheet.create({
  itemRightBottom: {
    flexDirection: "row",
    alignItems: "center",
    height: 20,
  },
});

export class TextTime extends PureComponent {
  render() {
    const { time } = this.props;
    return (
      <View style={styles.itemRightBottom}>
        <Text style={styleInApp.textTime}>{time}</Text>
      </View>
    );
  }
}
