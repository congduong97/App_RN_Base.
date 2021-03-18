import {AUTHENT_TABLE} from './Schema';

export default {
  name: AUTHENT_TABLE,
  primaryKey: 'user_id',
  properties: {
    user_id: {type: 'int?'},
    full_name: {type: 'string?'},
    access_token: {type: 'string?'},
    token_type: {type: 'string?'},
    scope: {type: 'string?'},
    phone: {type: 'string?'},
    email: {type: 'string?'},
    roles: {type: 'string?[]', default: []},
    avatar: {type: 'string?'},
    authorized_at: {type: 'int?'},
    expires_in: {type: 'int?'},
  },
};

