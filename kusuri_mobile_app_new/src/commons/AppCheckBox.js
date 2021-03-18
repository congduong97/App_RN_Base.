import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { COLOR_BORDER } from "../const/Color";
export default class AppCheckBox extends Component {
  onChangeData = () => {
    const { onChangeData } = this.props;
    onChangeData && onChangeData();
  };
  render() {
    const { status, size, borderColor, containerStyle } = this.props;
    return (
      <TouchableOpacity
        onPress={this.onChangeData}
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            width: size,
            height: size,
            borderWidth: 1,
            borderColor: borderColor ? borderColor :COLOR_BORDER,
            borderRadius: 2,
            backgroundColor:status?"#06B050":"white"
          },
          containerStyle,
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        {status && (
          <MaterialIcons name="done" size={size - 2} color="white" />
        )}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});
