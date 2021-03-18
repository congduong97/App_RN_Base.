import actions from "../redux/actions";

import { post, get, requestALl, isSuccess, put, showAlert } from "./ApiHelper";
import models from "../models";
import Toast from "react-native-simple-toast";

export const GET_EXAMINATION_CARD_INFO = "api/doctor-appointments/";
export const GET_EXAMINATION_MEDICAL_RESULTS = "api/medical-results/suggestion";
export const GET_MEDICAL_SPECIFIC_DOCTOR_APPINTMENT = "api/medical-results/specific-doctor-appointment";
export const GET_PHONE_OLD_APPOINTMENT = (appointmentCode) => `api/medical-results/old-appointment-code/${appointmentCode}/patient-phone`;
export const API_RESPONSE_DOCTOR_APPOINTMENT = "api/medical-results/exist-doctor-appointment";
export const API_RESPONSE_PATIENT_RECORD = "api/doctor-appointments/patient-record/";

export async function getExaminationCardInfo(dispatch, params) {
  let responsesData = await get(
    `${GET_EXAMINATION_CARD_INFO}${params}`,
    {},
    dispatch,
    "Lỗi khi lấy thông tin Phiếu khám"
  );
  return responsesData?.data || [];
}

export async function getMedialSpecificDoctorAppintment(dispatch, params) {
  dispatch(actions.showLoading())
  let responsesData = await get(
    GET_MEDICAL_SPECIFIC_DOCTOR_APPINTMENT,
    params,
    dispatch,
    "Lỗi khi lấy thông tin kết quả khám bệnh"
  );
  dispatch(actions.hideLoading())
  return responsesData?.data || [];
}
export async function getPhoneOldAppoinment(dispatch, params) {
  console.log("responsesData?.data:    ", GET_PHONE_OLD_APPOINTMENT(params))
  let responsesData = await get(
    GET_PHONE_OLD_APPOINTMENT(params),
    {},
    dispatch,
    "Lỗi khi lấy số điện thoại kết quả khám bệnh"
  );
  console.log("responsesData?.data:    ", responsesData?.data)
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || null;
  }
  return null
}

export async function responseDoctorAppointment(dispatch, params) {
  dispatch(actions.showLoading())
  let responsesData = await get(
    API_RESPONSE_DOCTOR_APPOINTMENT,
    params,
    dispatch,
    "Lỗi khi lấy thông tin kết quả khám bệnh"
  );
  dispatch(actions.hideLoading())
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || [];
  }
  // else {
  //   Toast.showWithGravity(
  //     "Mã bệnh nhân hoặc họ trên bệnh nhân không tồn tại. Vui lòng kiểm tra lại.",
  //     Toast.LONG,
  //     Toast.CENTER
  //   );
  // }
}

export async function responsePatientRecord(dispatch, params) {
  dispatch(actions.showLoading())
  let responsesData = await get(
    `${API_RESPONSE_PATIENT_RECORD}${params}`,
    {},
    dispatch,
    "Lỗi khi lấy thông tin mã lần khám"
  );
  dispatch(actions.hideLoading())
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || [];
  }
}

export async function responsesDataMediacalResults(dispatch, params) {
  !params.isLoadding && dispatch(actions.showLoading())
  let responsesData = await get(
    `${GET_EXAMINATION_MEDICAL_RESULTS}`,
    params,
    dispatch,
    "Lỗi khi lấy thông tin gợi ý mã bệnh nhân"
  );
  !params.isLoadding && dispatch(actions.hideLoading())
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || [];
  }
  return []
}

export async function getCancelAppointment(dispatch, params) {
  dispatch(actions.showLoading())
  let responsesData = await put(
    `${GET_EXAMINATION_CARD_INFO}${params}/cancel`,
    {},
    dispatch,
    "Hủy Phiếu khám không thành công"
  );
  dispatch(actions.hideLoading())
  console.log("responsesData:    ", responsesData?.data)
  if (responsesData?.data?.errorKey == 'over_time_allowed_cancel') {
    showAlert("Hủy lịch khám", "Đã hết thời gian được phép hủy lịch khám")
    return null
  }
  if (isSuccess(responsesData?.status)) {
    return true
  }
  return false
}

export default {
  getExaminationCardInfo,
  getMedialSpecificDoctorAppintment,
  responseDoctorAppointment,
  responsePatientRecord,
  getCancelAppointment,
  responsesDataMediacalResults,
  getPhoneOldAppoinment
};
