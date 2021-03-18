import React, {PureComponent} from 'react';
import {View, Dimensions} from 'react-native';

import {COLOR} from '../utils';
import {TouchableCo} from '../elements';
import {AppText} from './AppText';

const {width} = Dimensions.get('window');

class Loading extends PureComponent {
  render() {
    const {style, title} = this.props;
    return (
      <TouchableCo>
        <View
          style={[
            {
              width,
              backgroundColor: COLOR.TRANSPARENT,
              justifyContent: 'center',
              alignItems: 'center',
            },
            style,
          ]}>
          {/* <Icon /> */}
          <AppText>{title}</AppText>
        </View>
      </TouchableCo>
    );
  }
}
export {Loading};
