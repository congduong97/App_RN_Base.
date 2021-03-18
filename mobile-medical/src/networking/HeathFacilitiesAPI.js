import actions from "../redux/actions";
import { post, get, requestALl, isSuccess } from "./ApiHelper";
import models from "../models";

const SEARCH_HEATH_FACILITIES = "api/health-facilities";
const GET_HOSPITAL_WOKING_DATE = "api/doctor-schedules/hospital/calendar-valid";
const GET_HOSPITAL_WOKING_TIME =
  "api/doctor-schedules/hospital/calendar-period-valid";
const GET_MEDICAL_SPECIALIZATION = (heathFacilitiesId) =>
  `api/medical-specialities/health-facility/${heathFacilitiesId}`;
const REQUEST_HEATH_FACI_PROCESS_FEEDBACKS =
  "api/health-facilities/parent-and-this/";
const REQUEST_HEATH_FACILITIES_SEARCH =
  "api/health-facilities/search";
//Danh sách đơn vị xử lý phản hồi
const REQUEST_HEATH_FACILITIES_PARENT_AND_THIS =
  `api/health-facilities/parent-and-this/`;

export async function requestHeathFacilities(dispatch, params) {
  let responsesData = await get(
    SEARCH_HEATH_FACILITIES,
    params,
    dispatch,
    "Lỗi khi lấy danh Cơ sở Y tế"
  );

  await dispatch(actions.responseHeathFacilities(responsesData?.data || []));
  return responsesData?.data || [];
}

export async function requestDataHeathFacilities(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_HEATH_FACILITIES,
    params,
    dispatch,
    "Lỗi khi lấy danh Cơ sở Y tế"
  );

  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function getMedicalSpecialization(dispatch, params) {
  let responsesData = await get(
    GET_MEDICAL_SPECIALIZATION(params),
    {},
    dispatch,
    "Lỗi khi lấy danh Cơ sở Y tế"
  );
  await dispatch(
    actions.responseMedicalSpecialization(responsesData?.data || [])
  );
  return true;
}

export async function requestHospitalWorkingDate(dispatch, params) {
  let responsesData = await get(
    GET_HOSPITAL_WOKING_DATE,
    params,
    dispatch,
    "Lỗi khi lấy Thời gian làm việc của bệnh viện trong tháng"
  );
  // await dispatch(
  //   actions.responseMedicalSpecialization(responsesData?.data || [])
  // );
  return true;
}
export async function requestHospitalWorkingTime(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    GET_HOSPITAL_WOKING_TIME,
    params,
    dispatch,
    "Lỗi khi lấy Thời gian làm việc của bệnh viện trong ngày"
  );
  dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return false;
}

export async function getHeathFaciProcessFeedback(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_HEATH_FACI_PROCESS_FEEDBACKS + `${params}`,
    {},
    dispatch,
    "Lỗi khi lấy danh Cơ sở Y tế"
  );
  await dispatch(
    actions.responseHeathFaciProcessFeeback(responsesData?.data || [])
  );
  dispatch(actions.hideLoading());
  return true;
}

export async function requestHealthFaclitiesSearch(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_HEATH_FACILITIES_SEARCH,
    params,
    dispatch,
    "Lỗi khi thực hiện lấy danh sách cơ sở Y Tế"
  );
  // await dispatch(
  //   actions.responseHeathFaclitiesSearch(responsesData?.data || [])
  // );
  dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return true;
}

export async function requestHealthFaclitiesSearchLoadMode(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_HEATH_FACILITIES_SEARCH,
    params,
    dispatch,
    "Lỗi khi thực hiện lấy danh sách cơ sở Y Tế"
  );
  // await dispatch(
  //   actions.responseHeathFaclitiesSearch(responsesData?.data || [])
  // );
  let heathFaclitiesData = responsesData?.data || [];
  let totalRecords = responsesData?.data?.length || 0
  await dispatch(
    actions.responseHeathFaclitiesSearchLoadMode({
      heathFaclitiesData,
      totalRecords,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    })
  );
  dispatch(actions.hideLoading());
  // if (isSuccess(responsesData?.status)) {
  //   return responsesData?.data;
  // }
  return true;
}

export async function requestHealthFaclitiesParentAndThis(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_HEATH_FACILITIES_PARENT_AND_THIS + `${params}`,
    {},
    dispatch,
    "Lỗi khi thực hiện lấy danh sách cơ sở Y Tế"
  );
  // await dispatch(
  //   actions.responseHeathFaclitiesSearch(responsesData?.data || [])
  // );
  dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return true;
}

export default {
  requestHeathFacilities, /// Lay danh sach Co SO YT DLK
  getMedicalSpecialization,
  requestHospitalWorkingDate, // Lay ngay lam viec trong thang
  requestHospitalWorkingTime, // Lay thoi gian lam viec trong ngay
  getHeathFaciProcessFeedback,
  requestHealthFaclitiesSearch, //Tra cứu cơ sở Y Tế
  requestHealthFaclitiesSearchLoadMode, //Tra cứu cơ sở Y Tế
  requestHealthFaclitiesParentAndThis, //Danh sách đơn vị xử lý phản hồi
  requestDataHeathFacilities,
};
