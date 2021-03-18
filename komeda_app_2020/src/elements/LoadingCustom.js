import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Spinkit from 'react-native-spinkit';
import {COLOR} from '../utils';
export default class LoadingCustom extends Component {
  render() {
    return (
      <View style={[styles.wrapperCenter, this.props.style]}>
        <Spinkit
          type='ThreeBounce'
          color={this.props.color ? this.props.color : COLOR.red}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
