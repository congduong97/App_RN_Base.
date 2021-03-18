import React, { Component } from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import { InputOtp } from "../item/InputOtp";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { DEVICE_HEIGHT } from "../../../const/System";
import { HeaderIconLeft } from "../../../commons";

export default class EnterOtpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validateSuccess: false,
    };
  }
  addBirthDay = () => {
    const { navigation } = this.props;
    const { state, navigate } = navigation;
    const { prams } = state;
    this.state.validateSuccess = true;
    navigate("EnterBirthDayScreen");
  };
  validateBirthDay = () => {
    const { navigation } = this.props;
    const { state, navigate } = navigation;
    const { prams } = state;
    this.state.validateSuccess = true;

    navigate("EnterValidateBirthDayScreen");
  };
  changePhoneNumber = () => {
    if (!this.state.validateSuccess) {
      this.props.navigation.goBack(null);
      return;
    }
    this.props.navigation.navigate("HOME");
  };

  render() {
    const { navigation } = this.props;
    const { goBack } = navigation;
    return (
      <View style={{ backgroundColor: "#F6F6F6", flex: 1 }}>
        <StatusBar backgroundColor={"#F6F6F6"} barStyle='dark-content' />
        <HeaderIconLeft goBack={goBack} navigation={navigation} />
        <KeyboardAwareScrollView
          // keyboardShouldPersistTaps={"always"}
          extraHeight={100}
          extraScrollHeight={100}
          enableOnAndroid
          style={{ height: DEVICE_HEIGHT }}
        >
          <InputOtp
            newPhoneChangeNumber={""}
            changePhoneNumber={this.changePhoneNumber}
            navigation={this.props.navigation}
            phone={this.props.navigation.state.params?.phoneNumber}
            addBirthDay={this.addBirthDay}
            validateBirthDay={this.validateBirthDay}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
