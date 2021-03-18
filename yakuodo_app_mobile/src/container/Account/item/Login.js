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

import {STRING} from '../../../const/String';
import {
  DEVICE_WIDTH,
  APP,
  managerAcount,
  APP_ID,
  stateSercurity,
} from '../../../const/System';
import {
  COLOR_WHITE,
  COLOR_BROWN,
  COLOR_GRAY,
  APP_COLOR,
  COLOR_BLUE_LIGHT,
  COLOR_RED,
} from '../../../const/Color';
import {TextInputLogin} from '../../LoginScreen/Item/TextInputLogin';
import {ButtonLogin} from '../../LoginScreen/Item/ButtonLogin';
import {AppImage} from '../../../component/AppImage';
import {
  linkDeeplink,
  countScanerQRCoupon,
  useDeepLink,
} from '../../HomeScreen/SetUpDeepLink';
import {renderHome} from '../../HomeScreen/index';
import {API_URL} from '../../../const/Url';
import {PinCode} from './PinCode';
import {checkBlackList} from '../util/checkBlackList';
export class Login extends Component {
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
      memberCodeLogin: '',
      memberCode: '',
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    if (linkDeeplink.linkSave && !managerAcount.userId) {
      setTimeout(() => {
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
      }, 500);

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
    const {visibleModal} = this.props;
    visibleModal();
  };
  pushLogin = async () => {
    const {textAll} = this.state;
    const {setVisible} = this.props;
    if (textAll.length === 16) {
      this.state.memberCodeLogin = textAll;
      this.state.activebutton = false;

      this.checkMemberBlackList();
    }
  };
  checkMemberBlackList = async () => {
    this.setState({loading: true});
    try {
      const blackList = await checkBlackList(this.state.memberCodeLogin);
      // console.log('blackList', blackList);
      if (!blackList) {
        this.state.textAll = '';
        this.state.textOne = '';
        this.state.textTwo = '';
        this.state.textThree = '';
        this.state.textFour = '';
        this.setVisibleScreen('pinCode');
        return;
      }
      // console.log('blackList', blackList);
      return;
    } catch (error) {
    } finally {
      this.setState({loading: false});
    }
  };
  setVisibleScreen = screen => {
    this.setState({visibleScreen: screen});
    const {} = this.props;
    if (screen == 'success') {
      setTimeout(() => {
        const {visibleModal, setVisibleScreenOtp} = this.props;
        if (stateSercurity.onSecurity) {
          setVisibleScreenOtp();
        } else {
          visibleModal();

          if (linkDeeplink.linkSave) {
            this.timeOutModalDidMount = setTimeout(() => {
              useDeepLink(linkDeeplink.linkSave);
              linkDeeplink.linkSave = null;
            }, 500);
          }
        }
      }, 2000);
    }
  };
  goBack = () => {
    const {visibleModal, setVisibleScreen} = this.props;
    if (
      managerAcount.validateOtp ||
      managerAcount.memberCodeInBlackList ||
      !stateSercurity.onSecurity
    ) {
      visibleModal();
    } else {
      setVisibleScreen('addOtp');
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

  renderContent = () => {
    const {loading, visibleScreen, activebutton, memberCodeLogin} = this.state;
    if (visibleScreen === 'success') {
      return (
        <Text style={{fontSize: 18, marginVertical: 50}}>
          {'会員カードの登録が完了しました。'}
        </Text>
      );
    }
    if (visibleScreen === 'pinCode') {
      return (
        <PinCode
          setVisibleScreen={this.setVisibleScreen}
          memberCodeLogin={memberCodeLogin}></PinCode>
      );
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flex: 1,
        }}>
        <Text style={{fontSize: 14, textAlign: 'center', marginBottom: -10}}>
          WA!CA カード番号を入力
        </Text>
        <Text style={{color: COLOR_RED, fontSize: 14, marginBottom: 10}}>
          {
            '\nWA!CAカードは機種変更など再ログイン時に必要となるため破棄しないようお願いします。'
          }
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
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
          name={'次へ'}
          onPress={() => {
            this.pushLogin();
          }}
          style={{
            marginTop: 20,
            backgroundColor: activebutton ? COLOR_BLUE_LIGHT : COLOR_GRAY,
          }}
        />
        {managerAcount.userId ? (
          <ButtonLogin
            loadingLogin={loading}
            activebutton={activebutton}
            styleText={{color: COLOR_BLUE_LIGHT}}
            name={STRING.go_back}
            onPress={this.goBack}
            style={{
              marginTop: 16,
              backgroundColor: COLOR_WHITE,
              borderColor: COLOR_BLUE_LIGHT,
              borderWidth: 1,
              width: '100%',
            }}
          />
        ) : (
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
        <View
          style={{
            borderColor: '#cecece',
            width: '100%',
            borderWidth: 1,
            padding: 8,
            marginTop: 16,
            marginBottom: 30,
            paddingHorizontal: 16,
          }}>
          <Text style={{fontSize: 12}}>
            {
              '初めてWA!CAをご利用またはカード不良で再発行したお客さまは、お買い物またはチャージした翌日にカード番号の登録ができるようになります。'
            }
          </Text>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View>
        <View
          style={[
            [
              styles.wrapperContainer,
              {alignItems: 'center'},
            ],
          ]}>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <AppImage
              style={{width: DEVICE_WIDTH / 2, height: DEVICE_WIDTH / 4}}
              url={APP.IMAGE_LOGO}
              resizeMode={'contain'}
            />
          </View>

          {this.renderContent()}
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
  wrapperError: {
    marginTop: 5,
    width: DEVICE_WIDTH - 50,
    marginLeft: 25,
    marginRight: 25,
  },
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH - 30,
    paddingHorizontal: 16,
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
