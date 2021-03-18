import React, { PureComponent } from "react";
import { Text } from "react-native";
import Countdown from "react-countdown-now";

export default class CountDownCoupon extends PureComponent {
  renderCountDown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return null;
    } else {
      // Render a countdown
      return (
        <Text style={{ color: "red" }}>
          残り{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </Text>
      );
    }
  };

  render() {
    const { time, onComplete } = this.props;
    let now = Date.now();
    now = now + 2 * 60 * 60 * 1000;
    return (
      <Countdown
        autoStart
        date={Date.now() + time}
        renderer={this.renderCountDown}
        onComplete={onComplete}
      />
    );
  }
}
