import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
// import {
//   GoogleAnalyticsTracker,
//   GoogleAnalyticsSettings,
//   GoogleTagManager
// } from 'react-native-google-analytics-bridge';

// export const tracker = new GoogleAnalyticsTracker('UA-128599394-3');
export const urlImageDefault =
  'https://tenshock.biz/uploads/article/image/1416/______2____.jpg';

export const screen = {
  name: false,
  activities: [],
};
export const tab = {
  screenTab: {
    indexCouPonScreen: 0,
    indexVideoScreen: 0,
    indexCatalogScreen: 0,
    indexSearchStoreScreen: 0,
    indexNotificationScreen: 0,
    indexCertificateMemberScreen: 0,
    indexPushNotificationsScreen: 0,
    indexSettingScreen: 0,
  },
  block: false,
};
export const subMenu = {
  data: [],
};
const deleteCacheVersion = '0';
export const keyAsyncStorage = {
  timeUpdateNotification: 'timeUpdateNotification',
  deviceTokenFake: `deviceTokenFake${deleteCacheVersion}`,
  deviceToken: `deviceToken${deleteCacheVersion}`,
  autologin: `autologin${deleteCacheVersion}`,
  autologinAgain: 'autologinAgain',
  idfa: `idfa${deleteCacheVersion}`,
  timePushNotification: `timePushNotification${deleteCacheVersion}`,
  timeNotification: `timeNotification${deleteCacheVersion}`,
  managerAccount: `managerAccount${deleteCacheVersion}`,
  firstDownload: `firstDownload${deleteCacheVersion}`,
  isAgree: `isAgree${deleteCacheVersion}`,
  versionApp: `versionApp${deleteCacheVersion}`,
  getNumberError: 'getNumberError',
  stateSercurity: 'stateSercurity',
  timeUpdateNewCoupon: `timeUpdateNewCoupon${deleteCacheVersion}`,
  allowUseBeacon: 'allowUseBeacon', 
  firstTimeShowTermUseBeacon: 'firstTimeShowTermUseBeacon',
  beaconInfo: 'beaconInfo',
  isShowListAdvertisement:"isShowListAdvertisement",
  isInstalledApp: 'isInstalledApp', 
  isMemberCodeChange: 'isMemberCodeChange',
};

export const isIOS = Platform.OS === 'ios';
export const versionApp = isIOS ? '2.3.5' : '2.3.5';
const widthDEVICE = Dimensions.get('window').width;
const heightDEVICE = Dimensions.get('window').height;
export const DEVICE_WIDTH =
  widthDEVICE <= heightDEVICE ? widthDEVICE : heightDEVICE;

export const DEVICE_HEIGHT =
  widthDEVICE <= heightDEVICE ? heightDEVICE : widthDEVICE;
export const SYSTEAM_VERSION = DeviceInfo.getSystemVersion();
export const DEVICE_ID = DeviceInfo.getUniqueId();
console.log('DEVICE_ID', DEVICE_ID);

export const device = {
  ADV_ID: DeviceInfo.getUniqueId(),
};
console.log(device.ADV_ID);
export const dataSave = {
  coupon: [],
  categoryCoupon: [],
  myCoupon: [],
  numberDay: 4,
  loadCouponSuccess: false,
};
export const dataCoupon = {
  coupon: [],
  categoryCoupon: [],
  myCoupon: [],
  numberDay: 4,
  loadCouponSuccess: false,
};

export const managerAcount = {
  phoneNumber: '',
  pinCode: '',
  showRegister: false,
  numberErrorPass: 0,
  timeErrorPass: '',
  showLogin: false,
  showLogout: false,
  memberCode: null,
  memberId: null,
  birthday: null,
  gender: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
  enablePasswordOppenApp: false,
  enablePasswordMyPage: false,
  passwordApp: null,
  validateOtp: false,
  memberCodeInBlackList: false,
  messengerBackList: '',
  point: 0,
  mile: 0,
};
// console.log('managerAcountmanagerAcount', managerAcount.accessToken);
export const stateSercurity = {
  onSecurityIOS: false,
  onSecurityAndroid: false,
  onSendOTPByEmailIOS: false,
  onSendOTPByEmailAndroid: false,
  onSecurity: false,
  onSendOTPByEmail: false,
  maxNumberOfConsecutiveSmsByPhone: 3,
  namespace: "",
};
const IMAGE_LOGO = '';
export const APP = {
  IMAGE_LOGO,
  notificationRead: 0,
};

export const APP_ID = 1;
//Dev:
// export const URL_DOMAIN = 'https://dev.yakuodo.shop-analyze.com';
// export const URL = `${URL_DOMAIN}/api/v1/app/${APP_ID}/`;
// export const SENDER_ID = '1025819336809';
// export const APPID = 'YAKU_001';
// export const APPNAME = '薬王堂公式デモ';
// export const COMPANYID = 'INC_YAKU';

//Product:
export const URL_DOMAIN = 'https://yakuodo.shop-analyze.com';
export const URL = `${URL_DOMAIN}/api/v1/app/${APP_ID}/`;
export const SENDER_ID = '940581285110';
export const APPID = 'YAKU_001';
export const APPNAME = '薬王堂公式デモ';
export const COMPANYID = 'INC_YAKU';

// api key của hưng
// export const API_KEY_YOUTUBE = 'AIzaSyAkQ1jm-7w1WyxdQUr0yKi1cwykzep5K10';
//yakuodo youtube
export const API_KEY_YOUTUBE = 'AIzaSyDY5fAAByUq0BQc4b4XzGff42bitagw-8s';
