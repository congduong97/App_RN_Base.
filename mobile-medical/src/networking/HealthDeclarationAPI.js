import actions from "../redux/actions";
import { get, post, isSuccess, isCheckError400, deleteAPI } from "./ApiHelper";

const GET_QUESTION_LIST = "api/public/medical-declaration-infos/questions";
const SEND_HEALTH_DECLARATION = "api/medical-declaration-infos";
const GET_HEALTH_DECLARATION_LIST = "api/medical-declaration-infos/user";
const REMOVE_HEALTH_DECLARATION = "/api/medical-declaration-infos/";

export async function requestGetHealthQuestionList(dispatch, params) {
  let responsesData = await get(
    GET_QUESTION_LIST,
    params,
    dispatch,
    "Lỗi khi lấy danh sách câu hỏi"
  );
  await dispatch(actions.responseHealthQuestionList(responsesData?.data || []));
  return responsesData?.data || [];
}

export async function requestSendHealthDeclaration(dispatch, body) {
  dispatch(actions.showLoading());
  let responsesData = await post(
    SEND_HEALTH_DECLARATION,
    body,
    dispatch,
    "Lỗi gửi tờ khai y tế"
  );

  if (isSuccess(responsesData?.status)) {
    await requestGetHealthDeclarationList(dispatch);
  } else if (
    isCheckError400(responsesData?.data?.status, responsesData?.data?.errorKey)
  ) {
  }
  dispatch(actions.hideLoading());
  return isSuccess(responsesData?.status);
}

export async function requestRemoveHealthDeclaration(dispatch, params) {
  console.log("params", params);
  dispatch(actions.showLoading());
  let responsesData = await deleteAPI(
    REMOVE_HEALTH_DECLARATION + `${params}`,
    {},
    dispatch,
    "Lỗi xóa tờ khai y tế"
  );
  console.log("responsesData Xóa tờ khai ý tế:", responsesData);
  dispatch(actions.hideLoading());
  return responsesData?.status;
}

export async function requestGetHealthDeclarationList(dispatch, params) {
  params?.isReloadData && dispatch(actions.showLoading());
  let responsesData = await get(
    GET_HEALTH_DECLARATION_LIST,
    params,
    dispatch,
    "Lỗi khi lấy danh sách tờ khai y tế"
  );

  let healthDeclarationData = responsesData?.data || [];
  let totalRecords = responsesData?.headers["x-total-count"] || 0;

  await dispatch(
    actions.responseHealthDeclarationList({
      healthDeclarationData,
      totalRecords,
      isReloadData: params?.isReloadData || false,
      currentPage: params?.page || 0,
      sizePage: params?.size || 30,
    })
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export default {
  requestGetHealthQuestionList,
  requestSendHealthDeclaration,
  requestGetHealthDeclarationList,
  requestRemoveHealthDeclaration,
};
