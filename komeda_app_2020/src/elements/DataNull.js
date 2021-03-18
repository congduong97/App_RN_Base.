import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {COLOR, STRINGS, SIZE} from '../utils/resources';
import {AppText} from './AppText';
import {AppIcon} from './AppIcon';

const DataNull = (props) => {
  const {style, title, onPress, buttonTitle, buttonIconName} = props;

  const renderExtensionButton = () => {
    if (buttonTitle) {
      return (
        <TouchableOpacity
          style={{
            // flexDirection: "row",
            marginTop: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={onPress}>
          <AppIcon
            type={'MaterialIcons'}
            icon={'refresh'}
            iconColor={COLOR.grey_500}
            iconSize={30}
          />
          <AppText style={{color: COLOR.grey_500}}>
            {title || buttonTitle}
          </AppText>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
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
          textAlign: 'center',
        }}>
        {title || STRINGS.Empty_data}
      </AppText>
      {renderExtensionButton()}
    </View>
  );
};

export {DataNull};
