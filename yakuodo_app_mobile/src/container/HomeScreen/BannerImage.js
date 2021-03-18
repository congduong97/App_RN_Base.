import React, { Component } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { AppImage } from '../../component/AppImage';
import { DEVICE_WIDTH, managerAcount } from '../../const/System';
import { STRING } from '../../const/String';
import { Api } from '../../service';
import { CheckDataApp } from '../LauncherScreen/service';
import ReloadScreen from '../../service/ReloadScreen';
import { ServiveModal } from './util/service';
// import console = require('console');
// import console = require('console');
// import console = require('console');

export class BannerImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      id: null,
      url: null
    };
  }
  componentDidMount() {
    this.getBanner();
    CheckDataApp.onChange('BANNER', () => {
      this.getBanner()
      // alert('change banner')
      // console.log('change banner')
    })
  }
  componentWillUnmount() {
    CheckDataApp.unChange('BANNER')
  }

  getBanner = async () => {
    try {
      const res = await AsyncStorage.getItem('groupBanner');
      // console.log('dddddd',res)
      if (res && res !== 'null') {
        const banner = JSON.parse(res);
        // console.log('banner',banner)
        if (banner.active) {
          this.setState({ visible: true, url: banner.url, id: banner.id });
        }
      } else {
        this.setState({ visible: false });

      }
    } catch (error) {
      // console.log('error', error)
    }
  }
  callclickBanner = async () => {
    try {
      const { id } = this.state;
      const res = await Api.clickBanner(id);
      // console.log('rescallclickBanner', res);
    } catch (error) {
    }
  }
  clickBanner = () => {
    this.callclickBanner();
    if (managerAcount.userId) {
      this.props.navigation.navigate('LIST_BANNER');
      ReloadScreen.set('LIST_BANNER')
    } else {
      Alert.alert(
        STRING.notification,
        STRING.please_login_to_use,
        [
          {
            text: STRING.cancel,
            onPress: () => { },
            style: 'cancel'
          },
          { text: STRING.ok, onPress: () => ServiveModal.set() },
        ],
        { cancelable: false }
      );
    }
  }

  render() {
    const { visible, id, url } = this.state;
    if (!visible) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.clickBanner}>
        <AppImage url={url} style={{ width: DEVICE_WIDTH, height: DEVICE_WIDTH / 5 }} />

      </TouchableOpacity>
    );
  }
}
