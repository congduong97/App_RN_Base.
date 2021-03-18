import {APP_ID, device, URL, URL_DOMAIN} from './System';

// export const URL = `https://yakuodo.shop-analyze.com/api/v1/app/${APP_ID}/`;
export const URL_IMAGE =
  'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/';
// export const URL_DOMAIN = 'https://yakuodo.shop-analyze.com'; //relese
export const URL_PDF =
  'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/';

export const URL_DOMAIN_CATALOG =
  'https://s3-ap-northeast-1.amazonaws.com/shop-app-assets/';
export const URL_COMPANY_DETAIL = `${URL}app/detail`;
export const URL_MENU = `${URL}menu/mobile`;
export const URL_LIST_CITY = `${URL}/v1/city/existStore?companyId=${APP_ID}`;
export const URL_LIST_DISTRICT = `${URL}/v1/city/`;
export const URL_INTRODUCING = `${URL}introducingImage/mobile`;
export const URL_SLIDER = `${URL}sliderImage/mobile`;

export const URL_APP_COLOR = `${URL}mobile/color`;
export const URL_CHECK_UPDATE_APP = `${URL}app/checkupdateApp/`;
export const URL_MOBILE_APP = `${URL}app/detail`;
export const URL_CONFIG_REGISTER = `${URL}getConfigRegister`;
export const URL_COMPANY_NOTIFICATION = `${URL}notification/all?`;
export const URL_COMPANY_NOTIFICATION_IMPORTANT = `${URL}notification/important`;
export const URL_COMPANY_NOTIFICATION_NORMAl = `${URL}notification/normal`;
export const URL_COMPANY_NOTIFICATION_CLICK = `${URL}notification/click/`;
export const URL_COMPANY_PUSH_NOTIFICATION = `${URL}pushNotification/list-mobile?`;

export const URL_COMPANY_CLICK_PUSH_NOTIFICATION = `${URL}pushNotification/click/`;
export const URL_COMPANY_VIDEO = `${URL}video/list?`;
export const URL_ADD_MILE = `${URL_DOMAIN}/addYakoudoMile?`;
export const URL_COUNT_CLICK_VIDEO = (companyId, videoId) =>
  `${URL}video/click/${videoId}/`;
export const URL_COMPANY_STORE = `${URL}store/listAll?`;
export const URL_GO_CATALOG = `${URL}store/`;
export const URL_AUTO_LOGIN = `${URL}autoLogin?`;
export const URL_AUTO_LOGIN_AGAIN = `${URL}autoLoginAgain?`;
export const URL_COMPANY_ICON_PUSH_NOTIFICATION = `${URL}menu/getPushNotificationMenuIcon`;
export const URL_COMPANY_ICON_NOTIFICATION = `${URL}menu/getCompanyNotificationMenuIcon`;
export const URL_COMPANY_STORE_DETAIL = `${URL}store/detail/`;
export const URL_COMPANY_HISTORY_COUPON = `${URL}coupon/usingHistory?deviceId=`;
export const URL_COMPANY_COUPON = `${URL}coupon/listForMobile?`;
export const URL_COMPANY_COUPON_DETAIL = `${URL}coupon/detail/`;
export const URL_COMPANY_USE_COUPON = `${URL_DOMAIN}/addCouponYakoudo?`;

export const URL_PUSH_DEVICE_TOKEN = `${URL}pushDeviceToken?deviceToken=`;
export const URL_PUSH_DEVICE_TOKEN_AGAIN = `${URL}pushDeviceTokenAgain?deviceToken=`;

export const URL_BOOK_MARK = `${URL}store/bookmark?storeId=`;
export const URL_COMPANY_PUSH_NOTIFICATION_DETAIL = `${URL}pushNotification/detail/`;
export const URL_COMPANY_NOTIFICATION_DETAIL = `${URL}notification/detail/`;

export const URL_COMPANY_LIST_EVENT = `${URL}stampRally/mobile/listEvent?`;
export const URL_COMPANY_EVENT_DETAIL = `${URL}stampRally/mobile/event/`;
export const URL_COMPANY_LIST_STAMPS = `${URL}stampRally/mobile/`;

