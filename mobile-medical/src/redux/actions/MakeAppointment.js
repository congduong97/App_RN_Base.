import * as types from "./actionTypes";

export function saveMakeAppointData(data) {
  return {
    type: types.SAVE_MAKE_APPOINT_DATA,
    data: data,
  };
}
export function resetMakeAppointData() {
  return {
    type: types.RESET_MAKE_APPOINT_DATA,
  };
}
