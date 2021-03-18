import actions from "../redux/actions";

import { post, get, requestALl, isSuccess } from "./ApiHelper";
import models from "../models";

const REQUEST_FEEDBACKS = "api/feedbacks";
const REQUEST_SEND_FEEDBACKS = "api/feedbacks";
const CONFIRM_FEEDBACK = "/api/feedbacks/confirm";
const GET_FEEDBACK_DETAIL = (medicalSpecialityId) =>
  `api/feedbacks/${medicalSpecialityId}`;

export async function requestFeedbacks(dispatch, params) {
  params?.isReloadData && dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_FEEDBACKS,
    {
      ...params, ...{
        "isMobile": 1,
      }
    },
    dispatch,
    "Lỗi khi thay lấy danh góp ý"
  );
  let feedbacksData = responsesData?.data || [];
  let totalRecords = responsesData.headers["x-total-count"] || 0;
  await dispatch(
    actions.responseFeedbacks({
      feedbacksData,
      totalRecords,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    })
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function sendFeedbackHeathFacilities(
  dispatch,
  { file, ...params }
) {
  dispatch(actions.showLoading());
  var formData = new FormData();
  for (var key in params) {
    params[key] && formData.append(key, params[key]);
  }
  for (var index in file) {
    formData.append("file", file[index]);
  }

  let responsesData = "";
  responsesData = await post(
    REQUEST_SEND_FEEDBACKS,
    formData,
    dispatch,
    "Lỗi khi Tạo góp ý"
  );
  // console.log("SENT_FEEDBACK_HEATHY", responsesData);

  dispatch(actions.hideLoading());
  return isSuccess(responsesData?.status);
}

export async function confirmFeedback(dispatch, params) {
  let responsesData = await post(
    CONFIRM_FEEDBACK,
    params,
    dispatch,
    "Lỗi khi gửi nhận xét"
  );

  console.log("responsesData", responsesData);
  return responsesData?.data || {};
}

export async function getFeedbackDetail(dispatch, id) {
  let responsesData = await get(
    GET_FEEDBACK_DETAIL(id),
    {},
    dispatch,
    "Lỗi khi lấy nhận xét"
  );

  return responsesData?.data || {};
}

export default {
  requestFeedbacks,
  sendFeedbackHeathFacilities,
  confirmFeedback,
  getFeedbackDetail,
};
