import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import TouchableOpacityEx from "./TouchableOpacityEx";
import { Colors, Dimension, Fonts } from "../commons";
import IconView, { IconViewType } from "./IconView";

export default function Checkbox(props) {
  const {
    id,
    isCheck,
    label,
    data,
    style,
    styleIconCheck,
    sizeIcon,
    styleLabel,
    onToggle,
    onPressLabel,
  } = props;
  const [isChecked, setIsCheck] = useState(isCheck);
  const handleOnPressLabel = () => {
    onPressLabel ? onPressLabel({ id, data, isChecked }) : handleOnPress();
  };
  const handleOnPress = () => {
    onToggle && onToggle({ id, data, isChecked: !isChecked });
    setIsCheck(!isChecked);
  };
  return (
    <TouchableOpacityEx
      onPress={handleOnPress}
      style={{ ...styles.styleContains, ...style }}
    >
      <IconView
        onPress={handleOnPress}
        style={{ ...styles.stIconCheck, ...styleIconCheck }}
        name={isChecked ? "radiobox-marked" : "radiobox-blank"}
        type={IconViewType.MaterialCommunityIcons}
        size={sizeIcon || Dimension.sizeIconMenu}
        color={isChecked ? '#00C6AD' : '#747F9E'}
      />
      <Text
        onPress={handleOnPressLabel}
        style={{ ...styles.stLabel, ...styleLabel }}
      >
        {label}
      </Text>
    </TouchableOpacityEx>
  );
}

const styles = StyleSheet.create({
  styleContains: {
    flexDirection: "row",
    alignItems: "center",
  },
  stIconCheck: {
    height: 35,
    width: 35,

    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  stLabel: {
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize14,
    color: Colors.textLabel,
    fontFamily: Fonts.SFProDisplayRegular,
    height: "100%",
  },
});

Checkbox.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleIconCheck: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  backgroundColor: PropTypes.string,
  isCheck: PropTypes.bool,
  onToggle: PropTypes.func,
  onPressLabel: PropTypes.func,
  id: PropTypes.any,
  data: PropTypes.any,
  label: PropTypes.any,
};
