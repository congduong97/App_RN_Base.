import React from 'react';
import {TouchableCo, AppIcon} from '../elements';

const AppIconButton = (props) => {
  const {onPress, icon, style, hitSlop, disabled} = props;
  const {iconName, iconColor, iconSize, iconType} = icon;
  return (
    <TouchableCo
      disabled={disabled}
      onPress={onPress}
      hitSlop={hitSlop}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        },
        style,
      ]}>
      <AppIcon
        type={iconType}
        icon={iconName}
        iconColor={iconColor}
        iconSize={iconSize}
      />
    </TouchableCo>
  );
};

export {AppIconButton};
