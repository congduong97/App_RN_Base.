import {get, put, post, requestALl} from './ApiHelper';
import actions from '../redux/actions';
import models from '../models';
import {
  REQUEST_NOTIFICAITONS,
  REQUEST_READ_ALL_NOTIFI,
  REQUEST_CHANGE_STATUS_NOTIFI,
} from './ApiUrl';

export async function requestNotifications(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_NOTIFICAITONS,
    params,
    dispatch,
    'Lỗi khi lấy danh sách thông báo',
  );
  let notificationsData = responsesData?.data || [];
  let totalRecords = responsesData?.pagination?.totalRecords || 0;
  let totalUnread = responsesData?.pagination?.totalUnread || 0;
  await dispatch(
    actions.responseNotifications({
      notificationsData,
      totalRecords,
      totalUnread,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    }),
  );
  return notificationsData;
}

export async function requestReadAllNotifications(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await put(
    REQUEST_READ_ALL_NOTIFI,
    params,
    dispatch,
    'Lỗi khi thực hiện đọc thông báo',
  );
  await dispatch(actions.setReadedAll(true));
  // return true;
}

export async function requestChangeStatusNotifi(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await put(
    REQUEST_CHANGE_STATUS_NOTIFI(params),
    params,
    dispatch,
    'Lỗi khi thực hiện thay đổi trạng thái thông báo',
  );

  if (params.status === 1) {
    await dispatch(actions.setDataReadedNotifi(responsesData));
  }
  return true;
}

export default {
  requestNotifications,
  requestChangeStatusNotifi,
  requestReadAllNotifications,
};
