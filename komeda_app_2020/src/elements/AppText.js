import React from 'react';
import {Text} from 'react-native';
import {SIZE, COLOR} from '../utils/resources';

const AppText = (props) => {
  const {children, style, onPress, numberOfLines} = props;
  return (
    <Text
      {...props}
      style={[
        {
          fontSize: SIZE.H5,
          color: '#4D4D4D',
          fontFamily: 'irohamaru-Regular',
        },
        style,
      ]}
      onPress={onPress}>
      {children}
    </Text>
  );
};

AppText.propTypes = {
  style: Text.propTypes.style,
};

export {AppText};
