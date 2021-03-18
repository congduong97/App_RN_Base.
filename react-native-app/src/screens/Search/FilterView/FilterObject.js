import {Dimension, Telecoms} from '../../../commons/constants';
import {NotContainNumbers} from '../../../models/ConfigsData';
import FilterKey from './FilterKey';

export default class FilterObject {
  constructor(dataFilter) {
    this[FilterKey.status] = 0;
    this[FilterKey.IsReloadData] = true;
    this[FilterKey.Size] = Dimension.NUMBER_ITEM_PAGE_DEFAULT;
    if (dataFilter) {
      Object.assign(this, dataFilter);
    }
    convertContainToArray(this);
  }
  initialData(
    phoneString,
    telecomId,
    priceFrom,
    priceTo,
    fengshui,
    categoryId,
  ) {
    this[FilterKey.Pattern] = phoneString || '';
    this[FilterKey.MultipleTeco] = getTelcoIds(telecomId);
    if (priceFrom) this[FilterKey.PriceFrom] = priceFrom || '';
    if (priceTo) this[FilterKey.PriceTo] = priceTo || '';
    if (fengshui) this[FilterKey.MenhSim] = fengshui || '';
    if (categoryId) this[FilterKey.CategoryId] = categoryId || '';
    return this;
  }
}

export const getTelcoIds = (telecomId) => {
  if (telecomId) {
    return [telecomId].toString();
  }
  let telcoIds = [];
  telcoIds.push(0);
  Telecoms.forEach((item) => {
    telcoIds.push(item.id);
  });
  return telcoIds.toString();
};

export const selectTelecom = (telecomId, multipleTeco = '') => {
  let telecomIds = multipleTeco ? multipleTeco.split(',').map((x) => +x) : [];
  let index = telecomIds.indexOf(telecomId);
  if (telecomId === 0) {
    telecomIds = [];
    if (index < 0) {
      telecomIds = Telecoms.map((item) => {
        return item.id;
      });
      telecomIds.unshift(0);
    }
  } else {
    if (index > -1) {
      telecomIds.splice(index, 1);
      if (telecomIds.indexOf(0) > -1) {
        telecomIds.shift();
      }
    } else {
      telecomIds.push(telecomId);
      if (telecomIds.length === Telecoms.length) {
        telecomIds.unshift(0);
      }
    }
  }
  return telecomIds.toString();
};

export const convertArrayContain = (filterData) => {
  let arraySelected = filterData[FilterKey.NotContains];
  if (arraySelected && arraySelected.length > 0) {
    NotContainNumbers.forEach((item) => {
      if (arraySelected.includes(item)) {
        filterData[FilterKey.NotContains + item] = true;
      } else {
        filterData[FilterKey.NotContains + item] &&
          delete filterData[FilterKey.NotContains + item];
      }
    });
    delete filterData[FilterKey.NotContains];
  }
};

export const convertContainToArray = (filterData) => {
  let arrayContain = [];
  if (filterData) {
    NotContainNumbers.forEach((item) => {
      if (filterData[FilterKey.NotContains + item]) {
        arrayContain.push(item);
        delete filterData[FilterKey.NotContains + item];
      }
    });
    filterData[FilterKey.NotContains] = arrayContain;
  }
};
