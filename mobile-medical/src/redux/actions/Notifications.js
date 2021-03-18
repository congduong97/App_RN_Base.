import * as types from "./actionTypes";

export function responseNotifications(data) {
  return {
    type: types.RESPONSE_GET_NOTIFICATIONS,
    data: data,
  };
}

export function responseCountNotiUnread(data){
  return {
    type: types.RESPONSE_COUNT_NOTI_UNREAD,
    data: data
  }
}