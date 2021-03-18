import actions from "../redux/actions";
import { post, get, requestALl, isSuccess, showAlertError } from "./ApiHelper";
import models from "../models";
const SEARCH_DOCTORS = (medicalSpecialityId) =>
  `api/doctors/health-facility/${medicalSpecialityId}`;
const SEARCH_DOCTOR = "api/doctors";
const SEARCH_DOCTOR_TIME_SELECTED = "/api/doctors/time-selected";
const GET_FEEDBACKS_DOCTOR = "api/doctor-feedback";
const SENT_FEEDBACKS_DOCTOR = "api/doctor-feedback";
const GET_ACADEMICS = "/api/academics";
const GET_HEALTH_FACILITIES = "/api/health-facilities";
const SEASRCH_DOCOTRS_IN_APPOINTMENT_DOCTOR = "/api/doctors/in-thirty-days";
const GET_DOCTOR_WOKING_TIME = `/api/doctor-schedules/doctor/calendar-period-valid`;
const GET_DOCTOR_TERM_OF_USE = `/api/public/configs/term-of-use`;
const REQUEST_MEDICAL_SERVICES = "api/medical-services";
const GET_HOSPITAL_WOKING_TIME_DOCTOR = "api/doctor-schedules/doctor/calendar-period-valid";
const GET_SPECIALIZATION = (medicalSpecialityId) =>
  `api/medical-specialities/health-facility/${medicalSpecialityId}`;
const REQUEST_DATA_CLINICS = (medicalSpecialityId) =>
  `api/clinics/health-facility/${medicalSpecialityId}`;
const GET_DOCTOR_CALENDAR = (idDoctor) =>
  `api/doctor-schedules/doctor/${idDoctor}/calendar`;
const GET_PATIENT_RECORD = (healthFacilityId) =>
  `api/doctor-appointments/patient-record/${healthFacilityId}`;
const GET_CHECK_OLD_APPOINTMENT_CODE = (existsOldAppointment) =>
  `api/doctor-appointments/exists-old-appointment/${existsOldAppointment}`;
const CHECK_BAO_HIEM_Y_TE = `api/public/baohiemyte/`;
// const CHECK_BAO_HIEM_Y_TE = (baoHiemYTe) =>
//   `api/public/baohiemyte/${baoHiemYTe}`;

const dataBaoHiemYTe = {
  "Invalid": "invalid",
  "Expired": "expired",
  "lessthan30days": "lessthan30days",
  "than30days": "than30days",
  "valid": "valid",
}

export async function searchDoctorsSpeciality(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_DOCTORS(params.medicalSpecialityId),
    {},
    dispatch,
    "Lỗi khi lấy danh sác bác sỹ "
  );
  // await dispatch(actions.saveHeathFacilities(responsesData || []));
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function searchDoctors(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_DOCTOR,
    params,
    dispatch,
    "Lỗi khi lấy danh Bác sỹ"
  );

  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function searchDoctorsLoadMode(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_DOCTOR,
    params,
    dispatch,
    "Lỗi khi lấy danh Bác sỹ"
  );
  let doctorsData = responsesData?.data || [];
  let totalRecords = responsesData?.data?.length || 0
  
  await dispatch(
    actions.responseDataDoctor({
      doctorsData,
      totalRecords,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
    })
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function searchDoctorsTimeSelected(dispatch, params, isLoadding = true) {
  if (isLoadding) dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_DOCTOR_TIME_SELECTED,
    params,
    dispatch,
    "Lỗi khi lấy danh Bác sỹ"
  );

  if (isLoadding) dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return [];
}

export async function searchDoctorsInAppointmentDoctor(dispatch, params, isLoadding = true) {
  if (isLoadding) dispatch(actions.showLoading());
  let responsesData = await get(
    SEASRCH_DOCOTRS_IN_APPOINTMENT_DOCTOR,
    params,
    dispatch,
    "Lỗi khi lấy danh Bác sỹ"
  );

  if (isLoadding) dispatch(actions.hideLoading());
  console.log("responsesData?.data:   ", responsesData?.data)
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return [];
}

export async function getDoctorFeedbacks(dispatch, params) {
  let responsesData = await get(
    GET_FEEDBACKS_DOCTOR,
    params,
    dispatch,
    "Lỗi khi lấy danh sách nhận xét"
  );
  return responsesData?.data || [];
}

export async function sentFeedbackDoctor(dispatch, params) {
  let responsesData = await post(
    SENT_FEEDBACKS_DOCTOR,
    params,
    dispatch,
    "Lỗi khi gửi nhận xét"
  );

  return responsesData?.data || {};
}

export async function getAcademics(dispatch, params) {
  let responsesData = await get(
    GET_ACADEMICS,
    params,
    dispatch,
    "Lỗi khi Lấy danh sách học hàm học vị"
  );

  return responsesData?.data || {};
}

export async function getCoSoYTe(dispatch, params) {
  let responsesData = await get(
    GET_HEALTH_FACILITIES,
    params,
    dispatch,
    "Lỗi khi Lấy danh sách cơ sở y tế"
  );

  return responsesData?.data || {};
}

