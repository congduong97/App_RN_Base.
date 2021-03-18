import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Colors } from "../commons";

export default function AppStatusBar({ backgroundColor, ...props }) {
  let isStatusBar = props.isStatusBar !== undefined ? props.isStatusBar : true;
  return (
    <>
      {isStatusBar && (
        <View
          style={[
            styles.statusBar,
            { backgroundColor: backgroundColor, marginTop: 5 },
          ]}
        >
          <StatusBar
            translucent
            backgroundColor={backgroundColor}
            {...props}
            barStyle="dark-content"
          />
        </View>
      )}
      <SafeAreaView backgroundColor={props.colorsLinearGradient[0]} />
    </>
  );
}

AppStatusBar.defaultProps = {
  colorsLinearGradient: Colors.colorsLinearGradient,
};

const styles = StyleSheet.create({
  statusBar: {
    height: StatusBar.currentHeight,
  },
});
