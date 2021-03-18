import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLOR_GRAY, COLOR_BLUE_LIGHT, COLOR_BLACK} from '../../../const/Color';
import {useDarkMode} from 'react-native-dark-mode';
export default class InputPassword extends Component {
  constructor(props) {
    super(props);
    const {disableSercurity} = this.props;
    this.state = {
      secureTextEntry: !disableSercurity,
      value: '',
    };
  }
  changeSecureTextEntry = () => {
    this.setState({secureTextEntry: !this.state.secureTextEntry});
  };
  onChangeText = value => {
    const {onChangeText, keyboardType} = this.props;
    let textNumber = '';
    if (keyboardType === 'number-pad' && value && value.length >= 1) {
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        if (!isNaN(parseInt(element))) {
          textNumber = `${textNumber}${element}`;
        }
      }
    } else {
      textNumber = value;
    }
    onChangeText(textNumber);
    this.setState({value: textNumber});
  };

  render() {
    const {secureTextEntry, value} = this.state;
    const {
      loading,
      placeholder,
      maxLength,
      keyboardType,
      disableSercurity,
    } = this.props;
    const isDarkMode = useDarkMode;
    return (
      <View
        style={[
          {
            borderWidth: 1,
            borderColor: COLOR_BLUE_LIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginBottom: 16,
          },
          this.props.styleContainer,
        ]}>
        <TextInput
          value={value}
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
              color: isDarkMode ? COLOR_BLACK : '',
            },
          ]}
          editable={!loading}
          {...this.props}
          onChangeText={this.onChangeText}
        />
        {disableSercurity ? null : (
          <AntDesign
            color={COLOR_GRAY}
            onPress={this.changeSecureTextEntry}
            style={{width: 30, marginRight: 8}}
            name={secureTextEntry ? 'eye' : 'eyeo'}
            size={30}
          />
        )}
      </View>
    );
  }
}
