import DbHelper from './DbHelper';
import {AppConfigEntity} from '../entity';
import AppConfig from '../dto/AppConfig';

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
}

export function clearAllConfigs() {
  let dataBO = new AppConfigsBO();
  dataBO.clearAllConfigs();
  return true;
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
//////////
export function saveQuickOrder(data) {
  AppConfig.QuickOrder.value = `${data}`;
  new AppConfigsBO().insertOrUpdate(AppConfig.QuickOrder, true);
}

//Lay Token Login
export function getQuickOrder() {
  let authentInfo = new AppConfigsBO().getObjectByPrimaryKey(
    AppConfig.QuickOrder.id,
  );
  if (authentInfo && authentInfo.value) {
    return authentInfo.value === 'true';
  }
  return null;
}

export function saveShowWebPrices(data) {
  AppConfig.ShowWebPrices.value = `${data}`;
  new AppConfigsBO().insertOrUpdate(AppConfig.ShowWebPrices, true);
}

//Lay Token Login
export function getShowWebPrices() {
  let authentInfo = new AppConfigsBO().getObjectByPrimaryKey(
    AppConfig.ShowWebPrices.id,
  );
  if (authentInfo && authentInfo.value) {
    return authentInfo.value === 'true';
  }
}

export function saveCompactUnit(data) {
  AppConfig.CompactUnit.value = `${data}`;
  new AppConfigsBO().insertOrUpdate(AppConfig.CompactUnit, true);
}

//Lay Token Login
export function getCompactUnit() {
  let authentInfo = new AppConfigsBO().getObjectByPrimaryKey(
    AppConfig.CompactUnit.id,
  );
  if (authentInfo && authentInfo.value) {
    return authentInfo.value === 'true';
  }
  return false;
}

export function saveConfigsSetting(dataInput) {
  let dataBO = new AppConfigsBO();
  if (dataInput) {
    dataBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

//Lay setting theo idÏ
export function getConfigSetting(idConfig) {
  let authentInfo = new AppConfigsBO().getObjectByPrimaryKey(idConfig);
  if (authentInfo && authentInfo.value) {
    return authentInfo.value === 'true';
  }
  return false;
}

export function getAllSetting() {
  let isQuickOrder = getConfigSetting(AppConfig.QuickOrder.id);
  let isShowWebPrices = getConfigSetting(AppConfig.ShowWebPrices.id);
  let isCompactUnit = getConfigSetting(AppConfig.CompactUnit.id);
  return {isQuickOrder, isShowWebPrices, isCompactUnit};
}
