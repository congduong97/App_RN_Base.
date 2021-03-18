import AsyncStorage from '@react-native-community/async-storage';
import {API_URL} from '../const/Url';
import {URL, URL_DOMAIN} from '../const/System';
import {
  DEVICE_ID,
  APP_ID,
  managerAcount,
  isIOS,
  device,
  keyAsyncStorage,
  versionApp
} from '../const/System';

export const getUserId = () => {
  if (managerAcount.userId) {
    return `&userId=${managerAcount.userId}&memberCode=${
      managerAcount.memberCode
    }`;
  } else {
    return '';
  }
};

export async function fetchApiMethodGet(api, usingCode4) {
  console.log('URL', api);
  let headers;
  console.log(managerAcount.accessToken, 'accessToken');
  if (managerAcount && managerAcount.accessToken) {
    headers = {
      accessToken: `${managerAcount.accessToken}`,
    };
  }
  const response = await fetch(api, {
    method: 'GET',
    headers,
  });

  if (response.status === 200) {
    const res = await response.json();
    //case: expired accessToken
    if (
      response.status === 900 ||
      res.status === 900 ||
      res.responseCode == 400 ||
      res.responseCode == 401 ||
      (usingCode4 && res.status.code == 4)
    ) {
      //get new accesstoken
      const resultRefreshAccessToken = await pushResetToken();
      if (resultRefreshAccessToken.code === 1000) {
        //call api againt
        const newResponse = await fetch(api, {
          method: 'GET',
          headers: {
            accessToken: resultRefreshAccessToken.res.accessToken,
          },
        });
        if (newResponse.status === 200) {
          const newRes = await newResponse.json();
          //return new result
          return {res: newRes, code: response.status};
        }
        return {
          res: response,
          code: response.status,
        };
      }
    }
    return {res: res, code: response.status};
  }
  return {res: response, code: response.status};
}
export async function fetchApiMethodPost(api) {
  let headers;
  if (managerAcount && managerAcount.accessToken) {
    headers = {
      accessToken: `${managerAcount.accessToken}`,
    };
  }
  console.log(managerAcount.accessToken, 'accessToken');
  const response = await fetch(api, {
    method: 'POST',
    headers,
  });
  if (response.status === 200) {
    const res = await response.json();
    if (
      response.status === 900 ||
      res.status === 900 ||
      res.responseCode == 400 ||
      res.responseCode == 401
    ) {
      //get new accesstoken
      const resultRefreshAccessToken = await pushResetToken();
      if (resultRefreshAccessToken.code === 1000) {
        //call api againt
        const newResponse = await fetch(api, {
          method: 'POST',
          headers: {
            accessToken: resultRefreshAccessToken.res.accessToken,
          },
        });
        if (newResponse.status === 200) {
          const newRes = await newResponse.json();
          //return new result
          return {res: newRes, code: response.status};
        }
        return {
          res: response,
          code: response.status,
        };
      }
    }

    return {res: res, code: response.status};
  }
  return {res: response, code: response.status};
}

// export async function fetchApiMethodPost(URL) {
//   console.log('URL', URL);
//   let newConfig = confix || {};
//   newConfig.credentials = 'include';
//   newConfig.headers = {};
//   newConfig.headers.appId = APP_ID;
//   newConfig.headers.deviceId = DEVICE_ID;
//   newConfig.headers.typeOs = isIOS ? 'IOS' : 'ANDROID';
//   newConfig.headers.memberCode = managerAcount.memberCode;

//   console.log('newConfig', newConfig);

//   const response = await fetch(URL, newConfig);
//   console.log('response post', response);
//   let responseFetchApiMethodPost =
//     response.status == 200 ? await response.json() : {};
//   console.log('responseFetchApiMethodPost', responseFetchApiMethodPost);

//     return {res: res, code: response.status};
//   }
// }

async function fetchApiMethodGetNotConvertData(URL) {
  let response = await fetch(URL, {method: 'GET'});
  const res = (await response.status) === 200 ? response._bodyInit : response;
  return {res: res, code: response.status};
}

