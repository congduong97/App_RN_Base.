import React, { PureComponent } from "react";
import { Text, View, TextInput } from "react-native";
import { SIZE } from "../../../const/size";
import { COLOR_BORDER } from "../../../const/Color";

export default class InputText extends PureComponent {
  onChangeData = (text) => {
    !!this.props.onChangeText && this.props.onChangeText(text);
  };
  render() {
    const {
      keyboardType,
      styleInput,
      placeholder,
      defaultValue,
      autoCapitalize,
      onBlur,
      maxLength,
      inputRef,
      editable,
      multiline,
      onKeyPress,
      value,
    } = this.props;

    return (
      <TextInput
        value={value}
        ref={inputRef}
        maxLength={maxLength}
        keyboardType={keyboardType}
        onChangeText={this.onChangeData}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        editable={!editable}
        multiline={!!multiline}
        onKeyPress={onKeyPress}
        style={[
          {
            fontSize: SIZE.H14,
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: COLOR_BORDER,
            height: 35,
            paddingHorizontal: SIZE.width(3),
            paddingVertical: 0,
          },
          styleInput,
        ]}
      />
    );
  }
}
