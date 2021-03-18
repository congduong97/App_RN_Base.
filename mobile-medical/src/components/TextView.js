import React, { useState, memo } from "react";
import { StyleSheet, Text, View, Keyboard } from "react-native";
import PropTypes from "prop-types";
import { Colors, Dimension, Fonts } from "../commons";
import IconView, { IconViewType } from "./IconView";
import TouchableOpacityEx from "./TouchableOpacityEx";
function iconLeft(props) {
  const {
    nameIconLeft,
    onPressIconLeft,
    styleIconLeft,
    typeIconLeft,
    sizeIconLeft,
    colorIconLeft,
  } = props;
  if (nameIconLeft) {
    const onPress = () => {
      onPressIconLeft && onPressIconLeft();
    };
    return (
      <IconView
        {...props}
        onPress={onPressIconLeft && onPress}
        style={[styles.styleIcon, styleIconLeft]}
        name={nameIconLeft}
        type={typeIconLeft || IconViewType.EVIcon}
        size={sizeIconLeft || Dimension.sizeIconText}
        color={colorIconLeft || Colors.colorIcon}
      />
    );
  }
}

function centerElement(props) {
  if (!props || (props.centerElement && props.centerElement.props)) {
    return <View style={styles.customTitle}>{props.centerElement}</View>;
  } else {
    const onPress = () => {
      if (props.onPressText) {
        Keyboard.dismiss();
        props.onPressText({ id: props.id, data: props.value });
      } else {
        // neu khong co onPressText thi dung onPress
        Keyboard.dismiss();
        props.onPress({ id: props.id, data: props.value });
      }
    };
    let disabled =
      props.disabled !== undefined
        ? props.disabled
        : props.onPressText
        ? false
        : true;
    let style = props.disabled
      ? props.styleContainerTextDisable
      : [styles.styleContainerText, props.styleContainerText];
    let styleText = props.disabled
      ? props.styleTextDisabled
      : [styles.styleText, props.styleText];
    const contentText = props.children ? (
      <Text style={styleText} numberOfLines={props.numberOfLines}>
        {props.children}
      </Text>
    ) : (
      <View style={style}>
        {props.title ? (
          <Text style={[styles.styleTitle, props.styleTitle]}>
            {props.title}
          </Text>
        ) : null}
        {props.value ? (
          <Text
            style={[styles.styleValue, props.styleValue]}
            numberOfLines={props.numberOfLines}
          >
            {props.value}
          </Text>
        ) : null}
      </View>
    );
    return (
      <TouchableOpacityEx
        style={style}
        disabled={disabled}
        onPress={onPress}
        waitTitme={props.waitTitme}
      >
        {contentText}
      </TouchableOpacityEx>
    );
  }
}

function iconRight(props) {
  const {
    nameIconRight,
    onPressIconRight,
    styleIconRight,
    typeIconRight,
    sizeIconRight,
    colorIconRight,
  } = props;

  if (nameIconRight) {
    const onPress = () => {
      onPressIconRight && onPressIconRight();
    };
    return (
      <IconView
        onPress={onPressIconRight && onPress}
        style={[styles.styleIcon, styleIconRight]}
        name={nameIconRight}
        type={typeIconRight || IconViewType.EVIcon}
        size={sizeIconRight || Dimension.sizeIconText}
        color={colorIconRight || Colors.colorIcon}
      />
    );
  }
}

const TextView = memo((props) => {
  const onPress = () => {
    if (props.onPress) {
      Keyboard.dismiss();
      props.onPress({ id: props.id, data: props.data });
    }
  };
  let disabled =
    props.disabled !== undefined
      ? props.disabled
      : props.onPress
      ? false
      : true;
  let style = props.disabled
    ? props.styleDisable
    : [styles.styleContainer, props.style];
  return (
    <TouchableOpacityEx
      style={style}
      disabled={disabled}
      onPress={onPress}
      waitTitme={props.waitTitme}
    >
      {iconLeft(props)}
      {props.leftElement}
      {centerElement(props)}
      {props.rightElement}
      {iconRight(props)}
    </TouchableOpacityEx>
  );
});

TextView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleDisable: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleTextDisabled: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleContainerText: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleText: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleValue: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  styleTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  text: PropTypes.string,
  disabled: PropTypes.bool,
  textTransform: PropTypes.string,
  waitTitme: PropTypes.number,
};

TextView.defaultProps = {
  style: {
    // justifyContent: 'center',
  },
  styleText: {
    color: "black",
    fontSize: 14,
  },
  styleTextDisabled: {
    color: "gray",
    fontSize: 14,
  },
};

const styles = StyleSheet.create({
  styleContainer: {
    flexDirection: "row",
    // backgroundColor: "#234",
  },

  styleContainerText: {
    position: "relative",
  },

  styleText: {
    color: "black",
    fontSize: 14,
  },
  styleTextDisabled: {
    color: "gray",
    fontSize: 14,
  },

  styleIcon: {
    alignSelf: "center",
  },

  customTitle: {
    justifyContent: "center",
    alignItems: "center",
  },
  styleTitle: {
    // fontFamily: 'Lato-Regular',
    fontSize: Dimension.fontSize14,
    color: "gray",
    // fontStyle: "italic",
  },

  styleValue: {
    // fontFamily: 'Lato-Regular',
    fontSize: Dimension.fontSize14,
    color: Colors.colorText,
  },
});

export default TextView;
