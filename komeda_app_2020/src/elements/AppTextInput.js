import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {COLOR, SIZE} from '../utils';
import Entypo from 'react-native-vector-icons/Entypo';

const AppTextInput = ({
  keyboardType,
  secureTextEntry,
  styleInput,
  styleWrap,
  placeholder,
  onChangeText,
  defaultValue,
  autoCapitalize,
  onBlur,
  maxLength,
  inputRef,
}) => {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);
  const onPressEye = () => {
    setIsVisible(!isVisible);
  };
  const onChangeData = (text) => {
    onChangeText && onChangeText(text);
  };

  return (
    <View style={[{justifyContent: 'center'}, styleWrap]}>
      <TextInput
        ref={inputRef}
        maxLength={maxLength}
        keyboardType={keyboardType}
        secureTextEntry={!isVisible}
        onChangeText={onChangeData}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        style={[{paddingRight: 40}, styleInput]}
      />
      {!!secureTextEntry && (
        <TouchableOpacity
          onPress={onPressEye}
          style={{position: 'absolute', right: 10, top: 10}}>
          <Entypo
            name={!isVisible ? 'eye' : 'eye-with-line'}
            size={SIZE.icon_menu_size}
            color={COLOR.COFFEE_BROWN}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppTextInput;
