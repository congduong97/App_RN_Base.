import * as types from "./actionTypes";

export function responsePatientRecords(data) {
  return {
    type: types.RESPONSE_PATIENT_RECORDS,
    data: data,
  };
}

export function responseSearchPatientRecords(data) {
  return {
    type: types.RESPONSE_SEARCH_PATIENT_RECORDS,
    data: data,
  };
}