export const URL_COMPANY_CHECK_UPDATE_MENU = `${URL}menu/getRecentlyModified?lastAccess=`;
export const URL_COMPANY_CHECK_UPDATE_MOBILE_APP = `${URL}app/getRecentlyModifedSlider?lastAccess=`;
export const URL_COMPANY_CHECK_UPDATE_NOTIFICATION = `${URL}/pushNotification/checkStatusPushNotification?`;
export const URL_COMPANY_QUESTION = `${URL}/question/list`;

export const URL_CHECK_EMAIL = `${URL_DOMAIN}/checkUsedEmail?email=`;
export const URL_REGISTER = `${URL_DOMAIN}/registerMobileUser`;
export const URL_SIGN = `${URL_DOMAIN}/login`;
export const URL_PUSH_EMAIL = `${URL_DOMAIN}/reset-password?username=`;
export const URL_FORGOT_PASSWORD = `${URL_DOMAIN}/forgotPassword?email=`;
export const URL_CONFIRM_RESET_PASSWORD = `${URL_DOMAIN}/setPassword?`;
export const URL_REFRESH_TOKEN = `${URL_DOMAIN}/api/v1/app/{appId}/member/`;
export const URL_CATEGORY_YAKUODO_COUPON = `${URL_DOMAIN}/api/v1/app/categoryCoupon/listMobile`;
export const URL_YAKUODO_ALL_COUPON = `${URL_DOMAIN}/getAllCouponYakuodo?`;
export const URL_YAKUODO_USER = `${URL_DOMAIN}/getYakoudoUser?`;
export const URL_IMAGE_CERTIFICATE = `${URL}getCertificateImage`;
export const URL_USING_IMAGE = `${URL}imageUsingMobile`;
export const URL_STEP_USING = `${URL}stepUsingMobile`;
export const URL_WAI_INTRO = `${URL}waiwai`;
export const URL_WAI_TERM = `${URL}getWaiTerm`;
export const URL_NEW_NOTIFICATION = `${URL}notification/checkStatus?`;
export const URL_NEW_COUPON = `${URL}newCoupon/checkNewCoupon?`;

export const URL_VIEW_VIDEO = `${URL}countVideoYakuodo?`;
export const UR_VIEW_COUPON = `${URL}countViewCouponYakuodo?`;
export const URL_COUNT_USING_COUPON = `${URL}countUseCouponYakuodo?`;
export const URL_MAINTAIN = `${URL_DOMAIN}/checkStatusMaintain`;
export const URL_CHECK_VERSION = `${URL}/checkVersion`;
export const URL_ADD_HISTORY = `${URL}historySeachCoupon/add?`;
export const URL_DELETE_HISTORY = `${URL}historySeachCoupon/delete?`;
export const URL_LIST_HISTORY = `${URL}historySeachCoupon/listMobile?`;
export const PUSH_ONLY_DEVICE_TOKEN = `${URL}pushOnlyDeviceToken?`;
export const LIST_BANNER = `${URL}groupBanner/getBannerForApp`;
export const LIST_BANNER_NOT_LOGIN = `${URL}/groupBanner/detailAppHasNotLogin/`;
export const SELECT_LIST_BANNER = `${URL}banner/selectListBannerApp?bannerIds=`;
export const DETAIL_BANNER = `${URL}banner/detailBannerApp/`;
export const APPLY_LIST_BANNER = `${URL}banner/applyListBannerApp?bannerIds=`;
export const BANNER_FROM_SLIDER = `${URL}groupBanner/getBannerForAppFromSlide?`;
export const CLICK_SLIDER = `${URL}sliderImage/countClickSlide/`;
export const CLICK_BANNER = `${URL}groupBanner/countClickGroupBanner/`;
export const CHECK_UPDATE_APP = `${URL}couponYakuodo/checkUpdateAppBeforeShowListCoupon?`;

