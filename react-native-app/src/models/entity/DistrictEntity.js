import {DISTRICT_TABLE} from './Schema';

export default {
  name: DISTRICT_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    name: {type: 'string?'},
    code: {type: 'string?'},
    parentId: {type: 'int?'},
    parentName: {type: 'string?'},
  },
};
