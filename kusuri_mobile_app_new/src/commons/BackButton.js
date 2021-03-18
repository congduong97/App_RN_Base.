import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { APP_COLOR } from '../const/Color';

export default class BackButton extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { goBack } = this.props;
    return (
      <SafeAreaView style={styles.wrapperHeader} >
        <TouchableOpacity width={50} onPress={() => goBack(null)}>
          <Icon
            name="md-close" size={25} color={APP_COLOR.COLOR_TEXT}
          />
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
    justifyContent: 'center'
  }
});
