import DbHelper from "./DbHelper";
import { AuthentEntity } from "../entity";
import { deepCopyObject } from "../../commons";
import { cleanUserData } from "./User";
import { clearAllConfigs } from "./AppConfigs";

class AuthentBO extends DbHelper {
  constructor() {
    super(AuthentEntity);
  }

  getAccountInfo() {
    try {
      let arrayData = this.getAll();
      if (arrayData) {
        return arrayData[0];
      } else {
        return "";
      }
    } catch (error) {
      return "";
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
  console.log("Vao logout");
  cleanUserData();
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
  return new AuthentBO().getAccountInfo()?.token_type || "Bearer";
}

//Lay Token Login
export function getTokenSignIn() {
  let authentInfo = new AuthentBO().getAccountInfo();
  if (authentInfo) {
    return authentInfo?.id_token;
  }
  return null;
}

//Lay Token Login
export function isLoggedIn() {
  let authentInfo = new AuthentBO().getAccountInfo();
  if (authentInfo) {
    return authentInfo.id_token ? true : false;
  }
  return false;
}

//check xem ng dung có bam luu hay k
export function isLoggedInAndSaveAccount() {
  let authentInfo = new AuthentBO().getAccountInfo();
  if (authentInfo) {
    return authentInfo.id_token && authentInfo.isSaveAccount ? true : false;
  }
  return false;
}
