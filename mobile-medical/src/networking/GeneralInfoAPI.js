import actions from "../redux/actions";

import { post, get, requestALl, isSuccess } from "./ApiHelper";
import models from "../models";

const REQUEST_HISTORY_ACTIVITY = "/api/activity-log/diary";

export async function getDataHistoryActivity(dispatch) {
  let responsesData = await get(
    REQUEST_HISTORY_ACTIVITY,
    {},
    dispatch,
    "Lỗi khi lấy thông tin nhật ký hoạt động"
  );
  if(isSuccess(responsesData?.status)) {
    return responsesData?.data
  }
}

export default {
    getDataHistoryActivity
};
