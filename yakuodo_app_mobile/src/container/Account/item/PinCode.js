import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {STRING} from '../../../const/String';
import {
  DEVICE_WIDTH,
  managerAcount,
  keyAsyncStorage,
} from '../../../const/System';
import {
  COLOR_WHITE,
  COLOR_GRAY,
  COLOR_BLUE_LIGHT,
  COLOR_RED,
} from '../../../const/Color';
import {Api} from '../../../service';
import {getUserInfo} from '../../../service/addListener';
import InputPassword from './InputPassword';
import {ButtonTypeOne} from './ButtonTypeOne';
import {ButtonTypeThree} from './ButtonTypeThree';

export class PinCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinCode: '',
      pinCodeConfirm: '',
      loading: false,
      activebutton: true,
    };
  }
  pushHome = () => {
    const {setVisibleScreen} = this.props;
    setVisibleScreen('success');
  };
  goBack = () => {
    const {setVisibleScreen} = this.props;
    setVisibleScreen('addMemberCode');
  };
  onChangeText = value => {
    this.state.pinCode = value;
    // this.checkActiveButton()
  };
  onChangeTextConfirm = value => {
    this.state.pinCodeConfirm = value;
    // this.checkActiveButton()
  };

  checkPinCode = () => {
    const {pinCode, pinCodeConfirm} = this.state;
    if (!pinCode && !pinCodeConfirm) {
      this.pushLogin();
    } else {
      if (pinCodeConfirm == pinCode && pinCodeConfirm.length === 6) {
        this.pushLogin();
      } else {
        if (pinCode.length !== 6 || pinCodeConfirm.length !== 6) {
          this.setState({textError: 'PINコードは6桁で入力してください。'});
        } else {
          this.setState({
            textError:
              'PINコードが一致しません。新しい\nPINコードを再度ご入力ください。',
          });
        }
      }
    }
  };
  pushLogin = async () => {
    const {pinCode, pinCodeConfirm} = this.state;
    const {memberCodeLogin} = this.props;
    try {
      this.setState({loading: true, textError: ''});
      const response = await Api.pushSign(memberCodeLogin, pinCode);
      // console.log('pincode', response);

      if (response.code == 400) {
        Alert.alert(STRING.member_code_not_found);
      } else if (response.code == 200) {
        const {
          phoneNumber,
          memberId,
          newAccessToken,
          newRefreshToken,
          accessToken,
          refreshToken,
        } = response.res;
        managerAcount.validateOtp = false;
        managerAcount.phoneNumber = phoneNumber;
        managerAcount.accessToken = newAccessToken || accessToken;
        managerAcount.refreshToken = newRefreshToken || refreshToken;
        managerAcount.userId = memberId;
        managerAcount.memberCode = memberCodeLogin;
        managerAcount.pinCode = pinCode;
        // console.log(' managerAcount', managerAcount);
        await getUserInfo();
        AsyncStorage.setItem(
          keyAsyncStorage.managerAccount,
          JSON.stringify(managerAcount),
        );
        this.pushHome();
        return;
      } else {
        Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
      }

      this.setState({loading: false});
    } catch (e) {
      this.setState({loading: false});

      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      // console.log('gotuf');
    }
  };

  render() {
    const {loading, activebutton, textError} = this.state;

    return (
      <View style={{width: DEVICE_WIDTH - 63}}>
        <View
          style={[
            styles.wrapperContainer,
            {justifyContent: 'center', alignItems: 'center'},
          ]}>
          <Text style={{fontSize: 14, textAlign: 'center', marginBottom: -10}}>
            WA!CAカードに記載のPINコードを入力
          </Text>
          <Text style={{color: COLOR_RED, fontSize: 14, marginBottom: 10}}>
            {
              '\nWA!CAカードは機種変更など再ログイン時に必要となるため破棄しないようお願いします。'
            }
          </Text>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              padding: 16,
            }}>
            <InputPassword
              maxLength={6}
              keyboardType={'number-pad'}
              placeholder={'PINコードを入力'}
              styleContainer={{marginBottom: 0}}
              onChangeText={this.onChangeText}></InputPassword>
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '100%',
              padding: 16,
              paddingTop: 0,
            }}>
            <InputPassword
              maxLength={6}
              keyboardType={'number-pad'}
              placeholder={'PINコードを再入力'}
              styleContainer={{marginBottom: 0}}
              onChangeText={this.onChangeTextConfirm}></InputPassword>
          </View>
          {textError ? <Text style={styles.textError}>{textError}</Text> : null}
          <View style={{paddingHorizontal: 16, width: '100%'}}>
            <ButtonTypeOne
              activebutton={activebutton}
              loading={loading}
              name={'次へ'}
              onPress={this.checkPinCode}
            />
          </View>
          <View style={{padding: 16, width: '100%'}}>
            <ButtonTypeThree
              loading={loading}
              styleText={{color: COLOR_BLUE_LIGHT}}
              name={STRING.go_back}
              onPress={this.goBack}
            />
          </View>
          <View style={{padding: 8, borderWidth: 1, borderColor: '#cecece'}}>
            <Text style={{fontSize: 12}}>
              <Text style={styles.textError}>
                {'【ご注意】\nPINコードは未入力でもご登録可能となります。'}
              </Text>
              入力時、未入力時の機能の違いは以下となります。 {'\n \n'}
              <Text style={styles.textError}>
                {'▼PINコード未入力または不一致\n'}
              </Text>
              ・WA!CAポイント付与、利用
              <Text style={styles.textError}>
                {
                  '\n \n▼PINコード入力＆一致 ※WA!CAカード同様にご利用いただけます。\n'
                }
              </Text>
              {'・WA!CAポイント付与、利用\n・WA!CAマネーチャージ、利用\n'}
              <Text style={styles.textError}>
                {
                  '※アプリでWA!CAマネーのご利用にはWA!CAカードにて1度以上のチャージ実績が必要となります。'
                }
              </Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  marginLeftRight: {
    marginLeft: 25,
    marginRight: 25,
  },
  textError: {
    color: COLOR_RED,
    marginBottom: 10,
  },
  wrapperError: {
    marginTop: 5,
    width: DEVICE_WIDTH - 50,
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    flexGrow: null,
    width: '100%',
  },
  textInput: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperBody: {
    width: '100%',

    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperSpace: {
    height: 30,
  },

  textButton: {
    color: COLOR_WHITE,
    fontSize: 16,
    fontFamily: 'SegoeUI',
  },
  wrapperFooter: {
    width: DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: COLOR_GRAY,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    elevation: 2,
  },
});
