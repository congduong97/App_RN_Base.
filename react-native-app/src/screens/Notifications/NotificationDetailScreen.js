import React from 'react';
import {Text} from 'react-native';
import {ScreensView} from '../../components';

export default function NotificationDetailScreen(props) {
  return (
    <ScreensView
      isScroll={false}
      titleScreen={'Chi tiết'}
      // styleContent={styles.styleContains}
      nameIconRight={'camera-filled'}
      // onPressRight={navigateToCreateImage}
    >
      <Text></Text>
    </ScreensView>
  );
}
