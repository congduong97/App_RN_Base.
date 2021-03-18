import React, { PureComponent } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HTML from "react-native-render-html";

import { COLOR_WHITE, COLOR_GRAY_LIGHT } from "../../../const/Color";
import {
  isIOS,
  DEVICE_WIDTH,
  getWidthInCurrentDevice,
  getHeightInCurrentDevice,
} from "../../../const/System";
import { NetworkError, Loading } from "../../../commons";
import { Api } from "../util/api";
import MaintainView from "../../../commons/MaintainView";

export default class TermsOfUse extends PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      htmlContent: "",
      networkError: false,
      isMaintain: false,
    };
  }

  getTermsOfUse = () => {
    this.setState(
      {
        isLoading: true,
        networkError: false,
      },
      () => {
        Api.getTermsOfUser()
          .then((data) => {
            console.log(data, "data");
            if (data.code === 502) {
              this.setState({
                isMaintain: true,
              });
              return;
            }
            this.setState({
              htmlContent: data.res.data,
              isLoading: false,
              networkError: false,
              isMaintain: false,
            });
          })
          .catch(() => {
            this.setState({
              networkError: true,
              isLoading: false,
              isMaintain: false,
            });
          });
      }
    );
  };
  renderContent() {
    let { isMaintain, isLoading, networkError, htmlContent } = this.state;
    console.log(htmlContent, "html");
    if (networkError) {
      return <NetworkError onPress={() => this.getTermsOfUse()}  timeOut={10000}/>;
    }
    if (isLoading) {
      return <Loading size={40} />;
    }
    return (
      <View
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#00000029",
          padding: 8,
          margin: 10,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          <HTML html={htmlContent} />
        </ScrollView>
      </View>
    );
  }
  render() {
    let headerHeight = isIOS ? 64 : 56;
    if (this.state.isMaintain) {
      return <MaintainView onPress={this.getTermsOfUse} />;
    }
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: COLOR_WHITE, alignItems: "center" }}
      >
        {Platform.OS == "android" && (
          <StatusBar
            backgroundColor={COLOR_GRAY_LIGHT}
            barStyle="dark-content"
          />
        )}
        <View
          style={{
            justifyContent: "center",
            width: DEVICE_WIDTH,
            height: headerHeight,
          }}
        >
          <View style={{ width: DEVICE_WIDTH * 0.35 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                padding: 10,
                paddingRight: 30,
                paddingLeft: 15,
                alignItems: "center",
                flexDirection: "row",
              }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Ionicons name={"ios-arrow-back"} size={22} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 18,
              color: "#1C1C1C",
              position: "absolute",
              alignSelf: "center",
            }}
          >
            利用規約
          </Text>
        </View>

        {this.renderContent()}
      </SafeAreaView>
    );
  }
  componentDidMount() {
    this.getTermsOfUse();
  }
}

const styles = StyleSheet.create({
  container: {
    width: getWidthInCurrentDevice(345),
    height: getHeightInCurrentDevice(470),
  },
});
