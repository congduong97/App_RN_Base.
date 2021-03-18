import React from 'react';
import {View, Platform, Linking} from 'react-native';
import {ToastService} from '../utils';
const openMapByLinking = (link) => {
  Linking.canOpenURL(link).then((supported) => {
    if (supported) {
      Linking.openURL(link);
    } else {
      const msg = "Don't know how to open URI:" + link;
      ToastService.showToast(msg);
    }
  });
};

const onGoGoogleMap = (latitude, longitude) => {
  const destination = `${latitude}+${longitude}`;
  const url = Platform.select({
    android: `google.navigation:q=${destination}`,
    ios: `maps://app?daddr=${destination}`,
  });
  Linking.openURL(url);
};

const OpenMap = {
  byLink: openMapByLinking,
  byApp: onGoGoogleMap,
};
export {OpenMap};
