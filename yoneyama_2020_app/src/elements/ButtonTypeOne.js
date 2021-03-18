import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';
import {AppText} from './AppText';
import {COLOR} from '../utils';

const ButtonTypeOne = (props) => {
  const {style, loading, onPress, name, styleText, colorText} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        if (!loading) {
          onPress && onPress();
        }
      }}
      style={[
        styles.wrapperBottomButton,
        styles.wrapperCenter,
        {backgroundColor: COLOR.color_button_type_one},
        style,
      ]}>
      {loading ? (
        <Spinner color={COLOR.color_button_type_one} type={'ThreeBounce'} />
      ) : (
        <AppText
          style={[
            {
              color: colorText ? colorText : COLOR.text_app,
              fontSize: 16,
              fontWeight: 'bold',
            },
            styleText,
          ]}>
          {name}
        </AppText>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  wrapperBottomButton: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLOR.COLOR_BROWN,
    height: 45,
    borderRadius: 5,
  },
  textButton: {},
});

export {ButtonTypeOne};
