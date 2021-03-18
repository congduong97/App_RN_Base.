import {StyleSheet} from 'react-native';
import {Color, Dimension, Font} from '../../commons/constants';

export default StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  stContainModal: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomColor: Color.borderColor,
  },
  viewContainerButton: {
    flex: 1,
    justifyContent: 'center',
    height: Dimension.heightButton,
    fontWeight: '700',
  },
  stTextButtonSelected: {
    alignContent: 'center',
    fontSize: Dimension.fontSize16,
    alignItems: 'center',
    marginHorizontal: Dimension.margin5,
  },
  stHeaderPicker: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: Dimension.margin20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  styContainPickerIOS: {
    height: 275,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  stTextAccept: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: Dimension.fontSize15,
    color: Color.MayaBlue,
    // fontWeight: '700',
    paddingVertical: 16,
  },
  stTextCancellation: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: Dimension.fontSize15,
    color: '#747474',
    paddingVertical: 16,
  },
  /////
  stLabel: {
    color: Color.lableColor,
    fontSize: Dimension.fontSize,
    lineHeight: 20,
  },
  stValue: {
    color: '#000000',
    fontSize: Dimension.fontSize15,
    fontWeight: '700',
    lineHeight: 20,
  },
  stContain: {
    position: 'relative',
  },
  stContainInput: {},
});
