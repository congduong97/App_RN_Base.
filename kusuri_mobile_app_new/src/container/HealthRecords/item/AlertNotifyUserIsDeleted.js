//Library:
import React, { PureComponent } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { NavigationActions } from "react-navigation";

//Setup:
import { SIZE } from "../../../const/size";
import { COLOR_WHITE, COLOR_BLACK } from "../../../const/Color";

//Component:
import ButtonConfirm from "./ButtonConfirm";

//Services:
import NavigationService from "../../../service/NavigationService";
export default class AlertNotifyUserIsDeleted extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
  }

  ableModal = () => {
    this.setState({ isVisible: true });
  };

  disableModal = () => {
    let arrayScreen = [
      NavigationActions.navigate({ routeName: "HOME" }),
      NavigationActions.navigate({ routeName: "HEALTH_RECORD" }),
    ];
    NavigationService.reset(1, arrayScreen);
    this.setState({
      isVisible: false,
    });
  };

  render() {
    const { isVisible } = this.state;
    return (
      <Modal
        animationInTiming={300}
        backdropTransitionInTiming={300}
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
            borderRadius: 5,
            paddingHorizontal: SIZE.width(8),
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginTop: 40,
              color: COLOR_BLACK,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            選択したユーザーが削除されました、リロードしてください。
          </Text>
          <ButtonConfirm
            textButton={"OK"}
            onPress={this.disableModal}
            styleButton={{
              marginTop: 45,
              backgroundColor: "#E41018",
              borderColor: "#E41018",
              marginBottom: 40,
            }}
          />
        </View>
      </Modal>
    );
  }
}
