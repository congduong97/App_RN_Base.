import React, { Component } from "react";
import { View } from "react-native";
import { SIZE } from "../../../const/size";

export default class ScanningCameraArea extends Component {
  render() {
    return (
      <View
        style={{
          height: SIZE.height(41),
          width: SIZE.width(100),
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View
          style={{
            height: SIZE.height(41),
            width: SIZE.width(10),
            backgroundColor: "rgba(52, 52, 52, 0.8)",
          }}
        />
        {/* Vùng camera bo 4 góc */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              height: SIZE.height(4.2),
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Góc bo  1 */}
            <View
              style={{
                height: SIZE.height(4.2),
                width: SIZE.height(4.2),
                borderTopWidth: 5,
                borderTopColor: "#FF0000",
                borderLeftWidth: 5,
                borderLeftColor: "#FF0000",
              }}
            />
            {/* Góc bo  2 */}
            <View
              style={{
                height: SIZE.height(4.2),
                width: SIZE.height(4.2),
                borderTopWidth: 5,
                borderTopColor: "#FF0000",
                borderRightWidth: 5,
                borderRightColor: "#FF0000",
              }}
            />
          </View>
          <View style={{ flex: 1 }} />
          <View
            style={{
              height: SIZE.height(4.2),
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* Bo góc  3 */}
            <View
              style={{
                height: SIZE.height(4.2),
                width: SIZE.height(4.2),
                borderBottomWidth: 5,
                borderLeftWidth: 5,
                borderLeftColor: "#FF0000",
                borderBottomColor: "#FF0000",
              }}
            />
            {/* Bo góc 4 */}
            <View
              style={{
                height: SIZE.height(4.2),
                width: SIZE.height(4.2),
                borderBottomWidth: 5,
                borderRightWidth: 5,
                borderRightColor: "#FF0000",
                borderBottomColor: "#FF0000",
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: SIZE.height(41),
            width: SIZE.width(10),
            backgroundColor: "rgba(52, 52, 52, 0.8)",
          }}
        />
      </View>
    );
  }
}
