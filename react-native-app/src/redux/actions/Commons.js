import * as types from '../actions/actionTypes';

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
    type: types.SYNC_APP.SUCCESS,
    data: isDone,
  };
}

export function saveSimCategories(saveData) {
  return {
    type: types.SIM_CATEGORIES.SAVE,
    data: saveData,
  };
}

export function changeCopySim(listSimCopied) {
  return {
    type: types.SIM_COPY.COPY,
    data: listSimCopied,
  };
}

export function resetCopySim(dataResponse) {
  return {
    type: types.SIM_COPY.RESET,
    data: dataResponse,
  };
}

export function saveProvinces() {
  return {
    type: types.SAVE_PROVINCES,
  };
}
export function saveDistricts() {
  return {
    type: types.SAVE_DISTRICTS,
  };
}

export function saveWards() {
  return {
    type: types.SAVE_WARDS,
  };
}
