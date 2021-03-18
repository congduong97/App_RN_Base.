import { fetchApiMethodGet, fetchApiMethodPost } from "../../../service";
import {
  DEVICE_ID,
  URL,
  managerAccount,
  keyAsyncStorage,
  isIOS,
} from "../../../const/System";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { chooseStoreService } from "./service";

const getListCitiesAndDistricts = async () => {
  console.log(`${URL}prescriptionStore/getListCitiesAndDistricts`, "url");
  return await fetchApiMethodGet(
    `${URL}prescriptionStore/getListCitiesAndDistricts`
  );
};
const getListStoreByDistrict = async (id) => {
  return await fetchApiMethodGet(
    `${URL}prescriptionStore/getListStoreByDistrictId?districtId=${id}`
  );
};
const getListStoreHistory = async () => {
  console.log(managerAccount.accessToken, "managerAccount.accessToken");
  console.log(`${URL}prescriptionStore/getListStoreHistory`);
  const listStore = await fetchApiMethodGet(
    `${URL}prescriptionStore/getListStoreHistory`
  );
  console.log("listStore", listStore);
  return listStore;
};
const creatPrescription = async (
  listPrescriptionImages,
  memberPhone,
  storeCode,
  receptionDate
) => {
  console.log(listPrescriptionImages, "listPrescriptionImages");
  console.log(memberPhone, storeCode, receptionDate);
  let timeOut = false;
  const data = getFormData(
    listPrescriptionImages,
    memberPhone,
    storeCode,
    receptionDate
  );
  return await fetchApiMethodPost(
    `${URL}prescription/create?phase=PHASE_2`,
    {
      method: "POST",
      body: data,
      // contentType: false,
      // processData: false,
      headers: {
        accessToken: `${managerAccount.accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    },
    timeOut
  );
};
function getFormData(listImages, memberPhone, storeCode, receptionDate) {
  let formData = new FormData();
  formData.append("memberPhone", memberPhone);
  formData.append("storeCode", storeCode);
  if (receptionDate) {
    formData.append("receptionDate", receptionDate); // "2020/12/14 00:00"; format: yyyy//MM/dd 00:00;
  }

  console.log("list image", listImages);
  // let formDataImage = [];
  for (let index = 0; index < listImages.length; index++) {
    let image = {
      uri: isIOS
        ? listImages[index].uri.replace("file://", "")
        : listImages[index].uri,
      type: "multipart/form-data",
      name: getNameFileImage(listImages[index].uri)
        ? getNameFileImage(listImages[index].uri)
        : "image.jpg",
    };
    formData.append("listPrescriptionImages", image);
    // formDataImage.push(image);
  }
  // formDataImage.forEach((item, index) => {

  // });

  console.log("formdata", formData);
  return formData;
}

const getListStoreNearUserLocation = (latitude, longitude) => {
  return fetchApiMethodGet(
    `${URL}prescriptionStore/getListStoreForMap?latitude=${latitude}&longitude=${longitude}`
  );
};
const getNameFileImage = (uri) => {
  return uri.toString().substring(uri.lastIndexOf("/") + 1, uri.length);
};

const getListDayCanBeChosen = async (storeCode) => {
  console.log(`${URL}prescription/listDayCanBeChosen?storeCode=${storeCode}`);
  return await fetchApiMethodGet(
    `${URL}prescription/listDayCanBeChosen?storeCode=${storeCode}`
  );
};
// getCurrentPhoneNumber
const getCurrentPhoneNumber = async () => {
  return await fetchApiMethodGet(
    `${URL}prescriptionStore/getCurrentPhoneNumber`
  );
};
export const Api = {
  getListCitiesAndDistricts,
  getListStoreByDistrict,
  getListStoreHistory,
  creatPrescription,
  getListStoreNearUserLocation,
  getListDayCanBeChosen,
  getCurrentPhoneNumber,
};
