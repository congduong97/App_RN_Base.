import React from 'react';
import {StyleSheet, Text, View, StatusBar, SafeAreaView} from 'react-native';
import commons from '../commons';

export default function AppStatusBar({backgroundColor, ...props}) {
  let isStatusBar = props.isStatusBar !== undefined ? props.isStatusBar : true;
  return (
    <>
      {isStatusBar && (
        <View style={[styles.statusBar, {backgroundColor: backgroundColor}]}>
          <StatusBar translucent backgroundColor={backgroundColor} {...props} />
        </View>
      )}
      <SafeAreaView backgroundColor={props.colorsLinearGradient[0]} />
    </>
  );
}

AppStatusBar.defaultProps = {
  colorsLinearGradient: commons.Color.colorsLinearGradient,
};

const styles = StyleSheet.create({
  statusBar: {
    height: StatusBar.currentHeight,
  },
});
