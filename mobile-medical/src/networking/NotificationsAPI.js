import actions from "../redux/actions";

import { get } from "./ApiHelper";

const REQUEST_NOTIFICATIONS = "api/notifications";
const REQUEST_COUNT_NOTI_UNREAD = "api/notifications/unread";
const REQUEST_CHECK_SEND = (id) =>
  `api/notifications/${id}/seen`;

export async function requestNotifications(dispatch, params) {
  params.isReloadData && dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_NOTIFICATIONS,
    params,
    dispatch,
    "Lỗi khi thay lấy danh thông báo"
  );
  let notificationsData = responsesData?.data || [];
  let totalRecords = responsesData.headers["x-total-count"] || 0;
  await dispatch(
    actions.responseNotifications({
      notificationsData,
      totalRecords,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    })
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function requestCheckSend(dispatch, params) {
  let responsesData = await get(
    REQUEST_CHECK_SEND(params),
    {},
    dispatch,
    ""
  );

  return true;
}

export default {
  requestNotifications,
  requestCheckSend
};
