import React, {useState} from 'react';
import {View, TouchableOpacity, TextInput} from 'react-native';
import {COLOR, SIZE} from '../utils';
import Entypo from 'react-native-vector-icons/Entypo';

const AppTextInput = ({
  secureTextEntry,
  styleInput,
  styleWrap,
  placeholder,
  onChangeText,
  defaultValue,
  autoCapitalize,
  onBlur,
  maxLength,
}) => {
  const [isVisible, setIsVisible] = useState(!secureTextEntry);

  const onPressEye = () => {
    setIsVisible(!isVisible);
  };
  const onChangeData = (text) => {
    onChangeText(text);
  };
  return (
    <View style={styleWrap}>
      <TextInput
        textContentType={'password'}
        keyboardType={'ascii-capable'}
        secureTextEntry={!isVisible}
        maxLength={maxLength}
        onChangeText={onChangeData}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        style={styleInput}
      />
      {!!secureTextEntry && (
        <TouchableOpacity
          onPress={onPressEye}
          style={{position: 'absolute', right: 10, top: 10}}>
          <Entypo
            name={isVisible ? 'eye' : 'eye-with-line'}
            size={SIZE.icon_menu_size}
            color={COLOR.grey_700}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AppTextInput;
