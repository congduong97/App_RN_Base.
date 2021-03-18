import DbHelper from './DbHelper';
import {UserEntity} from '../entity';
import {RoleUser} from '../ConfigsData';
import commons from '../../commons';
import {UserDTO} from '../dto';

class UserBO extends DbHelper {
  constructor() {
    super(UserEntity);
  }

  getUserInfo() {
    try {
      let userInfoData = commons.convertToArray(this.getAll());
      if (userInfoData) {
        return userInfoData[0];
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

  clearAllUserInfo() {
    let userInfoData = this.getAll();
    if (userInfoData) {
      this.deleteRow(userInfoData);
      return true;
    }
    return false;
  }
}
////////////////////

export function cleanUserData() {
  let userBO = new UserBO();
  userBO.clearAllUserInfo();
  return true;
}

export function saveUserInfoData(dataInput) {
  let userBO = new UserBO();
  userBO.clearAllUserInfo();
  if (dataInput) {
    let userData = new UserDTO(dataInput);
    userBO.insertOrUpdate(userData, true);
    return true;
  }
  return false;
}

export function getUserInfo() {
  let userInfo = new UserBO().getUserInfo() || {};
  return userInfo;
}

export function getRoleUser() {
  let userInfo = new UserBO().getUserInfo();
  if (userInfo?.nameRole === RoleUser.Admin.code) {
    return RoleUser.Admin;
  } else if (userInfo?.nameRole === RoleUser.Agency.code) {
    return RoleUser.Agency;
  } else if (userInfo?.nameRole === RoleUser.Collaborator.code) {
    return RoleUser.Collaborator;
  } else {
    return RoleUser.Guest;
  }
}
