import React, { PureComponent } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { keyAsyncStorage, isIOS } from '../../../const/System';
import EddyStoneScanner from '../../../nativelib/react-native-eddystone-scanner';
import EddyStoneStatusService from '../../../service/EddyStoneStatusService';
import { Api } from '../../../service';
export default class BeaconSetting extends PureComponent {

  constructor() {
    super()
    this.state = {
      status : EddyStoneStatusService.get(),
    }
  }

  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
          <Text>Beaconの利用</Text>
          <Switch style={{ paddingRight: -10 }} value={this.state.status === 'yes'} onValueChange={this.onValueChange} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 16, alignItems: 'center', marginVertical: 10 }}>
          <Text onPress={() => this.props.onPressLink()} style={{ color: 'blue', textDecorationLine: 'underline' }}>Beaconの利用同意</Text>
        </View>
      </View>
    )
  }

  componentDidMount() {
    AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon)
      .then(data => {
        this.setState({ status : data })
      })
      .catch(err => {

      })

    EddyStoneStatusService.onChange('BeaconSetting', async () => {
      let allowUseBeacon = await AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon);
      this.setState({
        status: allowUseBeacon
      })
    })
  }

  componentWillUnmount() {
    EddyStoneStatusService.unChange('BeaconSetting');
  }

  onValueChange = (value)=> {
    try {
      if (value) {
        this.props.onPressLink();
      } else {
        EddyStoneScanner.stopScanEddyStone();
        AsyncStorage.setItem(keyAsyncStorage.allowUseBeacon, 'no');
        EddyStoneStatusService.set('no');
        Api.changeStatusAllowToUseBluetooth('off')
      }
    } catch (error) {
      
    }
  }
}