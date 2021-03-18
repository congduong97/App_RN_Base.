import React from 'react';
import {StyleSheet} from 'react-native';
import {SIZE, COLOR} from '../utils/resources';
import {SafeAreaView} from 'react-native-safe-area-context';

const AppWrapper = (props) => {
  const {style, children, forceInset} = props;
  return (
    <SafeAreaView
      forceInset={{top: 'never', bottom: 'never', ...forceInset}}
      style={[styles.container, style]}>
      {/* <StatusBar barStyle={'light-content'} /> */}
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZE.device_width,
    backgroundColor: COLOR.white,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export {AppWrapper};
