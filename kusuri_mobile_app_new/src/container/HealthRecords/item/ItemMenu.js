import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { COLOR_GREEN_PRIMARY } from "../util/constant";
import { SIZE } from "../../../const/size";
import AntDesign from "react-native-vector-icons/AntDesign";
export default class ItemMenu extends Component {
  render() {
    const { onPress, item, index, disabled } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: COLOR_GREEN_PRIMARY,
          alignItems: "center",
          flexDirection: "row",
          marginTop: 25,
          justifyContent: "space-between",
          paddingHorizontal: SIZE.width(4),
          marginHorizontal: SIZE.width(5),
          borderRadius: 5,
        }}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              height: SIZE.width(12),
              width: SIZE.width(12),
              backgroundColor: "white",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: SIZE.width(6),
            }}
          >
            <Image
              source={item.icon}
              style={{
                height: SIZE.width(7),
                width: SIZE.width(7),
              }}
              resizeMode={"contain"}
            />
          </View>
          <Text style={{ marginLeft: SIZE.width(4), color: "white",fontSize:18 }}>
            {item.name}
          </Text>
        </View>
        <AntDesign name="right" size={22} color={"white"} />
      </TouchableOpacity>
    );
  }
}
