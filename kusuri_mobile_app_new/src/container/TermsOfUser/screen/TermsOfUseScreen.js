import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/EvilIcons";
import HTML from "react-native-render-html";
import AsyncStorage from "@react-native-community/async-storage";

import { COLOR_WHITE, COLOR_BLACK } from "../../../const/Color";
import Header from "../item/Header";
import { DEVICE_WIDTH, isIOS, keyAsyncStorage } from "../../../const/System";
import { Api } from "../util/api";
import { NetworkError, Loading } from "../../../commons";
import MaintainView from "../../../commons/MaintainView";

export default class TermsOfUserScreen extends PureComponent {
  constructor() {
    super();
    this.state = {
      htmlContent: "",
      isLoading: false,
      networkError: false,
      isMaintain: false,
    };
  }

  renderCenterHeader = () => {
    return (
      <Text style={{ fontSize: 18, color: "#1C1C1C" }}>処方せん利用規約</Text>
    );
  };

  renderRightHeader = () => {
    return (
      <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
        <Icon name="close" size={30} color={"#646464"} />
      </TouchableOpacity>
    );
  };

  acceptTerms = async () => {
    this.props.navigation.navigate("PRESCRIPTION");
    try {
      await AsyncStorage.setItem(
        keyAsyncStorage.firstTimeOpenPrescription,
        "acceptTerms"
      );
    } catch (e) {}
  };

  render() {
    if (this.state.isMaintain) {
      return <MaintainView onPress={this.getTermsOfUser} timeOut={10000} />;
    }
    return (
      <View
        style={{ flex: 1, backgroundColor: COLOR_WHITE, alignItems: "center" }}
      >
        <Header
          centerComponent={this.renderCenterHeader}
          rightComponent={this.renderRightHeader}
        />
        {this.state.networkError ? (
          <NetworkError onPress={() => this.getTermsOfUser()} />
        ) : this.state.isLoading ? (
          <Loading size={40} />
        ) : (
          <>
            <View
              style={{
                flex: 1,
                width: "90%",
                borderWidth: 1,
                borderColor: "green",
                marginTop: 16,
                borderColor: "#00000029",
                padding: 8,
              }}
            >
              <ScrollView style={{ flex: 1 }}>
                <HTML html={this.state.htmlContent} />
              </ScrollView>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#06B050",
                borderRadius: 3,
                width: "85%",
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
              onPress={this.acceptTerms}
            >
              <Text
                style={{ fontSize: 14, color: COLOR_WHITE, fontWeight: "bold" }}
              >
                同意してはじめる
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  componentDidMount() {
    this.getTermsOfUser();
  }

  getTermsOfUser = () => {
    this.setState(
      {
        isLoading: true,
        networkError: false,
      },
      () => {
        Api.getTermsOfUser()
          .then((data) => {
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
}
