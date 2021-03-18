import React, {useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import {COLOR, SIZE} from '../utils';
import {AppIcon} from './AppIcon';
import {TouchableCo} from './TouchableCo';
import {AppText} from './AppText';
import {BottomService} from '../navigators/services/BottomService';

const {width, height} = Dimensions.get('window');

const ErrorView = (props) => {
  const {icon, errorName, onPress, style, textStyle, displayBottom} = props;

  useEffect(() => {
    BottomService.setDisplay(displayBottom || true);
    return () => {
      BottomService.setDisplay(true);
    };
  }, []);

  const renderIcon = () => {
    if (icon) {
      const {type, name} = icon;
      return (
        <AppIcon
          icon={name}
          type={type}
          iconSize={SIZE.H1 * 2.5}
          iconColor={COLOR.main_color}
        />
      );
    }
    return null;
  };
  const renderTitle = () => {
    if (errorName) {
      return (
        <AppText
          style={[
            {
              color: COLOR.main_color,
              fontSize: SIZE.H5,
              fontFamily: 'irohamaru-Medium',
              textAlign: 'center',
            },
            textStyle,
          ]}>
          {errorName}
        </AppText>
      );
    }
  };
  return (
    <View
      style={[
        {
          flex: 1,
          width,
          backgroundColor: COLOR.white,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}>
      {/* Icon */}
      {renderIcon()}
      {/* Nội dung */}
      {renderTitle()}
      {/* Nút bấm để load lại dữ liệu */}
      <TouchableCo
        onPress={onPress}
        style={{
          width: SIZE.width(84),
          padding: SIZE.padding,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          backgroundColor: COLOR.COFFEE_YELLOW,
          marginTop: SIZE.width(4),
        }}>
        <AppText
          style={{
            fontSize: SIZE.H4 * 0.9,
            color: COLOR.white,
            fontFamily: 'irohamaru-Medium',
          }}>
          再読込み
        </AppText>
      </TouchableCo>
    </View>
  );
};

export {ErrorView};
