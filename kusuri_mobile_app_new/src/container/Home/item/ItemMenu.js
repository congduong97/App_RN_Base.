import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  View,
  AppState,
} from "react-native";
import { DEVICE_WIDTH } from "../../../const/System";
import { COLOR_GRAY_LIGHT, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { NavigationEvents } from "react-navigation";
import { AppImage } from "../../../component/AppImage";
import { OpenMenu } from "../../../util/module/OpenMenu";
import { Api } from "../util/api";
import { NumberNewNofitification } from "../util/service";
import { MenuCouponAddPointHasNew } from "../../Coupon/util/service";

export class ItemMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemAnimation: new Animated.Value(0.01),
      isNew: false,
    };
    this.animationValue = {
      itemAnimation: new Animated.Value(0.01),
    };
    this.onPressItemMenu = this.onPressItemMenu.bind(this);
    this.animation = this.animation.bind(this);
  }
  componentDidMount() {
    this.animationTimeout = setTimeout(this.animation, 100);
    const { item } = this.props;
    if (item.function === "COMPANY_NOTIFICATION") {
      this.getApiNotification();
      AppState.addEventListener("change", this.handleAppStateChange);
    }
    if (item.function === "NEW_COUPON") {
      this.getApiHasNewCoupon();
    }
    if (item.function === "PUSH_NOTIFICATION") {
      this.setState({ count: NumberNewNofitification.get() });
      NumberNewNofitification.onChange(`${item.id}`, (count) => {
        this.setState({ count });
      });
    }

    if (item.function === "NEW_COUPON") {
      MenuCouponAddPointHasNew.onChange(`${item.function}-${item.id}`, () => {
        this.setState({ isNew: true });
      });
    }
  }

  handleAppStateChange = (changeStatus) => {
    if (changeStatus === "active") {
      this.getApiNotification();
    }
  };
  componentWillUnmount() {
    const { item } = this.props;
    if (item.function === "COMPANY_NOTIFICATION") {
      AppState.removeEventListener("change", this.handleAppStateChange);
    }
    if (item.function === "PUSH_NOTIFICATION") {
      NumberNewNofitification.unChange(`${item.id}`);
    }
  }

  onPressItemMenu() {
    const { navigation, item } = this.props;
    OpenMenu(item, navigation);
    if (
      item.function === "COMPANY_NOTIFICATION" ||
      item.function === "NEW_COUPON"
    ) {
      this.setState({ isNew: false });
    }
  }

  getApiNotification = async () => {
    try {
      const response = await Api.getNewNotification();
      if (response.code === 200 && response.res.status.code === 1000) {
        const isNew = response.res.data;
        this.setState({ isNew });
      }
    } catch (err) {}
  };
  getApiHasNewCoupon = async () => {
    try {
      const response = await Api.getHasNewCoupon();
      if (response.code === 200 && response.res.status.code === 1036) {
        this.setState({ isNew: true });
      }
    } catch (err) {}
  };

  animation() {
    const { itemAnimation } = this.animationValue;
    const { index } = this.props;
    Animated.timing(itemAnimation, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start(() => {
      this.animationTimeout && clearTimeout(this.animationTimeout);
    });
  }

  renderContent = () => {
    const { sizeItem, item } = this.props;
    const { isNew, count } = this.state;
    if (item.typeDisplay === "NONE") {
      return (
        <View
          style={{
            justifyContent: "space-between",
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            borderRadius: 3,
            width: sizeItem.widthItem,
            height: sizeItem.heightItem,
            paddingVertical: 0.021 * DEVICE_WIDTH,
            paddingHorizontal: 0.0186 * DEVICE_WIDTH,
          }}
        />
      );
    }
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          justifyContent: "space-around",
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          width: sizeItem.widthItem,
          height: sizeItem.heightItem,
          paddingVertical: 0.02 * DEVICE_WIDTH,
          paddingHorizontal: 0.02 * DEVICE_WIDTH,
        }}
        onPress={this.onPressItemMenu}
      >
        <Text numberOfLines={2} style={[styles.textButton]}>
          {item.name}
        </Text>
        {item.iconUrl ? (
          // <View style={{ alignItems: "center" }}>
          <AppImage
            url={item.iconUrl}
            style={{
              height: sizeItem.heightItem * 0.4,
              width: 0.6 * sizeItem.widthItem,
              alignSelf: "center",
              // backgroundColor:"green"
            }}
            resizeMode={"contain"}
          />
        ) : // </View>
        null}
        {isNew ? (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: -DEVICE_WIDTH * 0.02,
              borderWidth: 1,
              height: DEVICE_WIDTH * 0.05,
              width: DEVICE_WIDTH * 0.05,
              borderRadius: 10,
              borderColor: APP_COLOR.COLOR_TEXT,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: APP_COLOR.COLOR_TEXT,
                fontSize: DEVICE_WIDTH * 0.035,
              }}
            >
              N
            </Text>
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };
  renderNavigationEvent = () => {
    const { item } = this.props;
    if (item.function === "COMPANY_NOTIFICATION") {
      return (
        <NavigationEvents
          onWillFocus={(payload) => this.getApiNotification()}
        />
      );
    }
  };

  render() {
    const { isNew, count } = this.state;
    const { sizeItem } = this.props;
    const { itemAnimation } = this.animationValue;

    const scale = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [0.01, 0.6, 1],
    });
    const opacity = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [0.01, 0.3, 1],
    });
    const translateY = itemAnimation.interpolate({
      inputRange: [0.01, 0.6, 1],
      outputRange: [-20, -10, 0],
    });

    return (
      <Animated.View
        style={[
          {
            opacity,
            backgroundColor: APP_COLOR.BACKGROUND_COLOR,
            transform: [{ scale }, { translateY }, { perspective: 1000 }],
          },
        ]}
      >
        {this.renderContent()}
        {this.renderNavigationEvent()}
        {count ? <Text style={styles.textBabel}>{count}</Text> : null}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  wrapperBody: {
    backgroundColor: COLOR_WHITE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
  },
  wrapperCenter: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  imageFeature: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH / 2 + 50,
  },
  imageIcon: {
    height: 100,
    width: 100,
  },
  textBabel: {
    fontFamily: "SegoeUI",
    top: 10,
    right: 10,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
    padding: 8,
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 12,
    color: COLOR_WHITE,
    backgroundColor: "red",
  },

  textButton: {
    fontSize: 0.032 * DEVICE_WIDTH,
    textAlign: "left",
    color: "#1D1D1D",
    fontWeight: "700",
  },
});
