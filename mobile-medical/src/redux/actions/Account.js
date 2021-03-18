import * as types from "./actionTypes";

export function saveAccountAuthent(data) {
  return {
    type: types.ACCOUNT.AUTHENTICATION,
    data: data,
  };
}

export function signOut() {
  return {
    type: types.ACCOUNT.SIGN_OUT,
  };
}

export function saveAccountInfo(data) {
  return {
    type: types.ACCOUNT.ACCOUNT_INFO,
    data: data,
  };
}
