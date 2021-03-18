import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { ButtonTypeTwo, Loading } from "../../../commons";
import { STRING } from "../util/string";
import { DEVICE_WIDTH, managerAccount } from "../../../const/System";
import { COLOR_BLACK, COLOR_WHITE, APP_COLOR } from "../../../const/Color";
import { Api } from "../../Account/util/api";

export class GroupButtonHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0), // Initial value for opacity: 0
      height: new Animated.Value(0),
      loading: true, // Initial value for opacity: 0
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);

    this.getNumberPoint();
  }
  getNumberPoint = async () => {
    try {
      const response = await Api.updateMyPage();
      if (response.code === 200 && response.res.status.code === 1000) {
        const { point, barcodeImageUrl, money } = response.res.data;
        managerAccount.point = point;
      }
    } catch (error) {
    } finally {
      if (this.timeoutLoading) {
        clearTimeout(this.timeoutLoading);
      }
      this.timeoutLoading = setTimeout(() => {
        this.setState({ loading: false });
        this.startAnimation();
      }, 200);
    }
  };

  startAnimation() {
    Animated.parallel([
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 500,
      }),
      Animated.timing(this.state.height, {
        toValue: DEVICE_WIDTH / 4,
        duration: 500,
      }),
    ]).start(() => {});
  }
  goToMyPage = () => {
    this.props.navigation.navigate("MY_PAGE");
  };
  reloadAnimation() {
    this.setState({
      loading: false,
      opacity: new Animated.Value(0),
      height: new Animated.Value(0),
    });
    this.getNumberPoint();
  }
  render() {
    const { opacity, height, loading } = this.state;
    if (!managerAccount.userId) {
      return null;
    }
    if (loading) {
      return <Loading />;
    }

    return (
      <Animated.View style={[styles.container, { opacity, height }]}>
        <View style={{ flex: 1 }}>
          <ButtonTypeTwo
            name={STRING.textGoMyPage}
            onPress={this.goToMyPage}
            style={styles.buttonTopOne}
            styleText={{ fontSize: 14 }}
          />
          <TouchableOpacity
            style={[
              styles.buttonTopTwo,
              { borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2 },
            ]}
          >
            <Text
              style={{
                color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2,
                marginLeft: 50,
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              {STRING.coupon}
            </Text>
            <Image
              source={require("../images/ic_new.png")}
              style={{ height: 38, width: 37, position: "absolute" }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.buttonTopPoint,
            { backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 },
          ]}
        >
          <Text style={styles.textMyPoint}>{STRING.my_point}</Text>
          <Text
            style={[
              styles.textFontMyPage,
              { color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1 },
            ]}
          >{`${managerAccount.point} pt`}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  buttonTopOne: {
    width: DEVICE_WIDTH / 2 - 10,
    height: 40,
    marginLeft: 5,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 3,
  },
  buttonTopTwo: {
    marginTop: -5,
    width: DEVICE_WIDTH / 2 - 10,
    height: 40,
    marginLeft: 5,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "red",
  },
  buttonTopPoint: {
    width: DEVICE_WIDTH / 2 - 6,
    height: 85,
    margin: 5,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  textMyPoint: {
    color: COLOR_WHITE,
  },
  textFontMyPage: {
    color: COLOR_WHITE,
    fontSize: 25,
    fontWeight: "bold",
  },
  textButton: {
    color: COLOR_BLACK,
    marginLeft: 50,
    marginTop: 10,
    fontSize: 14,
  },
});
