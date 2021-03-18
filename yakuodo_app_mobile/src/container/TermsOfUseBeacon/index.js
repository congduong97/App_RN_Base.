import React, { PureComponent } from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Image, AppState, Platform } from 'react-native';
import HTML from 'react-native-render-html';
import AsyncStorage from '@react-native-community/async-storage';

import HeaderIconLeft from '../../commons/HeaderIconLeft'
import { COLOR_GRAY_LIGHT } from '../../const/Color';
import { STRING } from '../../const/String';
import { Api } from '../../service';
import { keyAsyncStorage, isIOS, DEVICE_WIDTH, managerAcount } from '../../const/System';
import EddyStoneScanner from '../../nativelib/react-native-eddystone-scanner';
import EddyStoneStatusService from '../../service/EddyStoneStatusService';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
export default class TermsOfUseBeacon extends PureComponent {

  fromTo = 'HomeScreen';
  constructor() {
    super()
    this.state = {
      html: ''
    }
  }

  render() {
    this.fromTo = this.props.navigation.getParam("fromTo", 'HomeScreen');
    const { goBack } = this.props.navigation;
    console.log("goBack ", goBack)
    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle="dark-content" />
        <HeaderIconLeft
          disableBackButton={this.fromTo === 'HomeScreen' || this.fromTo === 'Settings'}
          title="Beaconの利用同意"
          goBack={goBack}
        />

        <View style={styles.webview_container}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <HTML html={this.state.html}
              onLinkPress={(e, href) => {
                Linking.openURL(href);
              }}
              renderers={{
                img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                  if (Object.keys(convertedCSSStyles).length === 0) {

                    return (
                      <Image
                        key={`${Math.random()}`}
                        resizeMode='contain'
                        source={{ uri: htmlAttribs.src }}
                        style={{
                          width: undefined,
                          height: undefined,
                          alignSelf: 'center'
                        }}
                      />
                    );
                  }

                  const maxWidth = DEVICE_WIDTH * 0.9;

                  let customWidth = convertedCSSStyles.width;
                  let customHeight = convertedCSSStyles.height;

                  if (isNaN(convertedCSSStyles.width)) {
                    customWidth =
                      (parseFloat(convertedCSSStyles.width) * maxWidth) / 100;
                  }

                  if (isNaN(convertedCSSStyles.height)) {
                    customHeight =
                      (parseFloat(convertedCSSStyles.height) * maxWidth) / 100;
                  }

                  const ratio = customWidth / customHeight;
                  return (
                    <Image
                      key={`${Math.random()}`}
                      resizeMode='stretch'
                      source={{ uri: htmlAttribs.src }}
                      style={{
                        width: maxWidth,
                        height: undefined,
                        aspectRatio: ratio,
                        alignSelf: 'center',
                      }}
                    />
                  );
                },
              }} />
          </ScrollView>
        </View>

