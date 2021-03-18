import actions from "../redux/actions";

import { post, get, requestALl, isSuccess, put } from "./ApiHelper";
import models from "../models";

const REQUEST_PAYMENT = "api/public/transactions/payment-method";
const DO_PAYMENT = "api/payment/vnpay/request?source=2";
const DO_PAYMENT_UPDATE = "api/payment/vnpay/request/update-doctor-appointment?source=2";
const SAVE_PAYMENTSTATUS= "/api/public/payment/vnpay/ipn";
const GET_LIST_BANK= "/api/public/transactions/banks";
const GET_RETURN_PAYMENTSTATUS= "/api/doctor-appointments/booking-code/";

export async function requestPaymentMethod(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_PAYMENT,
    params,
    dispatch,
    "Lỗi khi lấy danh sách Phương thức thanh toán"
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}
export async function getListBank(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    GET_LIST_BANK,
    params,
    dispatch,
    "Lỗi khi lấy danh sách Ngân Hàng"
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}



export async function doPayment(dispatch, params) {
  let responsesData = await post(
    DO_PAYMENT,
    params,
    dispatch,
    "Không thực hiện được thanh toán "
  );
  return responsesData?.data || [];
}

export async function doPaymentUpdate(dispatch, params) {
  let responsesData = await put(
    DO_PAYMENT_UPDATE,
    params,
    dispatch,
    "Không thực hiện được thanh toán "
  );
  return responsesData?.data || [];
}

export async function savePaymentStatus(dispatch, params,link) {
  let responsesData = await get(
    SAVE_PAYMENTSTATUS+`?${link}`,
    params,
    dispatch,
    "Không thực hiện được thanh toán "
  );
  return responsesData?.data || [];
}
export async function getReturnPaymentStatus(dispatch, params,code) {
  let responsesData = await get(
    GET_RETURN_PAYMENTSTATUS+`${code}`,
    params,
    dispatch,
    "Không thực hiện được thanh toán "
  );
  return responsesData?.data || [];
}
export default {
    requestPaymentMethod,
    doPayment,
    doPaymentUpdate,
    savePaymentStatus,
    getListBank,
    getReturnPaymentStatus
};
