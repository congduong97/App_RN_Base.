import React, { Component, PureComponent } from "react";
import { Text, StyleSheet } from "react-native";
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
    const { time, couponStart, onDoneCountDown } = this.props;
    let now = new Date();
    let timeStart = new Date(couponStart);
    let timeout = now.getTime() - timeStart.getTime();
    return (
      <>
        {timeout < time && (
          <Countdown
            date={Date.now() + time - timeout}
            renderer={this.renderCountDown}
            onComplete={onDoneCountDown}
          ></Countdown>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({});