const getUseCoupon = async id => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_USE_COUPON}userId=${
      managerAcount.userId
    }&detailedId[]=${id}&appId=${APP_ID}&deviceId=${device.ADV_ID}&cardNo=${
      managerAcount.memberCode
    }&accessToken=${managerAcount.accessToken}`,
  );
};

/// check qrCode
const checkQRCode = async url => {
  return await fetchApiMethodGet(`${url}`);
};

const getQrCode = async code => {
  return await fetchApiMethodGet(
    `${API_URL.URL_ADD_MILE}accessToken=${
      managerAcount.accessToken
    }&appId=${APP_ID}&userId=${
      managerAcount.userId
    }&mileCodes=${code}&deviceId=${device.ADV_ID}`,
  );
};

//api related login
const pushDeviceToken = async token => {
  const os = isIOS ? 'IOS' : 'ANDROID';
  let response = await fetch(
    `${API_URL.URL_PUSH_DEVICE_TOKEN}${token}&deviceType=${os}&deviceId=${
      device.ADV_ID
    }`,
    {
      method: 'GET',
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};
const pushDeviceTokenAgain = async (token, deviceId) => {
  const os = isIOS ? 'IOS' : 'ANDROID';
  let response = await fetch(
    `${
      API_URL.URL_PUSH_DEVICE_TOKEN_AGAIN
    }${token}&deviceType=${os}&deviceId=${deviceId}`,
    {
      method: 'GET',
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};
const countDeepLink = async link => {
  // alert(`device.ADV_ID : ${device.ADV_ID}`)
  const response = await fetch(
    `${link}&typeOs=${isIOS ? 'IOS' : 'ANDROID'}&deviceId=${
      device.ADV_ID
    }&appId=${APP_ID}${getUserId()}`,
    {
      method: 'GET',
    },
  );
  return response;
};

const confirmReceivedCoupon = async referralCode => {
  return await fetchApiMethodGet(
    `${URL}/referralCoupon/confirmReceivedCoupon?referralCode=${referralCode}`,
  );
};

const checkQrCpon = async link => {
  const response = await fetch(
    `${link}&typeOs=${isIOS ? 'IOS' : 'ANDROID'}&deviceId=${
      device.ADV_ID
    }&appId=${APP_ID}${getUserId()}`,
    {
      method: 'GET',
    },
  );
  return response;
};

const getInformationMyPage = async isReloadBarcode => {
  return fetchApiMethodGet(
    `${URL}member/getInformationMyPage?accessToken=${
      managerAcount.accessToken
    }&userId=${managerAcount.userId}&memberCode=${
      managerAcount.memberCode
    }&pinCode=${managerAcount.pinCode}&isNewAPI=true&isReloadBarcode=${
      isReloadBarcode ? 'true' : 'false'
    }`,
    true,
  );
};

const getNewNotification = async () => {
  let time = await AsyncStorage.getItem('timeNotification');
  time = time ? time : 0;
  return fetchApiMethodGet(
    `${API_URL.URL_NEW_NOTIFICATION}deviceId=${
      device.ADV_ID
    }&lastAccess=${time}${getUserId()}`,
  );
};

//View
const pushResetToken = async () => {
  let responseRefreshToken = await fetch(
    `${URL_DOMAIN}/api/v1/app/{appId}/member/getAccessToken?refreshToken=${
      managerAcount.refreshToken
    }`,
    {
      method: 'POST',
      // body: formData
    },
  );
  if (responseRefreshToken.status === 200) {
    const res = await responseRefreshToken.json();
    if (res.status.code === 1000) {
      const newToken = res.data;
      managerAcount.accessToken = newToken;
      const managerJson = JSON.stringify(managerAcount);
      AsyncStorage.setItem(keyAsyncStorage.managerAccount, managerJson);
      return {
        code: 1000,
        res: {accessToken: newAccessToken},
      };
    } else {
      if (res.status.code === 400 || res.status.code === 401) {
        const responseLogin = await pushSign(
          managerAcount.memberCode,
          managerAcount.pinCode,
        );
        if (responseLogin.code === 200) {
          const {newAccessToken, newRefreshToken} = responseLogin.res;
          managerAcount.accessToken = newAccessToken;
          managerAcount.refreshToken = newRefreshToken;
          const managerJson = JSON.stringify(managerAcount);
          AsyncStorage.setItem(keyAsyncStorage.managerAccount, managerJson);
          return {
            code: 1000,
            res: {accessToken: newAccessToken},
          };
        }
        return {res: responseRefreshToken, code: 500};
      } else {
        return {res: responseRefreshToken, code: responseRefreshToken.status};
      }
    }
  } else {
    return {res: responseRefreshToken, code: responseRefreshToken.status};
  }
};
const pushSign = async (memberCode, pinCode) => {
  var formData = new FormData();
  formData.append('email', 'MOBILE_USER');
  formData.append('password', memberCode);
  formData.append('appId', APP_ID);
  formData.append('deviceId', device.ADV_ID);
  formData.append('pinCode', pinCode);
  formData.append('isNewAPI', true);
  let response = await fetch(API_URL.URL_SIGN, {
    method: 'POST',
    body: formData,
  });
  // console.log('response', response);
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};

//api related to Notification
const getNotification = async (size, page) => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_NOTIFICATION}&page=${size}&size=${page}&deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};

const getCheckUpDatePushNotification = async () => {
  let time = await AsyncStorage.getItem('timeUpdateNotification');
  let timeApi = time != null ? new Number(time) : new Date().getTime();

  return await fetchApiMethodGet(
    `${
      API_URL.URL_COMPANY_CHECK_UPDATE_NOTIFICATION
    }lastAccess=${timeApi}&deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const getNotificationDetail = async id => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_NOTIFICATION_DETAIL}${id}?deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};
