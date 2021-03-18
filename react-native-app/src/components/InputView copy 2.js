import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';
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
} from 'react-native';
import {useMergeState} from '../AppProvider';
import {Color} from '../commons/constants';
import IconView from './IconView';
const height = 45;
const borderRadius = 4;
const sizeIconClean = height / 2 - 8;
const sizeIconLeft = (2 * height) / 3 - 5;
const colorNormal = '#5C6979';

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
    ? [stViewLabel, {top: toY / 2, left: toX}]
    : [
        stViewLabel,
        {
          opacity: labelAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.5, 1],
          }),
          transform: [{translateX}, {translateY}],
          color: '#345',
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
    onPressIconLeft && onPressIconLeft({id, data});
  };
  if (typeof iconLeft === 'string') {
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

export default function InputView(props) {
  const {
    id,
    value,
    onClearText,
    onBlur,
    editable,
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
    onConvertText,
    fontSizeLabel,
    styleTextLabel,
    label,
    animationDuration,
    easing,
    useNativeDriver,
    stylePlaceholder,
    isError,
    iconEdit,
  } = props;
  const reftInput = useRef();
  const [stateScreen, setStateScreen] = useMergeState({
    valueInput: value,
    isErrored: isError,
  });
  const {valueInput, isErrored} = stateScreen;
  const styleContains = [styles.styleContains, style];
  const stContainsInput = [styles.styleContainsInput, styleInput];
  const stTextLabel = [styles.styleTextLabel, styleTextLabel];
  const stIconClean = [styles.styleIconClean, styleIconClean];
  const stPlaceholder = [styles.stylePlaceholder, stylePlaceholder];
  const stTextInput = [
    styles.styleTextInput,
    styleTextInput,
    !valueInput && stPlaceholder,
  ];

  useEffect(() => {
    const newValue = value;
    const newisError = isError;
    if (props.hasOwnProperty('value') && newValue !== valueInput) {
      setStateScreen({valueInput: newValue});
    }
    if (props.hasOwnProperty('isError') && newisError !== isErrored) {
      setStateScreen({isErrored: newisError});
    }
  }, [props]);

  const labelAnimated = useRef(new Animated.Value(valueInput ? 1 : 0)).current;

  const clear = () => {
    reftInput.current.clear();
  };

  const focus = () => {
    if (props.editable !== false) {
      reftInput.current.focus();
    }
  };

  const isFocused = () => {
    return reftInput.current && eftInput.current.isFocused();
  };

  const handleFocus = (event) => {
    toggle(true);
    onFocus && onFocus(event);
  };

  const changeStyleView = () => {};

  const toggle = (isActive) => {
    changeStyleView();
    if (!valueInput) {
      Animated.timing(labelAnimated, {
        toValue: isActive ? 1 : 0,
        duration: animationDuration,
        easing,
        useNativeDriver: useNativeDriver || true,
      }).start();
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
    handleChangeText('');
    onClearText && onClearText({id, data: ''});
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
    onChangeText && onChangeText({id, data: convertText});
    if (onCausedError) {
      isErrored = !onCausedError({id, data: text});
    }
    setStateScreen({
      isErrored,
      valueInput: convertText,
      numberHad: convertText.length,
    });
  };

  const handleChange = (event) => {};


  return (
    <View style={styleContains}>
      <View style={stContainsInput}>
        <IconLeftView {...props} />
        <TouchableWithoutFeedback onPress={focus}>
          <Animated.View style={styleLabelHolder(labelAnimated, props)}>
            <Text style={stTextLabel}>{label}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        {props.children ? (
          props.children
        ) : (
          <>
            <TextInput
              ref={reftInput}
              {...props}
              style={stTextInput}
              value={valueInput}
              // keyboardType= {"phone-pad"}
              onChangeText={handleChangeText}
              placeholderTextColor={Color.colorText}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              underlineColorAndroid="transparent"
            />
            {isShowClean && valueInput ? (
              <IconView
                onPress={handleClean}
                name="cancel"
                size={sizeIconClean}
                style={stIconClean}
                color={colorNormal}
              />
            ) : null}
          </>
        )}
      </View>
      {isErrored ? (
        <Text style={styles.styleTextError}>{labelError}</Text>
      ) : null}
    </View>
  );
}

const styleIcon = {
  width: height - 4,
  height: height,
  borderRadius: borderRadius,
  justifyContent: 'center',
  alignItems: 'center',
};

const styles = StyleSheet.create({
  styleContains: {
    borderRadius: 4,
    // flex: 1,
    position: 'relative',
  },
  styleContainsInput: {
    height: height,
    position: 'relative',
    flexDirection: 'row',
    borderColor: colorNormal,
    borderRadius: borderRadius,
    alignItems: 'center',
    borderWidth: 0.75,
  },
  styleIconLeft: {
    ...styleIcon,
    borderTopLeftRadius: borderRadius,
    borderBottomLeftRadius: borderRadius,
    alignSelf: 'center',
    // backgroundColor: '#435',
  },

  styleIconClean: {
    ...styleIcon,
    width: height - 10,
    borderTopRightRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    alignSelf: 'center',
  },

  styleTextInput: {
    flex: 1,
    borderRadius: borderRadius,
    fontStyle: 'normal',
    marginLeft: Platform.OS === 'ios' ? 5 : 0,
  },

  styleTextError: {
    color: 'red',
    // fontStyle: 'italic',
    fontSize: 12,
  },

  styleViewLabel: {position: 'absolute'},
  styleTextLabel: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: Color.Purple,
    textAlign: 'center',
  },
  stylePlaceholder: {
    fontWeight: 'normal',
    fontStyle: 'italic',
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
