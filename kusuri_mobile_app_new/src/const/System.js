import { Dimensions, Platform, StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";
import {
  COLOR_BLACK,
  COLOR_BLUE,
  COLOR_GRAY,
  COLOR_WHITE,
  COLOR_GRAY_LIGHT,
  COLOR_GRAY_900,
} from "./Color";
import { SIZE } from "./size";

export const screen = {
  name: false,
  activities: [],
};
export const menuInApp = {
  nameNotification: "",
  iconNotification: "",
  namePushNotification: "",
  iconPushNotification: "",
  bottomMenu: null,
  homeMenu: null,
  subMenu: null,
  showBottomMenu: null,
  rowSizeHomeMenu: 2,
  headerMenu: [],
  mainMenu: [],
};
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const isIphoneX =
  Platform.OS === "ios" && Dimensions.get("window").height >= 812;

export const versionApp = isIOS ? "2.1.7" : "2.1.7";
export const versionCodePush = isIOS ? "1" : "1";
export const sizePage = 11;

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
};
export const subMenu = {};
export const SYSTEAM_VERSION = DeviceInfo.getSystemVersion();
console.log("systemverrsiob", SYSTEAM_VERSION);

// nead change
export const API_KEY_YOUTUBE = "AIzaSyCovv_1sQTfb6bZXqmm2tR3blSi7qbts1U";
const widthDEVICE = Dimensions.get("window").width;
const heightDEVICE = Dimensions.get("window").height;

export const DEVICE_WIDTH =
  widthDEVICE <= heightDEVICE ? widthDEVICE : heightDEVICE;
export const DEVICE_HEIGHT =
  widthDEVICE <= heightDEVICE ? heightDEVICE : widthDEVICE;
export const maxSizeText = DEVICE_WIDTH / 26;

export const marginBottomWithMenu = isIOS && DEVICE_HEIGHT === 812 ? 94 : 50;
export const DEVICE_ID = DeviceInfo.getUniqueId();
export const DEVICE_VERSION = DeviceInfo.getSystemVersion();

console.log("DEVICE_ID", DEVICE_ID);
export const WIDTHDEVICES = (width) => {
  return Dimensions.get("window").width * (width / 375);
};

export const getWidthInCurrentDevice = (width) => {
  return Dimensions.get("window").width * (width / 375);
};

export const getHeightInCurrentDevice = (height) => {
  return Dimensions.get("window").height * (height / 667);
};

export const keyAsyncStorage = {
  timeUpdateCompanyNotification: "timeUpdateCompanyNotification",
  versionApp: "versionApp",
  menuInApp: "menuInApp",
  deviceTokenFake: "deviceTokenFake",
  managerAccount: "managerAccount",
  isAgree: "isAgree",
  deviceToken: "deviceToken",
  firstDownload: "firstDownload",
  appDetail: "company",
  version: "version",
  mobileApp: "mobileApp",
  appColor: "appColor",
  introducing: "introducing",
  menu: "menu",
  bottomMenu: "bottomMenu",
  iconNotification: "iconNotification",
  nameNotification: "nameNotification",
  namePushNotification: "namePushNotification",
  iconPushNotification: "iconPushNotification",
  subMenu: "subMenu",
  slider: "slider",
  termInfo: "termInfo",
  identifier: "identifier",
  configRegister: "configRegister",
  timeUpdateNotification: "timeUpdateNotification",
  banner: "banner",
  usingSms: "usingSms",
  timeUpdateNewCoupon: "timeUpdateNewCoupon",
  firstTimeOpenPrescription: "firstTimeOpenPrescription",
  barcodeImageUrl: "barcodeImageUrl",
  appImageUrl: "appImageUrl",
  pointOfUser: "pointOfUser",
  moneyOfUser: "moneyOfUser",
  textDescription: "textDescription",
  textTimeUpdate: "textTimeUpdate",
  arrUrlImageSaveWhenTakePhoto:"arrUrlImageSaveWhenTakePhoto",
  healthRecordPolicy: "healthRecordPolicy",
};

const IMAGE_LOGO = "";
export const APP = {
  IMAGE_LOGO,
};

