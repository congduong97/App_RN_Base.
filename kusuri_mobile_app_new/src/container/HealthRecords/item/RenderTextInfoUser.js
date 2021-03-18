import React from "react";
import { View, Text } from "react-native";
import { SIZE } from "../../../const/size";
import { COLOR_TEXT } from "../util/constant";
const renderTextInfoUser = (key, param) => {
  const setMinHeightText = SIZE.height(4.8);
  if (key || param) {
    return (
      <View
        style={{
          minHeight: setMinHeightText,
          width: SIZE.width(90),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: SIZE.H5, fontWeight: "bold" ,color:COLOR_TEXT}}>{key}</Text>
        <View
          style={{
            minHeight: setMinHeightText,
            width: SIZE.width(58),
            marginRight: SIZE.width(4),
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: SIZE.H5, fontWeight: "400" ,color:COLOR_TEXT}}>{param}</Text>
        </View>
      </View>
    );
  }
  if (!key && param) {
    return (
      <View
        style={{
          minHeight: setMinHeightText,
          width: SIZE.width(90),
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: SIZE.H5, fontWeight: "bold" }} />
        <View
          style={{
            minHeight: setMinHeightText,
            width: SIZE.width(58),
            marginRight: SIZE.width(4),
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: SIZE.H5, fontWeight: "400" }}>{param}</Text>
        </View>
      </View>
    );
  }

  if (!key && !param) {
    return null;
  }
};

export { renderTextInfoUser };
