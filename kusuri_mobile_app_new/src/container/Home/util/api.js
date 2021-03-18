import AsyncStorage from "@react-native-community/async-storage";
import {
  fetchApiMethodGet,
  fetchApiMethodGetNotUseToken,
  fetchApiMethodPost,
} from "../../../service";
import {
  keyAsyncStorage,
  DEVICE_ID,
  URL,
  URL_DOMAIN,
  managerAccount,
  PRIVATE_KEY_PUSH_DEVICE_TOKEN,
} from "../../../const/System";
// import console = require('console');

const getCheckUpDateNotification = async () => {
  const time = await AsyncStorage.getItem(
    keyAsyncStorage.timeUpdateNotification
  );

  const timeApi = time != null ? new Number(time) : new Date().getTime();
  // console.log('1562230805924', new Date(timeApi).toString());

  return await fetchApiMethodGet(
    `${URL}pushNotification/checkStatusPushNotification?lastAccess=${timeApi}&deviceId=${DEVICE_ID}`
  );
};

const getNewNotification = async () => {
  let time = await AsyncStorage.getItem(
    keyAsyncStorage.timeUpdateCompanyNotification
  );
  time = time || 0;
  return fetchApiMethodGet(
    `${URL}notification/checkStatus?deviceId=${DEVICE_ID}&lastAccess=${time}`
  );
};
getHasNewCoupon = async () => {
  let time = await AsyncStorage.getItem(keyAsyncStorage.timeUpdateNewCoupon);
  time = time || new Date().getTime();
  return fetchApiMethodPost(
    ///api/v1/app/{appId}/newCoupon/hasNewCoupon
    `${URL}newCoupon/hasNewCoupon?currentTime=${time}`,
    {
      method: "POST",
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
const getNotificationImportant = async () =>
  await fetchApiMethodGet(`${URL}notification/important`);

const bannerImage = async (bannerId) =>
  await fetchApiMethodGet(
    `${URL}bannerImage/applyBanner/${bannerId}?deviceId=${DEVICE_ID}`
  );

const sliderImage = async (sliderId) =>
  await fetchApiMethodGet(
    `${URL}sliderImage/countView?deviceId=${DEVICE_ID}&sliderId=${sliderId}`
  );

const getNotificationNormal = async () =>
  await fetchApiMethodGet(`${URL}notification/normal`);

const pushDeviceToken = async (token) =>
  fetchApiMethodGetNotUseToken(
    `${URL}device/pushDeviceToken?deviceId=${DEVICE_ID}&deviceToken=${token}&privateKey=${PRIVATE_KEY_PUSH_DEVICE_TOKEN}`
  );

const getListPkikakuHasCoupon = async () => {
  return await fetchApiMethodGet(`${URL}/newCoupon/getListSpecialPkikakuRemainCoupon`);
};
export const Api = {
  getCheckUpDateNotification,
  getNewNotification,
  getHasNewCoupon,
  getNotificationImportant,
  getNotificationNormal,
  bannerImage,
  sliderImage,
  pushDeviceToken,
  getListPkikakuHasCoupon
};