//---nead change--//
// ---dev---//
export const APP_ID = "1558058623240";
export const COMPANY_ID = "1558058610362";
export const URL_SHOP = "https://dev.kusuri-aoki-shop-info.com";
export const URL_DOMAIN = "https://dev.kusuri-aoki.shop-analyze.com";
export const SENDER_ID = "903556958068";

//---production---//
// export const APP_ID = "1558940708628";
// export const COMPANY_ID = "1558940700681";
// export const URL_SHOP = "https://kusuri-aoki-shop-info.com";
// export const URL_DOMAIN = "https://kusuri-aoki.shop-analyze.com";
// export const SENDER_ID = "867275678656";

export const PRIVATE_KEY = "device_id_kusuri_no_aoki";
export const PRIVATE_KEY_PUSH_DEVICE_TOKEN = "device_token_kusuri_no_aoki";
export const URLShop = `${URL_SHOP}/api/v1/app`;
export const URL = `${URL_DOMAIN}/api/v1/app/${APP_ID}/`;
export const URL_LOGIN = `${URL_DOMAIN}/login`;

export const managerAccount = {
  accessToken: null,
  username: null,
  memberCode: null,
  refreshToken: null,
  point: null,
  money: null,
  password: null,
  userId: null,
  userNameWebView: null,
  passwordWebView: null,
  birthday: null,
  phoneNumber: null,
  passwordApp: null,
  enablePasswordOppenApp: null,
  enablePasswordMyPage: null,
  validatePhoneNumberSuccess: null,
  needValidateBirthDay: null,
  needAddBirthDay: null,
  usingSms: true,
  memberCodeInBlackList: false,
};
export const styleInApp = StyleSheet.create({
  title: {
    color: COLOR_BLACK,
    fontSize: 14,
    fontWeight: "bold",
  },
  titleDetail: {
    color: COLOR_BLACK,
    fontSize: 18,
    fontWeight: "bold",
  },
  shortDescription: {
    color: COLOR_GRAY,
    fontFamily: "SegoeUI",
    fontSize: 12,
    marginVertical: 5,
  },
  textTime: {
    fontSize: 12,
    color: COLOR_GRAY_900,
    fontWeight: "bold",
  },
  bigImage: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH * (9 / 16),
  },
  smallImage: {
    width: 100,
    height: 100,
    borderRadius: 3,
  },
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "row",
    backgroundColor: COLOR_WHITE,
    borderBottomWidth: 2,
    borderColor: COLOR_GRAY_LIGHT,
  },
  container1: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLOR_WHITE,
  },
  containerLeft: {
    justifyContent: "center",
  },
  hkgpronw6_18: {
    fontSize: SIZE.H18,
    // fontFamily: "Hiragino Kaku Gothic ProN W6",
    color: "#1C1C1C",
    fontWeight: "bold",
  },
  hkgpronw6_16: {
    fontSize: SIZE.H16,
    // fontFamily: "Hiragino Kaku Gothic ProN W6",
    color: "#1C1C1C",
    fontWeight: "bold",
  },
  hkgpronw6_14: {
    fontSize: SIZE.H14,
    // fontFamily: "Hiragino Kaku Gothic ProN W6",
    color: "#1C1C1C",
    fontWeight: "bold",
  },
  hkgpronw6_12: {
    fontSize: SIZE.H12,
    // fontFamily: "Hiragino Kaku Gothic ProN W6",
    color: "#1C1C1C",
    fontWeight: "bold",
  },
  hkgpronw3_16: {
    fontSize: SIZE.H16,
    // fontFamily: "Hiragino Kaku Gothic ProN W3",
    color: "#1C1C1C",
  },
  hkgpronw3_14: {
    fontSize: SIZE.H14,
    // fontFamily: "Hiragino Kaku Gothic ProN W3",
    color: "#1C1C1C",
  },
  hkgpronw3_12: {
    fontSize: SIZE.H12,
    // fontFamily: "Hiragino Kaku Gothic ProN W3",
    color: "#1C1C1C",
  },
  hkgpronw3_13: {
    fontSize: SIZE.H13,
    // fontFamily: "Hiragino Kaku Gothic ProN W3",
    color: "#646464",
  },
});
