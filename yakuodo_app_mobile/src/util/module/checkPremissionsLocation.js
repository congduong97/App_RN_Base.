import {Alert, Platform} from 'react-native';
import {STRING} from '../../const/String';
import Permissions, {
  request,
  PERMISSIONS,
  check,
  RESULTS,
} from 'react-native-permissions';
import {isIOS} from '../../const/System';
// import console = require('console');

const AlertPermissionsLocation = () => {
  Alert.alert(
    STRING.permission,
    STRING.need_enable_enable_location,
    [
      {text: STRING.cancel},
      {
        text: STRING.ok,
        onPress: () => (isIOS ? Permissions.openSettings() : () => {}),
      },
    ],
    {cancelable: false},
  );
};
const AlertPermissionsLocationAndroidRejected = () => {
  Alert.alert(
    STRING.permission,
    STRING.need_enable_permission_location_with_setting_android,
    [
      {text: STRING.cancel},
      {
        text: STRING.ok,
        onPress: () => (isIOS ? Permissions.openSettings() : () => {}),
      },
    ],
    {cancelable: false},
  );
};

export const checkPermissionsWhenInUse = async () => {
  // alert('kiemtra');
  // alert('chay xong duoi');
  // const response = await Permissions.check('location', {type: 'whenInUse'});
  // // console.log('checkPermissionsWhenInUse', response);
  // if (response === 'authorized') {
  //   return true;
  // }
  // //ios response === 'denied' not use Permissions.request
  // if (response === 'denied' && isIOS) {
  //   console.log('denied-location when using');
  //   return await checkPermissionsAlways();
  // }
  // //android response === 'restricted' not use Permissions.request
  // if (response === 'restricted' && !isIOS) {
  //   return await checkPermissionsAlways();
  // }
  // if (response !== 'authorized') {
  //   const responsePemissitions = await Permissions.request('location', {
  //     type: 'always',
  //   });
  //   if (responsePemissitions === 'authorized') {
  //     return true;
  //   }
  //   AlertPermissionsLocation();
  //   return false;
  // }
  const permission = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  });

  check(permission).then(status => {
    if (status === RESULTS.GRANTED) {
      return true;
    }
    if (status === RESULTS.DENIED) {
      request(permission).then(status =>
        console.log('request-permission', status),
      );
    }
    if (status === RESULTS.BLOCKED) {
      AlertPermissionsLocation();
      return false;
    }
  });

  // if (response == RESULTS.GRANTED) {
  //   console.log('GRanted');
  //   return true;
  // }
  // AlertPermissionsLocation();
  // return false;

  // const response = await request(
  //   Platform.select({
  //     android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //     ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //   }),
  // );
  // console.log('response-location-permision', response);
};

export const checkLocationPermissionInIOS = async ()=> {
  const response = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  if (response === RESULTS.GRANTED) {
    return true;
  } 
  if (response === RESULTS.DENIED) {
    //request location always for scan beacon when close app
    request(PERMISSIONS.IOS.LOCATION_ALWAYS);   
  } 
  if (response === RESULTS.BLOCKED) {
    AlertPermissionsLocation();
  }
  return false;
} 

const checkPermissionsAlways = async () => {
  const response = await Permissions.check('location', {type: 'always'});
  // console.log('checkPermissionsAlways', response);

  if (response === 'denied' && isIOS) {
    AlertPermissionsLocation();
    return false;
  }
  if (response === 'restricted' && !isIOS) {
    AlertPermissionsLocationAndroidRejected();
    return false;
  }
  if (response !== 'authorized') {
    const responsePemissitions = await Permissions.request('location', {
      type: 'always',
    });
    if (responsePemissitions === 'authorized') {
      return true;
    }
    AlertPermissionsLocation();
    return false;
  }
};
