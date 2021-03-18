import * as types from "../actions/actionTypes";

export function isShowLoading(isShow) {
  return {
    type: types.LOADING.LOADING,
    isShow: isShow,
  };
}

export function showLoading() {
  return {
    type: types.LOADING.SHOW,
  };
}

export function hideLoading() {
  return {
    type: types.LOADING.HIDE,
  };
}

export function synchronizedFirstData(isDone) {
  return {
    type: types.SYNC_APP_SUCCESS,
    data: isDone,
  };
}

//// Lu hanh dong book lich kham: Theo ngay hay theo bac si
export function actionBookType(bookType) {
  return {
    type: types.ACTION_BOOK_TYPE,
    data: bookType,
  };
}