export async function getSpecialities(dispatch, id, params, isLoadding = true) {
  if (isLoadding) dispatch(actions.showLoading());
  let responsesData = await get(
    GET_SPECIALIZATION(id),
    params,
    dispatch,
    "Lỗi khi Lấy danh sách chuyên khoa"
  );

  if (isLoadding) dispatch(actions.hideLoading());
  return responsesData?.data || {};
}

export async function requestDataClinics(dispatch, id, params, isLoadding = true) {
  if (isLoadding) dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_DATA_CLINICS(id),
    params,
    dispatch,
    "Lỗi khi Lấy danh sách phòng khám"
  );

  if (isLoadding) dispatch(actions.hideLoading());
  return responsesData?.data || {};
}

export async function getPatientRecords(dispatch, healthFacilityId) {
  // dispatch(actions.showLoading());
  let responsesData = await get(
    GET_PATIENT_RECORD(healthFacilityId),
    {
      
    },
    dispatch,
    "Lỗi khi Lấy danh sách mã phiếu khám cũ"
  );

  // dispatch(actions.hideLoading());
  return responsesData?.data || {};
}

export async function checkExistsOldAppointment(dispatch, existsOldAppointment) {
  // dispatch(actions.showLoading());
  let responsesData = await get(
    GET_CHECK_OLD_APPOINTMENT_CODE(existsOldAppointment),
    {},
    dispatch,
    "Lỗi khi kiểm tra mã phiếu khám cũ"
  );

  // dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return false;
}

export async function getMaLanKhamCu(dispatch, healthFacilityId, params) {
  // dispatch(actions.showLoading());
  let responsesData = await get(
    GET_PATIENT_RECORD(healthFacilityId),
    params,
    dispatch,
    "Lỗi khi Lấy danh sách mã phiếu khám cũ"
  );

  // dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return [];
}

export async function requestDataMedicalServices(dispatch, params) {
  let responsesData = await get(
    REQUEST_MEDICAL_SERVICES,
    params,
    dispatch,
    "Lỗi khi lấy danh sách dịch vụ khám"
  );
  return responsesData?.data || {};
}

export async function checkBaoHiemYTe(dispatch, params, isLoading = true) {
  if (isLoading) dispatch(actions.showLoading());
  let responsesData = await get(
    CHECK_BAO_HIEM_Y_TE,
    params,
    dispatch,
    "Lỗi khi Kiểm tra bảo hiểm y tế"
  );

  if (isLoading) dispatch(actions.hideLoading());
  let message = "true"
  console.log("responsesData?.data:   ", responsesData?.data)
  if (responsesData?.data) {
    if (responsesData?.data?.code == dataBaoHiemYTe.Invalid) {
      message = "Bảo hiểm y tế của bạn không tồn tại"
    } else if (responsesData?.data?.code == dataBaoHiemYTe.Expired) {
      message = "Bảo hiểm y tế của bạn đã hết hạn"
    }
  }
  return message;
}

export async function getDataBaoHiemYTe(dispatch, params) {
  let responsesData = await get(
    CHECK_BAO_HIEM_Y_TE,
    params,
    dispatch,
    "Lỗi khi Kiểm tra bảo hiểm y tế"
  );

  if (responsesData?.data) {
    if (responsesData?.data?.code == dataBaoHiemYTe.valid) {
      return responsesData?.data
    }
  }
  return [];
}

export async function requestDoctorWorkingTime(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    GET_DOCTOR_WOKING_TIME,
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

export async function requestHospitalWorkingTimeDoctor(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    GET_HOSPITAL_WOKING_TIME_DOCTOR,
    params,
    dispatch,
    "Lỗi khi lấy Thời gian làm việc của bệnh viện trong ngày"
  );
  dispatch(actions.hideLoading());
  console.log("responsesData?.data:    ", responsesData?.data)
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;
  }
  return false;
}

export async function requestTermOfUse(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    GET_DOCTOR_TERM_OF_USE,
    params,
    dispatch,
    "Lỗi khi lấy Cam kết bảo mật kết quả"
  );
 
  dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data;

  }
  return false;
}

export async function getDoctorCalendar(dispatch, params) {
  let responsesData = await get(
    GET_DOCTOR_CALENDAR(params),
    {},
    dispatch,
    "Lỗi khi check giờ làm việc của bác sỹ"
  );
 
  if (isSuccess(responsesData?.status)) {
    return true;

  }
  return false;
}

export default {
  searchDoctorsSpeciality,
  searchDoctors,
  searchDoctorsLoadMode,
  searchDoctorsTimeSelected,
  searchDoctorsInAppointmentDoctor, /// lay danh sach bac si co lich trong 30 ngay
  requestDoctorWorkingTime, /// lay danh sach bac si co lich trong 30 ngay
  getDoctorFeedbacks,
  sentFeedbackDoctor,
  getAcademics,
  getSpecialities,
  getCoSoYTe,
  checkBaoHiemYTe,
  requestTermOfUse,
  getPatientRecords,
  requestDataMedicalServices,
  requestHospitalWorkingTimeDoctor,
  getMaLanKhamCu,
  checkExistsOldAppointment,
  getDoctorCalendar,
  getDataBaoHiemYTe,
  requestDataClinics,
};
