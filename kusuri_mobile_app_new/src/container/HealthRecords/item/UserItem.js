import React, { Component } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import {
  APP_COLOR,
  COLOR_GRAY_LIGHT,
  COLOR_BORDER,
} from "../../../const/Color";
import Icon from "react-native-vector-icons/AntDesign";
import { Loading } from "../../../commons";
import { SIZE } from "../../../const/size";
import { COLOR_TEXT } from "../util/constant";
export default class UserItem extends Component {
  onPressUser = () => {
    !!this.props.onPress && this.props.onPress();
  };
  activeUser = () => {
    const { item, onPressActiveUser } = this.props;
    !!onPressActiveUser && onPressActiveUser(item.id);
  };
  render() {
    const {
      item,
      typeUserItem,
      loadingActiveUser,
      styleContainer,
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: "white",
            paddingHorizontal: 15,
            paddingVertical: 15,
            flexDirection: "row",
            // justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 0.5,
            borderColor: COLOR_BORDER,
          },
          styleContainer,
        ]}
        activeOpacity={typeUserItem && typeUserItem == "current" ? 0.5 : 1}
        onPress={this.onPressUser}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            paddingRight: 15,
          }}
        >
          <Image
            style={{
              height: 40,
              width: 40,
            }}
            source={require("../../../images/icon_user.png")}
            resizeMode={"contain"}
          />
          <View
            style={{
              flexDirection: "row",
              // alignItems: "baseline",
              marginLeft: 15,
              // backgroundColor: "red",
            }}
          >
            <Text
              style={{
                fontSize: SIZE.H16,
                color: COLOR_TEXT,
              }}
              numberOfLines={1}
            >
              {item.firstName} {item.lastName}
            </Text>
            <Text
              style={{
                fontSize: SIZE.H12,
                marginLeft: 4,
                color: COLOR_TEXT,
                marginTop: 5,
              }}
            >
              さん
            </Text>
          </View>
        </View>
        {typeUserItem && typeUserItem == "current" ? (
          <Icon
            name="right"
            size={18}
            color={"#06B050"}
            style={{ marginLeft: SIZE.width(4) }}
          />
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#06B050",
              borderRadius: 3,
              width: SIZE.width(24),
              height: 36,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: SIZE.width(5),
            }}
            disabled={loadingActiveUser || item.currentUser}
            onPress={this.activeUser}
            activeOpacity={loadingActiveUser || item.currentUser ? 1 : 0.5}
          >
            <Text
              style={{
                color: "white",
                fontSize: 14,
              }}
            >
              {item.currentUser ? "選択済み" : "選択"}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }
}
