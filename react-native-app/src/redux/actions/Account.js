import {SIGN_IN, GET_ACCOUNT_INFO, SIGN_OUT} from './actionTypes';

export function saveAccountAuthent(data) {
  return {
    type: SIGN_IN.SUCCESS,
    data: data,
  };
}
export function saveAccountInfo(data) {
  return {
    type: GET_ACCOUNT_INFO.SUCCESS,
    data: data,
  };
}
export function changePasswordSuccess(data) {
  return {
    type: GET_ACCOUNT_INFO.SUCCESS,
    data: data,
  };
}
export function signOut() {
  return {
    type: SIGN_OUT,
  };
}
