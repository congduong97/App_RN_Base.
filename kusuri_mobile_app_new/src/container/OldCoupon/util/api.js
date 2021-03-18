

import { fetchApiMethodGet } from '../../../service';
import { DEVICE_ID, URL } from '../../../const/System';

const getUseCoupon = async (id, turningId) => await fetchApiMethodGet(`${URL}coupon/${id}/use?deviceId=${DEVICE_ID}${turningId ? `&turningId=${turningId}` : ''}`);

const getCoupons = async (size, page) => await fetchApiMethodGet(`${URL}coupon/listForMobile?deviceId=${DEVICE_ID}`);

const getCouponDetail = async (id, turningId) => await fetchApiMethodGet(`${URL}coupon/detail/${id}?deviceId=${DEVICE_ID}${turningId ? `&turningId=${turningId}` : ''}`);

const getHistoryCoupon = async (size, page) => await fetchApiMethodGet(`${URL}coupon/usingHistory?deviceId=${DEVICE_ID}&page=${page}&size=${size}&sortDir=desc&sortField=id`);

export const Api = {
    getUseCoupon,
    getCoupons,
    getCouponDetail,
    getHistoryCoupon

};
