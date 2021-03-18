import {PROVINCE_TABLE} from './Schema';

export default {
  name: PROVINCE_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    name: {type: 'string?'},
    code: {type: 'string?'},
  },
};
