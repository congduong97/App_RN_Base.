import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Font from '../commons/constants/Font';
import withPreventDoubleClick from './PreventDoubleClick';
const TouchableOpacityEx = withPreventDoubleClick(TouchableOpacity);

const Button = ({id, data, onPress, color, style, title, titleStyle}) => {
  const handleOnClick = () => {
    onPress && onPress({id, data});
  };

  return (
    <TouchableOpacityEx
      onPress={handleOnClick}
      style={[styles.button, {backgroundColor: color}, style]}>
      <Text style={[styles.buttonText, titleStyle]}>{title}</Text>
    </TouchableOpacityEx>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 9,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: Font.FiraSansRegular,
  },
});
export default Button;
