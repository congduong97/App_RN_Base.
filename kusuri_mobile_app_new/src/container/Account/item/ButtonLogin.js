import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React, { PureComponent } from "react";
import { APP_COLOR, COLOR_BROWN } from "../../../const/Color";
import Spinner from "react-native-spinkit";

export class ButtonLogin extends PureComponent {
  render() {
    const { style, loadingLogin, onPress, name, styleText } = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.wrapperBottomButton,
          styles.wrapperCenter,
          { backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 },
          style,
        ]}
        onPress={() => {
          if (!loadingLogin) {
            onPress();
          }
        }}
      >
        {loadingLogin ? (
          <Spinner
            color={APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1}
            type={"ThreeBounce"}
          />
        ) : (
          <Text
            style={[
              {
                color: APP_COLOR.COLOR_TEXT_BUTTON_TYPE_1,
                fontSize: 16,
                fontWeight: "bold",
              },
              styleText,
            ]}
          >
            {name}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  wrapperCenter: {
    alignItems: "center",
    justifyContent: "center",
  },

  wrapperBottomButton: {
    width: "100%",
    marginTop: 25,
    marginBottom: 10,
    backgroundColor: COLOR_BROWN,
    height: 45,
    borderRadius: 5,
  },
  textButton: {},
});
