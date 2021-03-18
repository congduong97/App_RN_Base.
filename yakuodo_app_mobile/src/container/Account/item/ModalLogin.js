import React, {Component} from 'react';
import {View, Text, AppState, ScrollView, Alert} from 'react-native';
import {Login} from './Login';
import Modal from 'react-native-modal';
import {
  DEVICE_WIDTH,
  managerAcount,
  stateSercurity,
  isIOS,
} from '../../../const/System';
import {COLOR_WHITE} from '../../../const/Color';
import {ServiveModal} from '../../HomeScreen/util/service';
import {ValidatePhone} from './ValidatePhone';
import BackList from './BackList';
import NavigationService from '../../../service/NavigationService';
import CurrentScreen from '../../../service/CurrentScreen';
import {CheckDataApp} from '../../LauncherScreen/service';
import BackgroundTimer from 'react-native-background-timer';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
export default class ModalLogin extends Component {
  constructor(props) {
    super(props);
    let screenVisible = '';
    if (managerAcount.memberCodeInBlackList && stateSercurity.onSecurity) {
      screenVisible = 'memberCodeInBackList';
    } else if (!managerAcount.userId) {
      screenVisible = 'addMemberCode';
    } else if (!managerAcount.validateOtp && stateSercurity.onSecurity) {
      screenVisible = 'addOtp';
    }

    this.state = {
      isVisible: !!screenVisible,
      screenVisible,
    };
  }

  componentDidMount() {
    CheckDataApp.onChange('SERCURITY', status => {
      if (status && status.type == 'UPDATE_APP') {
        if (this.state.isVisible) {
          this.setState({isVisible: false});
        }
        return;
      }

      if (this.state.isVisible && !stateSercurity.onSecurity) {
        this.setState({isVisible: false});
        return;
      }
      if (!this.state.isVisible && stateSercurity.onSecurity) {
        let screenVisible = '';
        if (managerAcount.memberCodeInBlackList && stateSercurity.onSecurity) {
          screenVisible = 'memberCodeInBackList';
        } else if (!managerAcount.userId) {
          screenVisible = 'addMemberCode';
        } else if (!managerAcount.validateOtp && stateSercurity.onSecurity) {
          screenVisible = 'addOtp';
        }
        if (screenVisible) {
          this.setState({screenVisible, isVisible: !!screenVisible});
        }
      }
    });

    ServiveModal.onChange('ModalLogin', status => {
      if (status && status.type == 'BLACK_LIST' && stateSercurity.onSecurity) {
        this.setState({screenVisible: 'memberCodeInBackList', isVisible: true});
        return;
      }
      if (status && status.type == 'CHECK_VALIDATE_PHONE') {
        let screenVisible = '';
        if (managerAcount.memberCodeInBlackList && stateSercurity.onSecurity) {
          screenVisible = 'memberCodeInBackList';
        } else if (!managerAcount.userId) {
          screenVisible = 'addMemberCode';
        } else if (!managerAcount.validateOtp && stateSercurity.onSecurity) {
          screenVisible = 'addOtp';
        }
        if (screenVisible && !this.state.isVisible) {
          this.setState({screenVisible, isVisible: !!screenVisible});
        }
        return;
      }

      this.setState({screenVisible: 'addMemberCode', isVisible: true});
    });
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (
      nextAppState === 'active' &&
      this.state.appState == 'background' &&
      stateSercurity.onSecurity
    ) {
      if (managerAcount.enablePasswordOppenApp) {
        NavigationService.navigate('EnterPassMyPageAndOppenApp', {
          nameScreen: 'LOCK_BACKGROUND',
        });
      } else {
        if (
          managerAcount.enablePasswordMyPage &&
          CurrentScreen.get() == 'MY_PAGE'
        ) {
          NavigationService.navigate('EnterPassMyPageAndOppenApp', {
            nameScreen: 'LOCK_BACKGROUND_MY_PAGE',
          });
        }
      }
    }

    if (!isIOS) {
      if (this.timeOutBackground) {
        BackgroundTimer.clearTimeout(this.timeOutBackground);
      }
      this.timeOutBackground = BackgroundTimer.setTimeout(() => {
        this.state.appState = nextAppState;
      }, 500);
    } else {
      this.state.appState = nextAppState;
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  visibleModal = () => {
    this.setState({isVisible: !this.state.isVisible});
  };
  setVisibleScreenOtp = () => {
    this.setState({screenVisible: 'addOtp'});
  };
  setVisibleScreen = screenVisible => {
    this.setState({screenVisible});
  };

  renderContent = () => {
    const {screenVisible} = this.state;
    if (screenVisible === 'memberCodeInBackList') {
      return (
        <BackList
          setVisibleScreen={this.setVisibleScreen}
          visibleModal={this.visibleModal}></BackList>
      );
    }
    if (screenVisible === 'addMemberCode') {
      return (
        <Login
          visibleModal={this.visibleModal}
          setVisibleScreen={this.setVisibleScreen}
          setVisibleScreenOtp={this.setVisibleScreenOtp}></Login>
      );
    }
    if (screenVisible === 'addOtp') {
      return (
        <ValidatePhone
          visibleModal={this.visibleModal}
          setVisibleScreen={this.setVisibleScreen}></ValidatePhone>
      );
    }
    return null;
  };
  render() {
    const {isVisible} = this.state;
    return (
      <Modal
        isVisible={isVisible}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'always'}
          extraHeight={200}
          enableOnAndroid
          style={[styles.wrapperContainer, {flexGrow: null}]}>
          <View
            style={{
              width: DEVICE_WIDTH - 32,
              backgroundColor: COLOR_WHITE,
              padding: 16,
              borderRadius: 4,
              alignItems: 'center',
            }}>
            {this.renderContent()}
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}

const styles = {
  wrapperContainer: {
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH - 32,
  },
};
