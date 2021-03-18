import DbHelper from "./DbHelper";
import { PatientRecordsEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class PatientRecordsBO extends DbHelper {
  constructor() {
    super(PatientRecordsEntity);
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

export function savePatientRecords(dataInput) {
  let dataBO = new PatientRecordsBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getListPatientRecords() {
  let dataArray = new PatientRecordsBO().getListData();
  return dataArray ? dataArray.reverse() : [];
}

export function isExistPatient() {
  let dataArray = new PatientRecordsBO().getListData();
  return dataArray && dataArray.length > 0;
}

export function getPatientRecordsInfo(recordsId) {
  let dataArray = new PatientRecordsBO().getObjectByPrimaryKey(recordsId) || {};
  return dataArray;
}
