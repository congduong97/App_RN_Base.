import DbHelper from './DbHelper';
import {AuthentEntity} from '../entity';
import {RoleUser} from '../ConfigsData';
import {cleanUserData} from './UserBO';
import {clearAllConfigs} from './AppConfigsBO';
import commons from '../../commons';

class AuthentBO extends DbHelper {
  constructor() {
    super(AuthentEntity);
  }

  getAccountInfo() {
    try {
      let arrayData = commons.convertToArray(this.getAll());
      if (arrayData) {
        return arrayData[0];
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

  clearAll() {
    let arrayData = this.getAll();
    if (arrayData) {
      this.deleteRow(arrayData);
      return true;
    }
    return false;
  }
}
////////////////////
export function handleLogin(dataInput) {
  saveAccountInfoData(dataInput);
}

export function handleSignOut() {
  cleanUserData();
  clearAllConfigs();
  let authentObject = new AuthentBO();
  authentObject.clearAll();
  return true;
}

export function saveAccountInfoData(dataInput) {
  let authentObject = new AuthentBO();
  authentObject.clearAll();
  if (dataInput) {
    authentObject.insertOrUpdate(dataInput, true);
    return true;
  }
  return false;
}

export function getAccountInfo() {
  return new AuthentBO().getAccountInfo();
}

//Lay Token Login
export function getAccountId() {
  let authentInfo = new AuthentBO().getAccountInfo();
  return authentInfo?.user_id;
}

//Lay Token Login
export function getTokenType() {
  let authentInfo = new AuthentBO().getAccountInfo();
  let tokenType = 'Bearer ';
  if (authentInfo) {
    tokenType = authentInfo?.token_type || 'Bearer ';
  }
  return tokenType;
}

//Lay Token Login
export function getTokenSignIn() {
  let authentInfo = new AuthentBO().getAccountInfo();
  if (authentInfo) {
    return authentInfo?.access_token;
  }
  return null;
}

//Lay Token Login
export function isLoggedIn() {
  let authentInfo = new AuthentBO().getAccountInfo();
  if (authentInfo) {
    return authentInfo.access_token ? true : false;
  }
  return false;
}

///TK cua phai la dai ly khong
export function isRoleAgency() {
  let authentInfo = new AuthentBO().getAccountInfo();
  return RoleUser.Agency.code === authentInfo?.roles[0];
}
