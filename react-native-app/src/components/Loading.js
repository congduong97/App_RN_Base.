import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Color from '../commons/constants/Color';

const Loading = (props) => {
  return (
    props.loading && (
      <View style={styles.loading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Color.MayaBlue} />
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingContainer: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#00000070',
  },
});
export default Loading;
