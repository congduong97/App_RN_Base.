import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Spinner from "react-native-spinkit";
import React, { PureComponent } from "react";
import { APP_COLOR, COLOR_BROWN } from "../const/Color";

export default class ButtonTypeOne extends PureComponent {
  render() {
    const { style, loading, onPress, name, styleText } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.wrapperBottomButton,
          styles.wrapperCenter,
          { backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1 },
          style,
        ]}
        onPress={() => {
          if (!loading) {
            onPress && onPress();
          }
        }}
      >
        {loading ? (
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
    height: 50,
    borderRadius: 5,
  },
  textButton: {},
});
