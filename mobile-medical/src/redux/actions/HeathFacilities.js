import * as types from "./actionTypes";

//// Luu
export function responseHeathFacilities(data) {
  return {
    type: types.SAVE_HEATH_FACILITIES_DATA,
    data: data,
  };
}

//// Luu
export function responseMedicalSpecialization(data) {
  return {
    type: types.MEDICEL_SPECIALIZATION_DATA,
    data: data,
  };
}
export function responseHeathFaciProcessFeeback(data) {
  return {
    type: types.MEDICEL_PROCESS_FEEDBACK_DATA,
    data: data,
  };
}
export function responseHeathFaclitiesSearch(data) {
  return {
    type: types.RESPONSE_HEATH_FACLITIES_SEARCH,
    data: data,
  };
}
export function responseHeathFaclitiesSearchLoadMode(data) {
  return {
    type: types.RESPONSE_HEATH_FACLITIES_SEARCH_LOAD_MODE,
    data: data,
  };
}
export function responseHeathFaclitiesSearchLoadModeReset(data) {
  return {
    type: types.RESPONSE_HEATH_FACLITIES_SEARCH_LOAD_MODE_RESET,
    data: data,
  };
}
