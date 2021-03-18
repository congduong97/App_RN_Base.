import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLOR_GRAY, COLOR_BLACK } from "../../../const/Color";
import { useDarkMode } from "react-native-dark-mode";
export default class InputPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secureTextEntry: true
    };
  }
  changeSecureTextEntry = () => {
    this.setState({ secureTextEntry: !this.state.secureTextEntry });
  };

  render() {
    const { secureTextEntry } = this.state;
    const isDarkMode = useDarkMode;
    const {
      loading,
      onChangeText,
      placeholder,
      maxLength,
      keyboardType
    } = this.props;
    return (
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: "gray",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginBottom: 16
          },
          this.props.styleContainer
        ]}
      >
        <TextInput
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          keyboardType={keyboardType}
          placeholderTextColor={COLOR_GRAY}
          maxLength={maxLength}
          style={[
            {
              height: 40,
              paddingLeft: 16,
              flex: 9,
              color: isDarkMode ? COLOR_BLACK : ""
            }
          ]}
          onChangeText={onChangeText}
          editable={!loading}
          {...this.props}
        />
        <AntDesign
          color={COLOR_GRAY}
          onPress={this.changeSecureTextEntry}
          style={{ flex: 1 }}
          name={secureTextEntry ? "eye" : "eyeo"}
          size={30}
        ></AntDesign>
      </View>
    );
  }
}
