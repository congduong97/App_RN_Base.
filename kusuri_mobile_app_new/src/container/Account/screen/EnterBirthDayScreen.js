import React, { Component } from "react";
import { View, Text, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { InputBirthDay } from "../item/InputBirthDay";
import { COLOR_WHITE } from "../../../const/Color";
import { HeaderIconLeft } from "../../../commons";

export default class EnterBirthDayScreen extends Component {
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
        <InputBirthDay navigation={this.props.navigation} ></InputBirthDay>
      </ScrollView>
    );
  }
}
