import {StyleSheet} from 'react-native';
import {Color, Dimension, Font} from '../../commons/constants';
import {windowSize} from '../../commons/utils/devices';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: Color.HomeColor,
  },

  button: {
    width: '100%',
    backgroundColor: Color.White,
    borderWidth: 0.5,
    borderColor: Color.Border,
    borderRadius: 30,
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    height: 40,
  },
  iconImage: {
    width: 25,
    height: 25,
  },
  title: {
    fontFamily: Font.FiraSansRegular,
    fontSize: 16,
    fontWeight: '700',
    // textAlign: 'center',
    paddingVertical: 10,
  },
  telecom: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,

    // shadowColor: 'white',
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 1,

    // elevation: 1,
    // shadowColor: Color.Border,
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.8,
    // shadowRadius: 3,
  },
  telecomIcon: {
    width: 60,
    height: 60,
    borderRadius: 60,
    borderColor: Color.MayaBlue,
    borderWidth: 1.5,
  },
  menuHomeItem: {
    width: 55,
    height: 55,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: 'lightgray',
  },
  menuHomeImage: {width: 30, height: 30, borderRadius: 25},
  itemContainer: {
    // width: windowSize.width / 3,

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    textAlign: 'center',
    color: 'black',
    padding: 5,
    fontSize: 14,
  },
  itemHightlightText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
  },
  actionButton: {
    fontSize: 40,
    fontFamily: Font.FiraSansBold,
    // position: 'absolute',
    // right: 10,
    // bottom: 20,
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowColor: '#000000',
    // elevation: 3,
  },
  actionText: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: Color.White,
    fontFamily: Font.FiraSansRegular,
  },
  actionTextContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 40,
    justifyContent: 'center',
  },
  listContainer: {
    // width: '100%',
    flex: 1,
    // backgroundColor: '#452',
    padding: 10,
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
    // alignItems: 'center',
  },
  itemButton: {
    width: '95%',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    // borderWidth: 0.5,
    // borderColor: Color.Border,
    backgroundColor: Color.White,
  },
  itemHightlightButton: {
    width: windowSize.width / 4 - 10,
    height: windowSize.width / 4 - 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    // borderWidth: 0.5,
    // borderColor: Color.Border,
    backgroundColor: Color.White,
  },
  telecomContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 10,
  },
  menuHomeContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  selectItem: {
    width: 65,
    height: 65,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    shadowColor: Color.Border,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'white',
  },
  updateButton: {
    borderRadius: 3,
    marginTop: 10,
    backgroundColor: Color.MayaBlue,
    padding: 10,
  },

  arrowRight: {
    height: 0,
    width: 0,
    borderLeftWidth: 10,
    borderBottomWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: Color.MayaBlue,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginRight: 8,
  },
  titleBlock: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerMenuHomeItem: {
    // backgroundColor: '#345',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: windowSize.width / 3,
  },

  containsImageItemMenu: {
    width: 55,
    height: 55,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //////
  styleItemMenu: {},

  ////////

  styleContainsBlock: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderBottomColor: Color.border,
    borderBottomWidth: 1,
  },

  styleListCategories: {},
  styleContentListCategories: {},

  styleContainsItemCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
    marginHorizontal: 5,
    borderColor: Color.MayaBlue,
    borderWidth: 1.5,

    backgroundColor: Color.White,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,
  },

  styleItemCircle: {
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    elevation: 3,
  },

  styleItemRectangle: {
    height: 50,
    marginHorizontal: 5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    backgroundColor: Color.White,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
  },

  textMenuFates: {
    color: '#fff',
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },

  styleContainsBeautiful: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.White,
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowColor: '#000000',
    elevation: 3,
  },
  /////
  styleContainsHeader: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  styleSearch: {
    backgroundColor: 'white',
    flex: 1,
    height: 40,
    borderRadius: 40,
    alignSelf: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  styleTextValueSearch: {
    marginLeft: Dimension.margin10,
    fontSize: 16,
    alignSelf: 'center',
    color: Color.colorHintText,
    fontWeight: '700',
  },

  countNoti: {
    color: 'white',
    lineHeight: 15,
    fontSize: Dimension.fontSize12,
  },
  containerNoti: {
    position: 'absolute',
    right: -10,
    top: 0,
    backgroundColor: Color.darkRedIOS,
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
    borderRadius: 50,
  },
});

export default styles;