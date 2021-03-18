import {CATEGORIES_TABLE} from './Schema';

export default {
  name: CATEGORIES_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    code: {type: 'string?'},
    name: {type: 'string?'},
    priority: {type: 'int?'},
    pattern: {type: 'string?'},
    type: {type: 'string?'},
    typeName: {type: 'string?'},
    color: {type: 'string?'},
    exam: {type: 'string?'},
  },
};
