import React, { PureComponent } from 'react';
import { StatusBar, ScrollView, StyleSheet } from 'react-native';
import { COLOR, SIZE } from '../utils/resources';

class AppScrollContainer extends PureComponent {
  render() {
    const { children, style } = this.props;
    return (
      <ScrollView style={[styles.container, style]}>
        <StatusBar barStyle={'dark-content'} hidden />
        {children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: SIZE.device_width,
    backgroundColor: COLOR.white,
    // justifyContent: 'flex-start',
    // alignItems: 'center'
  },
});
export { AppScrollContainer };
