import {get, requestALl} from './ApiHelper';
import * as actions from '../redux/actions/Commons';
import {OrderStatusRequest} from '../models/ConfigsData';
import models from '../models';
import {requestAccountInfo} from './Account';
import {handleRequestOrder} from './Order';
import {requestNotifications} from './Notifications';
import {
  GET_SIM_CATEGORIES,
  GET_PROVINCES,
  GET_DISTRICTS,
  GET_WARDS,
} from './ApiUrl';

//Lay danh loai
async function requestSimCategory(dispatch) {
  let responsesData = await get(
    GET_SIM_CATEGORIES,
    {},
    dispatch,
    'Lỗi khi lấy danh mục SIM',
  );
  await dispatch(actions.saveSimCategories(responsesData?.data || []));
  return responsesData?.data || [];
}
async function requestProvinces(dispatch) {
  let responsesData = await get(
    GET_PROVINCES,
    {},
    dispatch,
    'Lỗi khi lấy danh sách Tỉnh/ Thành',
  );
  await models.saveProvincesData(responsesData?.data || []);
  return responsesData?.data || [];
}

async function requestDistricts(dispatch) {
  let responsesData = await get(
    GET_DISTRICTS,
    {},
    dispatch,
    'Lỗi khi lấy danh sách Quận/ Huyện',
  );
  await models.saveDistrictsData(responsesData?.data || []);
  return responsesData?.data || [];
}

async function requestWards(dispatch) {
  let responsesData = await get(
    GET_WARDS,
    {},
    dispatch,
    'Lỗi khi lấy danh Phường/Xã',
  );
  await models.saveWardsData(responsesData?.data || []);
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
      requestSimCategory(dispatch), /// lay danh muc Catategories
      requestProvinces(dispatch), /// lay danh sach Tinh THanhÏ
      requestDistricts(dispatch), /// lay danh sach Quan Huyen
      requestWards(dispatch), /// Lay danh sach Phuong xa
    ],
    dispatch,
  )
    .then((responses) => {
      return true;
    })
    .catch((errors) => {
      console.log('requestDataAppLaunch -> errors', errors);
      return false;
    });
  isDone && dispatch(actions.synchronizedFirstData(true));
  dispatch(actions.hideLoading());
}

export async function requestDataAfterAuthent(dispatch, params) {
  dispatch(actions.showLoading());
  let isDone = await requestALl(
    [
      requestAccountInfo(dispatch),
      handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART),
    ],
    dispatch,
  )
    .then((responses) => {
      return true;
    })
    .catch((errors) => {
      return false;
    });
  dispatch(actions.hideLoading());
  return isDone;
}

export default {
  requestDataAppLaunch,
  requestDataAfterAuthent,
};
