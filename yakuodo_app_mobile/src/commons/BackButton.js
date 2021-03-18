import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {APP_COLOR} from '../const/Color';
import {STRING} from '../const/String';
import {SYSTEAM_VERSION, isIOS} from '../const/System';

export default class BackButton extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const {goBack, container} = this.props;
    return (
      <SafeAreaView
        style={{
          position: 'absolute',
          marginTop: parseInt(SYSTEAM_VERSION) < 11 && isIOS ? 20 : 0,
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            left: 0,
            top: 0,
            padding: 10,
            width: 100,
            paddingRight: 30,
            paddingLeft: 15,
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            goBack(null);
          }}>
          <Icon name="ios-arrow-back" size={25} color={APP_COLOR.COLOR_TEXT} />
          <Text style={{fontSize: 16, color: APP_COLOR.COLOR_TEXT}}>
            {' '}
            {STRING.back}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  wrapperHeader: {
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
