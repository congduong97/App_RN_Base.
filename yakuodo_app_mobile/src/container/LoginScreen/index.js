import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import {RNShopSdkBanner} from 'react-native-shop-sdk';
import AsyncStorage from '@react-native-community/async-storage';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {STRING} from '../../const/String';
import {
  DEVICE_WIDTH,
  APP,
  managerAcount,
  keyAsyncStorage,
  APP_ID,
} from '../../const/System';
import {
  COLOR_WHITE,
  COLOR_BROWN,
  COLOR_GRAY,
  APP_COLOR,
} from '../../const/Color';
import {Api} from '../../service';

import BackButton from '../../commons/BackButton';
import {TextInputLogin} from './Item/TextInputLogin';
import {ButtonLogin} from './Item/ButtonLogin';
import {AppImage} from '../../component/AppImage';
import {pushResetScreen} from '../../util';
import {getUserInfo} from '../../service/addListener';
import {linkDeeplink, countScanerQRCoupon} from '../HomeScreen/SetUpDeepLink';
import {renderHome} from '../HomeScreen';
import {API_URL} from '../../const/Url';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textOne: '',
      textTwo: '',
      textThree: '',
      textFour: '',
      textAll: '',
      loading: false,
      activebutton: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    // alert(linkDeeplink.linkSave);
    if (linkDeeplink.linkSave && !renderHome && !managerAcount.userId) {
      Alert.alert(
        STRING.notification,
        STRING.please_login_to_use,
        [
          {
            text: STRING.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: STRING.ok,
            onPress: () => {},
          },
        ],
        {cancelable: false},
      );
      if (
        linkDeeplink.linkSave.includes(
          `${API_URL.URL_DOMAIN}/api/v1/app/${APP_ID}/checkNewQPON?`,
        ) ||
        linkDeeplink.linkSave.includes(`${API_URL.URL_DOMAIN}/deeplink`)
      ) {
        this.callDeepLink(linkDeeplink.linkSave);
      }
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  callDeepLink = link => {
    this.timeoutDeepLinkLogin = setTimeout(() => {
      countScanerQRCoupon(link);
    }, 500);
  };
  handleBackPress = () => {
    const {routeName} = this.props.navigation.state;
    if (routeName === 'ChangeMemberCode') {
      this.props.navigation.goBack(null);
      return true;
    }
    return true;
  };
  changeDataParent = field => value => {
    this.state[field] = value;
    const {textOne, textTwo, textThree, textFour} = this.state;
    this.state.textAll = `${textOne}${textTwo}${textThree}${textFour}`;
    if (this.state.textAll.length == 16) {
      this.setState({activebutton: true});
    } else if (!this.state.activebutton || this.state.activebutton) {
      this.setState({activebutton: false});
    }
  };
  pushHome = () => {
    const {navigation} = this.props;

    // if (renderHome) {
    //     navigation.goBack(null);
    // } else {
    pushResetScreen(navigation, 'HomeNavigator');
    // }
  };
  pushLogin = async () => {
    const {textAll} = this.state;
    const {routeName} = this.props.navigation.state;

    this.setState({loading: true});

    try {
      if (textAll.length === 16) {
        const response = await Api.pushSign(textAll);
        // console.log('login', response);

        if (response.code == 400) {
          Alert.alert(STRING.member_code_not_found);
        } else if (response.code == 200) {
          const {newAccessToken, newRefreshToken, userId} = response.res;
          // console.log('Login', response.res);
          if (routeName == 'Login') {
            managerAcount.accessToken = newAccessToken;
            managerAcount.refreshToken = newRefreshToken;
            managerAcount.userId = userId;
            managerAcount.memberCode = textAll;
            await getUserInfo();
            AsyncStorage.setItem(
              keyAsyncStorage.managerAccount,
              JSON.stringify(managerAcount),
            );
            this.pushHome();
            return;
          }
          managerAcount.accessToken = newAccessToken;
          managerAcount.refreshToken = newRefreshToken;
          managerAcount.userId = userId;
          managerAcount.memberCode = textAll;

          AsyncStorage.getItem(keyAsyncStorage.deviceToken).then(res => {
            if (res) {
              if (managerAcount.userId) {
                RNShopSdkBanner.saveMemberCode(`${managerAcount.memberCode}`);
                RNShopSdkBanner.registDeviceToken(
                  res,
                  managerAcount.memberCode || '',
                );
              } else {
                RNShopSdkBanner.registDeviceToken(res, '');
              }
            }
          });
          await getUserInfo();
          Alert.alert(STRING.change_account_success);
          AsyncStorage.setItem(
            keyAsyncStorage.managerAccount,
            JSON.stringify(managerAcount),
          );
          this.props.navigation.goBack('');

          return;
        } else {
          Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
        }
      }
      this.setState({loading: false});
    } catch (e) {
      this.setState({loading: false});

      Alert.alert(STRING.an_error_occurred, STRING.please_try_again_later);
    } finally {
      // console.log('gotuf');
    }
  };
  changeFocus = field => value => {
    switch (field) {
      case 'textOne':
        if (value) {
          this.inPutTwo.textInput.focus();
        }
        break;
      case 'textTwo':
        if (value) {
          this.inPutThree.textInput.focus();
        } else {
          this.inPutOne.textInput.focus();
        }
        break;
      case 'textThree':
        if (value) {
          this.inPutFour.textInput.focus();
        } else {
          this.inPutTwo.textInput.focus();
        }
        break;
      case 'textFour':
        if (!value) {
          this.inPutThree.textInput.focus();
        }
    }
  };
  renderBackButton() {
    const {goBack} = this.props.navigation;
    const {routeName} = this.props.navigation.state;
    if (routeName == 'Login') {
      return null;
    }
    return <BackButton goBack={() => goBack(null)} />;
  }
  render() {
    const {routeName} = this.props.navigation.state;
    const {loading, activebutton} = this.state;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        extraHeight={200}
        enableOnAndroid
        style={styles.wrapperContainer}>
        <View style={styles.wrapperContainer}>
          <View style={styles.wrapperBody}>
            <AppImage
              style={{
                width: DEVICE_WIDTH / 2,
                height: DEVICE_WIDTH / 4,
                margin: 8,
                marginTop: 30,
              }}
              url={APP.IMAGE_LOGO}
              resizeMode={'contain'}
            />
            <Text style={{marginTop: 10, fontSize: 20}}>
              WA!CA カード番号を入力
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                padding: 16,
                paddingLeft: 18,
                paddingRight: 14,
              }}>
              <TextInputLogin
                loading={loading}
                changeFocus={this.changeFocus('textOne')}
                onRef={ref => (this.inPutOne = ref)}
                changeDataParent={this.changeDataParent('textOne')}
              />
              <TextInputLogin
                loading={loading}
                changeFocus={this.changeFocus('textTwo')}
                onRef={ref => (this.inPutTwo = ref)}
                changeDataParent={this.changeDataParent('textTwo')}
              />
              <TextInputLogin
                loading={loading}
                changeFocus={this.changeFocus('textThree')}
                onRef={ref => (this.inPutThree = ref)}
                changeDataParent={this.changeDataParent('textThree')}
              />
              <TextInputLogin
                loading={loading}
                changeFocus={this.changeFocus('textFour')}
                onRef={ref => (this.inPutFour = ref)}
                changeDataParent={this.changeDataParent('textFour')}
              />
            </View>

            <ButtonLogin
              activeOpacity={activebutton ? 0.5 : 1}
              loadingLogin={loading}
              name={STRING.login}
              onPress={() => {
                this.pushLogin();
              }}
              style={{
                marginTop: 20,
                backgroundColor: activebutton
                  ? APP_COLOR.COLOR_TEXT
                  : COLOR_GRAY,
              }}
            />
            {routeName !== 'Login' ? null : (
              <TouchableOpacity
                onPress={() => {
                  if (!loading) {
                    this.pushHome();
                    linkDeeplink.linkSave = null;
                  }
                }}>
                <Text style={{color: APP_COLOR.COLOR_TEXT, marginTop: 50}}>
                  {'カード番号を入力せずに利用する'}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={{marginTop: 40, fontSize: 15}}>
              {
                '初めてWA!CAをご利用またはカード不良で再発行したお客さまは、お買い物またはチャージした翌日にカード番号の登録ができるようになります。'
              }
            </Text>
          </View>
          {this.renderBackButton()}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  marginLeftRight: {
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperError: {
    marginTop: 5,
    width: DEVICE_WIDTH - 50,
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperContainer: {
    paddingTop: isIOS ? 20 : 0,
    backgroundColor: COLOR_WHITE,
    flex: 1,
    paddingBottom: 20,
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
    width: DEVICE_WIDTH,

    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  wrapperSpace: {
    height: 30,
  },
  wrapperBottomButton: {
    margin: 25,
    marginBottom: 10,
    backgroundColor: COLOR_BROWN,
    width: DEVICE_WIDTH - 50,
    height: 45,
    borderRadius: 5,
  },
  textButton: {
    color: COLOR_WHITE,
    fontSize: 16,
    fontFamily: 'SegoeUI',
  },
  wrapperFooter: {
    flex: 1,
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
