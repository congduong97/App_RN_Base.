import React, {useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {AppHeader, AppTextButton, AppText} from '../../../elements';
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view';
import AppTextInput from '../../../elements/AppTextInput';
import {COLOR, SIZE, FetchApi, isIos} from '../../../utils';
import {keyNavigation} from '../../../navigators/utils/KeyNavigation';
import {useForceUpdate} from '../../../hooks/forceupdate';
import {AccountService} from '../../../utils/services/AccountService';
import {useNavigation} from '@react-navigation/native';
import {STRING} from '../../../utils/constants/String';
import {StateUserService} from '../../Home/services/StateUserService';

const NewLinkingCard = () => {
  const navigation = useNavigation();
  const data = useRef({
    memberCode: '',
    pinCode: '',
  });
  const error = useRef('');
  const submitBtn = useRef(null);
  const forceUpdate = useForceUpdate();

  const onValidate = () => {
    const {memberCode, pinCode} = data.current;
    if (memberCode.length == 0) {
      error.current = STRING.please_enter_member_code;
      forceUpdate();
      return false;
    }

    if (pinCode.length == 0) {
      error.current = STRING.please_enter_pin_code;
      forceUpdate();
      return false;
    }

    return true;
  };
  //Liên kết thẻ thành viên API:
  const onLinkingCard = async () => {
    const {memberCode, pinCode} = data.current;
    error.current = '';
    const validate = onValidate();
    submitBtn.current.setLoadingValue(true);
    if (validate) {
      const response = await FetchApi.linkingCard(memberCode, pinCode);
      if (response.success) {
        const accountLogin = AccountService.getAccount('');
        let accountUpdateInfo = {...accountLogin};
        accountUpdateInfo.point = response.data.point;
        accountUpdateInfo.money = response.data.money;
        AccountService.setAccount(accountUpdateInfo);
        StateUserService.updateState();
        navigation.navigate(keyNavigation.CONFIRM_MESS, {key: 'LINK_CARD'});
      } else {
        if (
          response &&
          response.message == STRING.network_error_try_again_later
        ) {
          error.current = STRING.network_error_try_again_later;
          forceUpdate();
        } else if (response && response.status_code == 502) {
          error.current = STRING.server_maintain;
          forceUpdate();
        } else {
          error.current = STRING.info_card_member_wrong;
          forceUpdate();
        }
      }
    }

    submitBtn.current.setLoadingValue(false);
  };

  const onChangeText = (field) => (value) => {
    data.current[field] = value;
  };

  return (
    <View style={{flex: 1}}>
      <AppHeader title={'KOMECAの登録'} leftGoBack />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={{backgroundColor: COLOR.white, paddingVertical: 32}}>
          <AppText
            style={{
              color: '#4D4D4D',
              fontFamily: 'irohamaru-Medium',
              fontSize: SIZE.H5 * 1.2,
              marginHorizontal: 16,
              lineHeight: 32,
            }}>
            お手持ちのKOMECAを登録するとバリュー残高
            やポイント残高がアプリ上で確認できるようにな ります
          </AppText>
          <AppText
            style={{
              color: '#EF6572',
              marginHorizontal: 16,
              marginTop: SIZE.height(1),
              fontSize: SIZE.H5 * 1.05,
              lineHeight: 20,
              fontFamily: 'irohamaru-Medium',
            }}>
            ※KOMECAをお持ちでない方はコメダ珈琲店舗にてカ
            ード発行後、本アプリにカード情報をご登録ください
          </AppText>
          <AppText
            style={{
              color: '#EF6572',
              marginHorizontal: 16,
              fontSize: SIZE.H5 * 1.05,
              lineHeight: 20,
              fontFamily: 'irohamaru-Medium',
            }}>
            ※1度もチャージ実績のないKOMECAはご登録できませ んのでご注意ください
          </AppText>
          <AppText
            style={{
              color: '#EF6572',
              marginHorizontal: 16,
              fontSize: SIZE.H5 * 1.1,
              lineHeight: 20,
              marginBottom: 16,
            }}></AppText>
          <AppText
            style={{
              fontSize: SIZE.H5,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#47362B',
              color: COLOR.white,
              fontFamily: 'irohamaru-Medium',
            }}>
            カード番号
          </AppText>
          <AppTextInput
            keyboardType={'number-pad'}
            onChangeText={onChangeText('memberCode')}
            styleInput={styles.input}
            maxLength={16}
          />
          <AppText
            style={{
              fontSize: SIZE.H5,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#47362B',
              color: COLOR.white,
              fontFamily: 'irohamaru-Medium',
            }}>
            PINコード
          </AppText>
          <AppTextInput
            keyboardType={'number-pad'}
            onChangeText={onChangeText('pinCode')}
            styleInput={{
              height: 50,
              fontSize: SIZE.H5 * 1.2,
              width: SIZE.width(40),
              marginHorizontal: 16,
              marginTop: 24,
              marginBottom: 10,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: '#707070',
              paddingHorizontal: 8,
            }}
            maxLength={6}
          />
        </View>
        <View style={{paddingVertical: SIZE.width(5)}}>
          {error.current.length > 0 &&
          error.current == STRING.info_card_member_wrong ? (
            <View
              style={{
                minHeight: 50,
                width: SIZE.width(92),
                marginBottom: SIZE.width(5),
                alignItems: 'center',
                marginLeft: SIZE.width(4),
              }}>
              <View>
                <AppText
                  style={{
                    color: '#EF6572',
                    fontSize: isIos ? SIZE.H5 * 1.1 : SIZE.H5 * 0.9,
                    marginBottom: 10,
                    fontFamily: 'irohamaru-Medium',
                  }}>
                  連携できませんでした。以下、再度ご確認ください。
                </AppText>
                <AppText
                  style={{
                    color: '#EF6572',
                    fontSize: isIos ? SIZE.H5 * 1.1 : SIZE.H5 * 0.9,
                    marginBottom: 10,
                    fontFamily: 'irohamaru-Medium',
                  }}>
                  ・ご入力内容の誤り
                </AppText>
                <AppText
                  style={{
                    color: '#EF6572',
                    fontSize: isIos ? SIZE.H5 * 1.1 : SIZE.H5 * 0.9,
                    marginBottom: 10,
                    fontFamily: 'irohamaru-Medium',
                  }}>
                  ・チャージ実績のあるカードのみ連携可能
                </AppText>
              </View>
            </View>
          ) : (
            <AppText
              style={{
                color: '#EF6572',
                fontSize: SIZE.H5 * 1.1,
                textAlign: 'center',
                marginBottom: 10,
                fontFamily: 'irohamaru-Medium',
                paddingHorizontal: SIZE.width(5),
              }}>
              {error.current}
            </AppText>
          )}
          <AppTextButton
            // disabled={disableBtn}
            ref={submitBtn}
            onPress={onLinkingCard}
            style={{
              height: SIZE.height(7.5),
              backgroundColor: '#FF9A27',
              marginHorizontal: SIZE.width(16),
            }}
            title={'KOMECAを登録する'}
            textStyle={{
              color: COLOR.white,
              fontSize: SIZE.H5 * 1.15,
              fontFamily: 'irohamaru-Medium',
            }}
          />
          <AppText
            onPress={() => {
              navigation.navigate(keyNavigation.MY_PAGE);
            }}
            style={{
              fontSize: SIZE.H5,
              textAlign: 'center',
              color: '#68463A',
              marginVertical: 16,
              textDecorationLine: 'underline',
              fontFamily: 'irohamaru-Medium',
            }}>
            マイアカウントTOPにもどる
          </AppText>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    borderColor: '#707070',
    height: 50,
    marginHorizontal: 16,
    marginVertical: 24,
    fontSize: SIZE.H5 * 1.2,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

export default NewLinkingCard;
