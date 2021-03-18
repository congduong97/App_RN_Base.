import {StyleSheet, Platform} from 'react-native';
import {Color, Font} from '../../commons/constants';
import {ratioH, windowSize} from '../../commons/utils/devices';
const {width} = windowSize;

export default StyleSheet.create({
  styleContains: {
    flex: 1,
  },

  containsSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },

  stylesContainSearch: {
    width: null,
    height: 40,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 40,
  },

  styleInputSearch: {
    borderRadius: 40,
    borderColor: Color.Border,
  },

  styleContainIcon: {
    width: 30 * ratioH,
    height: 30 * ratioH,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ///
  containerTagTelecom: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  listTag: {
    flex: 1,
    flexDirection: 'row',
  },

  tagTelecom: {
    width: 60,
    margin: 3,
    paddingVertical: Platform.OS === 'ios' ? 5 : 3,
    // height: 25,
    color: 'black',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontFamily: Font.FiraSansRegular,
  },
  tagTelecomFocus: {
    color: 'white',
    backgroundColor: Color.MayaBlue,
    borderWidth: 0.5,
    borderColor: Color.MayaBlue,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tagTelecomNotFocus: {
    backgroundColor: Color.SoftGray,
    borderWidth: 0.5,
    borderColor: Color.Border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  filterContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: Color.lineSeparator,
    paddingHorizontal: 8,
    // marginHorizontal: 5,
    paddingBottom: 10,
  },
  containsSort: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  labelResult: {
    flex: 1,
    fontSize: 16,
  },
  smallButtonGroup: {
    flex: 1,
    flexDirection: 'row',
  },
  smallButtonText: {
    fontSize: 11,
    color: '#67CDFD',
    textDecorationLine: 'underline',
    textDecorationColor: '#666666',
    paddingLeft: 5,
  },
  textHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
