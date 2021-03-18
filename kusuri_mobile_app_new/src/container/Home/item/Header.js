//Library:
import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
  Image,
  View,
} from "react-native";
import { Right, Left } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import PushNotification from "react-native-push-notification";
const BadgeAndroid = require("react-native-android-badge");

//Setup:
import { Api } from "../util/api";
import { DEVICE_WIDTH, APP, SYSTEAM_VERSION } from "../../../const/System";
import {
  COLOR_GRAY,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  APP_COLOR,
} from "../../../const/Color";
import { AppImage } from "../../../component/AppImage";
import { NumberNewNofitification, DrawerControl } from "../util/service";
import { CheckDataApp } from "../../Launcher/util/service";

//Services:
import ServicesUpdateComponent from "../../../service/ServicesUpdateComponent";
import NavigationService from "../../../service/NavigationService";

export class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      count: 0,
      imageLogo: APP.IMAGE_LOGO,
    };
    this.onPressIconNotifications = this.onPressIconNotifications.bind(this);
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    NumberNewNofitification.onChange("notification-count", (count) => {
      if (Number.isInteger(count)) {
        if (count <= 0) {
          if (isIOS) {
            PushNotification.setApplicationIconBadgeNumber(0);
          } else {
            BadgeAndroid.setBadge(0);
          }
          this.setState({ count: 0 });
        } else {
          if (isIOS) {
            PushNotification.setApplicationIconBadgeNumber(count);
          } else {
            BadgeAndroid.setBadge(count);
          }
          this.setState({ count });
        }
      }
    });
    this.getApi();
    CheckDataApp.onChange("HEADER", () => {
      const { imagelogo } = this.state;
      if (imagelogo !== APP.IMAGE_LOGO) {
        this.setState({ imageLogo: APP.IMAGE_LOGO });
      }
    });
  }

  componentWillUnmount() {
    CheckDataApp.unChange("HEADER");
    NumberNewNofitification.unChange("notification-count");
  }

  onPressIconNotifications() {
    const { navigation } = this.props;
    NavigationService.navigate("PUSH_NOTIFICATION")
    NumberNewNofitification.set(0);
  }

  getApi = async () => {
    if (!this.state.loading) {
      try {
        this.state.loading = true;
        const updateNotification = await Api.getCheckUpDateNotification();
        if (updateNotification.code === 200) {
          ServicesUpdateComponent.set("MAIN_TAIN_FALSE");
          const count = updateNotification.res;
          if (Number.isInteger(count)) {
            NumberNewNofitification.set(count);
          }
        } else if (updateNotification.code == 502) {
          ServicesUpdateComponent.set("MAIN_TAIN_TRUE");
        }
      } catch (err) {
      } finally {
        this.state.loading = false;
      }
    }
  };

  rederLogo = () => {
    const { imageLogo } = this.state;
    return <AppImage style={styles.imageLogo} url={imageLogo} />;
  };

  render() {
    const { count } = this.state;
    return (
      <SafeAreaView
        style={{
          backgroundColor: APP_COLOR.BACKGROUND_COLOR,
          shadowColor: COLOR_WHITE,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
        }}
      >
        <View
          style={[
            styles.wrapperHeader,
            {
              backgroundColor: APP_COLOR.BACKGROUND_COLOR,
              paddingHorizontal: 0.04 * DEVICE_WIDTH,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              DrawerControl.set(true);
            }}
          >
            <Image
              source={require("../images/dash.png")}
              style={{
                height: 0.05 * DEVICE_WIDTH,
                width: 0.054 * DEVICE_WIDTH,
              }}
            />
          </TouchableOpacity>
          <View>{this.rederLogo()}</View>

          <TouchableOpacity
            onPress={this.onPressIconNotifications}
            style={{ position: "relative" }}
            activeOpacity={0.1}
          >
            <Image
              source={require("../images/loa.png")}
              style={{
                height: 0.066 * DEVICE_WIDTH,
                width: 0.08 * DEVICE_WIDTH,
              }}
            />
            {count > 0 ? (
              <View
                style={{
                  backgroundColor: "red",
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  left: 0.04 * DEVICE_WIDTH,
                  top: -8,
                }}
              >
                <Text style={styles.textBabel}>{count}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const isIOS = Platform.OS === "ios";
const withHeader = isIOS ? 64 - 17 : 56 - 8.5;

const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: DEVICE_WIDTH,
    paddingVertical: 8,
    backgroundColor: COLOR_WHITE,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,
  },
  textBabel: {
    fontFamily: "SegoeUI",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: COLOR_WHITE,
  },
  textTitle: {
    fontFamily: "SegoeUI",
    color: COLOR_BLACK,
    fontSize: 12,
    fontWeight: "bold",
  },

  imageLogo: {
    width: withHeader * (109 / 27),
    height: withHeader,
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
