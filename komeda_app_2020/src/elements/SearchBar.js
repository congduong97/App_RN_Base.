import React from 'react';
import {View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import {COLOR, SIZE, isIos} from '../utils';
import {AppIcon} from './AppIcon';

const SearchBar = ({
  styleInput,
  styleWrap,
  placeholder,
  onChangeText,
  defaultValue,
  autoCapitalize,
  onBlur,
  onPressFilter,
}) => {
  const onChangeData = (text) => {
    onChangeText && onChangeText(text);
  };
  return (
    <View style={[{padding: !isIos ? 4 : 10}, styles.wrapper, styleWrap]}>
      <TouchableOpacity
        style={{marginHorizontal: SIZE.padding}}
        hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
        onPress={onPressFilter}>
        <AppIcon
          type={'Fontisto'}
          icon={'search'}
          iconColor={'#AFAFAF'}
          iconSize={SIZE.H3}
        />
      </TouchableOpacity>
      <TextInput
        onChangeText={onChangeData}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        style={{
          flex: 1,
          color: '#707070',
          fontSize: SIZE.H5,

          ...styleInput,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
  },
});

export {SearchBar};
