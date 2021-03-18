import React, { Component } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { COLOR_WHITE } from "../../../const/Color";
import { InputBirthDay } from "../item/InputBirthDay";
import { HeaderIconLeft } from "../../../commons";

export default class EnterValidateBirthDayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <StatusBar backgroundColor={"#F6F6F6"} barStyle="dark-content" />
        <HeaderIconLeft goBack={goBack} navigation={navigation} />
        <SafeAreaView />
        <InputBirthDay vadiateBirthDay navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}
