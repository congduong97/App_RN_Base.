import DbHelper from "./DbHelper";
import { UserEntity } from "../entity";
import { UserDTO } from "../dto";
import { deepCopyObject } from "../../commons";

class UserBO extends DbHelper {
  constructor() {
    super(UserEntity);
  }

  getUserInfo() {
    try {
      let userInfoData = deepCopyObject(this.getAll());
      if (userInfoData) {
        return userInfoData[0];
      } else {
        return "";
      }
    } catch (error) {
      return "";
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
