import React, { Component } from "react";

import { StyleSheet, Text, View, Alert } from "react-native";
import QRCodeScanner from "../../../liberyCustom/react-native-qrcode-scanner";
import { COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { DEVICE_HEIGHT, DEVICE_WIDTH } from "../../../const/System";
import { ButtonTypeTwo, HeaderIconLeft } from "../../../commons";
import { HeaderClose } from "../item/HeaderClose";
import { STRING } from "../util/string";

export default class ScanScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {}

  componentWillUnmount() {}

  onSuccess = async (e) => {
    // alert('ok');
    if (e && e.data && e.data.length === 16) {
      this.props.navigation.replace("EnterPasswordScreen", {
        memberCode: e.data,
      });
    } else {
      Alert.alert(STRING.text_barcode_invalid);
      this.props.navigation.goBack(null);
    }
  };

  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
        <HeaderClose onPressClose={() => goBack(null)} />
        <QRCodeScanner
          cameraStyle={{ height: DEVICE_HEIGHT, width: DEVICE_WIDTH }}
          ref={(node) => {
            this.scanner = node;
          }}
          checkAndroid6Permissions
          style={{ backgroundColor: COLOR_WHITE }}
          onRead={(e) => this.onSuccess(e)}
          reactivate
          fadeIn
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLOR_WHITE,
            padding: 16,
          }}
        >
          <Text style={{ color: APP_COLOR.COLOR_TEXT }}>
            {" 会員バーコードを読み取ってください。"}
          </Text>
          <ButtonTypeTwo
            name={"番号を直接入力する"}
            onPress={() => {
              this.props.navigation.navigate("EnterMemberCodeScreen");
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
