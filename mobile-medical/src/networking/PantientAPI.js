import actions from "../redux/actions";

import {
  post,
  get,
  deleteAPI,
  put,
  requestALl,
  isSuccess,
  isCheckError400,
  showAlert,
} from "./ApiHelper";
import models from "../models";

const REQUEST_BOOK_BYDAY = "api/doctor-appointments-mobile";
const REQUEST_BOOK_BYDAY_UPDATE = "api/doctor-appointments/update";
const SEARCH_HEATH_FACILITIES = "api/health-facilities";
const REQUEST_CREATE_PATIENT_RECORD = "api/patient-records";
const REQUEST_DELETE_PATIENT_RECORD = "/api/patient-records/";
const REQUEST_CHECK_USERS_BLOCKED = "/api/users/blocked";
const CHECK_BAO_HIEM_Y_TE = `api/public/baohiemyte/`;
// const CHECK_BAO_HIEM_Y_TE = (baoHiemYTe) =>
//   `api/public/baohiemyte/${baoHiemYTe}`;

const dataBaoHiemYTe = {
  Invalid: "invalid",
  Expired: "expired",
  lessthan30days: "lessthan30days",
  valid: "valid",
  than30days: "than30days",
  wrong_information: "wrong_information",
};
export const SEARCH_PATIENT_RECORDS = "api/mobile/patient-records/user";

export async function requestPatientsRecords(dispatch, params) {
  let responsesData = await get(
    SEARCH_PATIENT_RECORDS,
    params,
    dispatch,
    "Lỗi khi thay lấy danh sách hồ sơ "
  );
  await dispatch(actions.responsePatientRecords(responsesData.data));
  return isSuccess(responsesData.status);
}

export async function searchDataPatientsRecords(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    SEARCH_PATIENT_RECORDS,
    params,
    dispatch,
    "Lỗi khi thay lấy danh sách hồ sơ "
  );
  dispatch(actions.hideLoading());
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || false;
  }

  return false
}

export async function requestSearchPatientsRecords(dispatch, params) {
  let responsesData = await get(
    SEARCH_PATIENT_RECORDS,
    params,
    dispatch,
    "Lỗi khi thay lấy danh sách hồ sơ "
  );
  let patientRecordsData = responsesData.data;
  console.log("responsesData.data:    ", responsesData.data);
  let totalRecords = responsesData.headers["x-total-count"];
  await dispatch(
    actions.responseSearchPatientRecords({
      patientRecordsData,
      isReloadData: params.isReloadData,
      currentPage: params.page,
      sizePage: params.size,
      totalRecords: totalRecords || 0,
    })
  );
  return responsesData.status === 200;
}

export async function requestBookByDay(dispatch, params) {
  let responsesData = await post(
    REQUEST_BOOK_BYDAY,
    params,
    dispatch,
    "Lỗi khi thực hiện đặt lịch khám "
  );
  return responsesData?.data || [];
}

export async function requestBookByDayUpdate(dispatch, params) {
  let responsesData = await put(
    REQUEST_BOOK_BYDAY_UPDATE,
    params,
    dispatch,
    "Lỗi khi thực hiện đặt lại lịch khám "
  );
  console.log("responsesData?.data:   ", responsesData?.data);
  if (isSuccess(responsesData?.status)) {
    return responsesData?.data || false;
  }

  return false;
}

export async function requestCreatePatientRecord(dispatch, params) {
  console.log("check requestCreatePatientRecord", params);
  dispatch(actions.showLoading());
  var formData = new FormData();
  for (var key in params) {
    params[key] && formData.append(key, params[key]);
  }
  let responsesData = "";
  let title = "";
  if (params.id) {
    title = "Cập nhật hồ sơ sức khỏe"
    responsesData = await put(
      REQUEST_CREATE_PATIENT_RECORD,
      formData,
      dispatch,
      "Lỗi khi Cập nhật hồ sơ sức khoẻ"
    );
  } else {
    title = "Tạo hồ sơ sức khỏe"
    responsesData = await post(
      REQUEST_CREATE_PATIENT_RECORD,
      formData,
      dispatch,
      "Lỗi khi thực hiện Tạo hồ sơ sức khoẻ"
    );
  }
  console.log("responsesData", responsesData?.data);
  if (isSuccess(responsesData?.status)) {
    await requestPatientsRecords(dispatch);
  } else if (
    isCheckError400(
      responsesData?.data?.status,
      responsesData?.data?.errorKey,
      title
    )
  ) {
    dispatch(actions.hideLoading());
    return null;
  }
  dispatch(actions.hideLoading());
  // await dispatch(actions.saveHeathFacilities(responsesData || []));
  return isSuccess(responsesData?.status);
}
export async function requestDeletePatientRecord(dispatch, params) {
  console.log("params", params);
  dispatch(actions.showLoading());
  let responsesData = await deleteAPI(
    REQUEST_DELETE_PATIENT_RECORD + `${params}`,
    {},
    dispatch,
    "Lỗi khi thực hiện xoá hồ sơ sức khoẻ"
  );
  console.log("responsesData", responsesData);
  if (isSuccess(responsesData?.status)) {
    await requestPatientsRecords(dispatch);
  } else if (isCheckError400(responsesData?.data?.status, responsesData?.data?.errorKey, "Lỗi - Hồ sơ bệnh nhân")) {
    dispatch(actions.hideLoading());
    return null;
  }
  dispatch(actions.hideLoading());
  return isSuccess(responsesData?.status);
}

export async function requestCheckUserBlocked(dispatch) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_CHECK_USERS_BLOCKED,
    {},
    dispatch,
    "Lỗi khi kiểm tra tài khoản user"
  );
  if (isSuccess(responsesData?.status)) {
    console.log("responsesData?.data:    ", responsesData?.data)
    return responsesData?.data
  }
  dispatch(actions.hideLoading());
  return false;
}

export async function checkBaoHiemYTePantient(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    CHECK_BAO_HIEM_Y_TE,
    params,
    dispatch,
    "Lỗi khi Kiểm tra bảo hiểm y tế"
  );

  dispatch(actions.hideLoading());
  console.log("responsesData?.data:   ", responsesData?.data);
  if (responsesData?.data) {
    // if (responsesData?.data?.code == dataBaoHiemYTe.lessthan30days) {
    if (responsesData?.data?.code == dataBaoHiemYTe.valid) {
      return {
        message:
          "Thời hạn bảo hiểm y tế của bạn hết hạn vào ngày " +
          responsesData?.data?.ngayKT,
        isCheck: true,
      };
    } else if (responsesData?.data?.code == dataBaoHiemYTe.Expired) {
      return {
        message: "Mã bảo hiểm y tế bạn đã hết hạn",
        isCheck: false,
      };
    } else if (responsesData?.data?.code == dataBaoHiemYTe.Invalid) {
      return {
        message: "Mã bảo hiểm y tế bạn không tồn tại",
        isCheck: false,
      };
    } else if (responsesData?.data?.code == dataBaoHiemYTe.wrong_information) {
      return {
        message: "Thông tin thẻ BHYT của bạn không đúng lắm. vui lòng đảm bảo Họ tên, Ngày sinh của bạn đã khai báo trùng với thông tin trên thẻ",
        isCheck: false,
      };
    }
    return {
      message: "",
      isCheck: true,
    };
  }
}

export default {
  requestSearchPatientsRecords,
  requestBookByDay,
  requestCreatePatientRecord,
  requestDeletePatientRecord,
  checkBaoHiemYTePantient,
  requestBookByDayUpdate,
  requestCheckUserBlocked,
  searchDataPatientsRecords
};
