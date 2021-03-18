import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IconView} from '../components';
import {Dimension} from '../commons/constants';

export default function TabBarIcon(props) {
  const {style, name, color, size} = props;
  return (
    <IconView
      style={[styles.styleContains, style]}
      name={name}
      color={color}
      size={size || 24}
    />
  );
}

const styles = StyleSheet.create({
  styleContains: {
    width: 35,
    height: 35,
    alignItems: 'center',
  },
});
