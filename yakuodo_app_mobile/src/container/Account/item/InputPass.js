import React, {PureComponent} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import {HandleInput} from '../util/service';
import {
  COLOR_GRAY_LIGHT,
  COLOR_GRAY,
  COLOR_BLUE_LIGHT,
  COLOR_RED,
  COLOR_BLACK,
} from '../../../const/Color';
import {isIOS, DEVICE_WIDTH} from '../../../const/System';
import {useDarkMode} from 'react-native-dark-mode';
export const maxSizeText = DEVICE_WIDTH / 26;
export class InputPass extends PureComponent {
  constructor(props) {
    super(props);
    const {value} = this.props;
    this.state = {
      text: value,
      valueFisrt: value,
    };
  }

  componentWillReceiveProps = nextProps => {
    if (
      nextProps &&
      (nextProps.value || nextProps.value === '') &&
      nextProps.value !== this.state.text
    ) {
      this.setState({text: nextProps.value});
    } else {
      if (nextProps.error) {
        this.setState({text: ''});
      }
    }
  };
  componentDidMount() {
    const {index, changeDataParent, nameScreen} = this.props;

    HandleInput.onChange(`InputLogin${index}${nameScreen}`, data => {
      if (
        data &&
        data.value &&
        data.index === index &&
        data.nameScreen === nameScreen
      ) {
        changeDataParent(index, data.value);
        this.setState({text: data.value});
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
  }
  componentWillUnmount() {
    const {index, nameScreen} = this.props;
    HandleInput.unChange(`InputLogin${index}${nameScreen}`);
  }

  changeText = value => {
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
    if (!isNaN(value)) {
      // alert('vao is');

      if (value.length === 0) {
        changeDataParent(index, value);

        this.setState({text: value});

        HandleInput.set({
          index: index - 1,
          nameScreen,
        });
      }
      if (value.length === 1) {
        changeDataParent(index, value);
        this.setState({text: value});

        HandleInput.set({
          index: index + 1,
          nameScreen,
        });
      }
      if (value.length === 2) {
        HandleInput.set({
          index: index + 1,
          value: value[1],
          nameScreen,
        });
      }
    } else if (value === '') {
      HandleInput.set({
        index: index - 1,
        nameScreen,
      });
      changeDataParent(index, value);

      this.setState({text: value});
    }
  };
  handleKeyPress = ({nativeEvent: {key: keyValue}}) => {
    if (keyValue === 'Backspace') {
      const {index, nameScreen} = this.props;
      HandleInput.set({
        index: index - 1,
        nameScreen,
      });
    }
  };

  handleKeyPressed = key => {
    this.setState({text: `${this.state.label}${key}`});
  };
  getMarginLeft = () => {
    const {index, autoFocus, marginCenter} = this.props;
    if (marginCenter) {
      return 10;
    }
    if (autoFocus) {
      return maxSizeText / 3;
    }
    if (index === 4 || index === 8 || index === 12) {
      return 10;
    }
    return 1;
  };
  render() {
    const {
      autoFocus,
      loading,
      end,
      widthInput,
      error,
      secureTextEntry,
    } = this.props;
    const {text} = this.state;
    const isDarkMode = useDarkMode;
    return (
      <TouchableOpacity
        onPress={() => {
          this.textInput.focus();
        }}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: widthInput * 1.5,
            borderWidth: 1,
            borderColor: error ? COLOR_RED : COLOR_BLUE_LIGHT,
            padding: 4,
          }}>
          <TextInput
            ref={ref => {
              this.textInput = ref;
            }}
            style={{
              fontSize: widthInput ? widthInput : 20,
              paddingLeft: widthInput ? (widthInput / 5) * 1.5 : 2 * 1.5,
              color: isDarkMode ? COLOR_BLACK : '',
            }}
            autoFocus={autoFocus}
            secureTextEntry={secureTextEntry}
            onChangeText={value => {
              if (!loading) {
                this.changeText(value);
              }
            }}
            value={`${text}`}
            // maxLength={end ? 1 : 2}
            keyboardType={'number-pad'}
            onKeyPress={this.handleKeyPress}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