const getPushNotification = async (size, page) => {
  const time = new Date().getTime() + 90000;
  AsyncStorage.setItem('timeUpdateNotification', time.toString());
  return await fetchApiMethodGet(
    `${
      API_URL.URL_COMPANY_PUSH_NOTIFICATION
    }size=${size}&page=${page}&deviceId=${device.ADV_ID}${getUserId()}`,
  );
};

const getNotificationImportant = async () => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_NOTIFICATION_IMPORTANT}?deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};
const getNotificationNormal = async () => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_NOTIFICATION_NORMAl}?deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};
const getPushNotificationDetail = async id => {
  return await fetchApiMethodGet(
    `${API_URL.URL_COMPANY_PUSH_NOTIFICATION_DETAIL}${id}?deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};

//api related to system data
const getCompanyDetail = async () => {
  return await fetchApiMethodGetNotConvertData(API_URL.URL_COMPANY_DETAIL);
};
const getMenu = async () => {
  return await fetchApiMethodGetNotConvertData(API_URL.URL_MENU);
};
const checkUpdateApp = async version => {
  let response = await fetch(`${API_URL.URL_CHECK_UPDATE_APP + version}?versionApp=${versionApp}&deviceId=${device.ADV_ID}`, {
    method: 'POST',
  });
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
  // return response
  // return await fetchApiMethodGet(API_URL.URL_CHECK_UPDATE_APP+version)
};
const addHistoryCoupon = async keyWork => {
  let response = await fetch(
    `${API_URL.URL_ADD_HISTORY}deviceId=${device.ADV_ID}&userId=${
      managerAcount.userId
    }&memberCode=${managerAcount.memberCode}&keyWord=${keyWork}`,
    {
      method: 'POST',
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};

const pushCountUsingCoupon = async (listCoupon, typeUse) => {
  let response = await fetch(
    `${API_URL.URL_COUNT_USING_COUPON}userId=${
      managerAcount.userId
    }&memberCode=${managerAcount.memberCode}&deviceId=${
      device.ADV_ID
    }&typeUse=${typeUse}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },

      body: JSON.stringify(listCoupon),
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};
//
const getMobileApp = async () => {
  return await fetchApiMethodGetNotConvertData(API_URL.URL_MOBILE_APP);
};
const getAppColor = async () => {
  return await fetchApiMethodGetNotConvertData(API_URL.URL_APP_COLOR);
};
const getIntroducing = async () => {
  return await fetchApiMethodGetNotConvertData(API_URL.URL_INTRODUCING);
};
const getIconNotification = async () => {
  return await fetchApiMethodGetNotConvertData(
    API_URL.URL_COMPANY_ICON_NOTIFICATION,
  );
};
const getIconPushNotification = async () => {
  return await fetchApiMethodGetNotConvertData(
    API_URL.URL_COMPANY_ICON_PUSH_NOTIFICATION,
  );
};

