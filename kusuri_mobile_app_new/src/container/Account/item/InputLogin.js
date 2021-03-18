import React, { PureComponent } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import { useDarkMode } from "react-native-dark-mode";
import {
  HandleInput,
  ServiceActiveFocusPhoneInLoginByPhone,
} from "../util/service";
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_BLACK,
} from "../../../const/Color";
import { isIOS, DEVICE_WIDTH } from "../../../const/System";
import { SIZE } from "../../../const/size";
export const maxSizeText = DEVICE_WIDTH / 26;

export class InputLogin extends PureComponent {

  backSpaceTimeout = null;

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      text: value,
      valueFisrt: value,
    };
  }
  // static getDerivedStateFromProps(props, state) {
  //     // Any time the current user changes,
  //     // Reset any parts of state that are tied to that user.
  //     // In this simple example, that's just the email.
  //     if (props.value !== state.text && props.value !== vle ) {
  //       return {
  //         text: props.value,
  //         valueFisrt:props.value
  //       };
  //     }

  //     return {
  //         text: state.text,
  //       };;
  //   }
  componentWillReceiveProps = (nextProps) => {
    if (nextProps && nextProps.value && nextProps.value !== this.state.text) {
      this.setState({ text: nextProps.value });
    }
  };
  componentDidMount() {
    const { index, changeDataParent, nameScreen } = this.props;
    HandleInput.onChange(`InputLogin${index}${nameScreen}`, (data) => {
      if (
        data &&
        data.value === "clear" &&
        data.index === index &&
        data.nameScreen === nameScreen
      ) {
        this.textInput.clear();
        this.textInput.focus();
        this.setState({ text: "" });
        changeDataParent(index, "");
        return;
      }
      if (
        data &&
        data.value &&
        data.index === index &&
        data.nameScreen === nameScreen
      ) {
        changeDataParent(index, data.value);
        this.setState({ text: data.value });
        HandleInput.set({
          index: index + 1,
          nameScreen,
        });
        return;
      }

      if (
        data &&
        !data.value &&
        data.index === index &&
        data.nameScreen === nameScreen
      ) {
        this.textInput.focus();
      }
    });
    ServiceActiveFocusPhoneInLoginByPhone.onChange(
      `active_phone ${index}`,
      (event) => {
        // console.log("event", event);
        // console.log("index", index);
        // console.log("nameScreen", nameScreen);
        if (
          event == "ACTIVE_PHONE" &&
          nameScreen == "EnterPhoneScreenLoginWithPhone" &&
          index == 0
        ) {
          this.textInput.focus();
        }
      }
    );
  }
  componentWillUnmount() {
    const { index, nameScreen } = this.props;
    HandleInput.unChange(`InputLogin${index}${nameScreen}`);
    ServiceActiveFocusPhoneInLoginByPhone.remove(`active_phone ${index}`);
    if (this.backSpaceTimeout) {
      clearTimeout(this.backSpaceTimeout);
    }
  }

  changeText = (value) => {
    // alert(value);

    const {
      index,
      changeDataParent,
      nameScreen,
      changeDataParentFillOtp,
    } = this.props;
    if (value && value.length === 6) {
      changeDataParentFillOtp && changeDataParentFillOtp(value);
      return;
    }
    if (!isNaN(value) && !value.includes(" ") && !value.includes(".")) {
      if (value.length === 0) {
        changeDataParent(index, value);
        this.setState({ text: value });
      }

      if (value.length === 1) {
        changeDataParent(index, value);
        this.setState({ text: value });

        HandleInput.set({
          index: index + 1,
          nameScreen,
        });
      }
      if (value.length === 2) {
        HandleInput.set({
          index: index,
          value: value[1],
          nameScreen,
        });
      }
    } else if (value === "") {
      // HandleInput.set({
      //   index: index - 1,
      //   nameScreen,
      // });
      changeDataParent(index, value);

      this.setState({ text: value });
    }
  };
  handleKeyPress = ({ nativeEvent: { key: keyValue }, timeStamp }) => {
    if (isIOS) {
      if (keyValue === "Backspace") {
        const { index, nameScreen } = this.props;
        if (this.state.text.length === 0) {
          HandleInput.set({
            index: index - 1,
            value: "clear",
            nameScreen,
          });
        }
      }
    } else {
      if (keyValue === "Backspace") {
        const { index, nameScreen } = this.props;
        if (this.state.text.length === 0) {
          if (this.backSpaceTimeout) {
            clearTimeout(this.backSpaceTimeout);
          }
          this.backSpaceTimeout = setTimeout(() => {
            if (this.state.text.length === 0) {
              HandleInput.set({
                index: index - 1,
                value: "clear",
                nameScreen,
              });
            }
          }, 30);
        }
      }
    }
  };

  handleKeyPressed = (key) => {
    this.setState({ text: `${this.state.label}${key}` });
  };
  getMarginLeft = () => {
    const { index, autoFocus, marginCenter } = this.props;
    if (marginCenter) {
      return 10;
    }
    if (autoFocus) {
      return maxSizeText / 3;
    }
    if (index === 4 || index === 8 || index === 12) {
      return SIZE.width(3);
    }
    return 1;
  };
  render() {
    const {
      autoFocus,
      loading,
      end,
      widthInput,
      customInputStyle,
      customViewInputStyle,
      editable,
    } = this.props;
    const { text } = this.state;
    const isDarkMode = useDarkMode;

    return (
      <TouchableOpacity
        onPress={() => {
          this.textInput.focus();
        }}
        style={[
          {
            justifyContent: "center",
            alignItems: "center",
            margin: 2,
            marginLeft: this.getMarginLeft(),
          },
          customViewInputStyle,
        ]}
      >
        <View style={{ borderColor: COLOR_GRAY_LIGHT, width: widthInput }}>
          <TextInput
            ref={(ref) => {
              this.textInput = ref;
            }}
            style={[
              {
                fontSize: widthInput ? widthInput : 18,
                paddingLeft: widthInput ? widthInput / 5 : 2,
                color: isDarkMode ? COLOR_BLACK : "",
              },
              customInputStyle,
            ]}
            autoFocus={autoFocus}
            onChangeText={(value) => {
              if (!loading) {
                this.changeText(value);
              }
            }}
            editable={editable}
            value={`${text}`}
            // maxLength={end ? 1 : 2}
            keyboardType={"number-pad"}
            onKeyPress={this.handleKeyPress}
          />

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: COLOR_GRAY,
              width: "100%",
              height: 1,
              position: "absolute",
              bottom: !isIOS ? maxSizeText / 2 : 0,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
