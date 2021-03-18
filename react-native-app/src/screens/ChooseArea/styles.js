import {StyleSheet, Platform} from 'react-native';
import {Dimension, Color, Font} from '../../commons/constants';

export default StyleSheet.create({
  stContain: {
    flex: 1,
    paddingBottom: 30,
  },
  stContainRow: {
    height: Dimension.heightInputView,
    marginHorizontal: Dimension.margin,
    alignItems: 'center',
    borderBottomColor: Color.colorBg2,
    borderBottomWidth: 0.5,
  },
  stTextValue: {
    fontSize: Dimension.fontSize16,
    fontFamily: Font.FiraSansMedium,
  },
  /////

  stInput: {
    margin: Dimension.margin2x,
    borderRadius: Dimension.radiusButton,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorBg2,
  },

  styleContainInput: {
    height: 46,
    borderColor: Color.borderColor,
  },
  stIconSearch: {
    backgroundColor: Color.MayaBlue,
    height: '100%',
    width: Platform.OS === 'ios' ? 56 : 40,
  },
});
