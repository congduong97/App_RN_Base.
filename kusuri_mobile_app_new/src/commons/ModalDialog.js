import React, { Component } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";

export class ModalDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  handleVisible = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  render() {
    const { isVisible } = this.state;
    const { children } = this.props;
    return (
      <Modal
        hasBackdrop
        isVisible={isVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onRequestClose={this.handleVisible}
        onBackdropPress={this.handleVisible}
        animationInTiming={600}
        backdropTransitionInTiming={600}
        backdropOpacity={0.4}
        style={{
          margin: 0,
          justifyContent: "center",
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        {children}
      </Modal>
    );
  }
}

export default ModalDialog;
