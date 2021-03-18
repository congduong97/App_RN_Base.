import DbHelper from "./DbHelper";
import { AppConfigEntity, RelationshipEntity, TopicsEntity } from "../entity";
import { deepCopyObject } from "../../commons";

class AppConfigsBO extends DbHelper {
  constructor() {
    super(AppConfigEntity);
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

class RelationshipBO extends DbHelper {
  constructor() {
    super(RelationshipEntity);
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

class TopicsBO extends DbHelper {
  constructor() {
    super(TopicsEntity);
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

export function saveCategoriesData(dataInput) {
  let dataBO = new AppConfigsBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function clearAllConfigs() {
  let dataBO = new AppConfigsBO();
  dataBO.clearAllConfigs();
  return true;
}

export function saveConfigsRelationship(dataInput) {
  let dataBO = new RelationshipBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getRelationship() {
  return new RelationshipBO().getListData();
}

export function filtterDataRelationship(keySearch) {
  return new RelationshipBO().getData("gender", keySearch);
}

export function getRelationshipName(code) {
  let dataArray = new RelationshipBO().getObjectByPrimaryKey(code) || {};
  return dataArray?.name;
}

export function saveTopics(dataInput) {
  let dataBO = new TopicsBO();
  dataBO.clearAllConfigs();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getTopics() {
  return new TopicsBO().getListData();
}
