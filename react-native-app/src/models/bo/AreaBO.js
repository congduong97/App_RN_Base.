import DbHelper from './DbHelper';
import {ProvinceEntity, DistrictEntity, WardEntity} from '../entity';
import {deepCopyObject} from '../../commons/utils';
import AreaDTO from '../dto/AreaDTO';

class ProvinceBO extends DbHelper {
  constructor() {
    super(ProvinceEntity);
  }

  clearAllObject() {
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

class DistrictBO extends DbHelper {
  constructor() {
    super(DistrictEntity);
  }

  clearAllObject() {
    let rawData = this.getAll();
    if (rawData) {
      this.deleteRow(rawData);
      return true;
    }
    return false;
  }

  getListData(cityCode) {
    let rawData = deepCopyObject(this.getData('parentId', cityCode));

    if (rawData) {
      return rawData;
    }
    return [];
  }
}

class WardBO extends DbHelper {
  constructor() {
    super(WardEntity);
  }
  clearAllObject() {
    let rawData = this.getAll();
    if (rawData) {
      this.deleteRow(rawData);
      return true;
    }
    return false;
  }

  getListData(districtCode) {
    let rawData = deepCopyObject(this.getData('parentId', districtCode));
    if (rawData) {
      return rawData;
    }
    return [];
  }
}

export function saveAreaData(dataInput) {}

export function saveProvincesData(dataInput) {
  let provincesObject = new ProvinceBO();
  provincesObject.clearAllObject();
  if (dataInput) {
    provincesObject.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}
export function saveDistrictsData(dataInput) {
  let districtsObject = new DistrictBO();
  districtsObject.clearAllObject();
  if (dataInput) {
    let dataInsert = new AreaDTO(dataInput);
    districtsObject.insertOrUpdate(dataInsert, true);
    return true;
  }
  return false;
}

export function saveWardsData(dataInput) {
  let wardsObject = new WardBO();
  wardsObject.clearAllObject();
  if (dataInput) {
    let dataInsert = new AreaDTO(dataInput);
    wardsObject.insertOrUpdate(dataInsert, true);
    return true;
  }
  return false;
}

export function filtterDataProvinces(keySearch) {
  return new ProvinceBO().getDataByColumn('name', keySearch);
}

export function getProvinceData() {
  return new ProvinceBO().getListData();
}
export function getDistrictData(parentCode) {
  return new DistrictBO().getListData(parentCode);
}

export function getWardData(parentCode) {
  return new WardBO().getListData(parentCode);
}
