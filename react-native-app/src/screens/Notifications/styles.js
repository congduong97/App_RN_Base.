import {StyleSheet} from 'react-native';
import {Color, Dimension, Font, Size} from '../../commons/constants';

export default StyleSheet.create({
  lineSeparator: {
    width: '100%',
    height: 0.5,
    backgroundColor: Color.Border,
  },

  buttonDelete: {
    width: 70,
    height: '100%',
    backgroundColor: Color.darkRedIOS,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stContainsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    // paddingHorizontal: Dimension.padding10,
    paddingVertical: Dimension.padding,
  },
  stRow: {
    flex: 1,
    paddingHorizontal: Dimension.padding10,
    backgroundColor: 'white',
  },
  stContentRow: {
    justifyContent: 'center',
    maxWidth: Size.width(88),
  },
  stIconRow: {
    padding: 3,
    borderWidth: 1,
    borderColor: Color.MayaBlue,
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Dimension.margin10,
  },
  stTitleNoti: {
    fontWeight: '500',
    fontSize: Dimension.fontSize15,
    color: Color.colorText,
    fontStyle: 'normal',
    fontFamily: Font.FiraSansRegular,
  },
  stValueNoti: {
    fontSize: Dimension.fontSize14,
    color: Color.colorText,
    fontFamily: Font.FiraSansRegular,
  },

  textDateNoti: {
    color: Color.colorText,
    fontStyle: 'italic',
    textAlign: 'right',
    fontSize: Dimension.fontSize12,
    backgroundColor: 'white',
    marginBottom: 5,
  },

  styleButtonAction: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    height: 40,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomColor: Color.border,
    borderBottomWidth: 0.5,
  },
  styleButton: {
    marginLeft: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  styleValueButton: {
    // alignSelf: 'center',
    fontSize: Dimension.fontSize15,
    fontWeight: '700',
    color: Color.MayaBlue,
    // alignItems: 'center',
  },
});
