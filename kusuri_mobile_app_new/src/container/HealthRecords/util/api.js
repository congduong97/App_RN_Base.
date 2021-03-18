import {
  managerAccount,
  APP_ID,
  isAndroid,
  isIOS,
} from "../../../const/System";
import { fetchApiMethodGet, fetchApiMethodPost } from "../../../service";
const url = `http://52.194.253.6:8080/api/v1/app/${APP_ID}/`;

const patientInfo = async () => {
  return await fetchApiMethodGet(
    `${url}patientInfo/list?memberCode=${managerAccount.memberCode}`
  );
};

const getTermDrug = async () => {
  return await fetchApiMethodGet(`${url}term_of_use/getTermOfUse`);
};
const getQuestionDrug = async () => {
  return await fetchApiMethodGet(`${url}question_answer/list`);
};
const getListMenuSetting = async () => {
  return await fetchApiMethodGet(`${url}menu_setting/list`);
};

const getListCity = async () => {
  return await fetchApiMethodGet(`${url}patientInfo/cities`);
};

const getListBlood = async () => {
  return await fetchApiMethodGet(`${url}patientInfo/blood-groups`);
};

// GET /api/v1/app/{appId}/patientInfo/allergies
const getListDefaultAllergies = async () => {
  return await fetchApiMethodGet(`${url}patientInfo/allergies`);
};

// GET /api/v1/app/{appId}/pcr/detail/{medicateId}: Lấy chi tiết đơn thuốc:
const getDetailMedicine = async (patientId, medicateId) => {
  return await fetchApiMethodGet(
    `${url}pcr/detail/${medicateId}?patientId=${patientId}`
  );
};

const getListPrescription = async (
  patientId,
  startOfMonth,
  endOfMonth,
  page,
  size
) => {
  return await fetchApiMethodGet(
    `${url}pcr/list?patientId=${patientId}&startTimeRange=${startOfMonth}&endTimeRange=${endOfMonth}&page=${page}&size=${size}`
  );
};

const createPatientInfo = async (data) => {
  return await fetchApiMethodPost(
    `${url}patientInfo/create?memberCode=${managerAccount.memberCode}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
const updateUserInfo = async (data, type) => {
  return await fetchApiMethodPost(
    `${url}patientInfo/update?patientSubmitType=${type}`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
const changeCurrentUser = async (id) => {
  return await fetchApiMethodGet(
    `${url}patientInfo/change-user/${id}?memberCode=${
      managerAccount.memberCode
    }`
  );
};

const getDetailUser = async (id) => {
  return await fetchApiMethodGet(`${url}patientInfo/detail/${id}`);
};
const deleteUser = async (id) => {
  return await fetchApiMethodGet(
    `${url}patientInfo/delete/${id}?memberCode=${managerAccount.memberCode}`
  );
};

function getFormDataFileQRCode(ojbFileCSV) {
  console.log("ojbFileCSV", ojbFileCSV);
  let formData = new FormData();
  formData.append("qrDataFile", {
    uri: isAndroid
      ? "file://" + ojbFileCSV.uri
      : ojbFileCSV.uri.replace("file://", ""),
    type: ojbFileCSV.type,
    name: ojbFileCSV.name,
  });
  return formData;
}

const handleFileCsvQRCodeAPI = async (ojbFileCSV) => {
  let data = getFormDataFileQRCode(ojbFileCSV);
  console.log(`${managerAccount.accessToken}`, "Token");
  const response = await fetchApiMethodPost(`${url}pcr/read`, {
    method: "POST",
    body: data,
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

const getNameFileImage = (uri) => {
  let newUri = uri.toString().substring(uri.lastIndexOf("/") + 1, uri.length);
  if (!!newUri) {
    return newUri;
  }
  return uri;
};
const saveFileCsvQrCodeAPI = async (dataDto, patientId, arrImage) => {
  let formData = new FormData();
  if (Array.isArray(arrImage) && arrImage.length > 0) {
    for (let index = 0; index < arrImage.length; index++) {
      let image = {
        uri: isIOS ? arrImage[index].replace("file://", "") : arrImage[index],
        type: "multipart/form-data",
        name: getNameFileImage(arrImage[index]),
      };
      formData.append("listDrugImage", image);
    }
  }
  formData.append("qrDataDto", JSON.stringify(dataDto));
  formData.append("patientId", JSON.stringify(patientId));
  return await fetchApiMethodPost(`${url}pcr/save`, {
    method: "POST",
    body: formData,
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const getELink = async (patientId) => {
  return await fetchApiMethodGet(`${url}oneTimeCode/getDetail/${patientId}`);
};

const generateNewELink = async (patientId) => {
  return await fetchApiMethodPost(`${url}oneTimeCode/generate/${patientId}`, {
    method: "POST",
    body: {},
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
const convertNameToKatakana = async (text) => {
  return await fetchApiMethodGet(`${url}patientInfo/convert-text?text=${text}`);
};
// POST /api/v1/app/over_counter_drug/save
const createMarketDrug = async (
  patientId,
  name,
  startDate,
  endDate,
  expiredDate,
  image,
  memo
) => {
  let formData = new FormData();
  let formImage;
  if (!image.imgDefault) {
    console.log("image", image.link);
    formImage = {
      uri: image.link,
      type: "multipart/form-data",
      name: "image.jpg",
    };
    formData.append("imageFile", formImage);
  }

  formData.append("id", "");
  formData.append("patientInfoId", patientId);
  formData.append("name", name);
  formData.append("startDate", startDate);
  if (endDate.length > 0) {
    formData.append("endDate", endDate);
  }
  if (expiredDate.length > 0) {
    formData.append("expirationDate", expiredDate);
  }

  formData.append("memo", memo);
  return await fetchApiMethodPost(`${url}over_counter_drug/save`, {
    method: "POST",
    body: formData,
    headers: {
      accessToken: `${managerAccount.accessToken}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
export const Api = {
  getQuestionDrug,
  getTermDrug,
  patientInfo,
  getListCity,
  getListBlood,
  getListDefaultAllergies,
  createPatientInfo,
  changeCurrentUser,
  getDetailUser,
  deleteUser,
  updateUserInfo,
  handleFileCsvQRCodeAPI,
  getListPrescription,
  saveFileCsvQrCodeAPI,
  getDetailMedicine,
  getELink,
  generateNewELink,
  convertNameToKatakana,
  createMarketDrug,
  getListMenuSetting,
};
