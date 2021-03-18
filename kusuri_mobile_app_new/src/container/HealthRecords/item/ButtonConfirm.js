//Library:
import React, { PureComponent } from "react";
import { Text, TouchableOpacity } from "react-native";

//Setup:
import { SIZE } from "../../../const/size";

//Component:
import { Loading } from "../../../commons";

export default class ButtonConfirm extends PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
    };
  }

  componentWillUnmount() {
    !!this.timeOut && clearTimeout(this.timeOut);
  }

  onPressButton = () => {
    let time = !!this.props.timeOut ? this.props.timeOut : 500;
    this.setState({
      isLoading: true,
    });
    !!this.props.onPress && this.props.onPress();
    this.timeOut = setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, time);
  };

  render() {
    const {
      textButton,
      styleButton,
      styleTextButton,
      loading,
    } = this.props;
    return (
      <TouchableOpacity
        style={[
          {
            alignItems: "center",
            paddingVertical: 17,
            backgroundColor: "#06B050",
            borderRadius: 3,
            borderColor: "#06B050",
            borderWidth: 1,
          },
          styleButton,
        ]}
        disabled={this.state.isLoading}
        onPress={this.onPressButton}
      >
        {!!loading && loading ? (
          <Loading style={{ height: 15 }} />
        ) : (
          <Text
            style={[{ fontSize: SIZE.H14, color: "white" }, styleTextButton]}
          >
            {textButton}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
