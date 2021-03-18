import React from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import TouchableOpacityEx from "./TouchableOpacityEx";
import { Colors, Dimension, Fonts, fontsValue } from "../commons";

export default function ButtonView(props) {
  const {
    id,
    data,
    title,
    style,
    styleText,
    onPress,
    disabled,
    bgColor = Colors.colorMain,
    bgDisable = Colors.colorButtonDisable,
    textColor = "white",
    fontSize = Dimension.fontSizeButton16,
  } = props;
  const styleContain = [
    styles.stContain,
    { backgroundColor: disabled ? bgDisable : bgColor },
    style,
  ];
  const stText = [
    styles.stText,
    styleText,
    { fontSize: fontSize, color: textColor },
  ];

  const handleOnPress = () => {
    onPress && onPress({ id, data });
  };
  return (
    <TouchableOpacityEx
      style={styleContain}
      onPress={handleOnPress}
      disabled={disabled}
    >
      <Text style={stText}>{title}</Text>
    </TouchableOpacityEx>
  );
}

const styles = StyleSheet.create({
  stContain: {
    height: Dimension.heightButton,
    backgroundColor: Colors.colorMain,
    borderRadius: Dimension.radiusButton,
    justifyContent: "center",
  },
  stText: {
    textAlign: "center",
    fontSize: Dimension.fontSizeButton16,
    fontFamily: Fonts.SFProDisplayRegular,
    color: "white",
  },
});

ButtonView.propTypes = {
  id: PropTypes.any,
  data: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleText: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  onPress: PropTypes.func,
};
