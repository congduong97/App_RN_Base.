import { Api } from './api'
let listImage = [];
let store = {};
let indexDate = -1;
let isChecked = false;
let phoneNumber = null;
export const chooseStoreService = {
  setUriImage: (image) => {
    // listImage.push(uri);
    listImage = [...listImage, image];
  },
  getListImage: () => {
    return listImage;
  },
  deleteLastImage: () => {
    listImage.pop();
  },
  clearListImage: () => {
    var arr = [];
    listImage = arr;
  },
  setStore: (item) => {
    store = item;
  },
  getStore: () => {
    return store;
  },
  getLastImage: () => {
    return listImage[listImage.length - 1];
  },
  deleteImage: (image) => {
    const newListImage = listImage.filter((item) => image !== item);
    listImage = [...newListImage];
  },
  getIndexDate: () => {
    return indexDate;
  },
  setIndexDate: (index) => {
    indexDate = index;
  },
  getChecked: () => {
    return isChecked;
  },
  setChecked: (isCheck) => {
    isChecked = isCheck;
  },
  getPhone: () => {
    return phoneNumber;
  },
  setPhone: (phone) => {
    phoneNumber = phone;
  },
  refresh: () => {
    listImage = [];
    store = {};
    indexDate = 0;
    isChecked = false;
    phoneNumber = null;
  },
  validateDayCanChoose: async (storeCode)=> {
    try {
      const response = await Api.getListDayCanBeChosen(storeCode)
      if(response.code==502){
        return "maintain"
      }
      const data = response.res.data;
      console.log("data 111 ", data)
      for (let i = 0; i < data.length; i++) {
        if (data[i].type == 'VALID'){
          console.log("data type  ", i, data[i].type)
          return "haveData";
        }
      } 
      return "nodata";
    } catch (error) {
      return "noData";
    } 
  }
};
