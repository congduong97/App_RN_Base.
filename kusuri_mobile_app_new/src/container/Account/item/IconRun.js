import React, { Component } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { DEVICE_WIDTH } from "../../../const/System";
export default class App extends Component {
  constructor() {
    super();
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.state = {
      fadeValue: new Animated.Value(0),
      xValue: new Animated.Value(0),
      rotateValue: new Animated.Value(0),
      left: false,
    };
  }

  componentDidMount() {
    this.runIcon();
  }
  moveAnimited = () => {
    Animated.timing(this.state.xValue, {
      toValue: DEVICE_WIDTH / 1.8 - 20,
      duration: 4000,
      easing: Easing.linear,
    }).start(() => {
      this.flip_Animation(true);

      Animated.timing(this.state.xValue, {
        toValue: 0,
        duration: 4000,
      }).start(() => {
        // alert('end');
        this.moveAnimited();
        //   setTimeout(() => {
        //     this.flip_Animation();
        // }, 3000);
        this.flip_Animation();
      });
    });
  };

  flip_Animation = (status) => {
    if (!status) {
      Animated.spring(this.animatedValue, {
        toValue: 0,
        tension: 10,
        friction: 8,
      }).start();
    } else {
      Animated.spring(this.animatedValue, {
        toValue: 180,
        tension: 10,
        friction: 8,
      }).start(() => {});
    }
  };
  runIcon = () => {
    Animated.parallel([this.moveAnimited()]).start(() => {});
  };
  render() {
    this.SetInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ["0deg", "180deg"],
    });

    const Rotate_Y_AnimatedStyle = {
      transform: [{ rotateY: this.SetInterpolate }],
    };

    return (
      <View style={styles.container}>
        <Animated.Image
          resizeMode={"contain"}
          source={require("../images/ezgif.com-gif-maker.gif")}
          style={[
            styles.animatedView,
            Rotate_Y_AnimatedStyle,
            { left: this.state.xValue },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    width: DEVICE_WIDTH / 1.8,
  },
  animatedView: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
});
