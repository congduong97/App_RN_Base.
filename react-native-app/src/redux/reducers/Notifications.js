import * as types from '../actions/actionTypes';
import {mergeByProperty, deepCopyObject} from '../../commons/utils';

const initialState = {
  resultNotifications: {notificationsData: [], pageNext: 1},
  totalNotifiUnread: 0,
  dataReadedNotifi: null,
  isReadedAll: null,
  dataNotification: null,
};

export default function NotificationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.DATA_NOTIFICAITON: {
      return Object.assign({}, state, {
        dataNotification: action.data,
      });
    }
    case types.RESPONSE_READED_NOTIFI: {
      let totalNotifiUnread = state.totalNotifiUnread;
      if (action.data) {
        totalNotifiUnread = --totalNotifiUnread;
        if (totalNotifiUnread < 0) {
          totalNotifiUnread = 0;
        }
      }
      return Object.assign({}, state, {
        dataReadedNotifi: action.data,
        totalNotifiUnread,
      });
    }
    case types.RESPONSE_READED_ALL_NOTIFI: {
      let totalNotifiUnread = state.totalNotifiUnread;
      if (action.data) {
        totalNotifiUnread = 0;
      }
      return Object.assign({}, state, {
        totalNotifiUnread,
        isReadedAll: action.data,
      });
    }
    case types.RESPONSE_GET_NOTIFICATIONS: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let totalNotifiUnread = action.data.totalUnread;
      let sizePage = action.data.sizePage;
      let notificationsData = action.data.notificationsData;
      if (!isReloadData) {
        notificationsData = deepCopyObject(
          state.resultNotifications.notificationsData,
        );
        mergeByProperty(notificationsData, action.data.notificationsData, 'id');
      }
      let pageNext = Math.floor(notificationsData.length / sizePage);
      let isFinished = totalRecords === notificationsData.length;
      return Object.assign({}, state, {
        totalNotifiUnread,
        resultNotifications: {
          isRequestDone: true,
          notificationsData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }

    case types.SIGN_OUT: {
      return Object.assign({}, state, {
        resultNotifications: {notificationsData: [], pageNext: 1},
        totalNotifiUnread: 0,
        dataReadedNotifi: null,
        isReadedAll: null,
        dataNotification: null,
      });
    }

    default:
      return state;
  }
}
