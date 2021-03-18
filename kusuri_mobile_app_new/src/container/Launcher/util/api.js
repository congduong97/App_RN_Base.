import {
  URL,
  URL_DOMAIN,
  COMPANY_ID,
  APP_ID,
  DEVICE_ID,
  isIOS,
  PRIVATE_KEY,
  PRIVATE_KEY_PUSH_DEVICE_TOKEN,
  keyAsyncStorage,
  versionApp,
} from "../../../const/System";
import {
  fetchApiMethodGet,
  fetchApiMethodGetNotUseToken,
} from "../../../service";
import AsyncStorage from "@react-native-community/async-storage";

const getConfigRegister = async () => {
  return await fetchApiMethodGet(`${URL}getConfigRegister`);
};

const getMaintain = async () => {
  return await fetchApiMethodGet(`${URL_DOMAIN}/checkStatusMaintain`);
};

const checkVersion = async () => {
  return await fetchApiMethodGet(`${URL}app/checkVersionApp`);
};

const checkUpdateApp = async (version) => {
  let os = isIOS ? "ios" : "android";
  let response = await fetch(
    `${URL}app/checkUpdateApp/${version}?typeOs=${os}&versionApp=${versionApp}&deviceId=${DEVICE_ID}`,
    {
      method: "POST",
    }
  );
  const res = response.status === 200 ? await response.json() : response;
  return { res: res, code: response.status };
};

const pushDeviceToken = async (token) =>
  fetchApiMethodGetNotUseToken(
    `${URL}/device/pushDeviceToken?deviceId=${DEVICE_ID}&deviceToken=${token}&privateKey=${PRIVATE_KEY_PUSH_DEVICE_TOKEN}`
  );
const pushRegisterDevice = async () =>
  await fetchApiMethodGetNotUseToken(
    `${URL}/device/pushDeviceId?companyId=${COMPANY_ID}&deviceId=${DEVICE_ID}&deviceType=${
      isIOS ? "IOS" : "ANDROID"
    }&privateKey=${PRIVATE_KEY}`
  );

const getAppDetail = async () =>
  await fetchApiMethodGetNotUseToken(`${URL}app/detail/`);

export const Api = {
  getAppDetail,
  getConfigRegister,
  getMaintain,
  checkVersion,
  checkUpdateApp,
  pushDeviceToken,
  pushRegisterDevice,
};
