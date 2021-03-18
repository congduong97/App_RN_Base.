import React, { Component } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { InputPhoneNummber } from "../item/InputPhoneNummber";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DEVICE_HEIGHT } from "../../../const/System";
import { COLOR_WHITE } from "../../../const/Color";
import { HeaderIconLeft } from "../../../commons";

export default class EnterPhoneScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  submitPhoneNumber = (phoneNumber) => {
    const { navigation } = this.props;
    const { state, navigate } = navigation;

    navigate("EnterOtpScreen", { phoneNumber });
  };
  changePhoneNumber = () => {
    const { navigation } = this.props;
    const { state, goBack } = navigation;
    const { prams } = state;
    goBack(null);
  };

  render() {
    const { navigation } = this.props;
        const { goBack } = navigation;
    return (
      <View style={{ flex: 1, backgroundColor: "#F6F6F6" }}>
        <StatusBar backgroundColor={"#F6F6F6"} barStyle="dark-content" />
        <HeaderIconLeft goBack={goBack} navigation={navigation} />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={"always"}
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          style={{ height: DEVICE_HEIGHT }}
        >
          <InputPhoneNummber
            changePhoneNumber={this.changePhoneNumber}
            submitPhoneNumber={this.submitPhoneNumber}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
