import React, { PureComponent } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Text, BackHandler, SafeAreaView } from "react-native";

import {
  getHeightInCurrentDevice,
  getWidthInCurrentDevice,
  styleInApp, isIOS, SYSTEAM_VERSION, APP, DEVICE_WIDTH
} from "../../../const/System";
import { COLOR_WHITE, COLOR_GRAY_LIGHT } from "../../../const/Color";
import { chooseStoreService } from "../util/service";
import { AppImage } from '../../../component/AppImage'
import { setReloadPrescriptionScreen } from '../../../service/ReloadPrescriptionScreen'

export default class SuccessNotification extends PureComponent {

  backAction = () => {
    return true;
  }

  navigatePrescriptionScreen = () => {
    chooseStoreService.refresh()
    setReloadPrescriptionScreen(true)
    this.props.navigation.navigate("PRESCRIPTION");
  }

  render() {

    return (
      <SafeAreaView>
      <View>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <View style={styles.wrapperHeader}>
          <AppImage
            style={styles.imageLogo}
            url={APP.IMAGE_LOGO}
            resizeMode={"contain"}
          />
        </View>
        <Text style={[styles.title, styleInApp.hkgpronw6_16]}>送信完了</Text>
        <View style={styles.contentContainer}>
          <Text style={[styleInApp.hkgpronw3_14, { lineHeight: 25 }]}>
            ▼
            処方せんの受付情報はアプリの「処方せん受付」「お知らせ」「プッシュ通知」にて通知されます。
          </Text>
          <Text style={[{ marginTop: 26, lineHeight: 25 }, styleInApp.hkgpronw3_14]}>
            ※プッシュ通知をOFFにされている方はアプリの「お知らせ」「処方せん受付」にてご確認ください。
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={this.navigatePrescriptionScreen}>
          <Text
            style={[styleInApp.hkgpronw6_14, { color: COLOR_WHITE }]}
          >
            トップページに戻る
          </Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.backAction)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.backAction);
  }
}

const withHeader = isIOS ? 64 - 17 : 56 - 8.5;
const styles = StyleSheet.create({
  wrapperHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0
  },
  imageLogo: {
    width: withHeader * (109 / 27),
    height: withHeader
  },
  title: {
    marginLeft: getWidthInCurrentDevice(20),
    marginTop: getWidthInCurrentDevice(31),
  },
  contentText: {
    fontSize: 14,
    color: "#1C1C1C",
  },
  contentContainer: {
    width: getWidthInCurrentDevice(336),
    height: getHeightInCurrentDevice(210),
    marginTop: getHeightInCurrentDevice(30),
    borderColor: "#FF7F7F",
    borderRadius: 3,
    borderWidth: 1.5,
    alignSelf: "center",
    padding: 15,
  },
  button: {
    width: getWidthInCurrentDevice(320),
    height: getHeightInCurrentDevice(44),
    borderRadius: 3,
    backgroundColor: "#06B050",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: getHeightInCurrentDevice(30),
  },
});
