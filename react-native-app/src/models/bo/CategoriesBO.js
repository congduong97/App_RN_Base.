import DbHelper from './DbHelper';
import {CategoriesEntity} from '../entity';
import commons from '../../commons';

class CategoriesBO extends DbHelper {
  constructor() {
    super(CategoriesEntity);
  }
  clearAllCategories() {
    let rawData = this.getAll();
    if (rawData) {
      this.deleteRow(rawData);
      return true;
    }
    return false;
  }

  getAllCategories() {
    try {
      return commons.deepCopyObject(this.getAll());
    } catch (error) {
      return [];
    }
  }
  getCategoriesSIMNice() {
    try {
      return commons.deepCopyObject(this.selectData('exam != null'));
    } catch (error) {
      return [];
    }
  }
}

export function saveCategoriesData(dataInput) {
  let categoriesBO = new CategoriesBO();
  categoriesBO.clearAllCategories();
  if (dataInput) {
    categoriesBO.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getCategoriesData(isTextAll) {
  let resultData = new CategoriesBO().getAllCategories();
  if (isTextAll) {
    let itemAll = {
      id: 0,
      code: 'All',
      name: 'Tất cả',
    };
    return [...[itemAll], ...resultData];
  }
  return resultData;
}

export function getCategoriesSIMNice() {
  let resultData = new CategoriesBO().getCategoriesSIMNice();
  return resultData || [];
}
