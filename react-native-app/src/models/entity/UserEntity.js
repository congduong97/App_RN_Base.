import {USER_INFO_TABLE} from './Schema';

export default {
  name: USER_INFO_TABLE,
  primaryKey: 'id',
  properties: {
    id: {type: 'int?'},
    username: {type: 'string?'},
    phone: {type: 'string?'},
    email: {type: 'string?'},
    fullName: {type: 'string?'},
    province: {type: 'int?'},
    district: {type: 'int?'},
    ward: {type: 'int?'},
    address: {type: 'string?'},
    fullAddress: {type: 'string?'},
    areaFullName: {type: 'string?'},
    zalo: {type: 'string?'},
    facebook: {type: 'string?'},
    bankName: {type: 'string?'},
    bankAccount: {type: 'string?'},
    bankAccountName: {type: 'string?'},
    approved: {type: 'bool?'},
    active: {type: 'bool?'},
    dateOfBirth: {type: 'string?'},
    nameRole: {type: 'string?'},
    avatar: {type: 'string?'},
    cmnd1: {type: 'string?'},
    cmnd2: {type: 'string?'},
  },
};