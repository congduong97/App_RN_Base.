import React, {Component} from 'react';
import {View} from 'react-native';

import {SIZE} from '../utils';
import Slider from '@react-native-community/slider';
import {AppText} from './AppText';

export default class AppSlider extends Component {
  constructor(props) {
    super(props);
    const {minimumValue} = this.props;
    let valueText = '';
    if (props.value) {
      valueText = props.value.toString();
    }

    this.state = {
      content: '',
      value: valueText || minimumValue,
    };
  }

  onChangeData = (value) => {
    const {onChangeData} = this.props;
    if (onChangeData) {
      onChangeData(value);
    }

    this.setState({value});
  };
  setValue = (value) => {
    this.setState({value});
  };

  render() {
    const {
      style,
      minimumValue,
      maximumValue,
      minimumTrackTintColor,
      maximumTrackTintColor,
      disabled,
      containerStyle,
      labelText,
      unitOfMeasure,
      styleLabelView,
      onSlidingComplete,
      onSlidingStart,
    } = this.props;
    const {value} = this.state;

    const valueToDisplay = parseInt(value, 10);
    return (
      <View style={[{flexDirection: 'column'}, containerStyle]}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: SIZE.margin * 2,
            },
            styleLabelView,
          ]}>
          <AppText>{labelText}</AppText>
          <AppText>
            {valueToDisplay} {unitOfMeasure}
          </AppText>
        </View>
        <Slider
          style={[{width: 200, height: 40}, style]}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumTrackTintColor={maximumTrackTintColor}
          onValueChange={this.onChangeData}
          disabled={disabled}
          onSlidingComplete={onSlidingComplete}
          onSlidingStart={onSlidingStart}
          value={value}
        />
      </View>
    );
  }
}
