import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextPropTypes,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useMergeState } from "../AppProvider";
import { Colors, Dimension } from "../commons";
import IconView, { IconViewType } from "./IconView";
import TouchableOpacityEx from "./TouchableOpacityEx";
const heightDefault = 45;
const borderRadius = 4;
const sizeIconClean = heightDefault / 2 - 8;
const sizeIconLeft = (2 * heightDefault) / 3 - 5;
const colorNormal = "#747F9E";

const styleLabelHolder = (labelAnim, props) => {
  const {
    isShowLabel,
    labelLeft = 0,
    fontSizeLabel = 12,
    styleTextLabel,
    styleViewLabel,
    offsetLabel = 3,
    iconLeft,
    styleIconLeft,
    iconLeftSize,
    height = heightDefault,
  } = props;
  const stViewLabel = [styles.styleViewLabel, styleViewLabel];

  let fontSize = (styleTextLabel && styleTextLabel?.fontSize) || 12;
  let toX = labelLeft || 5;
  let fromX = labelLeft
    ? labelLeft
    : styleViewLabel && styleViewLabel.marginLeft
      ? styleViewLabel.marginLeft
      : iconLeft
        ? iconLeftSize
          ? iconLeftSize
          : styleIconLeft && styleIconLeft.width
            ? styleIconLeft.width
            : sizeIconLeft
        : -2;
  let fromY = 0;
  let toY = -height / 2 - fontSize / 2 - offsetLabel;

  let translateY = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [fromY, toY],
  });

  let translateX = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [fromX, toX],
  });

  return isShowLabel
    ? [stViewLabel, { top: toY / 2, left: toX }]
    : [
      stViewLabel,
      {
        opacity: labelAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.5, 1],
        }),
        transform: [{ translateX }, { translateY }],
        color: "#345",
        fontSize: fontSize,
      },
    ];
};

function IconLeftView(props) {
  const {
    id,
    data,
    iconLeft,
    styleIconLeft,
    iconLeftColor,
    iconLeftSize,
    onPressIconLeft,
  } = props;
  const stContainIconLeft = [styles.styleIconLeft, styleIconLeft];
  const iconColor = iconLeftColor || colorNormal;
  const iconSize = iconLeftSize || sizeIconLeft;
  const handleOnPress = () => {
    onPressIconLeft && onPressIconLeft({ id, data });
  };
  if (typeof iconLeft === "string") {
    return (
      <IconView
        onPress={onPressIconLeft && handleOnPress}
        name={iconLeft}
        size={iconSize}
        style={stContainIconLeft}
        color={iconColor}
      />
    );
  }
  return null;
}

function RightView(props) {
  const {
    id,
    data,
    iconRightName,
    iconRightStyle,
    iconRightColor,
    iconRighSize,
    onPressIconRight,
  } = props;
  const stContainIcon = [styles.styleIconLeft, iconRightStyle];
  const iconColor = iconRightColor || colorNormal;
  const iconSize = iconRighSize || sizeIconLeft;
  const handleOnPress = () => {
    onPressIconRight && onPressIconRight({ id, data });
  };
  if (typeof iconRightName === "string") {
    return (
      <IconView
        onPress={onPressIconRight && handleOnPress}
        name={iconRightName}
        size={iconSize}
        style={stContainIcon}
        color={iconColor}
      />
    );
  }
  return null;
}

