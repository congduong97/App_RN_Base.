import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

class Clock extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { currentTime: null, currentDay: null };
  }

  componentWillMount() {
    this.getCurrentTime();
  }

  getCurrentTime = () => {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hour = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();

    if (year < 10) {
      year = "0" + year;
    }

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (hour < 10) {
      hour = "0" + hour;
    }

    this.setState({
      currentTime:
        `${year}/${month}/${day} ` + hour + ":" + minutes + ":" + seconds
    });
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.getCurrentTime();
    }, 1000);
  }

  render() {
    const { style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.timeText}>{this.state.currentTime}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },

  timeText: {
    fontSize: 16,
    fontWeight: "bold"
  }
});
export { Clock };
