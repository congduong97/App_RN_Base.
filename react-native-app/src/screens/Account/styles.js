import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Color, Dimension, Font, Size} from '../../commons/constants';

export default StyleSheet.create({
  styleContains: {
    backgroundColor: 'white',
    paddingVertical: Dimension.padding15,
  },
  logoImage: {
    marginVertical: 50,
    width: responsiveWidth(37),
    height: responsiveWidth(37),
    resizeMode: 'stretch',
    alignSelf: 'center',
  },
  formLogin: {
    backgroundColor: 'white',
    paddingVertical: Dimension.padding15,
  },
  containsForm: {
    backgroundColor: 'white',
    paddingVertical: Dimension.padding15,
  },
  textDecoration: {
    color: Color.MayaBlue,
    fontSize: responsiveFontSize(2),
    marginVertical: 5,
    fontFamily: Font.FiraSansRegular,
  },
  styleBtton: {
    width: '90%',
    marginTop: 40,
    alignSelf: 'center',
  },

  containsInputView: {
    marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin10,
  },

  styleInput: {},

  styleAvatar: {
    borderRadius: 8,
    height: Size.height(18),
    width: Size.height(18),
  },

  styleViewLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },

  styleButton: {
    backgroundColor: Color.MayaBlue,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginHorizontal: Dimension.margin20,
    marginTop: Dimension.margin20,
  },

  styleTextButton: {
    fontSize: Dimension.fontSize14,
    fontFamily: Font.FiraSansRegular,
    color: 'white',
    fontWeight: '700',
  },

  styleViewButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },

  styleButtonCancel: {
    flex: 1,
    marginVertical: Dimension.margin20,
    backgroundColor: Color.Border,
  },
  avatarContainer: {
    position: 'relative',
    // backgroundColor: '#f00',
    marginVertical: 25,
  },
  avatarCamera: {
    position: 'absolute',
    backgroundColor: '#fff',
    opacity: 0.6,
    right: 0,
    bottom: 0,
    padding: 5,
    borderRadius: 5,
  },

  stLabel: {
    color: Color.lableColor,
    fontSize: Dimension.fontSize,
  },
});
