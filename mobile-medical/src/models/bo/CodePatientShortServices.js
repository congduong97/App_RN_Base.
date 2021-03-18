import DbHelper from "./DbHelper";
import { CodePatientShortEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class CodePatientShortServices extends DbHelper {
  constructor() {
    super(CodePatientShortEntity);
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

export function saveCodePatientShortServicesData(dataInput) {
  let dataBO = new CodePatientShortServices();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, false);
    return true;
  }
  return false;
}

export function getCodePatientShortServicesData() {
  let dataBO = new CodePatientShortServices();
  return dataBO.getListData();
}
