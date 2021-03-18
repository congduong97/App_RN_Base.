import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  Text,
} from "react-native";
import { DEVICE_WIDTH, isIOS, SYSTEAM_VERSION, APP } from "../const/System";
import {
  COLOR_BLACK,
  COLOR_GRAY,
  COLOR_ORANGE,
  COLOR_GRAY_LIGHT,
} from "../const/Color";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AppImage } from "../component/AppImage";
import NavigationService from "../service/NavigationService";
import { SIZE } from "../const/size";
export default class HeaderIconLeft extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  getTitle = (title) => {
    if (title) {
      return title.replace(/\n|\r/g, "");
    }
    return "";
  };
  renderRight = () => {
    const {
      RightComponent,
      useBookmark,
      onPressBookMark,
      bookmark,
      checkName,
    } = this.props;

    if (useBookmark) {
      return (
        <View style={{ width: DEVICE_WIDTH * 0.3, alignItems: "flex-end" }}>
          <Icons
            name={bookmark ? "star" : "star-o"}
            size={24}
            style={{ paddingLeft: 30, paddingRight: 15 }}
            color={bookmark ? COLOR_ORANGE : COLOR_GRAY}
            onPress={onPressBookMark}
          />
        </View>
      );
    }
    if (RightComponent) {
      return RightComponent;
    }
    return <View style={{ width: DEVICE_WIDTH * 0.1 }} />;
  };
  goBack = () => {
    const { goBack, checkName } = this.props;
    if (goBack) {
      goBack();
    }
    if (checkName) {
      checkName();
    }
  };

  renderTitle = () => {
    const { logoStyle, title, titleStyle } = this.props;
    if (title) {
      return (
        <View
          style={[
            styles.imageLogo,
            { justifyContent: "center", alignItems: "center" },
            logoStyle,
          ]}
        >
          <Text style={[{ fontSize: SIZE.H4, color: COLOR_BLACK }, titleStyle]}>
            {title}
          </Text>
        </View>
      );
    }

    return (
      <AppImage
        style={[styles.imageLogo, logoStyle]}
        url={APP.IMAGE_LOGO}
        resizeMode={"contain"}
      />
    );
  };

  render() {
    const { loading } = this.state;
    const {
      goBack,
      logoStyle,
      title,
      stylesView,
      checkName,
      notBack,
    } = this.props;

    return (
      <SafeAreaView>
        <View style={[styles.wrapperHeader, stylesView]}>
          {!notBack && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                paddingRight: 10,
              }}
              onPress={this.goBack}
            >
              <Ionicons
                name={"chevron-back"}
                size={DEVICE_WIDTH * 0.09}
                style={{ color: "#636465" }}
              />
            </TouchableOpacity>
          )}

          {this.renderTitle()}

          {/* right component in header  */}
          {this.renderRight()}
          {/* <TouchableOpacity
            onPress={() => {
              NavigationService.navigate("HOME");
            }}
          >
            <Image
              style={{
                width: 0.08 * DEVICE_WIDTH,
                height: 0.08 * DEVICE_WIDTH,
              }}
              source={require("../images/homeicon.png")}
            />
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
    );
  }
}
const withHeader = isIOS ? 64 - 17 : 56 - 8.5;
const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: DEVICE_WIDTH,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,
    shadowColor: "#00000029",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  textTitle: {
    // fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 16,
  },
  wrapperLogo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  imageLogo: {
    height: DEVICE_WIDTH * 0.13,
    width: 0.44 * DEVICE_WIDTH,
  },
  shadow: isIOS
    ? {
        shadowColor: COLOR_GRAY,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
      }
    : {
        elevation: 1,
      },
});
