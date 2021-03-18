import actions from "../redux/actions";
// import {
//   SIGN_IN,
//   REQUEST_PROFILE_USER,
//   REQUEST_CHANGE_PASSWORD,
// } from "./ApiUrl";
export const SIGN_IN = "api/authenticate";
export const SIGN_IN_FACE_BOOK = "api/authenticate/facebook";
export const SIGN_IN_GOOGLE = "api/authenticate/google";
export const SIGN_UP = "affiliate/register";
export const REQUEST_PROFILE_USER = "api/account";
export const REQUEST_UPDATE_PROFILE_USER = "/api/users/mobile/update";
export const REQUEST_SSO = "api/public/oauth2/request";
import { post, get, put, isSuccess } from "./ApiHelper";

export async function requestAccountSignin(dispatch, params) {
  let responseData = await post(SIGN_IN, params, dispatch, "Lỗi đăng nhập.");
  let status = responseData?.status;
  if (status && !(await isSuccess(status))) {
    return false;
  }
  let dataAccount = responseData?.data
  dataAccount = {
    ...responseData?.data,
    ...{ isSaveAccount: params.isSaveAccount }
  }
  console.log("params.isSaveAccount:   " , params.isSaveAccount)
  await dispatch(actions.saveAccountAuthent(dataAccount));
  return true;
}

export async function requestAccountSignInFaceBook(dispatch, params) {
  let responseData = await post(
    SIGN_IN_FACE_BOOK,
    params,
    dispatch,
    "Lỗi đăng nhập."
  );
  console.log("responseData", responseData);
  let status = responseData?.status;
  if (status && !(await isSuccess(status))) {
    return false;
  }
  await dispatch(actions.saveAccountAuthent(responseData?.data));
  return responseData?.data;
}

export async function requestAccountSignInGoogle(dispatch, params) {
  console.log("params>>>>", params);
  let responseData = await post(
    SIGN_IN_GOOGLE,
    params,
    dispatch,
    "Lỗi đăng nhập."
  );
  console.log("responseData requestAccountSignInGoogle", responseData.data);
  let status = responseData?.status;
  if (status && !(await isSuccess(status))) {
    return false;
  }
  await dispatch(actions.saveAccountAuthent(responseData?.data));
  return responseData?.data;
}

export async function requestAccountInfo(dispatch, params) {
  let responsesData = await get(
    REQUEST_PROFILE_USER,
    {},
    dispatch,
    "Lỗi khi sửa thông tin người dùng"
  );
  await dispatch(actions.saveAccountInfo(responsesData?.data || []));
  return true;
}

export async function requestUpdateAccountInfo(dispatch, { avatar, ...params }) {
  let dataForm = new FormData()
  dispatch(actions.showLoading())
  for (var key in params) {
    dataForm.append(key, params[key]);
  }
  for (var index in avatar) {
    dataForm.append("avatar", avatar[index]);
  }
  // dataForm.append("avatar", params.avatar);
  console.log("params:   ", params)
  let responsesData = await put(
    REQUEST_UPDATE_PROFILE_USER,
    dataForm,
    dispatch,
    "Lỗi khi sửa thông tin người dùng"
  );
  console.log("responsesData:   ", responsesData)

  dispatch(actions.hideLoading())
  if (isSuccess(responsesData?.status)) {
    await dispatch(actions.saveAccountInfo(responsesData?.data || []));
    return true
  }
  return false;
}

export async function requestSingOut(dispatch, params) {
  await dispatch(actions.signOut());
  return true;
}

export async function requestSSO(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_SSO,
    {},
    dispatch,
    "Lỗi khi lấy thông tin SSO"
  );
  dispatch(actions.hideLoading());
  return responsesData?.data;
}

export default {
  requestAccountSignInFaceBook,
  requestAccountSignInGoogle,
  requestAccountSignin,
  requestAccountInfo,
  requestSingOut,
  requestSSO,
  requestUpdateAccountInfo,
};
