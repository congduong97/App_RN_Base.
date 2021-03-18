import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SIZE, COLOR, STYLE} from '../utils';
import {AppIcon} from './AppIcon';
import {TouchableCo} from './TouchableCo';
import {AppText} from './AppText';

export default class AppCheckBox extends Component {
  constructor(props) {
    super(props);
    const {value} = props;
    this.state = {
      value: value || false,
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    onRef && onRef(this);
  }

  onChangeData = () => {
    const {value} = this.state;
    const {onChangeData} = this.props;

    if (onChangeData) {
      onChangeData(!value);
    }

    this.setState({value: !value});
  };

  setValue = (value) => {
    this.setState({value});
  };

  getValue = () => {
    return this.state.value;
  };

  render() {
    const {
      style,
      size,
      iconColor,
      text,
      textStyle,
      containerStyle,
    } = this.props;
    const {value} = this.state;

    const checkBoxSize = {
      width: size || SIZE.icon_size_ionicons,
      height: size || SIZE.icon_size_ionicons,
    };

    return (
      <TouchableCo
        hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
        style={[
          {flexDirection: 'row', justifyContent: 'center'},
          containerStyle,
        ]}
        onPress={this.onChangeData}>
        <View
          style={[
            STYLE.center,
            {
              backgroundColor: value ? '#1976D2' : COLOR.grey_300,
              borderRadius: 4,
            },
            style,
            checkBoxSize,
          ]}>
          {value && (
            <AppIcon
              type={'MaterialIcons'}
              icon={'done'}
              iconColor={iconColor || COLOR.white}
              iconSize={
                size ? (size * 2) / 3 : (SIZE.icon_size_ionicons / 3) * 2
              }
            />
          )}
        </View>
        <AppText
          style={[
            {fontSize: SIZE.H5 * 1.2, marginLeft: SIZE.padding},
            textStyle,
          ]}>
          {text}
        </AppText>
      </TouchableCo>
    );
  }
}
