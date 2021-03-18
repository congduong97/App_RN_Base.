import React, { Component } from "react";
import { Text, View } from "react-native";
import ButtonConfirm from "./ButtonConfirm";
import Modal from "react-native-modal";
import NavigationService from "../../../service/NavigationService";
import { SIZE } from "../../../const/size";

export class ModalPolicyNotice extends Component {
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

  onPress = () => {
    this.handleVisible();
    NavigationService.navigate("DRUG_TERM");
  };

  render() {
    return (
      <Modal
        hasBackdrop
        isVisible={this.state.isVisible}
        animationIn="slideInUp"
        animationOut="fadeOut"
        onRequestClose={this.handleVisible}
        animationInTiming={300}
        backdropTransitionInTiming={300}
        backdropOpacity={0.4}
        style={{
          margin: 0,
          justifyContent: "center",
          //   alignItems: "center",
        }}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: SIZE.width(5),
            borderRadius: 3,
          }}
        >
          <Text
            style={{
              marginTop: 50,
              marginHorizontal: SIZE.width(10),
              fontSize: 16,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            利用規約が更新されました。
            利用を継続するには、利用規約をご確認いただき同意をお願いします。
          </Text>

          <ButtonConfirm
            textButton={"利用規約を表示"}
            onPress={this.onPress}
            styleButton={{
              marginHorizontal: SIZE.width(8),
              backgroundColor: "#06B050",
              marginTop: 20,
              marginBottom: 40,
            }}
            styleTextButton={{
              color: "#FFFFFF",
              fontSize: SIZE.H5,
              fontWeight: "bold",
            }}
          />
        </View>
      </Modal>
    );
  }
}

export default ModalPolicyNotice;
