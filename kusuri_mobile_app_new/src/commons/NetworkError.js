import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import IconMaitain from "react-native-vector-icons/FontAwesome";
import { COLOR_GRAY, COLOR_WHITE } from "../const/Color";
import { STRING } from "../const/String";
import NetInfo from "@react-native-community/netinfo";
import { AppImage } from "../component/AppImage";
import IconRun from "../container/Account/item/IconRun";
import { DEVICE_WIDTH, keyAsyncStorage, styleInApp ,managerAccount} from "../const/System";
import AsyncStorage from "@react-native-community/async-storage";
import { SIZE } from "../const/size";
import { BottomService } from "../service/BottomService";
const { width, height } = Dimensions.get("window");

const inchWithDevice = (DEVICE_WIDTH - DEVICE_WIDTH / 10) / 160;
let widthImageBarcode = 0;
if (inchWithDevice >= 2.2) {
  widthImageBarcode = 2.2 * 160;
} else {
  widthImageBarcode = DEVICE_WIDTH - DEVICE_WIDTH / 10;
}
export default class NetworkError extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      displayBardCode: true,
      barcodeImageUrl: '',
      imageUrl: '',
    };
  }
  async componentDidMount() {
    const { iconName, iconSize, disableIcon, disablePopup } = this.props;
    if (
      iconName == undefined &&
      disableIcon == undefined &&
      disablePopup == undefined
    ) {
      NetInfo.isConnected.fetch().then((isConnected) => {
        if (!isConnected) {
          Alert.alert(
            "ネットワークエラー",
            "インターネット接続を確認してください。"
          );
        }
      });
    }
    // BottomService.show(false);
    const barcodeImageUrl = await AsyncStorage.getItem(
      keyAsyncStorage.barcodeImageUrl
    );
    const imageUrl = await AsyncStorage.getItem(keyAsyncStorage.appImageUrl);
    if (barcodeImageUrl || imageUrl) {
      this.setState({ barcodeImageUrl, imageUrl });
    }
    console.log('[ barcodeImageUrl ]', barcodeImageUrl);
  }
  componentWillUnmount() {
    BottomService.show(true);
    // this.clearTimer();
  }
  renderIcon = () => {
    const { iconName, iconSize, disableIcon } = this.props;

    if (disableIcon) {
      return null;
    }
    if (iconName === "gears") {
      return (
        <IconMaitain name={iconName} size={iconSize || 80} color={COLOR_GRAY} />
      );
    }
    return (
      <Icon
        name={iconName || "wifi-off"}
        size={iconSize || 80}
        color={COLOR_GRAY}
      />
    );
  };
  render() {
    const { onPress, textStyle, title, style } = this.props;
    console.log("imageUrl",this.state.imageUrl );
    console.log("barcodeImageUrl",this.state.barcodeImageUrl);
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
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0}
            style={[styles.wrapperCenter, this.props.style]}
          >
            <View style={[styles.wrapperCenter, { paddingHorizontal: 16 }]}>
              {this.renderIcon()}

              <Text style={[styles.textError, textStyle]}>
                {title || STRING.please_try_again_later}
              </Text>
            </View>
          </TouchableOpacity>
          {!!this.state.imageUrl && (
            <AppImage
              style={[styleInApp.bigImage, { width: DEVICE_WIDTH - 32 ,marginTop:20}]}
              resizeMode={"contain"}
              url={this.state.imageUrl}
            />
          )}
          {!!this.state.barcodeImageUrl && (
            <View style={{ justifyContent: "center", alignItems: "center",paddingBottom:20 }}>
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
        
        </ScrollView>
      </SafeAreaView>
    );
  }


}

const styles = StyleSheet.create({
  wrapperCenter: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 20,
  },
  textError: {
    marginTop: 20,
    color: COLOR_GRAY,
    fontSize: 20,
    textAlign: "center",
  },
});
