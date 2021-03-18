import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ViewPropTypes,
  TouchableOpacity,
} from "react-native";
import IconView from "./IconView";
class TextView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onPress = this.onPress.bind(this);
  }

  onPress = () => {
    this.props.onPress && this.props.onPress(this.props.value, this.props.id);
  };

  static propTypes = {
    title: PropTypes.string,
    iconColor: PropTypes.string,
  };

  render() {
    const {
      style,
      iconLeft,
      iconColor,
      iconSize,
      iconLeftStyle,
      iconRight,
      iconColorRight,
      iconRightSize,
      iconRightStyle,
      stylesTextContent,
      title,
      styleTitle,
      value,
      styleValue,
      onPress,
      sourceLeft,
      sourceRight,
    } = this.props;
    let disabledOnPress = onPress ? false : true;
    let styleContainer = [styles.containerStyle, style];
    let styleIconLeft = [styles.iconLeftStyle, iconLeftStyle];
    let styleIconRight = [styles.iconRightStyle, iconRightStyle];
    let titleStyle = [styles.styleTitle, styleTitle];
    let valueStyle = [styles.styleValue, styleValue];
    return (
      <TouchableOpacity
        style={styleContainer}
        disabled={disabledOnPress}
        onPress={this.onPress}
      >
        {iconLeft && (
          <IconView
            style={styleIconLeft}
            name={iconLeft}
            size={iconSize}
            color={iconColor}
          />
        )}
        <View style={stylesTextContent}>
          {title ? <Text style={titleStyle}>{title}</Text> : <View />}
          {value ? <Text style={valueStyle}>{value}</Text> : <View />}
        </View>
        {iconRight && (
          <IconView
            style={styleIconRight}
            name={iconRight}
            size={iconRightSize}
            color={iconColorRight}
          />
        )}
      </TouchableOpacity>
    );
  }
}

TextView.defaultProps = {
  iconSize: 14,
  iconRightSize: 14,
  iconColor: "#9AA6B4",
  iconColorRight: "#9AA6B4",
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  iconLeftStyle: {
    marginRight: 5,
  },
  iconRightStyle: {},

  styleTitle: {
    fontFamily: "Lato-Regular",
    fontSize: 8,
    color: "gray",
    fontStyle: "italic",
  },

  styleValue: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "#5C6979",
  },
});

export default TextView;
