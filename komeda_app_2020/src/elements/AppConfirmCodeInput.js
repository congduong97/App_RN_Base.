import React, {PureComponent} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {COLOR, SIZE} from '../utils';

export default class AppConfirmCodeInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      codeArr: new Array(this.props.codeLength).fill(''),
      currentIndex: 0,
    };
    this.codeInputRefs = [];
  }

  setFocus(index) {
    this.codeInputRefs[index].focus();
  }

  blur(index) {
    this.codeInputRefs[index].blur();
  }

  onInputCode(text, index) {
    const {codeLength, onFulfill, onCodeChange, codeInputLength} = this.props;
    this.state.currentIndex = index;
    let newCodeArr = [...this.state.codeArr];
    newCodeArr[index] = text;

    if (index == codeLength - 1) {
      if (newCodeArr[index].length > codeInputLength / codeLength) {
        this.blur(this.state.currentIndex);
      }
      onFulfill && onFulfill(newCodeArr.join(''));
    } else {
      if (newCodeArr[index].length < codeInputLength / codeLength + 0.5) {
        return;
      }
      this.setFocus(this.state.currentIndex + 1);
    }
    this.setState(
      {codeArr: newCodeArr, currentIndex: this.state.currentIndex + 1},
      () => {
        onCodeChange && onCodeChange(newCodeArr.join(''));
      },
    );
  }

  render() {
    const {
      codeLength,
      textInputStyle,
      wrapperStyle,
      autoFocus,
      activeColor,
      codeInputLength,
    } = this.props;

    let codeInputs = [];
    for (let i = 0; i < codeLength; i++) {
      codeInputs.push(
        <TextInput
          keyboardType={'number-pad'}
          key={i.toString()}
          ref={(ref) => (this.codeInputRefs[i] = ref)}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: SIZE.padding / 2,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: COLOR.main_color,
            marginHorizontal: SIZE.padding / 3,
            ...textInputStyle,
          }}
          underlineColorAndroid='transparent'
          selectionColor={activeColor}
          returnKeyType={'done'}
          {...this.props}
          autoFocus={autoFocus && i == 0}
          onChangeText={(text) => this.onInputCode(text, i)}
          maxLength={codeInputLength}
        />,
      );
    }

    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginVertical: SIZE.padding,
          ...wrapperStyle,
        }}>
        {codeInputs}
      </View>
    );
  }
}
