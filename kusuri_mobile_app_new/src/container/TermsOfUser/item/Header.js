import React, { PureComponent } from 'react'
import { View, StatusBar, StyleSheet, SafeAreaView, Platform } from 'react-native'
import PropTypes from 'prop-types';

import { isIOS, DEVICE_WIDTH } from '../../../const/System'
import { COLOR_GRAY_LIGHT, COLOR_WHITE } from '../../../const/Color'

export default class Header extends PureComponent {
  static propTypes = {
    leftComponent: PropTypes.func,
    centerComponent: PropTypes.func,
    rightComponent: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  render() {
    let headerHeight = isIOS ? 64 : 56;
    return (
      <SafeAreaView style={{ backgroundColor: COLOR_WHITE }}>
        <View >
          {Platform.OS == 'android' && <StatusBar backgroundColor={COLOR_GRAY_LIGHT} barStyle='dark-content' />}
          <View style={{ justifyContent: 'center', width: DEVICE_WIDTH, height: headerHeight, backgroundColor: COLOR_WHITE }}>
            {this.props.leftComponent && this.props.leftComponent()}
            <View style={{ position: 'absolute', alignSelf: 'center' }}>
              {this.props.centerComponent && this.props.centerComponent()}
            </View>
            <View style={{ position: 'absolute', alignSelf: 'flex-end', height: headerHeight, width: headerHeight, justifyContent: 'center', alignItems: 'center' }}>
              {this.props.rightComponent && this.props.rightComponent()}
            </View>
          </View>
          <View style={{ width: DEVICE_WIDTH, height: 1, backgroundColor: '#00000029' }} />
        </View>
      </SafeAreaView>
    )
  }
}
