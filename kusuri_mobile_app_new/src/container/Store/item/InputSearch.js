import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { WIDTHDEVICES } from "../../../const/System";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { APP_COLOR, COLOR_WHITE, COLOR_BLACK } from "../../../const/Color";
import { useDarkMode } from "react-native-dark-mode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default class InputSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: ""
    };
  }
  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
  }
  onChangeText = text => {
    this.setState({ textInput: text.trim() });
    this.props.changeDataValue(text);
  };

  focusTextInput = () => {
    this.refs.focus();
  };

  gotoSearch = () => {
    const { submit } = this.props;
    if (submit) {
      submit();
    }
  };
  render() {
    const { onLayOut } = this.props;
    const isDarkMode = useDarkMode;
    return (
      <View
        style={{
          width: "100%"
        }}
        onLayout={onLayOut}
      >
        <View
          style={{
            height: WIDTHDEVICES(45),
            width: WIDTHDEVICES(343),
            margin: WIDTHDEVICES(16),
            borderRadius: 4,
            borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
            borderWidth: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <TextInput
            onSubmitEditing={() => this.gotoSearch()}
            ref={ref => (this.ref = ref)}
            placeholder={"店名・住所などキーワード"}
            placeholderTextColor={"#464646"}
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
              paddingLeft: 5,
              color: isDarkMode ? COLOR_BLACK : ""
            }}
            onChangeText={text => {
              this.onChangeText(text);
            }}
          ></TextInput>
          <TouchableOpacity
            style={{
              height: "100%",
              width: WIDTHDEVICES(30),
              backgroundColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              alignItems: "center",
              justifyContent: "center",
              borderColor: APP_COLOR.COLOR_BORDER_BUTTON_TYPE_1,
              marginLeft: WIDTHDEVICES(4)
            }}
            onPress={this.gotoSearch}
          >
            <FontAwesome name="search" size={20} color={COLOR_WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
