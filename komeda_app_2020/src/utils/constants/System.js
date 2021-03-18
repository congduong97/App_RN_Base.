import {Platform, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

const AsyncStoreKey = {
  onPressSkipUpdateVersion: 'onPressSkipUpdateVersion',
  appId: 'appId',
  your_location: 'your_location',
  registration_deviceID: 'registration_deviceID',
  registration_token: 'registration_token',
  currentVersion1: 'currentVersion1',
  currentVersion2: 'currentVersion2',
  account: 'account',
  hasLaunched: 'hasLaunched',
  gotInfor: 'gotInfor',
  info: 'infor',
  timeUsedCoupon: 'timeUsedCoupon',
  app_password: 'app_password',
  app_secure: 'app_secure',
  memmber_secure: 'memmber_secure',
  lock_app: 'lock_app',
  deviceToken: 'deviceToken',
  homeLaunched: 'homeLaunched',
  versionUpdateSkip: 'versionUpdateSkip',
  accountActiveOTPLogin: 'accountActiveOTPLogin',
  hideGuide: 'hideGuide',
  alwaysDisplayIntroducingImage: 'alwaysDisplayIntroducingImage',
  permissionLocation: 'permissionLocation',
  policy: 'policy',
  setup_secu_and_certy: 'setupsecuandserty',
  black_mail: 'black_mail',
};

//Kiểm tra nền tảng và các cấu hình khác:
const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const API_KEY_YOUTUBE = 'AIzaSyC3OW9HvZeK3yUFlAUwqdfvP0DnjlFw1eY';
const DEVICE_ID = DeviceInfo.getUniqueId();
const TYPE_PLAFORM = isIos ? 'IOS' : 'ANDROID';
const PRIVATE_KEY_DEVICE_ID = 'device_id_komeda';
const TYPE_USER = 'MOBILE_USER';
const VERSION_PLAFORM = DeviceInfo.getSystemVersion();
const {width, height} = Dimensions.get('window');
const isIphoneX = isIos && height / width > 1.888;
const DEVICE_WIDTH = width <= height ? width : height;
const DEVICE_HEIGHT = width <= height ? height : width;

// Dev:
const versionApp = isIos ? '1.0.3' : '1.0.5';
const versionCodePush = isIos ? '07/11/2020' : '07/11/2020';
const APP_ID = '1609818113731';
const URL_DOMAIN = 'https://dev.komeda.shop-analyze.com';
const COMPANY_ID = '1609232612764';

console.log('[APP_ID]', APP_ID);
console.log('[DEVICE_ID]', DEVICE_ID);

// Product
// const versionApp = isIos ? '1.0.3' : '1.0.3';
// const versionCodePush = isIos ? '0' : '0';
// const APP_ID = '1596690646035';
// const URL_DOMAIN = 'https://komeda.shop-analyze.com';
// const COMPANY_ID = '1596690640174';

const getCurrentTime = () => {
  return moment().toDate().getTime();
};

export {
  AsyncStoreKey,
  isIos,
  URL_DOMAIN,
  isIphoneX,
  isAndroid,
  APP_ID,
  DEVICE_ID,
  TYPE_PLAFORM,
  COMPANY_ID,
  PRIVATE_KEY_DEVICE_ID,
  TYPE_USER,
  versionApp,
  VERSION_PLAFORM,
  API_KEY_YOUTUBE,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  getCurrentTime,
  versionCodePush,
};
