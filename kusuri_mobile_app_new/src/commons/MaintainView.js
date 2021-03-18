import React, { Component, PureComponent } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { SIZE } from "../const/size";
import Loading from "./Loading";
import {
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BROWN,
  COLOR_RED,
} from "../const/Color";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-community/async-storage";
import {
  keyAsyncStorage,
  DEVICE_WIDTH,
  styleInApp,
  managerAccount,
} from "../const/System";
import { AppImage } from "../component/AppImage";
import { BottomService } from "../service/BottomService";
import { STRING } from "../const/String";
import IconRun from "../container/Account/item/IconRun";
const { width, height } = Dimensions.get("window");

const inchWithDevice = (DEVICE_WIDTH - DEVICE_WIDTH / 10) / 160;
let widthImageBarcode = 0;
if (inchWithDevice >= 2.2) {
  widthImageBarcode = 2.2 * 160;
} else {
  widthImageBarcode = DEVICE_WIDTH - DEVICE_WIDTH / 10;
}

export default class MaintainView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      displayBardCode: true,
      barcodeImageUrl: "",
      imageUrl: "",
    };
  }
  async componentDidMount() {
    BottomService.show(false);
    const barcodeImageUrl = await AsyncStorage.getItem(
      keyAsyncStorage.barcodeImageUrl
    );
    const imageUrl = await AsyncStorage.getItem(keyAsyncStorage.appImageUrl);
    if (barcodeImageUrl || imageUrl) {
      this.setState({ barcodeImageUrl, imageUrl });
    }
  }
  componentWillUnmount() {
    BottomService.show(true);
    this.clearTimer();
  }

  clearTimer() {
    this.timer !== undefined ? clearTimeout(this.timer) : null;
  }
  onPressButton = async () => {
    this.setState({
      isLoading: true,
    });
    if (this.props.onPress) {
      await this.props.onPress();
    }

    if (!this.props.timeOut) {
      this.setState({
        isLoading: false,
      });
    } else {
      this.timer = setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, this.props.timeOut);
    }
  };
  renderTouch() {
    if (this.state.isLoading) {
      return <Loading />;
    }
    return (
      <Text
        style={{
          fontSize: SIZE.H4 * 0.9,
          color: COLOR_WHITE,
        }}
      >
        更新
      </Text>
    );
  }
  render() {
    const { style, textStyle } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, backgroundColor: COLOR_WHITE }}
          contentContainerStyle={[
            {
              flex: 1,
              width,
              justifyContent: "center",
              alignItems: "center",
            },
            style,
          ]}
        >
          <Icon name={"ios-settings"} size={SIZE.H1 * 2.5} color={COLOR_GRAY} />
          <Text
            style={[
              {
                color: COLOR_GRAY,
                fontSize: SIZE.H5,
                textAlign: "center",
                lineHeight: SIZE.H5 * 1.2,
                margin: SIZE.width(5),
              },
              textStyle,
            ]}
          >
            {STRING.maintain}
          </Text>
          {!!this.state.imageUrl && (
            <AppImage
              style={[styleInApp.bigImage, { width: DEVICE_WIDTH - 32 }]}
              resizeMode={"contain"}
              url={this.state.imageUrl}
            />
          )}
          {!!this.state.barcodeImageUrl && (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <AppImage
                style={[
                  styleInApp.bigImage,
                  {
                    width: widthImageBarcode,
                    height: widthImageBarcode / 4,
                    marginTop: 16,
                  },
                ]}
                resizeMode={"cover"}
                url={this.state.barcodeImageUrl}
              />
              <Text style={{ marginVertical: 16 }}>
                {managerAccount.memberCode}
              </Text>
              <View style={{ height: 20 }}>
                <IconRun />
              </View>
            </View>
          )}
          <TouchableOpacity
            onPress={this.onPressButton}
            disabled={this.state.isLoading}
            style={{
              width: SIZE.width(45),
              height: SIZE.height(6),
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: COLOR_RED,
              marginTop: SIZE.width(7),
            }}
          >
            {this.renderTouch()}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
