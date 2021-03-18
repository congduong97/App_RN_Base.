import moment from 'moment';
import React, {useRef} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {debounce} from 'lodash';
import {useMergeState} from '../../AppProvider';
import {Color, Dimension, Size} from '../../commons/constants';
import {InputView, TextView} from '../../components';
const iconSize = 18;

export default function ChangePasswordView(props) {
  const {typeView, simData, onPress, navigation, refDialog} = props;
  const zone = moment().utcOffset();
  const [stateScreen, setStateScreen] = useMergeState({
    isVerified: false,
    isError: false,
  });
  const {isVerified, isError} = stateScreen;
  const refPassword = useRef({
    currentPassword: '',
    newPassword: '',
    reNewPassword: '',
  });
  const handleOnPress = (id) => {
    if (id == 'Type-ChangePassword') {
      refPassword.current['reNewPassword'] &&
        delete refPassword.current['reNewPassword'];
      onPress && onPress(refPassword.current);
      refDialog.hideDialog();
    } else {
      refDialog.hideDialog();
    }
  };

  const handleCheckPassword = ({id, data}) => {
    return (
      refPassword.current['reNewPassword'] &&
      refPassword.current['newPassword'] ===
        refPassword.current['reNewPassword']
    );
  };
  const handleChangeValue = ({id, data}) => {
    try {
      refPassword.current[id] = data;
      if (id === 'newPassword' || id === 'reNewPassword') {
        debounce(300, handleCheckValue).call();
      }
    } catch (error) {
      console.log('lỗi ', error);
    }
  };

  const handleCheckValue = () => {
    let isError =
      refPassword.current['reNewPassword'] &&
      refPassword.current['newPassword'] !==
        refPassword.current['reNewPassword']
        ? true
        : false;
    setStateScreen({
      isVerified:
        refPassword.current['currentPassword'] &&
        refPassword.current['newPassword'] ===
          refPassword.current['reNewPassword'],
      isError,
    });
  };
  return (
    <>
      <View style={styles.styleViewLine}>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
        <Text style={styles.styleTitleDialog}>{'Đổi Mật Khẩu'}</Text>
        <View style={{flex: 1, height: 2, backgroundColor: Color.border}} />
      </View>
      <View style={[styles.styleContainForm]}>
        <InputView
          id={'currentPassword'}
          iconLeft={'padlock'}
          iconLeftSize={iconSize}
          label={
            <Text>
              {'Mật khẩu cũ'} <Text style={{color: 'red'}}>*</Text>:
            </Text>
          }
          offsetLabel={-4}
          isShowLabel
          style={styles.containsInputView}
          styleViewLabel={styles.styleViewLabel}
          iconLeftColor={Color.colorIcon}
          styleTextInput={{fontWeight: 'bold'}}
          placeholder="Nhập mật khẩu cũ..."
          onChangeText={handleChangeValue}
          returnKeyType="next"
        />

        <InputView
          id={'newPassword'}
          iconLeft={'padlock'}
          iconLeftSize={iconSize}
          label={
            <Text>
              {'Mật khẩu mới'} <Text style={{color: 'red'}}>*</Text>:
            </Text>
          }
          offsetLabel={-4}
          isShowLabel
          style={styles.containsInputView}
          styleViewLabel={styles.styleViewLabel}
          iconLeftColor={Color.colorIcon}
          styleTextInput={{fontWeight: 'bold'}}
          placeholder="Nhập mật khẩu mới..."
          onChangeText={handleChangeValue}
          returnKeyType="next"
          // onCausedError={handleCheckPassword}
          // labelError={'Mật khẩu không trùng khớp'}
        />

        <InputView
          id={'reNewPassword'}
          iconLeft={'padlock'}
          iconLeftSize={iconSize}
          isShowLabel
          label={
            <Text>
              {'Xác nhận khẩu mới'} <Text style={{color: 'red'}}>*</Text>:
            </Text>
          }
          offsetLabel={-4}
          style={styles.containsInputView}
          styleViewLabel={styles.styleViewLabel}
          iconLeftColor={Color.colorIcon}
          styleTextInput={{fontWeight: 'bold'}}
          placeholder="Xác nhận khẩu mới..."
          onChangeText={handleChangeValue}
          returnKeyType="done"
          isError={isError}
          onCausedError={handleCheckPassword}
          labelError={'Mật khẩu không trùng khớp'}
        />
      </View>
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: Color.border,
          marginTop: Dimension.margin,
        }}
      />
      <View style={styles.styleContainButton}>
        <TouchableOpacity
          style={{
            width: Size.width(40),
            alignItems: 'center',
            marginLeft: Size.width(-5),
          }}
          onPress={() => {
            handleOnPress('Type-ChangePassword');
          }}>
          <TextView
            id={'Type-Canceled'}
            onPress={handleOnPress}
            style={styles.styleButtonCancel}
            styleValue={[styles.styleTextButton, {color: Color.colorText}]}
            value={`${' '}Huỷ bỏ${'   '}`}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleOnPress('Type-ChangePassword');
          }}>
          <TextView
            id={'Type-ChangePassword'}
            onPress={handleOnPress}
            disabled={!isVerified}
            style={[styles.styleButton]}
            styleDisable={[
              styles.styleButtonCancel,
              {borderColor: Color.Supernova},
            ]}
            styleValue={styles.styleTextButton}
            value={'Thực hiện'}
          />
        </TouchableOpacity>
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
  containsInputView: {
    marginHorizontal: Dimension.margin20,
    marginBottom: Dimension.margin10,
    marginTop: Dimension.margin15,
  },

  styleContainButton: {
    flex: 1,
    flexDirection: 'row',
    marginTop: Dimension.margin,
    justifyContent: 'space-around',
    paddingBottom: 10,
    marginBottom: Dimension.margin15,
  },
  styleButton: {
    // width: '45%',
    flex: 1,
    backgroundColor: Color.MayaBlue,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: Color.Supernova,
    borderWidth: 1,
    marginRight: Dimension.margin25,
    marginLeft: Dimension.margin10,
  },

  styleButtonCancel: {
    // width: '45%',
    padding: Size.width(3),
    flex: 1,
    backgroundColor: Color.colorBorderDisable,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    borderColor: Color.colorNameEstate,
    borderWidth: 1,
    marginRight: Dimension.margin10,
    marginLeft: Dimension.margin25,
  },

  styleTextButton: {
    fontSize: Dimension.fontSize12,
    color: 'white',
    fontWeight: '700',
    paddingHorizontal: Dimension.fontSize15,
  },
  ///CartView.js
  styleContainForm: {
    flex: 1,
    alignContent: 'center',
    paddingHorizontal: Dimension.margin,
    paddingBottom: Dimension.padding10,
  },

  styleViewLabel: {
    backgroundColor: 'white',
    paddingHorizontal: 3,
  },
});
