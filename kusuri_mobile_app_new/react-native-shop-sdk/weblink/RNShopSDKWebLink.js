import {Linking, Platform} from 'react-native';

const onClickApi = (notificationId, memberCode, deviceId) => {
  if (memberCode !== undefined || memberCode !== null) {
    return `http://dev.sdk-ads-analyze.com:8080/app/api/notification/onClick?notificationId=${notificationId}&memberCode=${memberCode}&deviceId=${deviceId}`;
  }
  return `http://dev.sdk-ads-analyze.com:8080/app/api/notification/onClick?notificationId=${notificationId}&deviceId=${deviceId}`;
};
const RNShopSDKWebLink = {
  openWebView: (notification, deviceId, memberCode) => {
    if (notification) {
      const ios = Platform.OS === 'ios';
      let data;
      if (ios) {
        data = notification.data ? notification.data.data : undefined;
      } else {
        data = notification.data;
      }
      if (data) {
        if (data.linkWebview && notification.userInteraction) {
          Linking.openURL(data.linkWebview).catch(() => {});
        }
        if (data.notificationId && notification.userInteraction && deviceId) {
          const api = onClickApi(data.notificationId, memberCode, deviceId);
          try {
            fetch(api, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
            });
          } catch (error) {}
        }
      }
    }
  },
};
export {RNShopSDKWebLink};
