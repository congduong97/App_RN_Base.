import React from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { Color, Font } from "../commons/constants"
import {
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { ratioH } from '../commons/utils/devices';
import IconView from './IconView';
const InputWithIcon = (props) => {
  const {
    style,
    stylesText,
    colorIcon,
    typeIcon,
    nameIcon,
    sizeIcon,
    onPressIcon,
  } = props;
  return (
    <View style={[styles.container, style]}>
      <IconView
        style={styles.icon}
        onPress={onPressIcon}
        name={nameIcon}
        type={typeIcon}
        size={sizeIcon || 20}
        color={colorIcon || Color.Border}
      />
      <TextInput
        {...props}
        style={[styles.input, stylesText]}
        underlineColorAndroid="transparent"
        placeholderTextColor={Color.Border}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: responsiveWidth(90),
    height: 40 * ratioH,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 30,
    borderColor: Color.Border,
    justifyContent: 'center',
    paddingHorizontal: 5
  },
  input: {
    flex: 1,
    height: 40 * ratioH,
    fontSize: responsiveFontSize(2),
    marginVertical: 1,
    borderBottomRightRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 0,
    paddingBottom: 0,
    fontFamily: Font.FiraSansRegular,
    color: '#000',
  },
  icon: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 18,
    height: 18,
  },
});
export default InputWithIcon;
