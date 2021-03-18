//Library:
import React, { Component } from "react";
import { View, StatusBar } from "react-native";

//Setup:
import { APP_COLOR, COLOR_GRAY_LIGHT } from "../../../const/Color";

//Component:
import { HeaderIconLeft } from "../../../commons";
import InputUserInfoBasic from "../item/InputUserInfoBasic";
export default class ChangeBasicUserInfo extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View
        style={{
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          flex: 1,
        }}
      >
        <StatusBar
          backgroundColor={APP_COLOR.BACKGROUND_COLOR}
          barStyle='dark-content'
        />
        <HeaderIconLeft goBack={goBack} />
        <View style={{ backgroundColor: COLOR_GRAY_LIGHT, flex: 1 }}>
          <InputUserInfoBasic
            onPressChange={true}
            navigation={this.props.navigation}
          />
        </View>
      </View>
    );
  }
}
