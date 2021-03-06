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
      "Phi??n ????ng nh???p c???a b???n ???? h???t h???n.",
      "Vui l??ng ????ng nh???p l???i ????? s??? d???ng h??? th???ng!",
      [
        {
          text: "?????ng ??",
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
      messageError = "C?? l???i x???y ra. Vui l??ng th??? l???i.";
    } else if (status === ERROR_CODE_404) {
      messageError = "Kh??ng t???n t???i API :\n\n " + error.response.config.url;
    } else if (status === ERROR_CODE_401) {
      if (models.getTokenSignIn()) {
        models.handleSignOut();
        messageError =
          "Phi??n ????ng nh???p ???? h???t h???n. Vui l??ng kh???i ?????ng l???i ???ng d???ng v?? ????ng nh???p l???i";
        // requestSignOut(dispatch)
      } else {
        messageError = "L???i kh??ng x??c ?????nh.";
      }
    } else if (status === ERROR_CODE_400) {
      messageError = "L???i truy xu???t th??ng tin.";
    } else if (status === ERROR_CODE_403) {
      messageError =
        "B???n kh??ng c?? quy???n truy c???p ch???c n??ng n??y. Li??n h??? hotline ????? bi???t th??m th??ng tin chi ti???t.";
    } else {
      messageError = error.response.data && error.response.data;
    }
  } else if (error.request) {
    messageError =
      "L???i k???t n???i v???i m??y ch???. Xin vui l??ng ki???m tra l???i ???????ng truy???n internet";
  } else {
    messageError = "X???y ra l???i: \n" + JSON.stringify(error.message);
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
        "B???n ch??a c?? h??? s?? b???nh nh??n c?? nh??n n??n kh??ng th??? kh???i t???o h??? s?? c???a gia ????nh.";
    } else if (ERROR_KEY_PATIENT_RECORD_APPOINTMENTS_EXIST === keyError) {
      messageError = "Kh??ng th??? x??a h??? s?? y t??? ???? ???????c s??? d???ng.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE === keyError) {
      messageError = "M?? b???o hi???m kh??ng ????ng. Vui l??ng ki???m tra l???i.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_EXISTS === keyError) {
      messageError =
        "M?? b???o hi???m y t??? ???? ???????c s??? d???ng ??? h??? s?? b???nh nh??n kh??c. Vui l??ng ki???m tra l???i.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_expired === keyError) {
      messageError = "M?? b???o hi???m y t??? n??y ???? h???t h???n. Vui l??ng ki???m tra l???i.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_invalid === keyError) {
      messageError =
        "M?? b???o hi???m y t??? n??y kh??ng t???n t???i. Vui l??ng ki???m tra l???i.";
    } else if (ERROR_KEY_HEALTH_INSURANCE_CODE_PERSONAL_EXITSTS === keyError) {
      messageError =
        "M???i 1 t??i kho???n ch??? c?? 1 h??? s?? b???nh nh??n c?? nh??n . Vui l??ng ki???m tra l???i.";
    } else if (ERROR_KEY_PATIENT_RECORD_RELATIVE_RECORD_EXITST === keyError) {
      messageError =
        "B???n kh??ng th??? x??a h??? s?? s???c kh???e c???a t??i khi v???n c??n h??? s?? s???c kh???e c???a ng?????i th??n .";
    } else if (ERROR_KEY_INSURANCE_CODE_WRONG_INFORMATION === keyError) {
      messageError = "Th??ng tin th??? BHYT c???a b???n kh??ng ????ng l???m. vui l??ng ?????m b???o H??? t??n, Ng??y sinh c???a b???n ???? khai b??o tr??ng v???i th??ng tin tr??n th???";
    } else {
      messageError = "C?? l???i kh??ng x??c ?????nh x???y ra. Vui l??ng th??? l???i sau";
    }

    showAlertError(messageError, title || "L???i - ?????t l???ch kh??m");
    return true;
  }

  return false;
}

export async function showAlert(titleAlert, contentAlert) {
  setTimeout(() => {
    Alert.alert(titleAlert, contentAlert, [{ text: "?????ng ??" }]);
  }, 700);
}

export async function showAlertError(
  contentAlert,
  title = "?????t l???ch kh??m" + " - L???i"
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
