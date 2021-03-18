import { concatenateString } from "../../commons";

export default class UserDTO {
  constructor(dataInput) {
    if (dataInput) {
      Object.assign(this, dataInput);
      this["username"] = dataInput.login;
      this["fullName"] = dataInput.name;
      this["nameRole"] = dataInput.authorities[0];
    }
  }
}
