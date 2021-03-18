import axios from "axios";
import * as URL from "./ApiUrl";
import { Alert } from "react-native";
import models from "../models";
import * as actions from "../redux/actions/Commons";
import ExpiredAccount from "../components/ExpiredAccount";
let expiredAccount = false;
import { NavigationCurrent } from "../components/NavigationCurrent";

export const BASE_URL = URL.BASE_URL;
export const IMAGE_BASE_URL = URL.IMAGE_BASE_URL;
export const AUTHORIZATION_BASIC = "Basic YXBwMToxMjM0NTY=";

export const ERROR_KEY_PERSONAL_PATIENT_RECORD =
  "personal_patient_record_isnull";
export const ERROR_KEY_PATIENT_RECORD_APPOINTMENTS_EXIST =
  "patient-record.appointments-exist";
export const ERROR_KEY_HEALTH_INSURANCE_CODE =
  "health_insurance_code.wrong_format";
export const ERROR_KEY_HEALTH_INSURANCE_CODE_EXISTS =
  "health_insurance_code.exists";
export const ERROR_KEY_HEALTH_INSURANCE_CODE_expired = "expired";
export const ERROR_KEY_HEALTH_INSURANCE_CODE_invalid = "invalid";
export const ERROR_KEY_HEALTH_INSURANCE_CODE_PERSONAL_EXITSTS =
  "personal_patient_record_exists";
export const ERROR_KEY_PATIENT_RECORD_RELATIVE_RECORD_EXITST =
  "patient-record.relative-record-exist";
export const ERROR_KEY_INSURANCE_CODE_WRONG_INFORMATION =
  "insurance_code.wrong_information";
export const ERROR_CODE_REQUEST_SUCCESS = 200;
export const ERROR_CODE_UPDATE_SUCCESS = 201;
export const ERROR_CODE_DELETE_SUCCESS = 204;
export const ERROR_CODE_500 = 500;

export const ERROR_CODE_422 = 422;
export const ERROR_CODE_400 = 400;
export const ERROR_CODE_401 = 401;
export const ERROR_CODE_403 = 403;
export const ERROR_CODE_404 = 404;
export const ERROR_CODE_SUCCESS = [
  ERROR_CODE_REQUEST_SUCCESS,
  ERROR_CODE_UPDATE_SUCCESS,
  ERROR_CODE_DELETE_SUCCESS,
];

const typeRequest = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    // Authorization: AUTHORIZATION_BASIC,
    Accept: "application/json, text/plain",
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
  }
);

const activeExpiredAccount = () => {
  const screenCurrent = NavigationCurrent.get();
  console.log("screenCurrent>>", screenCurrent);
  if (screenCurrent != "LoginScreen") {
    return Alert.alert(
      "Phiên đăng nhập của bạn đã hết hạn.",
      "Vui lòng đăng nhập lại để sử dụng hệ thống!",
      [
        {
          text: "Đồng ý",
          onPress: () => {
            ExpiredAccount.set("401_API");
            expiredAccount = false;
          },
        },
      ]
    );
  }
};
export async function handeResponseError(dispatch, error) {
  let messageError = "";
  if (error.response) {
    let status = error.response.status;
    if (status === ERROR_CODE_500) {
      messageError = "Có lỗi xảy ra. Vui lòng thử lại.";
    } else if (status === ERROR_CODE_404) {
      messageError = "Không tồn tại API :\n\n " + error.response.config.url;
    } else if (status === ERROR_CODE_401) {
      if (models.getTokenSignIn()) {
        models.handleSignOut();
        messageError =
          "Phiên đăng nhập đã hết hạn. Vui lòng khởi động lại ứng dụng và đăng nhập lại";
        // requestSignOut(dispatch)
      } else {
        messageError = "Lỗi không xác định.";
      }
    } else if (status === ERROR_CODE_400) {
      messageError = "Lỗi truy xuất thông tin.";
    } else if (status === ERROR_CODE_403) {
      messageError =
        "Bạn không có quyền truy cập chức năng này. Liên hệ hotline để biết thêm thông tin chi tiết.";
    } else {
      messageError = error.response.data && error.response.data;
    }
  } else if (error.request) {
    messageError =
      "Lỗi kết nối với máy chủ. Xin vui lòng kiểm tra lại đường truyền internet";
  } else {
    messageError = "Xảy ra lỗi: \n" + JSON.stringify(error.message);
  }
  if (messageError) {
    showAlertError(messageError);
  }
}
export function isSuccess(statusResponse) {
  return ERROR_CODE_SUCCESS.indexOf(statusResponse) > -1;
}

