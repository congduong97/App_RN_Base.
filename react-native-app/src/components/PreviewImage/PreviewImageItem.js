import React from 'react';
import {View, StyleSheet} from 'react-native';
import ImageModal from 'react-native-image-modal';

import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../commons/utils/devices';

import {ApiUrl} from '../../networking';

export default function PreviewImageItem({url}) {
  return (
    <View style={styles.container}>
      <ImageModal
        resizeMode="contain"
        imageBackgroundColor="#000000"
        style={{
          width: (SCREEN_WIDTH * 4) / 5,
          height: (SCREEN_WIDTH * 3) / 5,
        }}
        source={{
          uri: `${ApiUrl.IMAGE_BASE_URL}/${ApiUrl.VIEW_IMAGE}/${url}`,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginBottom: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
});
