import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SIZE } from "../../../const/size";
import { COLOR_BORDER } from "../../../const/Color";
import { COLOR_TEXT } from "../util/constant";

export default class RadioButton extends PureComponent {
  render() {
    const {
      sizeBtnRadio,
      value,
      title1,
      title2,
      styleContainer,
      touchBtnRadio,
    } = this.props;
    let size = !!sizeBtnRadio ? sizeBtnRadio : SIZE.width(6);
    return (
      <View style={[{ flexDirection: "row" }, styleContainer]}>
        <TouchableOpacity
          style={styles.viewItem}
          activeOpacity={0.5}
          onPress={() => touchBtnRadio(true)}
        >
          <TouchableOpacity
            style={[
              styles.bntRadio,
              { height: size, width: size, borderRadius: size / 2 },
            ]}
            onPress={() => touchBtnRadio(true)}
          >
            <View
              style={{
                backgroundColor: value ? "#06B050" : "white",
                height: size / 2,
                width: size / 2,
                borderRadius: size / 2,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.textRadio}>{title1}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewItem, { marginLeft: SIZE.width(3) }]}
          activeOpacity={0.5}
          onPress={() => touchBtnRadio(false)}
        >
          <TouchableOpacity
            style={[
              styles.bntRadio,
              { height: size, width: size, borderRadius: size / 2 },
            ]}
            onPress={() => touchBtnRadio(false)}
          >
            <View
              style={{
                backgroundColor: !value ? "#06B050" : "white",
                height: size / 2,
                width: size / 2,
                borderRadius: size / 2,
              }}
            />
          </TouchableOpacity>
          <Text style={styles.textRadio}>{title2}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  viewItem: {
    flexDirection: "row",
    width: SIZE.width(23),
    alignItems: "center",
  },
  bntRadio: {
    borderWidth: 1,
    borderColor: COLOR_BORDER,
    justifyContent: "center",
    alignItems: "center",
  },
  textRadio: {
    fontSize: 14,
    marginLeft: SIZE.width(3),
    color: COLOR_TEXT,
  },
});
