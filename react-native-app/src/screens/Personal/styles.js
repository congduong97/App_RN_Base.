import {StyleSheet} from 'react-native';
import {Color, Dimension} from '../../commons/constants';

export default StyleSheet.create({
  styleContains: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: Dimension.padding15,
  },
  styleHeader: {
    height: 270,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 0,
    backgroundColor: '#acb',
    elevation: 5,
    shadowOpacity: 1,
  },
  lineSeparation: {
    height: 20,
    borderTopColor: Color.border,
    borderTopWidth: 1,
    backgroundColor: Color.light_gray,
  },
  stSwitch: {
    marginHorizontal: Dimension.margin25,
  },
  styleLabelSwitch: {
    flex: 1,
    fontSize: Dimension.fontSize16,
    marginLeft: Dimension.margin20,
    fontWeight: '500',
  },

  styleRowText: {
    height: 56,
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
    marginHorizontal: Dimension.margin20,
  },
  styleContainerText: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flex: 1,
  },
  styleValue: {
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: Dimension.fontSize16,
    fontWeight: '700',
    marginLeft: Dimension.margin,
  },
});
