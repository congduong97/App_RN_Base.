import {
  URL,
  DEVICE_ID,
  managerAcount,
  DEVICE_WIDTH,
  device,
  keyAsyncStorage,
  URL_DOMAIN,
} from '../../../const/System';
import {fetchApiMethodGet, fetchApiMethodPost} from '../../../service';
import AsyncStorage from '@react-native-community/async-storage';
console.log('device', device.ADV_ID);
const getCategoryCoupon = async () => {
  return await fetchApiMethodGet(`${URL}newCoupon/categoryCoupon`);
};
const getListAllCoupon = async () => {
  const now = new Date().getTime();
  AsyncStorage.setItem(keyAsyncStorage.timeUpdateNewCoupon, `${now}`);
  return await fetchApiMethodGet(
    `${URL}newCoupon/listForMobile?deviceId=${device.ADV_ID}`,
  );
};

const getDetailCoupon = async detail => {
  return await fetchApiMethodGet(
    `${URL}newCoupon/detail/${detail}?deviceId=${device.ADV_ID}&memberId=${managerAcount.userId}&memberCode=${managerAcount.memberCode}  `,
  );
};

const countCouponDetail = async idDetail => {
  return await fetchApiMethodGet(
    `${URL}newCoupon/detail/${idDetail}?deviceId=${device.ADV_ID}`,
  );
};

const useListCoupon = async (couponIds, isUsedFromInList) =>
  await fetchApiMethodPost(
    `${URL}newCoupon/useList?couponIds=${couponIds}&deviceId=${device.ADV_ID}&isUsedFromInList=${isUsedFromInList}`,
    {
      method: 'POST',
      headers: {
        accessToken: `${managerAcount.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );
const addHistoryCoupon = async keyWork => {
  let response = await fetch(
    `${URL}/historySeachCoupon/add?deviceId=${device.ADV_ID}&userId=${managerAcount.userId}&memberCode=${managerAcount.memberCode}&keyWord=${keyWork}`,
    {
      method: 'POST',
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};

const getListHistorySearchCoupon = async (page, size) => {
  return await fetchApiMethodGet(
    `${URL}/historySeachCoupon/listMobile?memberCode=${managerAcount.memberCode}&page=${page}&size=${size}`,
  );
};

const deteleHistorySearchCoupon = async historyId => {
  let response = await fetch(
    `${URL_DOMAIN}/api/v1/app/{appId}/historySeachCoupon/delete?memberCode=${managerAcount.memberCode}&historyId=${historyId}`,
    {
      method: 'POST',
    },
  );
  const res = response.status === 200 ? await response.json() : response;
  return {res: res, code: response.status};
};

const referralCoupon = async (couponId, couponCode, kikakuCode) => {
  return await fetchApiMethodGet(
    `${URL}referralCoupon/generate?couponId=${couponId}&couponCode=${couponCode}&kikakuCode=${kikakuCode}&memberCode=${managerAcount.memberCode}`,
  );
};

export const API = {
  getCategoryCoupon,
  getListAllCoupon,
  getDetailCoupon,
  countCouponDetail,
  useListCoupon,
  addHistoryCoupon,
  getListHistorySearchCoupon,
  deteleHistorySearchCoupon,
  referralCoupon,
};
