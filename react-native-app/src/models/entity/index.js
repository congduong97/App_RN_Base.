import * as SchemaTable from './Schema';
import AppConfigEntity from './AppConfigEntity';
import AuthentEntity from './AuthentEntity';
import UserEntity from './UserEntity';
import CategoriesEntity from './CategoriesEntity';
import ProvinceEntity from './ProvinceEntity';
import DistrictEntity from './DistrictEntity';
import WardEntity from './WardEntity';

const schemaArray = [
  AppConfigEntity,
  AuthentEntity,
  UserEntity,
  CategoriesEntity,
  ProvinceEntity,
  DistrictEntity,
  WardEntity,
];

export {
  schemaArray,
  SchemaTable,
  AppConfigEntity,
  AuthentEntity,
  UserEntity,
  CategoriesEntity,
  ProvinceEntity,
  DistrictEntity,
  WardEntity,
};