export default function InputView(props) {
  const {
    id,
    onPress,
    value,
    onClearText,
    onBlur,
    editable = true,
    onFocus,
    style,
    styleInput,
    styleTextInput,
    isShowClean = true,
    styleIconClean,
    labelError,
    onCausedError,
    onChangeText,
    onChange,
    textDisable,
    onConvertText,
    fontSizeLabel,
    styleTextLabel,
    label,
    animationDuration,
    easing,
    useNativeDriver,
    stylePlaceholder,
    isError,
    styleTextPlaceholder,
    placeholderTextColor,
    placeholder,
    tintcolor,
    hasEye,
    pressShowPass,
    refInputView = null,
    isLableTick = false,
  } = props;
  const reftInput = refInputView ? refInputView : useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    valueInput: value,
    textPlaceholder: placeholder,
    isErrored: isError,
    isShowLableTick: isLableTick
  });
  const { valueInput, isErrored, textPlaceholder, isShowLableTick } = stateScreen;
  const styleContains = [styles.styleContains, style];
  const stContainsInput = [styles.styleContainsInput, styleInput];
  const stTextLabel = [styles.styleTextLabel, styleTextLabel];
  const stIconClean = [styles.styleIconClean, styleIconClean];
  const stPlaceholder = [styles.stylePlaceholder, stylePlaceholder];
  const [showPass, setStateShowPass] = useState(false);
  const stTextInput = [
    styles.styleTextInput,
    styleTextInput,
    !valueInput && stPlaceholder,
  ];

  useEffect(() => {
    const newValue = value;
    const newisError = isError;
    if (props.hasOwnProperty("value") && newValue !== valueInput) {
      setStateScreen({ valueInput: newValue });
    }
    if (props.hasOwnProperty("isError") && newisError !== isErrored) {
      setStateScreen({ isErrored: newisError });
    }
  }, [props]);

  const labelAnimated = useRef(new Animated.Value(valueInput ? 1 : 0)).current;

  const clear = () => {
    editable && reftInput && reftInput.current.clear();
  };

  const focus = () => {
    if (props.editable != false && editable) {
      reftInput && reftInput.current.focus();
    }
  };

  const isFocused = () => {
    return reftInput.current && reftInput.current.isFocused();
  };

  const handleFocus = (event) => {
    toggle(true);
    onFocus && onFocus(event);
  };

  const changeStyleView = () => {

  };

  const toggle = (isActive) => {
    changeStyleView();
    if (!valueInput) {
      Animated.timing(labelAnimated, {
        toValue: isActive ? 1 : 0,
        duration: animationDuration,
        easing,
        useNativeDriver: useNativeDriver || true,
      }).start();
      // this.setState({
      //   placeholder: isActive ? this.label : this.placeholder,
      // });

      if (isLableTick) {
        let isErrored = false
        if (onCausedError) {
          isErrored = !onCausedError({ id, data: valueInput });
        }
        if (isActive) {
          setStateScreen({ textPlaceholder: '', isShowLableTick: false });
        } else {
          setStateScreen({ textPlaceholder: placeholder, isShowLableTick: true, isErrored });
        }
      } else {
        if (isActive) {
          setStateScreen({ textPlaceholder: '' });
        } else {
          setStateScreen({ textPlaceholder: placeholder });
        }
      }
    }
  };

  const handleBlur = (event) => {
    changeStyleView();
    if (!valueInput) {
      toggle(false);
    }
    onBlur && onBlur(event);
  };

  const handleClean = () => {
    clear();
    handleChangeText("");
    onClearText && onClearText({ id, data: "" });
  };

  const nameIconShowPass = () => {
    if (showPass) {
      return "eye-with-line";
    }
    return "eye";
  };

  const showPassWord = () => {
    setStateShowPass(!showPass);
    pressShowPass();
  };

  const handleChangeText = (text) => {
    focus();
    let convertText = text;
    let isErrored = false;
    if (onConvertText) {
      convertText = onConvertText({
        id,
        data: convertText,
      });
    }
    onChangeText && onChangeText({ id, data: convertText });
    if (onCausedError) {
      isErrored = !onCausedError({ id, data: text });
    }
    setStateScreen({
      isErrored,
      valueInput: convertText,
      numberHad: convertText.length,
    });
  };

  const handleChange = (event) => { };
  const handleOnPress = () => {
    !editable && onPress && onPress({ id, data: valueInput });
  };

  const drawContent = () => {
    const stTextDisable = valueInput
      ? { ...styles.stTextDisable, ...textDisable }
      : {
        ...styles.stTextPlaceholder,
        ...styleTextPlaceholder,
        color: placeholderTextColor,
      };
    return editable ? (
      <View style={{ position: 'relative', flex: 1 }}>
        {isShowLableTick && !valueInput ?
          <Text style={[stTextDisable, {
            position: 'absolute',
            bottom: 12,
            left: 0,
            fontSize: 12
          }]}>
            <Text style={{ color: "red" }}>{'*'}</Text>  {textPlaceholder}
          </Text> : null}
        < TextInput
          {...props}
          ref={reftInput}
          style={stTextInput}
          placeholder={isShowLableTick ? "" : textPlaceholder}
          value={valueInput}
          onChangeText={handleChangeText}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          underlineColorAndroid='transparent'
        />
      </View>
    ) : (
      isShowLableTick && !valueInput ?
        <Text style={[stTextDisable, {
          // position: 'absolute',
          // bottom: 12,
          // left: 0,
          fontSize: 12
        }]}>
          <Text style={{ color: "red" }}>{'*'}</Text>  {textPlaceholder}
        </Text> : <Text numberOfLines={props.numberOfLines} style={stTextDisable}>
          {valueInput || placeholder}
        </Text>
    );
  };

  return (
    <TouchableOpacityEx
      style={styleContains}
      onPress={!editable && handleOnPress}
      waitTitme={10}
    >
      <View style={stContainsInput}>
        <IconLeftView {...props} />
        {!editable ? (valueInput ? <TouchableWithoutFeedback activeOpacity={0.2} onPress={focus}>
          <Animated.View style={styleLabelHolder(labelAnimated, props)}>
            <Text style={stTextLabel}>{label}</Text>
          </Animated.View>
        </TouchableWithoutFeedback> : null) :
          <TouchableWithoutFeedback activeOpacity={0.2} onPress={focus}>
            <Animated.View style={styleLabelHolder(labelAnimated, props)}>
              <Text style={[stTextLabel, { color: isErrored ? "red" : Colors.textLabel }]}>{label}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        }
        {drawContent()}
        {hasEye && !!valueInput && (
          <IconView
            onPress={showPassWord}
            name={nameIconShowPass()}
            type={IconViewType.Entypo}
            size={sizeIconClean}
            style={stIconClean}
            color={colorNormal}
          />
        )}
        {isShowClean && valueInput ? (
          <IconView
            onPress={handleClean}
            name='close-circle-outline'
            type={IconViewType.MaterialCommunityIcons}
            size={sizeIconClean}
            style={stIconClean}
            color={colorNormal}
          />
        ) : null}
        <RightView {...props} />
      </View>
      {isErrored ? (
        <Text style={styles.styleTextError}>{labelError}</Text>
      ) : null}
    </TouchableOpacityEx>
  );
}

