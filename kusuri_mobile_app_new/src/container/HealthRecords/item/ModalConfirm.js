import React, { Component } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { SIZE } from "../../../const/size";
import ButtonConfirm from "./ButtonConfirm";
import { TYPE_MODAL } from "../util/constant";
export default class ModalConfirm extends Component {
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
    const { title, onPressConfirm, type } = this.props;
    return (
      <Modal
        hasBackdrop
        isVisible={this.state.isVisible}
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
              fontSize: SIZE.H16,
              fontWeight: "700",
              lineHeight: 20,
            }}
          >
            {type == TYPE_MODAL.DELETE
              ? `${title}を削除します。\n よろしいですか？`
              : "入力した内容を破棄して戻ります。\n よろしいですか？"}
          </Text>
          <ButtonConfirm
            textButton={type == TYPE_MODAL.DELETE ? "削除する" : "破棄して戻る"}
            onPress={() => {
              !!onPressConfirm && onPressConfirm();
              this.handleVisible();
            }}
            styleButton={{
              marginHorizontal: SIZE.width(8),
              marginTop: 45,
              backgroundColor:
                type == TYPE_MODAL.DELETE ? "#E41018" : "#06B050",
              borderColor: type == TYPE_MODAL.DELETE ? "#E41018" : "#06B050",
            }}
          />
          <ButtonConfirm
            textButton={"キャンセル"}
            onPress={this.handleVisible}
            styleButton={{
              marginHorizontal: SIZE.width(8),
              backgroundColor: "white",
              marginTop: 20,
              marginBottom: 40,
            }}
            styleTextButton={{ color: "#06B050" }}
          />
        </View>
      </Modal>
    );
  }
}
