import React, {PureComponent} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, TouchableOpacity} from 'react-native';
import {COLOR, STRINGS, SIZE} from '../utils/resource';
import {AppText} from './AppText';

class DataNull extends PureComponent {
  renderExtensionButton = () => {
    const {onPress, buttonTitle, title, buttonIconName} = this.props;
    if (buttonTitle) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPress}>
          <Ionicons
            name={buttonIconName || 'ios-search'}
            size={30}
            style={{marginRight: 8}}
            color={COLOR.grey_500}
          />
          <AppText style={{color: COLOR.grey_500}}>
            {title || buttonTitle}
          </AppText>
        </TouchableOpacity>
      );
    }
  };

  render() {
    const {style, title} = this.props;
    return (
      <View
        style={[
          {
            width: '100%',
            backgroundColor: COLOR.TRANSPARENT,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}>
        <AppText
          style={{
            fontWeight: '700',
            fontSize: 20,
            color: COLOR.grey_700,
          }}>
          {title || STRINGS.Empty_data}
        </AppText>
        {this.renderExtensionButton()}
      </View>
    );
  }
}
export {DataNull};