const getUpDateMobileApp = async time => {
  return await fetchApiMethodGet(
    API_URL.URL_COMPANY_CHECK_UPDATE_MOBILE_APP + time,
  );
};

const getQuesitions = async () => {
  return await fetchApiMethodGet(API_URL.URL_COMPANY_QUESTION);
};

const getUsingImage = async () => {
  return fetchApiMethodGet(API_URL.URL_USING_IMAGE);
};
const getStepUsing = async () => {
  return fetchApiMethodGet(API_URL.URL_STEP_USING);
};
//
const getWaiIntro = async () => {
  return fetchApiMethodGet(API_URL.URL_WAI_INTRO);
};
const getWaiTerm = async () => {
  return fetchApiMethodGet(API_URL.URL_WAI_TERM);
};
const getAutoLogin = async advId => {
  return fetchApiMethodGet(`${API_URL.URL_AUTO_LOGIN}deviceId=${advId}`);
};
const getAutoLoginAgain = async advId => {
  return fetchApiMethodGet(`${API_URL.URL_AUTO_LOGIN_AGAIN}deviceId=${advId}`);
};
const getMaintain = async () => {
  return fetchApiMethodGet(`${API_URL.URL_MAINTAIN}`);
};
const checkVersion = async () => {
  const response = await fetch(API_URL.URL_CHECK_VERSION, {
    method: 'GET',
  });
  const res =
    (await response.status) === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};