export function isCheckError400(statusResponse, keyError, title) {
  var messageError = "";
  if (statusResponse === ERROR_CODE_400) {
    if (ERROR_KEY_PERSONAL_PATIENT_RECORD === keyError) {
      messageError =
        "Bạn chưa có hồ sơ bệnh nhân cá nhân nên không thể khởi tạo hồ sơ của gia đình.";
    } else if (ERROR_KEY_PATIENT_RECORD_APPOINTMENTS_EXIST === keyError) {
      messageError = "Không thể xóa hồ sơ y tế đã được sử dụng.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE === keyError) {
      messageError = "Mã bảo hiểm không đúng. Vui lòng kiểm tra lại.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_EXISTS === keyError) {
      messageError =
        "Mã bảo hiểm y tế đã được sử dụng ở hồ sơ bệnh nhân khác. Vui lòng kiểm tra lại.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_expired === keyError) {
      messageError = "Mã bảo hiểm y tế này đã hết hạn. Vui lòng kiểm tra lại.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_invalid === keyError) {
      messageError =
        "Mã bảo hiểm y tế này không tồn tại. Vui lòng kiểm tra lại.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_PERSONAL_EXITSTS === keyError) {
      messageError =
        "Mỗi 1 tài khoản chỉ có 1 hồ sơ bệnh nhân cá nhân . Vui lòng kiểm tra lại.";
    } else if (ERROR_KEY_PATIENT_RECORD_RELATIVE_RECORD_EXITST === keyError) {
      messageError =
        "Bạn không thể xóa hồ sơ sức khỏe của tôi khi vẫn còn hồ sơ sức khỏe của người thân .";
    } else if (ERROR_KEY_INSURANCE_CODE_WRONG_INFORMATION === keyError) {
      messageError = "Thông tin thẻ BHYT của bạn không đúng lắm. vui lòng đảm bảo Họ tên, Ngày sinh của bạn đã khai báo trùng với thông tin trên thẻ";
    } else {
      messageError = "Có lỗi không xác định xảy ra. Vui lòng thử lại sau";
    }

    showAlertError(messageError, title || "Lỗi - Đặt lịch khám");
    return true;
  }

  return false;
}

export async function showAlert(titleAlert, contentAlert) {
  setTimeout(() => {
    Alert.alert(titleAlert, contentAlert, [{ text: "Đồng ý" }]);
  }, 700);
}

export async function showAlertError(
  contentAlert,
  title = "Đặt lịch khám" + " - Lỗi"
) {
  showAlert(title, contentAlert);
}

async function post(url, params, dispatch, messageError, configs) {
  let responseMethodPost = await request(
    url,
    params,
    dispatch,
    messageError,
    typeRequest.POST,
    configs
  );
  if (responseMethodPost?.status == 401) {
    if (!expiredAccount) {
      expiredAccount = true;
      activeExpiredAccount();
    }
  }
  return responseMethodPost;
}

async function put(url, params, dispatch, messageError, configs) {
  let responseMethodPut = await request(
    url,
    params,
    dispatch,
    messageError,
    typeRequest.PUT,
    configs
  );
  if (responseMethodPut?.status == 401) {
    if (!expiredAccount) {
      expiredAccount = true;
      activeExpiredAccount();
    }
  }
  return responseMethodPut;
}
async function get(url, params, dispatch, messageError) {
  const responseMethodGet = await request(
    url,
    params,
    dispatch,
    messageError,
    typeRequest.GET
  );
  if (responseMethodGet?.status == 401) {
    if (!expiredAccount) {
      expiredAccount = true;
      activeExpiredAccount();
    }
  }
  return responseMethodGet;
}
async function deleteAPI(url, params, dispatch, messageError) {
  const responseMethodDelete = await request(
    url,
    params,
    dispatch,
    messageError,
    typeRequest.DELETE
  );
  if (responseMethodDelete?.status == 401) {
    if (!expiredAccount) {
      expiredAccount = true;
      activeExpiredAccount();
    }
  }
  return responseMethodDelete;
}

async function requestALl([...requestAPI], dispatch) {
  let responsesRresult = [];
  await axios
    .all(requestAPI)
    .then(
      axios.spread((...responses) => {
        responsesRresult = responses;
      })
    )
    .catch((errors) => {
      return errors;
    });
  return responsesRresult;
}

async function request(url, params, dispatch, messageError, type, configs) {
  try {
    let response = null;

    switch (type) {
      case typeRequest.GET: {
        response = await instance.get(url, { params: params });
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
        response = await instance.delete(url, { params: params });
        break;
      }
      default: {
        return null;
      }
    }
    let status = response.status;
    // let responsesData = response.data;
    let responsesData = response;
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
export { instance, requestALl, post, get, put, deleteAPI };
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
