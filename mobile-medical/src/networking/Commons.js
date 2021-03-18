import { get, post, requestALl } from "./ApiHelper";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import actions from "../redux/actions";
import models from "../models";
import { requestAccountInfo } from "./Account";
import { requestHeathFacilities } from "./HeathFacilitiesAPI";
import { requestPatientsRecords } from "./PantientAPI";
import { GET_DISTRICTS, GET_WARDS } from "./ApiUrl";
const REQUEST_SAVE_DEVICE_INFO = "api/device";
const GET_CONFIGS_RELATIONSHIP = "api/public/configs/relationship";
const GET_PROVINCES = "api/public/areas/cities";
const REQUEST_FEEDBACK_TOPICS = "api/topics/list";
const REQUEST_MEDICAL_SERVICES = "api/medical-services";
const REQUEST_COUNT_NOTI_UNREAD = "api/notifications/unread";
const GET_AREA_CHILDREN = (parentCode) =>
  `api/public/areas/${parentCode}/children`;

async function requestProvinces(dispatch) {
  let responsesData = await get(
    GET_PROVINCES,
    {},
    dispatch,
    "Lỗi khi lấy danh sách Tỉnh/ Thành"
  );
  await models.saveProvincesData(responsesData?.data || []);
  return true;
}

async function requestDistricts(dispatch) {
  let responsesData = await get(
    GET_DISTRICTS,
    {},
    dispatch,
    "Lỗi khi lấy danh sách Quận/ Huyện"
  );
  await models.saveDistrictsData(responsesData?.data || []);
  return responsesData?.data || [];
}

async function requestWards(dispatch) {
  let responsesData = await get(
    GET_WARDS,
    {},
    dispatch,
    "Lỗi khi lấy danh Phường/Xã"
  );
  await models.saveWardsData(responsesData?.data || []);
  return responsesData?.data || [];
}

async function requestAreaChildren(dispatch, params) {
  let responsesData = await get(
    GET_AREA_CHILDREN(params),
    {},
    dispatch,
    "Lỗi khi lấy thông tin khu vực"
  );
  return responsesData?.data || [];
}

/**
 * request lay cac thong tin khi khoi tao app
 * @param {*} dispatch
 * @param {*} params
 */
async function requestDataAppLaunch(dispatch, params) {
  dispatch(actions.showLoading());
  let isDone = await requestALl(
    [
      // neu da login thi lay thong tin tai khoan
      models.isLoggedIn() && requestDataAfterAuthent(dispatch),
      requestProvinces(dispatch), /// lay danh sach Tinh THanh
      // requestDistricts(dispatch), /// lay danh sach Quan Huyen
      // requestWards(dispatch), /// Lay danh sach Phuong xa
    ],
    dispatch
  )
    .then((responses) => {
      return true;
    })
    .catch((errors) => {
      console.log("requestDataAppLaunch -> errors", errors);
      return false;
    });
  isDone && dispatch(actions.synchronizedFirstData(true));
  dispatch(actions.hideLoading());
}

/**
 * request lay cac thong tin khi khoi tao app
 * @param {*} dispatch
 * @param {*} params
 */
async function requestSaveDeviceInfo(dispatch) {
  dispatch(actions.showLoading());
  let fcmToken = await getTokenFirebase();
  let params = {
    uuid: DeviceInfo.getUniqueId(),
    name: DeviceInfo.getDeviceNameSync(),
    firebaseToken: fcmToken,
  };
  let responsesData = await post(
    REQUEST_SAVE_DEVICE_INFO,
    params,
    dispatch,
    "Lỗi khi lưu thông tin thiết bị"
  );
  dispatch(actions.hideLoading());
  return responsesData?.data || [];
}

export async function requestConfigsRelationship(dispatch, params) {
  let responsesData = await get(
    GET_CONFIGS_RELATIONSHIP,
    {},
    dispatch,
    "Lỗi khi lấy danh sách mối quan hệ"
  );
  await models.saveConfigsRelationship(responsesData?.data || []);
  return true;
}

export async function requestFeedbackTopics(dispatch, params) {
  let responsesData = await get(
    REQUEST_FEEDBACK_TOPICS,
    {},
    dispatch,
    "Lỗi khi lấy danh sách Tiêu đề"
  );
  await models.saveTopics(responsesData?.data || []);
  return true;
}
export async function requestMedicalServices(dispatch, params) {
  let responsesData = await get(
    REQUEST_MEDICAL_SERVICES,
    {},
    dispatch,
    "Lỗi khi lấy danh sách dịch vụ khám"
  );
  await models.saveMedicalServicesData(responsesData?.data || []);
  return true;
}

export async function requestCountNotiUnread(dispatch, params) {
  let responsesData = await get(
    REQUEST_COUNT_NOTI_UNREAD,
    params,
    dispatch,
    "Lỗi khi lấy số thông báo chưa đọc"
  );
  let data = responsesData?.data || [];
  console.log(data);
  await dispatch(
    actions.responseCountNotiUnread({
      totalUnread: data
    })
  );
  return responsesData?.data || [];
}

export async function requestDataAfterAuthent(dispatch, params) {
  let isDone = await requestALl(
    [
      requestSaveDeviceInfo(dispatch),
      requestAccountInfo(dispatch),
      requestHeathFacilities(dispatch), // Danh CSYT
      requestPatientsRecords(dispatch),
      requestConfigsRelationship(dispatch),
      requestFeedbackTopics(dispatch),
      requestMedicalServices(dispatch),
      requestCountNotiUnread(dispatch)
    ],
    dispatch
  )
    .then((responses) => {
      return true;
    })
    .catch((errors) => {
      return false;
    });
  return isDone;
}

export default {
  requestDataAppLaunch,
  requestDataAfterAuthent,
  requestSaveDeviceInfo,
  requestAreaChildren,
};

async function getTokenFirebase() {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log("LỗfcmTokeni ", fcmToken);
    return fcmToken;
  } else {
    console.log("Lỗi ", fcmToken);
  }
}
