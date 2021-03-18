import { fetchApiMethodGet, fetchApiMethodPost } from "../../../service";
import {
  DEVICE_ID,
  URL,
  managerAccount,
  keyAsyncStorage
} from "../../../const/System";
import AsyncStorage from "@react-native-community/async-storage";

const getUseCoupon = async id =>
  await fetchApiMethodGet(`${URL}coupon/${id}/use?deviceId=${DEVICE_ID}`);

const getCoupons = async () => {
  const now = new Date().getTime();
  AsyncStorage.setItem(keyAsyncStorage.timeUpdateNewCoupon, `${now}`);
  return await fetchApiMethodGet(
    `${URL}newCoupon/listForMobile?deviceId=${DEVICE_ID}`
  );
};

const getCouponDetail = async (id, turningId) =>
  await fetchApiMethodGet(
    `${URL}coupon/detail/${id}?deviceId=${DEVICE_ID}${
      turningId ? `&turningId=${turningId}` : ""
    }`
  );

const getHistoryCoupon = async (size, page) =>
  await fetchApiMethodGet(
    `${URL}coupon/usingHistory?deviceId=${DEVICE_ID}&page=${page}&size=${size}&sortDir=desc&sortField=id`
  );

const getCategorys = async () =>
  await fetchApiMethodGet(
    `${URL}newCoupon/categoryCoupon?deviceId=${DEVICE_ID}`
  );

const countTimeDetail = async id =>
  await fetchApiMethodGet(`${URL}newCoupon/detail/${id}?deviceId=${DEVICE_ID}`);

const addCouponPlus = async () =>
  await fetchApiMethodPost(`${URL}newCoupon/addPointPlusCoupon`, {
    method: "POST",
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "application/json"
    }
  });

const useCoupon = async couponIds =>
  await fetchApiMethodPost(
    `${URL}newCoupon/use?deviceId=${DEVICE_ID}&&couponIds=${couponIds}`,
    {
      method: "POST",
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "application/json"
      }
    }
  );

export const Api = {
  getUseCoupon,
  getCoupons,
  getCouponDetail,
  getHistoryCoupon,
  getCategorys,
  countTimeDetail,
  addCouponPlus,
  useCoupon
};
