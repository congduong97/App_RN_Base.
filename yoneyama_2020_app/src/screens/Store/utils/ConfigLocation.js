//Library:
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {isIos, AsyncStoreKey} from '../../../utils';
import {Alert} from 'react-native';
import ServicesUpdateComponent from '../../../utils/services/ServicesUpdateComponent';

//Xin lại quyền truy cập vị trí:
const AlertPermissionsLocation = () => {
  Alert.alert(
    '位置情報有効設定',
    'あなたの位置情報へのアクセスを常に許可している場合は、位置情報に連動した、最新のお得情報をお届けします。アクセスをApp使用中のみ許可にしている場合は、Appを開いた時のみ更新のためすぐにお得情報が届かない場合があります。',
    [
      {
        text: 'キャンセル',
        onPress: () => {
          ServicesUpdateComponent.set('CALL_LIST_STORE_NOT_HAVE_LOCATION');
        },
      },
      {
        text: 'OK',
        onPress: () => openSettings(),
      },
    ],
    {cancelable: false},
  );
};

//Được phép gọi hàm Location hay không?
const isUserGetLocation = (useLocation) => {
  if (useLocation == 'GRANTED') {
    return 'USE_GET_LOCATION';
  } else {
    return 'NOT_USE_LOCATION';
  }
};

//Kiểm tra có phải lần đầu tiên cấp quyền vị trí không?
const checkPermissionLocationFirstActive = async () => {
  const firstActivePermissionStore = await AsyncStorage.getItem(
    AsyncStoreKey.permissionLocation,
  );
  if (!firstActivePermissionStore) {
    return 'FIRST_ACTIVE_PERMISSION_LOCATION';
  } else {
    return 'HAVE_ACTIVE_PERMISSION_LOCATION';
  }
};

//Kiểm tra quyền vị trí:
const checkPermissionsWhenInUse = async () => {
  if (isIos) {
    let checkPermissionAlaysIOS = false;
    let checkPermissionInUseAppIOS = false;
    //Kiểm tra người dùng có cho lấy vị trí luôn luôn không?
    request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((event) => {
      if (event === 'granted') {
        checkPermissionAlaysIOS = true;
        if (event === 'blocked') {
          checkPermissionAlaysIOS = false;
        }
      }
    });

    //Kiểm tra người dùng đang cho vị trí mỗi khi vào App không?
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(async (result) => {
      if (result == 'granted') {
        checkPermissionInUseAppIOS = true;
      } else {
        checkPermissionInUseAppIOS = false;
      }
      if (!checkPermissionAlaysIOS && !checkPermissionInUseAppIOS) {
        AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'NOT_GRANTED');
        isUserGetLocation('NOT_GRANTED');
        AlertPermissionsLocation();
      } else {
        const checkPermissionLocation = await checkPermissionLocationFirstActive();
        isUserGetLocation('USE_GET_LOCATION');
        if (checkPermissionLocation == 'FIRST_ACTIVE_PERMISSION_LOCATION') {
          AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'GRANTED');
          ServicesUpdateComponent.set('CALL_LIST_STORE_NEW_LOCATION');
        } else {
          AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'GRANTED');
        }
      }
    });
  }
  //Cấp quyền vị trí trên hệ điều hành Android:
  else {
    try {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(async (result) => {
        if (result == 'granted') {
          const checkPermissionLocation = await checkPermissionLocationFirstActive();
          if (checkPermissionLocation == 'FIRST_ACTIVE_PERMISSION_LOCATION') {
            AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'GRANTED');
            ServicesUpdateComponent.set('CALL_LIST_STORE_NEW_LOCATION');
          } else {
            AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'GRANTED');
          }
        } else {
          AsyncStorage.setItem(AsyncStoreKey.permissionLocation, 'NOT_GRANTED');
          AlertPermissionsLocation();
        }
      });
    } catch (error) {}
  }
};

//Lấy bán kính:
const getRadius = (rad) => {
  return (rad * Math.PI) / 180;
};

//Lấy đường kính:
export const getDistance = (lat1, lon1, lat2, lon2) => {
  //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
  const R = 6371; // Radius of earth in Miles
  const dLat = getRadius(lat2 - lat1);
  const dLon = getRadius(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(getRadius(lat1)) *
      Math.cos(getRadius(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  const n = parseFloat(d);
  d = Math.round(n * 100) / 100;
  return d;
};

export {checkPermissionsWhenInUse, isUserGetLocation};
