import {APP_CONFIG_TABLE} from './Schema';

const AppConfigEntity = {
  name: APP_CONFIG_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    parentId: {type: 'int?'},
    name: {type: 'string?'},
    code: {type: 'string?'},
    value: {type: 'string?'},
    descriptions: {type: 'string?'},
    type: {type: 'int?'},
    status: {type: 'int?', default: 1},
  },
};

export default AppConfigEntity;
