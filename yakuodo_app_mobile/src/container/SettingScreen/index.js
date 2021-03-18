import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar, AppState, Alert } from 'react-native';
import { List, Item, Content } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import HeaderIconLeft from '../../commons/HeaderIconLeft';
import {
  COLOR_GRAY_LIGHT,
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_WHITE,
} from '../../const/Color';
import { DEVICE_WIDTH, tab, subMenu, managerAcount, stateSercurity, keyAsyncStorage, isIOS, device, URL } from '../../const/System';
import { SubMenu } from './SubMenu';
import { openMenu } from '../../util/module/openMenu';
import { Security } from './Item/Security';
import UserChange from '../../service/UserChange';
import BeaconSetting from './Item/BeaconSetting';
import EddyStoneScanner from '../../nativelib/react-native-eddystone-scanner';
import Permissions from 'react-native-permissions';
export default class Setting extends PureComponent {
  isMount = false;
  constructor() {
    super();
    this.state = {
      username: null,
      nameLogin: '',
      iconLogin: '',
      nameLogout: '',
      iconLogout: '',
      nameRegister: '',
      iconRegister: '',
      subMenu: subMenu.data,
      visibleSercurity: managerAcount.userId && stateSercurity.onSecurity,
      appState: AppState.currentState,
    };
  }


  componentDidMount() {
    this.isMount = true;
    UserChange.onChange('Setting', status => {
      this.setState({ visibleSercurity: managerAcount.userId && stateSercurity.onSecurity })
    })
    this.didFocusSubscription = this.props.navigation.addListener('didFocus', async ()=> {
      this.checkBluetoothPermissionIOS();
    })
    AppState.addEventListener('change', this.handleAppStateChange);
    if (managerAcount.memberCode) {
      this.showTermsOfBeacon();
      this.handleMemberCodeChange();
    }
  }
  componentWillUnmount() {
    this.isMount = false;
    UserChange.unChange('Setting')
    this.didFocusSubscription.remove();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleMemberCodeChange = async ()=> {
    let isMemberCodeChange = await AsyncStorage.getItem(keyAsyncStorage.isMemberCodeChange);
    let allowUseBeacon = await AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon);
    if (isMemberCodeChange == 'yes') {
      AsyncStorage.setItem(keyAsyncStorage.isMemberCodeChange, 'no');
      if(!isIOS) {
        EddyStoneScanner.setUp(
          URL,
          managerAcount.accessToken,
          device.ADV_ID,
          stateSercurity.namespace,
          managerAcount.memberCode
        );
      }
      if (allowUseBeacon == 'yes') {
        try {
          EddyStoneScanner.stopScanEddyStone();
          setTimeout(()=> {
            EddyStoneScanner.startScanEddyStone();
          }, 2000);
        } catch (error) {
          
        }
      }
    }      
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.checkBluetoothPermissionIOS();
    }
    this.setState({ appState: nextAppState });
  };

  checkBluetoothPermissionIOS = async ()=> {
    if (isIOS) {
      console.log("tranta focus app ");
      let checkBluetoothPermission = this.props.navigation.getParam("checkBluetoothPermission", 'no');
      let allowUseBeacon = await AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon);
      if (allowUseBeacon == "yes" && checkBluetoothPermission == 'yes') {
        setTimeout(async () => {
          let status = await EddyStoneScanner.checkBluetoothPermission();
          console.log("tranta focus app 1 ", status);
          if (status.status == "denied" && this.isMount) {
            Alert.alert(
              "“Yakuodo_Dev”がBeaconを検知できるよう、Bluetoothをオンにしてください。",
              "",
              [
                {
                  text: "設定",
                  onPress: () => Permissions.openSettings()
                },
                {
                  text: "閉じる"
                }
              ],
              {
                cancelable: false
              }
            )
          }
        }, 1000);
      }
    }
  }

  render() {
    const { goBack } = this.props.navigation;
    const { iconUrlSettingScreen, nameSettingScreen } = tab.screenTab;
    const { disableBackButton, navigation } = this.props;
    const { visibleSercurity } = this.state


    return (
      <View style={styles.wrapperBody}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={disableBackButton}
          title={nameSettingScreen}
          goBack={goBack}
          imageUrl={iconUrlSettingScreen}
        />
        <Content>
          <View style={{ flex: 1, backgroundColor: COLOR_WHITE }}>
            <List>
              {visibleSercurity ?
                <Security navigation={this.props.navigation}></Security>
                : null
              }

              {managerAcount.memberCode && <BeaconSetting onPressLink={this.gotoTermsUseBeacon} />}

              <SubMenu
                data={this.state.subMenu}
                onPress={item => {
                  openMenu(item, navigation);
                }}
              />

            </List>
          </View>
        </Content>
      </View>
    );
  }

  gotoTermsUseBeacon = () => {
    this.props.navigation.navigate('TERM_USE_BEACON', {
      fromTo : 'BeaconSettings'
    })
  }

  showTermsOfBeacon = async ()=> {
    const isShow = await AsyncStorage.getItem(keyAsyncStorage.firstTimeShowTermUseBeacon);
    if (isShow != 'yes') {
      setTimeout(()=> {
        this.props.navigation.navigate('TermsOfUseBeacon', {
          fromTo : 'Settings'
        })
      }, 300);
      AsyncStorage.setItem(keyAsyncStorage.firstTimeShowTermUseBeacon, 'yes');
    }
  }
}

const styles = StyleSheet.create({
  wrapperBody: {
    flex: 1,
    backgroundColor: COLOR_WHITE,
    width: DEVICE_WIDTH,
    // height: '100%',
    paddingBottom: 0
  },
  avatarSetting: {
    width: 30,
    height: 30,
    borderRadius: 15
  },
  wrapperIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    marginRight: 15,
    borderRadius: 15
  },
  itemStyle: {
    backgroundColor: COLOR_WHITE,
    marginLeft: 0,
    height: 15,
    borderColor: COLOR_GRAY_LIGHT

    // paddingLeft: 15,
  },
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textDescriptionCard: {
    fontFamily: 'SegoeUI',
    fontSize: 14
  },
  textTitleCard: {
    fontFamily: 'SegoeUI',
    color: COLOR_BLACK,
    fontSize: 16,
    fontWeight: 'bold'
  },
  textTimeCard: {
    fontSize: 12,
    color: COLOR_BLUE,
    fontFamily: 'SegoeUI'
  },
  wrapperSpace: {
    height: 50
  }
});
