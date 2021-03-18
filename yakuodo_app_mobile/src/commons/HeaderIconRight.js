import React, { PureComponent } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform, SafeAreaView,AppState } from 'react-native';
import { Right, Body, Left, Header } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import PushNotification from 'react-native-push-notification';
import { Api } from '../service';
import { DEVICE_WIDTH, DEVICE_HEIGHT, tab, screen, APP, SYSTEAM_VERSION } from '../const/System';
import {
  COLOR_GRAY,
  COLOR_BLACK,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
} from '../const/Color';

import { AppImage } from '../component/AppImage';
import NotificationCount from '../service/NotificationCount';
import { CheckDataApp } from '../container/LauncherScreen/service';


const BadgeAndroid = require('react-native-android-badge');

export default class HeaderIconRight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageLogo: APP.IMAGE_LOGO,
      count: 0
    };
    this.onPressIconNotifications = this.onPressIconNotifications.bind(this);
  }
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    this.props.onRef && this.props.onRef(this);
    NotificationCount.onChange('notification-count', count => {
        if (count <= 0) {
          if (isIOS) {
            PushNotification.setApplicationIconBadgeNumber(0);
          } else {
            BadgeAndroid.setBadge(0);
          }
          this.setState({ count: 0 });
        } else {
          if (isIOS) {
            PushNotification.setApplicationIconBadgeNumber(count);
          } else {
            BadgeAndroid.setBadge(count);
          }
          this.setState({ count });
        }
    });
    CheckDataApp.onChange('HEADER', () => {
      const { imagelogo } = this.state
      // console.log('change Herder')
      if (imagelogo !== APP.IMAGE_LOGO) {
          this.setState({ imageLogo: APP.IMAGE_LOGO })
          // console.log('chnage',APP.IMAGE_LOGO)
      }
    })

    // if (NetInfo.)
    this.getApi();
  }
  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
    CheckDataApp.unChange('HEADER')
    NotificationCount.unChange('notification-count')
  }
  handleAppStateChange = (nextAppState) => {
    if (isIOS) {
      if (nextAppState === 'active') {
        this.getApi()

      }

    }
  }

  onPressIconNotifications() {
    const { navigation } = this.props;


      navigation.navigate('PUSH_NOTIFICATION');
      NotificationCount.set(0);
  }
  getApi = async () => {
    if (!this.state.loading) {
      try {
        this.state.loading = true;
        const updateNotification = await Api.getCheckUpDatePushNotification();
        // console.log('updateNotification',updateNotification)
        if (updateNotification.code === 200) {
          const count = updateNotification.res;
          if (Number.isInteger(count)) {
            NotificationCount.set(count);

          }
        }
      } catch (err) {
        
      } finally {
        this.state.loading = false;
      }
    }
  };

  render() {
    const { count ,imageLogo} = this.state;
    return (
      <SafeAreaView
        style={{
          backgroundColor: COLOR_WHITE,
          shadowColor: COLOR_WHITE,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0
        }}
      >
        <View style={[styles.wrapperHeader]}>
          <Left />
          <Body>
            <View style={styles.wrapperLogo}>
              <AppImage style={styles.imageLogo} url={imageLogo} />
            </View>
          </Body>
          <Right>
            <TouchableOpacity
              onPress={this.onPressIconNotifications}
              style={{ padding: 10, paddingLeft: 30, paddingRight: 15 }}
              width={50}
              activeOpacity={0.1}
            >
              <Icon name={'bell-o'} size={22} />
              {count > 0 ? <Text style={styles.textBabel}>{count}</Text> : null}
            </TouchableOpacity>
          </Right>
        </View>
      </SafeAreaView>
    );
  }
}

const isIOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  wrapperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: isIOS ? 64 : 56,
    backgroundColor: COLOR_WHITE,
    borderBottomWidth: 1,
    borderColor: COLOR_GRAY_LIGHT,
    marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,

  },
  textBabel: {
    fontFamily: 'SegoeUI',
    top: 10,
    right: 25,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    padding: 8,
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 10,
    color: COLOR_WHITE,
    backgroundColor: 'red'
  },
  textTitle: {
    fontFamily: 'SegoeUI',
    color: COLOR_BLACK,
    fontSize: 12,
    fontWeight: 'bold'
  },
  wrapperLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  imageLogo: {
    width: 120,
    height: 100
  },
  shadow: isIOS
    ? {
      shadowColor: COLOR_GRAY,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.5
    }
    : {
      elevation: 1
    }
});
