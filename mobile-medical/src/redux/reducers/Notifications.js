import * as types from "../actions/actionTypes";
import { mergeByProperty, deepCopyObject } from "../../commons/utils";

const initialState = {
  resultNotifications: { notificationsData: [], pageNext: 1 },
  totalUnread: 0
};

export default function NotificationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.RESPONSE_GET_NOTIFICATIONS: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let notificationsData = action.data.notificationsData;
      if (!isReloadData) {
        notificationsData = deepCopyObject(
          state.resultNotifications.notificationsData
        );
        mergeByProperty(notificationsData, action.data.notificationsData, "id");
      }
      let pageNext = Math.floor(notificationsData.length / sizePage);
      let isFinished = (Number(totalRecords) === notificationsData.length);
      return Object.assign({}, state, {
        resultNotifications: {
          isRequestDone: true,
          notificationsData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }
    case types.RESPONSE_COUNT_NOTI_UNREAD: {
      let totalUnread = action.data.totalUnread;
      return Object.assign({}, state, {
        resultNotifications: {
          totalUnread
        },
      });
    }

    default:
      return state;
  }
}
