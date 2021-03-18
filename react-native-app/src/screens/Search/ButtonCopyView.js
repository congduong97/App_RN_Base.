import Clipboard from '@react-native-community/clipboard';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {Color} from '../../commons/constants';
import {ratioW} from '../../commons/utils/devices';
import {
  formatCopyInUnitK,
  formatCurrencyToCopy,
} from '../../commons/utils/format';
import models from '../../models';
import Actions from '../../redux/actions';

export default function ButtonCopyView(props) {
  const {id, simCopy, title, style, onPress} = props;
  const dispatch = useDispatch();
  useSelector((state) => state.CommonsReducer);
  const isCompactUnit = models.getCompactUnit();
  const isLogin = models.isLoggedIn();
  const copyPriceCTV = () => {
    copyPrice(false);
  };
  const copyPriceWeb = () => {
    copyPrice(true);
  };

  const copyPrice = (isPriceWeb) => {
    let string = '';
    simCopy.forEach((item) => {
      let price = isPriceWeb ? item.websitePrice : item.collaboratorPrice;
      string += `${item.alias} = ${
        isCompactUnit ? formatCopyInUnitK(price) : formatCurrencyToCopy(price)
      }\n`;
    });

    Toast.show(`Đã sao chép ${simCopy.length} số sim`);
    Clipboard.setString(string);
    onPress && onPress();
    dispatch(Actions.resetCopySim());
  };

  const stTitle = isLogin
    ? `Copy giá bán lẻ (${simCopy.length})`
    : `Copy ${simCopy.length}`;

  return simCopy.length > 0 ? (
    <>
      {isLogin && (
        <TouchableOpacity
          style={[
            styles.styleContains,
            {bottom: 60, backgroundColor: Color.Red},
          ]}
          onPress={copyPriceCTV}>
          <Text
            style={
              styles.styleTitle
            }>{`Copy giá thu (${simCopy.length})`}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.styleContains} onPress={copyPriceWeb}>
        <Text style={styles.styleTitle}>{stTitle}</Text>
      </TouchableOpacity>
    </>
  ) : null;
}

const styles = StyleSheet.create({
  styleContains: {
    paddingHorizontal: 20 * ratioW,
    backgroundColor: Color.MayaBlue,
    position: 'absolute',
    bottom: 10,
    right: 20 * ratioW,
    height: 40,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 3,
  },

  styleTitle: {
    color: Color.White,
    fontWeight: '500',
  },
});
