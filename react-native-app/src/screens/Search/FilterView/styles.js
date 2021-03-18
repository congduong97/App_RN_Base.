import {StyleSheet} from 'react-native';
import {Color, Dimension} from '../../../commons/constants';
const heightRow = 45;
export default StyleSheet.create({
  styleContains: {
    flex: 1,
    padding: Dimension.padding,
    backgroundColor: 'white',
  },
  styleListFengshui: {},

  styleLineHeader: {
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },

  styleContainSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  styleSwitch: {
    flex: 1,
  },

  styleContainPrices: {
    height: heightRow,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: Dimension.margin15,
  },
  styleInputPrice: {
    flex: 1,
    marginHorizontal: Dimension.margin,
    // borderColor: Color.colorText,
    // borderWidth: Dimension.borderWidth,
    // borderRadius: 4,
  },
  styleInputScore: {
    width: 100,
    height: heightRow,
  },
  styleInput: {
    height: heightRow,
  },
  styleTitleBlock: {
    width: 120,
    color: Color.colorHeaderEstate,
    marginLeft: Dimension.margin5,
    fontSize: Dimension.fontSize15,
    fontWeight: 'bold',
    alignItems: 'center',
  },

  textMenuFates: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },

  styleContainsItemCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    marginHorizontal: 5,
    borderColor: 'white',
    borderWidth: 1.5,

    backgroundColor: 'white',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,
  },
  styleButtonReset: {
    flex: 1,
    marginVertical: Dimension.margin20,
    borderWidth: 1,
    borderColor: '#000',
  },
  itemText: {
    textAlign: 'center',
    color: 'black',
    padding: 5,
    fontSize: 14,
  },

  styleTextError: {
    color: 'red',
    fontStyle: 'italic',
    marginTop: 3,
    marginHorizontal: 10,
  },

  ////////
  styleContainPicker: {
    flex: 1,
    marginHorizontal: Dimension.margin,
    borderColor: Color.colorText,
    borderWidth: Dimension.borderWidth,
    borderRadius: 4,
  },

  dropdownStyle: {
    marginTop: -1,
    borderColor: 'cornflowerblue',
    borderWidth: 1,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    elevation: 3,
  },

  styleItemPicker: {
    width: 200,
    flex: 1,
    justifyContent: 'flex-start',
    borderBottomWidth: 0.2,
    borderBottomColor: Color.Border,
  },

  dropdownText: {
    height: 40,
    marginHorizontal: Dimension.margin10,
    fontSize: 15,
    textAlignVertical: 'center',
  },

  lineSeparator: {
    width: '100%',
    height: 0.5,
    backgroundColor: Color.Border,
  },
  //

  containerStylePicker: {
    flex: 1,
    height: 40,
  },

  styleDropDownPicker: {
    flex: 1,
    marginHorizontal: Dimension.margin,
    borderColor: Color.colorText,
    borderWidth: Dimension.borderWidth,
    borderRadius: 4,
    flexDirection: 'row',
    elevation: 4,
    overflow: 'visible',
    backgroundColor: '#fff',
  },
});