const URL_GACHA_GET_ALL = `${URL}gacha/getAll/`;
const URL_GACHA_SPIN = gachaId => `${URL}spin/${gachaId}/${device.ADV_ID}/`;
const URL_GET_ADVERTISEMENT = `${URL}beacon/getListAdvertisingContent`;
const URL_DETAIL_ADVERTISEMENT = `${URL}beacon/detailAdvertisingContent`;
const URL_BEACON_APPLY_COUPON = `${URL}beacon/applyCoupon`;
const URL_CHANGE_SCAN_BEACON_STATUS = `${URL}changeStatusAllowToUseBluetooth`;
export const API_URL = {
  CLICK_BANNER,
  CLICK_SLIDER,
  BANNER_FROM_SLIDER,
  APPLY_LIST_BANNER,
  LIST_BANNER_NOT_LOGIN,
  DETAIL_BANNER,
  SELECT_LIST_BANNER,
  LIST_BANNER,
  PUSH_ONLY_DEVICE_TOKEN,
  URL_ADD_HISTORY,
  URL_DELETE_HISTORY,
  URL_LIST_HISTORY,
  URL_CHECK_VERSION,
  URL_MAINTAIN,
  URL_COUNT_USING_COUPON,
  URL_AUTO_LOGIN,
  URL_AUTO_LOGIN_AGAIN,
  URL_VIEW_VIDEO,
  UR_VIEW_COUPON,
  URL_NEW_NOTIFICATION,
  URL_NEW_COUPON,
  URL_WAI_INTRO,
  URL_WAI_TERM,
  URL_STEP_USING,
  URL_USING_IMAGE,
  URL_COMPANY_QUESTION,
  URL_IMAGE_CERTIFICATE,
  URL_YAKUODO_USER,
  URL_DOMAIN,
  URL_COMPANY_LIST_STAMPS,
  URL_COMPANY_HISTORY_COUPON,
  URL_COMPANY_CLICK_PUSH_NOTIFICATION,
  URL_COMPANY_EVENT_DETAIL,
  URL_COMPANY_LIST_EVENT,
  URL_COUNT_CLICK_VIDEO,
  URL_BOOK_MARK,
  URL_COMPANY_STORE,
  URL_COMPANY_STORE_DETAIL,
  URL_COMPANY_COUPON,
  URL_COMPANY_COUPON_DETAIL,
  URL_COMPANY_USE_COUPON,
  URL_LIST_CITY,
  URL_LIST_DISTRICT,
  URL_COMPANY_VIDEO,
  URL_REGISTER,
  URL_CHECK_EMAIL,
  URL_SIGN,
  URL_CONFIRM_RESET_PASSWORD,
  URL_PUSH_EMAIL,
  URL_COMPANY_PUSH_NOTIFICATION,
  URL_COMPANY_CHECK_UPDATE_NOTIFICATION,
  URL_COMPANY_NOTIFICATION,
  URL_COMPANY_NOTIFICATION_DETAIL,
  URL_COMPANY_PUSH_NOTIFICATION_DETAIL,
  URL_COMPANY_CHECK_UPDATE_MENU,
  URL_COMPANY_CHECK_UPDATE_MOBILE_APP,
  URL_COMPANY_DETAIL,
  URL_MENU,
  URL_MOBILE_APP,
  URL_APP_COLOR,
  URL_PUSH_DEVICE_TOKEN,
  URL_PUSH_DEVICE_TOKEN_AGAIN,
  URL_INTRODUCING,
  URL_SLIDER,
  URL_REFRESH_TOKEN,
  URL_DOMAIN_CATALOG,
  URL_COMPANY_ICON_NOTIFICATION,
  URL_COMPANY_ICON_PUSH_NOTIFICATION,
  URL_CHECK_UPDATE_APP,
  URL_COMPANY_NOTIFICATION_IMPORTANT,
  URL_COMPANY_NOTIFICATION_NORMAl,
  URL_CONFIG_REGISTER,
  URL_FORGOT_PASSWORD,
  URL_GO_CATALOG,
  URL_GACHA_GET_ALL,
  URL_GACHA_SPIN,
  URL_COMPANY_NOTIFICATION_CLICK,
  URL_ADD_MILE,
  URL_CATEGORY_YAKUODO_COUPON,
  URL_YAKUODO_ALL_COUPON,
  CHECK_UPDATE_APP,
  URL,
  URL_GET_ADVERTISEMENT,
  URL_DETAIL_ADVERTISEMENT,
  URL_BEACON_APPLY_COUPON,
  URL_CHANGE_SCAN_BEACON_STATUS,
};
