//Library:
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

//Component:
import { SIZE } from "../../../const/size";
import NavigationService from "../../../service/NavigationService";
import {
  COLOR_TEXT,
  COLOR_GREEN_PRIMARY,
  EVENT_CHANGE_CURRENT_USER,
} from "../util/constant";
import { UserService } from "../util/UserService";

export default class UserHeaderSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: UserService.getListUser().currentUser,
    };
  }
  componentDidMount() {
    const { routeName } = this.props.navigation.state;
    UserService.onChange(
      `CHANGE_CURRENT_USER_${routeName}`,
      (listUser, event) => {
        if (event == EVENT_CHANGE_CURRENT_USER) {
          console.log(`listUser CHANGE_CURRENT_USER_${routeName}`, listUser);
          this.setState({
            currentUser: listUser.currentUser,
          });
        }
      }
    );
  }
  componentWillUnmount() {
    const { routeName } = this.props.navigation.state;
    UserService.remove(`CHANGE_CURRENT_USER_${routeName}`);
  }
  render() {
    const { currentUser } = this.state;
    return (
      // <View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: SIZE.width(4),
          paddingVertical: 10,
          backgroundColor: "white",
          alignItems: "center",
          borderBottomColor: "red",
          borderBottomWidth: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            paddingRight: SIZE.width(9),
            alignItems: "center",
          }}
        >
          <Image
            style={{
              height: SIZE.width(12.8),
              width: SIZE.width(12.8),
            }}
            source={require("../../../images/icon_user.png")}
            resizeMode={"contain"}
          />
          <View
            style={{
              flexDirection: "row",
              // alignItems: "baseline",
              flex: 1,
              marginLeft: SIZE.width(2),
            }}
          >
            <Text
              style={{
                fontSize: SIZE.H16,
                color: COLOR_TEXT,
                // flex:1
              }}
              numberOfLines={1}
            >
              {!!currentUser && !!currentUser.firstName
                ? currentUser.firstName
                : ""}{" "}
              {!!currentUser && !!currentUser.lastName
                ? currentUser.lastName
                : ""}
              {!!currentUser && !!currentUser.id ? "" : "データなし"}
            </Text>
            <Text
              style={{
                fontSize: SIZE.H12,
                marginLeft: 4,
                color: COLOR_TEXT,
                marginTop: 5,
              }}
            >
              {!!currentUser && !!currentUser.id ? "さん" : ""}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            width: SIZE.width(24),
            height: 40,
            backgroundColor: COLOR_GREEN_PRIMARY,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 3,
          }}
          onPress={() => {
            NavigationService.navigate("LIST_USER_OF_MEMBER");
          }}
        >
          <Text style={{ fontSize: SIZE.H12, color: "white" }}>
            ユ ー ザ ー
          </Text>
          <Text style={{ fontSize: SIZE.H12, color: "white" }}>
            登録 ・ 切 替
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
