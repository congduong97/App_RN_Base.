import React, { Component } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
const seconds = 60;
export default class ItemClockCountTime extends Component {
  constructor(props) {
    super(props);

    this.state = { time: {}, seconds: seconds, timeStart: "", isShow: true };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  componentDidMount() {
    this.startTimer();
  }

  startTimer() {
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.resetTime !== prevProps.resetTime) {
      this.setState({ seconds: seconds, isShow: true }, () => {
        // clearInterval(this.timer);
        this.timer = 0;
        this.startTimer();
      });
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (this.state.seconds === 0) {
      this.setState({ isShow: false });
      clearInterval(this.timer);
      this.props.requestReSend();
    }
  }

  render() {
    let { styleTimeText, style, timeStart, timeEnd } = this.props;
    return (
      <View style={[style]}>
        {this.state.isShow ? (
          <Text style={[styles.timeText, styleTimeText]}>
            {" "}
            ({this.state.time.m ? this.state.time.m : "00"}:
            {this.state.time.s
              ? this.state.time.s < 10
                ? "0" + this.state.time.s
                : this.state.time.s
              : "00"}
            )
          </Text>
        ) : (
          <Text />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS == "ios" ? 20 : 0,
  },

  timeText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },

  daysText: {
    color: "black",
    fontSize: 16,
    paddingBottom: 0,
  },
});
