import React from 'react';
import {Text, View} from 'react-native';
import {Color} from '../../commons/constants';
import {IconView} from '../../components';
import styles from './styles';

export default function TitleBlock(props) {
  const {title, style} = props;
  return (
    <View
      style={{
        ...styles.titleBlock,
        ...style,
      }}>
      <IconView
        name="caret-right"
        type="FontAwesome"
        color="white"
        size={25}
        color={Color.MayaBlue}
        size={25}
        style={{marginRight: 8}}
      />
      <Text style={styles.title}>{title.toUpperCase()}</Text>
    </View>
  );
}