        <TouchableOpacity
          style={{
             alignItems: 'center',marginHorizontal:15,
            backgroundColor: '#3E4489', borderRadius: 5, borderWidth: 1, marginVertical: 10,borderBottomColor:"#707070"
          }}
          onPress={this.allowUseBeacon}>
          <Text style={{ fontSize: 16, color: 'white',fontWeight:"bold", marginVertical: 13 }}>{STRING.allow_use_beacon}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
           alignItems: 'center',marginHorizontal:15,
           backgroundColor: 'white', borderRadius: 5, borderWidth: 1,borderBottomColor:"#707070",
           marginBottom:20
        }}
          onPress={this.rejectUseBeacon}>
          <Text style={{ fontSize: 16, color: 'black', marginVertical: 13 }}>{STRING.reject_use_beacon}</Text>
        </TouchableOpacity>
      </View >
    )
  }

  componentDidMount() {
    Api.getTermsOfUseBeacon()
      .then(response => response.text())
      .then(data => {
        this.setState({
          html: data
        })
      })
      .catch(err => {
        console.log("getTermsOfUseBeacon err: ", err)
      })
  }

  allowUseBeacon = async () => {
    if (managerAcount.memberCode != null) {
      if (this.fromTo === 'HomeScreen' || this.fromTo === 'Settings') {
        try {
          AsyncStorage.setItem(keyAsyncStorage.firstTimeShowTermUseBeacon, 'yes');
          if (isIOS) {
            this.startScanBeacon();
          } else {
            this.checkBluetoothStatusAndScanBeacon();
          }
          Api.changeStatusAllowToUseBluetooth('on');
        } catch (error) {
  
        }
      } else {
        let allowUseBeacon = await AsyncStorage.getItem(keyAsyncStorage.allowUseBeacon);
        if (allowUseBeacon == null) {
          allowUseBeacon = 'no';
        }
        if (allowUseBeacon == 'no') {
          if (isIOS) {
            this.startScanBeacon();
          } else {
            this.checkBluetoothStatusAndScanBeacon();
          }
          Api.changeStatusAllowToUseBluetooth('on');
        } 
        
      }
    } else {
      this.props.navigation.navigate('SETTING', {
        checkBluetoothPermission : 'no'
      })
    }
  }

  rejectUseBeacon = async () => {
    if (this.fromTo === 'HomeScreen' || this.fromTo === 'Settings') {
      AsyncStorage.setItem(keyAsyncStorage.firstTimeShowTermUseBeacon, 'yes');
      AsyncStorage.setItem(keyAsyncStorage.allowUseBeacon, 'no');
      EddyStoneStatusService.set('no');
    } else {
      this.stopScanBeacon();
    }
    Api.changeStatusAllowToUseBluetooth('off');
    this.props.navigation.navigate('SETTING', {
      checkBluetoothPermission : 'no'
    })
  }

  startScanBeacon = () => {
    try {
      setTimeout(()=> {
        EddyStoneScanner.startScanEddyStone();
      }, 1000);
      AsyncStorage.setItem(keyAsyncStorage.allowUseBeacon, 'yes');
      EddyStoneStatusService.set('yes');
    } catch (error) {
      
    }
    this.props.navigation.navigate('SETTING', {
      checkBluetoothPermission: 'yes'
    })
  }

  stopScanBeacon = ()=> {
    try {
      EddyStoneScanner.stopScanEddyStone();
      AsyncStorage.setItem(keyAsyncStorage.allowUseBeacon, 'no');
      EddyStoneStatusService.set('no');
    } catch (error) {
      
    }
  }

  checkBluetoothStatusAndScanBeacon = async ()=> {
    const bluetoothStatus = await BluetoothStatus.state();
    console.log("tranta bluetoothStatus ", bluetoothStatus);
    if (bluetoothStatus) {
      this.checkLocationPermissionAndStartScan();
      //this.startScanBeacon();
    } else {
      Alert.alert("ブルートゥーススキャン",
        "Beacon機能を利用するためにブルートゥースはONにしてください。",
        [
          {
            text: "Cancel",
            onPress: () => { }
          },
          {
            text: 'Ok',
            onPress: () => {
              BluetoothStatus.enable(true);
              this.checkLocationPermissionAndStartScan();
              //this.startScanBeacon();
            }
          }
        ],
        { cancelable: false })
    }
  }

  handleBlockLocationPermissionEvent = ()=> {
    try {
      Api.changeStatusAllowToUseBluetooth('off');
      this.props.navigation.navigate('SETTING', {
        checkBluetoothPermission : 'no'
      })  
    } catch (error) {
      
    }
  }

  checkLocationPermissionAndStartScan = async () => {
    if (!isIOS) {
      let status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status === RESULTS.GRANTED) {
        this.startScanBeacon();
      } else if (status === RESULTS.BLOCKED) {
        this.handleBlockLocationPermissionEvent();
      } else {
        let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (response === RESULTS.GRANTED) {
          this.startScanBeacon();                                                                                                                                                         
        } else if (response === RESULTS.BLOCKED) {
          this.handleBlockLocationPermissionEvent();
        }
      }  
    }
  }
}

const styles = StyleSheet.create({

  title: {
    fontSize: 16,
    fontFamily: 'SegoeUI',
  },
  webview_container: {
    flex: 1, width: '90%', 
    alignSelf:"center",
    marginTop:10
  }
})
