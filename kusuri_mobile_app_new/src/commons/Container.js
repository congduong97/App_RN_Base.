import React, { Component } from "react";
import { StatusBar, SafeAreaView } from "react-native";
import { HeaderIconLeft } from ".";
import NavigationService from "../service/NavigationService";

export class Container extends Component {
  goBack = () => {
    if (this.props.goBack) {
      this.props.goBack();
    } else {
      NavigationService.goBack();
    }
  };
  render() {
    const { containerStyle } = this.props;
    return (
      <SafeAreaView
        style={[
          {
            flex: 1,
          },
          containerStyle,
        ]}
      >
        <StatusBar barStyle={"dark-content"} />
        <HeaderIconLeft goBack={this.goBack} title={this.props.title} />
        {this.props.children}
      </SafeAreaView>
    );
  }
}

export default Container;
