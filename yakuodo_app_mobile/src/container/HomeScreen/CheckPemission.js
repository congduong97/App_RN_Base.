import Permissions, {
  checkNotifications,
  PERMISSIONS,
  RESULTS,
  requestNotifications,
  check
} from 'react-native-permissions';
import {RNShopSdkBanner} from 'react-native-shop-sdk';
import {STRING} from '../../const/String';
import {managerAcount, isIOS} from '../../const/System';
import {Alert} from 'react-native';
import {checkLocationPermissionInIOS} from '../../util/module/checkPremissionsLocation';

export const checkPermissionNotification = () => {
  checkNotifications()
    .then(({status, setting}) => {
      if (status === RESULTS.BLOCKED) {
        Alert.alert(
          STRING.notification,
          STRING.need_enable_notification,
          [
            {text: STRING.cancel},
            {text: STRING.ok, onPress: () => Permissions.openSettings()},
          ],
          {cancelable: false},
        );
      }
      if (status === RESULTS.DENIED) {
        requestNotifications(['alert', 'sound']).then(({status, settings}) => {
          console.log('re-request-push', status);
        });
      }
    })
    .catch(err => console.log('[error]', error));
};

checkLocationPermissionsInAndroid = async ()=> {
  const response = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  if (response === RESULTS.GRANTED) {
    return true;
  } 
  return false;  
}

export const checkLocationAddSDK = async () => {
  let location = false;
  if (isIOS) {
    location = await checkLocationPermissionInIOS();
  } else {
    location = await checkLocationPermissionsInAndroid();
  }

  if (location) {
    RNShopSdkBanner.collectDeviceInfoWithContainsLocation(
      true,
      `${managerAcount.memberCode || ''}`,
      '',
      '',
      `${managerAcount.birthday || ''}`,
      `${managerAcount.gender || ''}`,
      '',
      '',
      () => {},
    );
  } else {
    RNShopSdkBanner.collectDeviceInfoWithContainsLocation(
      false,
      `${managerAcount.memberCode || ''}`,
      '',
      '',
      `${managerAcount.birthday || ''}`,
      `${managerAcount.gender || ''}`,
      '',
      '',
      () => {},
    );
  }
};
