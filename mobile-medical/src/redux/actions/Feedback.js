import * as types from "./actionTypes";

export function responseFeedbacks(data) {
  return {
    type: types.RESPONSE_GET_FEEDBACKS,
    data: data,
  };
}

export function responseFeedbacksReset(data) {
  return {
    type: types.RESPONSE_GET_FEEDBACKS_RESET,
    data: data,
  };
}
