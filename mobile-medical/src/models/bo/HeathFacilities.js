import DbHelper from "./DbHelper";
import { HeathFacilitiesEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class HeathFacilitiesBO extends DbHelper {
  constructor() {
    super(HeathFacilitiesEntity);
  }
  clearAllConfigs() {
    let rawData = this.getAll();
    if (rawData) {
      this.deleteRow(rawData);
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

export function saveHeathFacilities(dataInput) {
  let dataBO = new HeathFacilitiesBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getListHealthFacilities() {
  return new HeathFacilitiesBO().getListData();
}

export function getHealthFacilityInfo(id) {
  let dataObject = new HeathFacilitiesBO().getObjectByPrimaryKey(id) || {};
  return dataObject;
  // return dataCoSoYTe.filter((item) => item.id === id)[0];
}

export function getHospitalEndTimeMorning(id) {
  let dataObject = new HeathFacilitiesBO().getObjectByPrimaryKey(id) || {};
  if (dataObject && dataObject?.config && dataObject?.config?.endTimeMorning) {
    return dataObject?.config?.endTimeMorning;
  }
  return "11:30";
}

export function getHospitalConfig(id) {
  let dataObject = new HeathFacilitiesBO().getObjectByPrimaryKey(id) || {};
  if (dataObject && dataObject?.config && dataObject?.config) {
    return dataObject?.config;
  }
  return {};
}
// export function getHospitalConfig(id) {
//   let dataObject = new HeathFacilitiesBO().getObjectByPrimaryKey(id) || {};
//   if (dataObject && dataObject?.config && dataObject?.config) {
//     return dataObject?.config;
//   }
//   return {};
// }
