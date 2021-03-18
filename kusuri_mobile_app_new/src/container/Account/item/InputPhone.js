import React, { PureComponent } from "react";
import { TextInput } from "react-native";
import { COLOR_GRAY, COLOR_BLACK } from "../../../const/Color";
import { useDarkMode } from "react-native-dark-mode";
export default class InputPhone extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  onChangeText = text => {
    const { onChangeText } = this.props;
    if (text === "" || text === "0") {
      onChangeText(text);
      this.setState({ text });
      return;
    }
    if (text && !isNaN(text)) {
      let textSet = parseInt(text);
      if (text[0] === "0" && textSet !== 0) {
        textSet = `0${textSet}`;
      }
      if (`${textSet}` !== "NaN") {
        onChangeText(`${textSet}`);
        this.setState({ text: `${textSet}` });
      }
    }
  };

  render() {
    const {
      placeholder,
      maxLength,
      placeholderTextColor,
      keyboardType,
      editable
    } = this.props;
    const isDarkMode = useDarkMode;
    return (
      <TextInput
        placeholder={placeholder}
        maxLength={maxLength}
        placeholderTextColor={placeholderTextColor}
        keyboardType={keyboardType}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          paddingLeft: 16,
          marginBottom: 16,
          color: isDarkMode ? COLOR_BLACK : ""
        }}
        onChangeText={this.onChangeText}
        editable={editable}
        value={this.state.text}
      />
    );
  }
}
