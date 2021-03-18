import React, { Component } from "react";
import { Text, View } from "react-native";
import { Loading } from ".";
import { DEVICE_WIDTH } from "../const/System";

export class NumberWithLoading extends Component {
  state = {
    loading: false,
  };
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.setLoadingPointWhenReload !==
      this.props.setLoadingPointWhenReload
    ) {
      this.setState({ loading: true });
    }
    if (this.state.loading) {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 1000);
    }
  }

  render() {
    const { value } = this.props;
    const { loading } = this.state;
    if (loading) {
      return <Loading style={{ height: 0.05 * DEVICE_WIDTH }} />;
    }
    return <Text style={this.props.style}>{value}</Text>;
  }
}

export default NumberWithLoading;
