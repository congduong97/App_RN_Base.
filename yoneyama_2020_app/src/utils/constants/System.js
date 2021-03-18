import {Platform, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {AppIdService} from '../services/AppIdService';
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
  goto_certificate_screen: 'gotocertificatescreen',
  certificateImageUrl: 'certificateImageUrl',
  barcodeUrl: 'barcodeUrl',
};

const isIos = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const API_KEY_YOUTUBE = 'AIzaSyBNB3tf_56-Ok93Fhdht5zK-_5LfYDpK3A';
const API_KEY_YOUTUBE_IOS = 'AIzaSyDQVVqyFDSvbNqjTcwAfNAFPa9ifzAI3Ws';
const DEVICE_ID = DeviceInfo.getUniqueId();
const TYPE_PLAFORM = isIos ? 'IOS' : 'ANDROID';
const PRIVATE_KEY_DEVICE_ID = 'device_id_yoneyama';
const TYPE_USER = 'MOBILE_USER';
const VERSION_PLAFORM = DeviceInfo.getSystemVersion();
const {width, height} = Dimensions.get('window');
const isIphoneX = isIos && height / width > 1.888;
const DEVICE_WIDTH = width <= height ? width : height;
const DEVICE_HEIGHT = width <= height ? height : width;

// Dev:
const versionApp = isIos ? '1.0.8' : '1.0.8';
const versionCodePush = isIos ? '' : '';
const APP_ID1 = '1609232559082';
const APP_ID2 = '1609232231793';
const URL_DOMAIN = 'https://dev.app-cms-yoneyama.com';
const COMPANY_ID = '1609232054504';

// Product:
// const versionApp = isIos ? '1.0.3' : '1.0.3';
// const versionCodePush = isIos ? '0' : '0';
// const APP_ID1 = '1593254256879';
// const APP_ID2 = '1593254268116';
// const URL_DOMAIN = 'https://app-cms-yoneyama.com';
// const COMPANY_ID = '1593254241992';

let APP_ID = APP_ID1;
AppIdService.onChange('changeAppId', (appId) => {
  APP_ID = appId;
});

console.log('APP_ID', APP_ID);
console.log('DEVICE_ID', DEVICE_ID);

const getCurrentTime = () => {
  return moment().toDate().getTime();
};

export {
  AsyncStoreKey,
  isIos,
  URL_DOMAIN,
  isIphoneX,
  isAndroid,
  APP_ID1,
  APP_ID,
  APP_ID2,
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
  API_KEY_YOUTUBE_IOS,
};
