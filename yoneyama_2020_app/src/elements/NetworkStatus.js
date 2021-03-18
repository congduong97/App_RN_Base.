import React, {PureComponent} from 'react';
import {View, Dimensions} from 'react-native';
import {COLOR, STRINGS} from '../utils/resource';
import {AppText} from './AppText';

const {width} = Dimensions.get('window');

export class NetworkStatus extends PureComponent {
  render() {
    const {style, title, textStyle, bgColor} = this.props;
    return (
      <View
        style={[
          {
            width,
            justifyContent: 'center',
            alignItems: 'center',
            height: 24,
            backgroundColor: bgColor || COLOR.STATUS_BAR_ERROR,
          },
          style,
        ]}>
        <AppText style={[{color: COLOR.white, fontSize: 12}, textStyle]}>
          {title || STRINGS.Network_fail_alert}
        </AppText>
      </View>
    );
  }
}
