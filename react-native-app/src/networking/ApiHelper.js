import axios from 'axios';
import commons from '../commons';
import * as URL from './ApiUrl';
import {Alert, Platform} from 'react-native';
import models from '../models';
import * as actions from '../redux/actions/Commons';
export const BASE_URL = URL.BASE_URL;
export const IMAGE_BASE_URL = URL.IMAGE_BASE_URL;
export const AUTHORIZATION_BASIC = 'Basic YXBwMToxMjM0NTY=';

export const ERROR_CODE_REQUEST_SUCCESS = 200;
export const ERROR_CODE_UPDATE_SUCCESS = 201;
export const ERROR_CODE_500 = 500;

export const ERROR_CODE_422 = 422;
export const ERROR_CODE_400 = 400;
export const ERROR_CODE_401 = 401;
export const ERROR_CODE_403 = 403;
export const ERROR_CODE_404 = 404;
export const ERROR_CODE_SUCCESS = [
  ERROR_CODE_REQUEST_SUCCESS,
  ERROR_CODE_UPDATE_SUCCESS,
];

const typeRequest = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    Authorization: AUTHORIZATION_BASIC,
    Accept: 'application/json, text/plain',
  },
});

instance.interceptors.request.use(async (request) => {
  if (models.getTokenSignIn()) {
    request.headers = {
      Authorization: `${models.getTokenType()} ${models.getTokenSignIn()}`,
    };
  }
  return request;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export async function handeResponseError(dispatch, error) {
  let messageError = '';
  if (error.response) {
    let status = error.response.status;
    if (status === ERROR_CODE_500) {
      messageError = 'Có lỗi xảy ra. Vui lòng thử lại.';
    } else if (status === ERROR_CODE_404) {
      messageError = 'Không tồn tại API :\n\n ' + error.response.config.url;
    } else if (status === ERROR_CODE_401) {
      if (models.getTokenSignIn()) {
        models.handleSignOut();
        messageError =
          'Phiên đăng nhập đã hết hạn. Vui lòng khởi động lại ứng dụng và đăng nhập lại';
        // requestSignOut(dispatch)
      } else {
        messageError = 'Lỗi không xác định.';
      }
    } else if (status === ERROR_CODE_400) {
      messageError = 'Lỗi truy xuất thông tin.';
    } else if (status === ERROR_CODE_403) {
      messageError =
        'Bạn không có quyền truy cập chức năng này. Liên hệ hotline để biết thêm thông tin chi tiết.';
    } else {
      messageError = error.response.data && error.response.data;
    }
  } else if (error.request) {
    messageError =
      'Lỗi kết nối với máy chủ. Xin vui lòng kiểm tra lại đường truyền internet';
  } else {
    messageError = 'Xảy ra lỗi: \n' + JSON.stringify(error.message);
  }
  if (messageError) {
    showAlertError(messageError);
  }
}
export async function isSuccess(statusResponse) {
  return ERROR_CODE_SUCCESS.indexOf(statusResponse) > -1;
}

export async function showAlert(titleAlert, contentAlert) {
  setTimeout(() => {
    Alert.alert(titleAlert, contentAlert, [{text: 'Đồng ý'}]);
  }, 1000);
}

export async function showAlertError(contentAlert) {
  showAlert(commons.NAME_APP + ' - Lỗi', contentAlert);
}

async function post(url, params, dispatch, messageError, configs) {
  return request(
    url,
    params,
    dispatch,
    messageError,
    typeRequest.POST,
    configs,
  );
}

async function put(url, params, dispatch, messageError, configs) {
  return request(url, params, dispatch, messageError, typeRequest.PUT, configs);
}
async function get(url, params, dispatch, messageError) {
  return request(url, params, dispatch, messageError, typeRequest.GET);
}
async function deleteAPI(url, params, dispatch, messageError) {
  return request(url, params, dispatch, messageError, typeRequest.DELETE);
}

async function requestALl([...requestAPI], dispatch) {
  let responsesRresult = [];
  await axios
    .all(requestAPI)
    .then(
      axios.spread((...responses) => {
        responsesRresult = responses;
      }),
    )
    .catch((errors) => {
      return errors;
    });
  return responsesRresult;
}

async function request(url, params, dispatch, messageError, type, configs) {
  // dispatch(actions.showLoading());
  try {
    let response = null;

    switch (type) {
      case typeRequest.GET: {
        response = await instance.get(url, {params: params});
        break;
      }
      case typeRequest.POST: {
        response = await instance.post(url, params, configs);
        break;
      }
      case typeRequest.PUT: {
        response = await instance.put(url, params, configs);
        break;
      }
      case typeRequest.DELETE: {
        response = await instance.delete(url, {params: params});
        break;
        0;
      }
      default: {
        return null;
      }
    }
    let status = response.status;
    let responsesData = response.data;
    if (isSuccess(status)) {
      dispatch(actions.hideLoading());
      return responsesData;
    } else {
      dispatch(actions.hideLoading());
      showAlertError(messageError);
      return response;
      return Promise.reject(response);
    }
    // return response;
  } catch (error) {
    // handeResponseError(dispatch, error);
    dispatch(actions.hideLoading());
    return error.response;
  }
}
export {instance, requestALl, post, get, put};
export default {
  handeResponseError,
  showAlertError,
  showAlert,
  isSuccess,
  requestALl,
  post,
  put,
  get,
  put,
  deleteAPI,
};