const pushOnlyDeviceToken = async deviceToken => {
  return fetchApiMethodGet(
    `${API_URL.PUSH_ONLY_DEVICE_TOKEN}deviceId=${
      device.ADV_ID
    }&deviceToken=${deviceToken}`,
  );
};
const listBanner = async () => {
  return fetchApiMethodGet(
    `${API_URL.LIST_BANNER}?deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const listBannerFromSlider = async () => {
  return fetchApiMethodGet(
    `${API_URL.BANNER_FROM_SLIDER}deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const listBannerNotLogin = async id => {
  return fetchApiMethodGet(
    `${API_URL.LIST_BANNER_NOT_LOGIN}${id}?deviceId=${device.ADV_ID}`,
  );
};
const selectListBannerApp = async bannerIds => {
  return fetchApiMethodGet(
    `${API_URL.SELECT_LIST_BANNER}${bannerIds}&deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};
const applyListBannerApp = async bannerIds => {
  return fetchApiMethodGet(
    `${API_URL.APPLY_LIST_BANNER}${bannerIds}&deviceId=${
      device.ADV_ID
    }${getUserId()}`,
  );
};
const detailBannerApp = async id => {
  return fetchApiMethodGet(
    `${API_URL.DETAIL_BANNER}${id}?&deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const clickSlider = async id => {
  return fetchApiMethodGet(
    `${API_URL.CLICK_SLIDER}${id}?&deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const clickBanner = async id => {
  return fetchApiMethodGet(
    `${API_URL.CLICK_BANNER}${id}?&deviceId=${device.ADV_ID}${getUserId()}`,
  );
};
const checkUpdateAppCouponScreen = () => {
  return fetchApiMethodGet(`${API_URL.CHECK_UPDATE_APP}`);
};
const getNewCoupon = async () => {
  // console.log('vao new');

  let time = await AsyncStorage.getItem('timeNewCoupon');
  // console.log('time', time);
  const currentTime = new Date().getTime();
  // console.log('currentTime', currentTime);
  AsyncStorage.setItem('timeNewCoupon', `${currentTime}`);

  return fetchApiMethodPost(
    `${URL}newCoupon/checkNewCoupon?currentTime=${time || 0}${getUserId()}`,
  );
};

const getTermsOfUseBeacon = () => {
  return fetch(`${URL}beacon/getPolicy`, {
    method: 'GET',
  });
};

const sendInBeaconEvent = (namespace, instance) => {
  return fetchApiMethodGet(
    `${URL}beacon/in?deviceId=${
      device.ADV_ID
    }&namespace=${namespace}&instance=${instance}`,
  );
};
// GET /api/v1/app/{appId}/beacon/getListAdvertisingContentWithoutPageId
const getAdvertisement = (typeGetListContent) => {
  return fetchApiMethodGet(
    `${API_URL.URL_GET_ADVERTISEMENT}?deviceId=${device.ADV_ID}&typeGetListContent=${typeGetListContent}`,
  );
};
const getDetailAdvertisement = (  advertisingContentId,
) => {
  return fetchApiMethodGet(
    `${API_URL.URL_DETAIL_ADVERTISEMENT}?deviceId=${
      device.ADV_ID
    }&advertisingContentId=${advertisingContentId}`,
  );
};

const beaconApplyCoupon = advertisingContentId => {
  console.log(
    'url',
    `${API_URL.URL_BEACON_APPLY_COUPON}?deviceId=${
      device.ADV_ID
    }&advertisingContentId=${advertisingContentId}`,
  );
  return fetchApiMethodPost(
    `${API_URL.URL_BEACON_APPLY_COUPON}?deviceId=${
      device.ADV_ID
    }&advertisingContentId=${advertisingContentId}`,
  );
};
const beaconApplyAllCoupon = (advertisingPageId, beaconTerminalId) => {
  console.log(
    'url',
    `${API_URL.URL_BEACON_APPLY_COUPON}?deviceId=${
      device.ADV_ID
    }&advertisingPageId=${advertisingPageId}&beaconTerminalId=${beaconTerminalId}`,
  );
  return fetchApiMethodPost(
    `${API_URL.URL_BEACON_APPLY_COUPON}?deviceId=${
      device.ADV_ID
    }&advertisingPageId=${advertisingPageId}&beaconTerminalId=${beaconTerminalId}`,
  );
};
const changeStatusAllowToUseBluetooth = (status) => {
  return fetchApiMethodPost(
    `${API_URL.URL_CHANGE_SCAN_BEACON_STATUS}?newStatus=${status}&deviceId=${device.ADV_ID}`
  )
}
const setStatusAllowToGetAdvertisingId = (status, idfa)=> {
  let urlStr = '';
  if (isIOS) {
    urlStr = `${URL}setStatusAllowToGetAdvertisingId?deviceId=${device.ADV_ID}&isAllow=${status}&idfa=${idfa}`
  } else {
    urlStr = `${URL}setStatusAllowToGetAdvertisingId?deviceId=${device.ADV_ID}&isAllow=${status}&adid=${idfa}`
  }
  return fetchApiMethodPost(urlStr);
}
export const Api = {
  getNewCoupon,
  getInformationMyPage,
  clickBanner,
  clickSlider,
  listBannerFromSlider,
  applyListBannerApp,
  listBannerNotLogin,
  detailBannerApp,
  selectListBannerApp,
  listBanner,
  checkQrCpon,
  addHistoryCoupon,
  pushDeviceTokenAgain,
  getAutoLoginAgain,
  checkVersion,
  getMaintain,
  pushCountUsingCoupon,
  getAutoLogin,
  pushDeviceToken,
  getWaiIntro,
  getWaiTerm,
  getStepUsing,
  getUsingImage,
  getQuesitions,
  getUseCoupon,
  pushSign,
  getNotification,
  getPushNotification,
  getCheckUpDatePushNotification,
  getNotificationDetail,
  getPushNotificationDetail,
  getCompanyDetail,
  getMenu,
  getMobileApp,
  getUpDateMobileApp,
  getAppColor,
  getIntroducing,
  getIconNotification,
  getIconPushNotification,
  checkUpdateApp,
  getNotificationImportant,
  getNotificationNormal,
  getQrCode,
  getNewNotification,
  pushResetToken,
  countDeepLink,
  pushOnlyDeviceToken,
  checkUpdateAppCouponScreen,
  checkQRCode,
  confirmReceivedCoupon,
  getTermsOfUseBeacon,
  sendInBeaconEvent,
  getAdvertisement,
  getDetailAdvertisement,
  beaconApplyCoupon,
  beaconApplyAllCoupon,
  changeStatusAllowToUseBluetooth,
  setStatusAllowToGetAdvertisingId,
};
