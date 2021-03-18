import * as types from "./actionTypes";

export function responseDataDoctor(data) {
  return {
    type: types.RESPONSE_GET_DOCTOR,
    data: data,
  };
}

export function responseDoctorReset(data) {
  return {
    type: types.RESPONSE_GET_DOCTOR_RESET,
    data: data,
  };
}
