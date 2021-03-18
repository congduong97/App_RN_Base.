import {StyleSheet} from 'react-native';
import {Color} from '../../commons/constants';

export default StyleSheet.create({
  /////////
  viewContainer: {
    alignSelf: 'stretch',
    height: 45,
    // backgroundColor: '#345',
  },

  viewContainerButton: {
    justifyContent: 'center',
    height: 45,
    fontWeight: '700',
  },

  viewHeaderPickerIOS: {
    alignSelf: 'stretch',
    height: 40,
  },
  stContainModal: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  styContainPickerIOS: {
    height: 400,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    // backgroundColor: '#345',
  },

  stHeaderPicker: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Color.Gainsboro,
    paddingHorizontal: 12,
  },

  stTextButtonSelected: {
    alignContent: 'center',
    fontSize: 16,
    alignItems: 'center',
    marginHorizontal: 5,
  },

  stTextActionHeader: {
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: Color.Indigo,
    fontWeight: '700',
    paddingVertical: 15,
  },
});