const styleIcon = {
  width: heightDefault - 4,
  height: heightDefault,
  borderRadius: borderRadius,
  justifyContent: "center",
  alignItems: "center",
};

const styles = StyleSheet.create({
  styleContains: {
    borderRadius: 4,
    // flex: 1,
    position: "relative",
  },
  styleContainsInput: {
    height: heightDefault,
    position: "relative",
    flexDirection: "row",
    borderColor: colorNormal,
    borderRadius: borderRadius,
    alignItems: "center",
    borderWidth: 0.75,
  },
  styleIconLeft: {
    ...styleIcon,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    alignSelf: "center",
    // backgroundColor: '#435',
  },

  styleIconClean: {
    ...styleIcon,
    width: heightDefault - 10,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    alignSelf: "center",
  },

  styleTextInput: {
    flex: 1,
    borderRadius: borderRadius,
    fontStyle: "normal",
    marginLeft: 5,
    // fontWeight: "700",
  },

  styleTextError: {
    color: "red",
    // fontStyle: 'italic',
    fontSize: 12,
  },

  styleViewLabel: { position: "absolute" },
  styleTextLabel: {
    backgroundColor: "transparent",
    fontSize: 14,
    color: Colors.textLabel,
    textAlign: "center",
  },
  stylePlaceholder: {
    fontWeight: "normal",
    // fontStyle: "italic",
  },

  stTextDisable: {
    marginHorizontal: Dimension.margin5,
    flex: 1,
  },

  stTextPlaceholder: {
    fontWeight: "normal",
    fontSize: Dimension.fontSize12,
    // fontStyle: "italic",
    color: Colors.colorBorder,
    marginHorizontal: Dimension.margin5,
    flex: 1,
  },
});
// InputView.defaultProps = {};

InputView.propTypes = {
  style: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
  styleIconLeft: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
  styleInput: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
  styleIconClean: ViewPropTypes ? ViewPropTypes.style : View.propTypes.style,
  styleTextInput: TextPropTypes ? TextPropTypes.style : Text.propTypes.style,
  iconLeft: PropTypes.any,
  value: PropTypes.string,
  isError: PropTypes.bool,
  editable: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onClearText: PropTypes.func,
  onChangeText: PropTypes.func,
};
