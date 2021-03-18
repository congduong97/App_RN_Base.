import {getAccountInfo} from '../bo/AuthentBO';
import {concatenateString} from '../../commons/utils/format';

export default class UserDTO {
  constructor(dataInput) {
    if (dataInput) {
      Object.assign(this, dataInput);
      this['nameRole'] = getAccountInfo()?.roles[0];
      if (dataInput['province']) {
        this['province'] = dataInput['province']?.id;
      }
      if (dataInput['district']) {
        this['district'] = dataInput['district']?.id;
      }
      if (dataInput['ward']) {
        this['ward'] = dataInput['ward']?.id;
      }
      this['fullAddress'] = concatenateString(
        ', ',
        dataInput['address'],
        dataInput['ward']?.name,
        dataInput['district']?.name,
        dataInput['province']?.name,
      );
      this['areaFullName'] = concatenateString(
        ', ',
        dataInput['ward']?.name,
        dataInput['district']?.name,
        dataInput['province']?.name,
      );
    }
  }
}
