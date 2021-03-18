import React, { Component } from "react";
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { APP_COLOR, COLOR_WHITE } from "../../../const/Color";
import { isIOS, DEVICE_WIDTH, APP } from "../../../const/System";
import { AppImage } from "../../../component/AppImage";
const withHeader = isIOS ? 64 - 17 : 56 - 8.5;

export class HeaderClose extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { onPressClose, disableClose } = this.props;
    return (
      <SafeAreaView style={{ backgroundColor: COLOR_WHITE }}>
        <View style={styles.wrapperHeader}>
          {disableClose ? null : (
            <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                left: 0,
              }}
              onPress={() => onPressClose()}
            >
              <Icon name='md-close' size={25} color={APP_COLOR.COLOR_TEXT} />
            </TouchableOpacity>
          )}

          <AppImage
            style={{
              width: withHeader * (109 / 27),
              height: withHeader,
            }}
            url={APP.IMAGE_LOGO}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  wrapperHeader: {
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    backgroundColor: COLOR_WHITE,
    alignItems: "center",
    justifyContent: "center",
  },
});
