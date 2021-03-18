
import * as type from './actionTypes';


export function responseNotifications(data) {
  return {
    type: type.RESPONSE_GET_NOTIFICATIONS,
    data: data,
  };
}

export function setDataReadedNotifi(data) {
  return {
    type: type.RESPONSE_READED_NOTIFI,
    data: data,
  };
}

export function setReadedAll(data) {
  return {
    type: type.RESPONSE_READED_ALL_NOTIFI,
    data: data,
  };
}

export function saveDataNotification(data) {
  return {
    type: type.DATA_NOTIFICAITON,
    data: data,
  };
}
