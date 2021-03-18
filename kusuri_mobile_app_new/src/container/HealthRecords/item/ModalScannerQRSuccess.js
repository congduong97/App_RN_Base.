//Library:
import React, { Component } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

//Setup:
import { SIZE } from "../../../const/size";
import { COLOR_TEXT } from "../util/constant";

export default class ModalScannerQRSuccess extends Component {
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

  openModal = () => {
    this.setState({ isVisible: true });
  };

  closeModal = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const { isVisible } = this.state;
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
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: SIZE.width(5),
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              marginVertical: 20,
              textAlign: "center",
              color: COLOR_TEXT,
              fontSize: 16,
            }}
          >
            性別 おくすり情報を登録しました。
          </Text>
          <TouchableOpacity
            onPress={this.closeModal}
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F2F2F2",
              alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "red",marginVertical:10 }}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  textModal: {
    color: "#000000",
    fontSize: SIZE.H4,
    marginLeft: SIZE.width(3),
    marginTop: SIZE.height(3),
  },
});
