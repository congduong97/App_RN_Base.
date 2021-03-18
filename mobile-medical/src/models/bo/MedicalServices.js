import DbHelper from "./DbHelper";
import { MedicalServicesEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class MedicalServicesBO extends DbHelper {
  constructor() {
    super(MedicalServicesEntity);
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

export function saveMedicalServicesData(dataInput) {
  let dataBO = new MedicalServicesBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getMedicalServices() {
  let dataArray = new MedicalServicesBO().getListData() || [];
  return dataArray;
}
