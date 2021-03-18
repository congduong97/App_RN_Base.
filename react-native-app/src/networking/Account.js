import actions from '../redux/actions';
import {Alert, Platform} from 'react-native';
import {
  SIGN_IN,
  REQUEST_PROFILE_USER,
  REQUEST_CHANGE_PASSWORD,
  SIGN_UP,
} from './ApiUrl';
import {post, get, requestALl, isSuccess, put} from './ApiHelper';
import {getUniqueId} from '../commons/utils/getDeviceId';
import ServicesUpdateComponent from '../services/ServicesUpdateComponent';

export async function requestAccountSignin(dispatch, params) {
  dispatch(actions.showLoading());
  var paramsFormData = new FormData();
  paramsFormData.append('username', params.username);
  paramsFormData.append('password', params.password);
  paramsFormData.append('grant_type', 'password');
  let responseData = await post(
    SIGN_IN,
    paramsFormData,
    dispatch,
    'Lỗi đăng nhập.',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  let status = responseData?.status;
  dispatch(actions.hideLoading());
  if (status && !(await isSuccess(status))) {
    return false;
  }
  await dispatch(actions.saveAccountAuthent(responseData));
  return true;
}

export async function requestSignUp(dispatch, params) {
  dispatch(actions.showLoading());
  var formData = new FormData();
  formData.append('fullName', params.fullName);
  formData.append('phone', params.phone);
  formData.append('email', params.email);
  formData.append('password', params.password);
  formData.append('provinceId', 1);
  formData.append('deviceId', getUniqueId().toString());
  formData.append('districtId', 3);
  formData.append('wardId', 1);
  let responseData = await post(
    SIGN_UP,
    formData,
    dispatch,
    'Lỗi đăng ký tài khoản.',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  console.log(responseData);

  let status = responseData.status;
  if (status && !(await isSuccess(status))) {
    return false;
  }
  return true;
}

//API update thông tin cá nhân trong màn hình cập nhật thông tin:
export async function requestUpdateProfile(dispatch, params) {
  let formData = new FormData();
  for (var key in params) {
    if (params?.[key]) {
      params[key] && formData.append(key, params[key]);
    }
  }
  let response = await put(
    REQUEST_PROFILE_USER,
    formData,
    dispatch,
    'Lỗi không thay đổi được thông tin! Vui lòng thử lại sau.',
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  if (response && response.status == 200) {
    requestAccountInfo(dispatch);
    Alert.alert('Update thông tin thành công!');
  } else {
    Alert.alert('Có lỗi sảy ra vui lòng thử lại sau!');
  }
}

export async function requestAccountInfo(dispatch) {
  dispatch(actions.showLoading());
  let responsesData = await get(
    REQUEST_PROFILE_USER,
    {},
    dispatch,
    'Lỗi khi lấy thông tin người dùng',
  );
  await dispatch(actions.saveAccountInfo(responsesData?.data || []));
  return true;
}

export async function requestChangepassword(dispatch, params) {
  dispatch(actions.showLoading());
  let responsesData = await post(
    REQUEST_CHANGE_PASSWORD,
    params,
    dispatch,
    'Lỗi khi thay đổi mật khẩu',
  );
  return responsesData.status === 200;
}

export async function requestSingOut(dispatch, params) {
  await dispatch(actions.signOut());
  return true;
}

export default {
  requestAccountSignin,
  requestAccountInfo,
  requestChangepassword,
  requestSingOut,
  requestSignUp,
  requestUpdateProfile,
};
