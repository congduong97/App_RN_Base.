import DbHelper from "./DbHelper";
import { MedicalReminderEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class MedicalReminderBO extends DbHelper {
  constructor() {
    super(MedicalReminderEntity);
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

export function saveMedicalRemindersData(dataInput) {
  let dataBO = new MedicalReminderBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getMedicalReminders() {
  let dataArray = new MedicalReminderBO().getListData() || [];
  return dataArray;
}

export function deleteRecord(id) {
  let dataBO = new MedicalReminderBO();
  const object = dataBO.getData('id', id);
  dataBO.deleteRow(object);
}