import React, {useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useMergeState} from '../../../AppProvider';
import ActionsKey from '../../../commons/ActionsKey';
import {Color, Dimension} from '../../../commons/constants';
import {formatCurrency} from '../../../commons/utils/format';
import {isValidPhoneNumber} from '../../../commons/utils/validate';
import {InputView, TextView} from '../../../components';
import CartKey from './CartKey';

export default function CreatCartView(props) {
  const {simData, onPress, refDialog} = props;

  const {id: simId, alias, telco, collaboratorPrice, websitePrice} = simData;
  const [stateScreen, setStateScreen] = useMergeState({
    isFormCart: false,
  });
  const {isFormCart} = stateScreen;
  const refCartInfo = useRef({
    customerAddress: '',
    customerName: '',
    customerPhone: '',
    simId,
  });
  const priceCTV = formatCurrency(collaboratorPrice);
  const priceWeb = formatCurrency(websitePrice);
  const handleOnPress = ({id}) => {
    if (id === ActionId.CloseDialog) {
      refDialog.hideDialog();
    } else if (id === ActionId.NextCreateCart) {
      setStateScreen({isFormCart: true});
    } else if (id === ActionId.ConfirmCreateCart) {
      // Tạo gio hang
      if (checkParam()) {
        onPress &&
          onPress({
            id: ActionsKey.ApiCreateCartNewAPI,
            data: refCartInfo.current,
          });
        refDialog.hideDialog();
      }
    } else if (id === ActionId.AddToCart) {
      // sang danh sach don hang da co
      onPress && onPress({id: ActionsKey.NextToCartList, data: {simId}});
      refDialog.hideDialog();
    }
  };
  const handleChangeValue = ({id, data}) => {
    refCartInfo.current[id] = data;
  };

  const checkParam = () => {
    if (!isValidPhoneNumber(refCartInfo.current[CartKey.CustomerPhone])) {
      Toast.showWithGravity(
        `Số điện thoại sai định dạng.`,
        Toast.SHORT,
        Toast.CENTER,
      );
      return false;
    }
    if (
      !refCartInfo.current[CartKey.CustomerName] ||
      !refCartInfo.current[CartKey.CustomerAddress]
    ) {
      Toast.showWithGravity(
        `Không được để trống các trường bắt buộc.`,
        Toast.SHORT,
        Toast.CENTER,
      );
      return false;
    }
    return true;
  };

  const handleCheckInput = ({id, data}) => {
    if (id === CartKey.CustomerName || id === CartKey.CustomerAddress) {
      return data;
    } else if (id === CartKey.CustomerPhone) {
      return isValidPhoneNumber(data);
    }
  };

  return (
    <>
      <View style={styles.styleViewLine}>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
        <Text style={styles.styleTitleDialog}>
          {isFormCart ? 'Tạo Giỏ Hàng Mới' : 'Chọn Giỏ Hàng'}
        </Text>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
      </View>
      <View style={styles.styleContent}>
        {!isFormCart ? (
          <>
            <TextView
              style={styles.styleRowText}
              styleContainerText={styles.styleContainerText}
              styleTitle={styles.styleTitle}
              styleValue={styles.styleValue}
              title={'Số điện thoại:'}
              value={alias}
            />
            <TextView
              style={styles.styleRowText}
              styleContainerText={styles.styleContainerText}
              styleTitle={styles.styleTitle}
              styleValue={styles.styleValue}
              title={'Nhà mạng:'}
              value={telco?.name}
            />
            <TextView
              style={styles.styleRowText}
              styleContainerText={styles.styleContainerText}
              styleTitle={styles.styleTitle}
              styleValue={styles.styleValue}
              title={'Giá bán:'}
              value={priceCTV}
            />
          </>
        ) : (
          <View style={[styles.styleContainForm]}>
            <InputView
              id={CartKey.CustomerName}
              iconLeft={'user'}
              offsetLabel={-4}
              isShowLabel
              iconLeftSize={18}
              style={styles.containsInputView}
              iconLeftColor={Color.colorIcon}
              styleTextInput={{fontWeight: 'bold'}}
              styleInput={styles.styleInput}
              styleViewLabel={styles.styleViewLabel}
              label={
                <Text>
                  {'Khách hàng'} <Text style={{color: 'red'}}>*</Text>:
                </Text>
              }
              placeholder="Nhập họ tên khách hàng..."
              onChangeText={handleChangeValue}
              onCausedError={handleCheckInput}
              labelError={'Tên khách hàng không được để trống'}
              returnKeyType="next"
            />

            <InputView
              id={CartKey.CustomerPhone}
              iconLeft={'telephone'}
              offsetLabel={-4}
              isShowLabel
              iconLeftSize={18}
              style={styles.containsInputView}
              iconLeftColor={Color.colorIcon}
              styleTextInput={{fontWeight: 'bold'}}
              styleInput={styles.styleInput}
              keyboardType="phone-pad"
              styleViewLabel={styles.styleViewLabel}
              label={
                <Text>
                  {'Số điện thoại'} <Text style={{color: 'red'}}>*</Text>:
                </Text>
              }
              placeholder="Nhập số điện thoại..."
              onChangeText={handleChangeValue}
              onCausedError={handleCheckInput}
              labelError={'Số điện thoại không đúng định dạng'}
              returnKeyType="next"
            />

            <InputView
              id={CartKey.CustomerAddress}
              iconLeft={'home-address'}
              offsetLabel={-4}
              isShowLabel
              iconLeftSize={18}
              style={styles.containsInputView}
              iconLeftColor={Color.colorIcon}
              styleTextInput={{fontWeight: 'bold'}}
              styleInput={styles.styleInput}
              styleViewLabel={styles.styleViewLabel}
              label={
                <Text>
                  {'Địa chỉ'} <Text style={{color: 'red'}}>*</Text>:
                </Text>
              }
              placeholder="Nhập địa chỉ khách hàng..."
              onChangeText={handleChangeValue}
              onCausedError={handleCheckInput}
              labelError={'Hãy điền địa chỉ'}
              returnKeyType="done"
            />
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          height: 2,
          backgroundColor: Color.border,
          marginTop: Dimension.margin,
        }}
      />
      <View style={styles.styleContainButton}>
        <TextView
          id={isFormCart ? ActionId.CloseDialog : ActionId.NextCreateCart}
          onPress={handleOnPress}
          style={[
            styles.styleButton,
            {backgroundColor: Color.Supernova, borderColor: Color.MayaBlue},
          ]}
          styleValue={styles.styleTextButton}
          value={isFormCart ? 'Huỷ bỏ' : 'Tạo mới'}
        />
        <TextView
          id={isFormCart ? ActionId.ConfirmCreateCart : ActionId.AddToCart}
          onPress={handleOnPress}
          style={styles.styleButton}
          styleValue={styles.styleTextButton}
          value={isFormCart ? 'Xác nhận' : 'Có sẵn'}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  styleViewLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Dimension.margin10,
  },
  styleTitleDialog: {
    backgroundColor: 'white',
    fontSize: Dimension.fontSize21,
    color: Color.star,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
    marginTop: -5,
  },

  styleContent: {
    marginTop: Dimension.margin10,
    paddingBottom: Dimension.padding10,
  },

  styleRowText: {flexDirection: 'row'},
  styleContainerText: {
    flex: 1,
    flexDirection: 'row',
    height: 30,
    marginBottom: 5,
    paddingHorizontal: Dimension.padding5,
  },
  styleTitle: {
    // backgroundColor: '#abc',
    fontSize: Dimension.fontSize15,
    flex: 1,
    alignSelf: 'center',
    alignContent: 'flex-start',
  },

  styleValue: {
    fontSize: Dimension.fontSize15,
    alignSelf: 'center',
    fontWeight: '700',
  },

  styleContainButton: {
    flexDirection: 'row',
    marginTop: Dimension.margin,
    justifyContent: 'space-around',
    marginBottom: Dimension.margin15,
  },
  styleButton: {
    // flex: 1,
    width: '45%',
    backgroundColor: Color.MayaBlue,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: Color.Supernova,
    borderWidth: 1,
  },
  styleTextButton: {
    fontSize: Dimension.fontSizeHeader,
    color: Color.White,
    fontWeight: '700',
  },
  ///CartView.js
  styleContainForm: {
    flex: 1,
    alignContent: 'center',
    paddingHorizontal: Dimension.margin,
  },
  styleInputPrice: {
    flex: 1,
    marginHorizontal: Dimension.margin,
  },
  styleTitleBlock: {
    marginTop: Dimension.margin10,
    marginBottom: Dimension.margin5,
    color: Color.Purple,
    fontSize: Dimension.fontSize15,
    alignItems: 'center',
  },
  styleInput: {
    // height: heightRow,
  },

  ///////CartsScreen.js
  containsInputView: {
    // marginHorizontal: Dimension.margin20,
    marginVertical: Dimension.margin15,
  },
  styleViewLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },
});

const ActionId = {
  NextCreateCart: 'NextCreateCart',
  ConfirmCreateCart: 'ConfirmCreateCart',
  AddToCart: 'AddToCart',
  CloseDialog: 'CloseDialog',
};
