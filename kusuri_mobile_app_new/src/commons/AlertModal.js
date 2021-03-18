import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { APP_COLOR, COLOR_BLACK, COLOR_WHITE } from "../const/Color";
import { SIZE } from "../const/size";
import Icon from "react-native-vector-icons/AntDesign";
export default class AlertModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showContent: true,
      isVisible: false,
    };
  }

  ableModal = () => {
    this.setState({ isVisible: true });
  };
  disableModal = () => {
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const { isVisible } = this.state;
    return (
      <Modal
        backdropOpacity={0.8}
        animationIn="zoomInDown"
        animationInTiming={600}
        backdropTransitionInTiming={600}
        backdropOpacity={0.4}
        style={{
          margin: 0,
          alignItems: "center",
        }}
        isVisible={isVisible}
        useNativeDriver={true}
      >
        <View
          style={{
            backgroundColor: COLOR_WHITE,
            marginHorizontal: SIZE.width(3),
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
              marginTop: 40,
              color: COLOR_BLACK,
              textAlign: "center",
            }}
          >
            認証が正常に完了しました。
          </Text>
          <Text
            style={{
              color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              marginTop: 30,
              textAlign: "center",
            }}
          >
            【ご注意】
          </Text>
          <Text
            style={{
              color: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              marginHorizontal: 25,
              textAlign: "center",
            }}
          >
            Aocaカードには会員番号、PIN番号とお問い合わせ時に利用する情報が印字されていますので、破棄しないようご注意ください。
          </Text>
          <TouchableOpacity
            style={{
              marginHorizontal: SIZE.width(3),
              paddingVertical: 15,
              borderWidth: 2,
              borderRadius: 3,
              borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_2,
              marginTop: 20,
              marginBottom: 40,
            }}
            onPress={this.disableModal}
          >
            <Text
              style={{
                color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_2,
                fontWeight: "bold",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              トップページへ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={this.disableModal}
          >
            <Icon name="close" size={26} color={COLOR_BLACK} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}
