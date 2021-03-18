import DbHelper from "./DbHelper";
import { ProvinceEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class ProvinceBO extends DbHelper {
  constructor() {
    super(ProvinceEntity);
  }

  clearAllUserInfo() {
    let userInfoData = this.getAll();
    if (userInfoData) {
      this.deleteRow(userInfoData);
      return true;
    }
    return false;
  }
  getListData() {
    let rawData = deepCopyObject(this.getAll());
    if (rawData) {
      return rawData;
    }
    return [];
  }
}
////////////////////

export function cleanUserData() {
  let dataBO = new ProvinceBO();
  dataBO.clearAllUserInfo();
  return true;
}

export function saveProvincesData(dataInput) {
  let dataBO = new ProvinceBO();
  dataBO.clearAllUserInfo();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getProvinces() {
  return new ProvinceBO().getListData();
}

export function filtterDataProvinces(keySearch) {
  return new ProvinceBO().getDataByColumn("name", keySearch);
}

export function getProvincesInfo(id) {
  let dataObject = new ProvinceBO().getObjectByPrimaryKey(id) || {};
  return dataObject;
}
