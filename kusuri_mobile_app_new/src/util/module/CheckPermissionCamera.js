import { Alert } from "react-native";
import { STRING } from "../../const/String";
import Permissions from "react-native-permissions";
import { isIOS } from "../../const/System";

export const checkPermissionCamera = () => {
  let checkCamera = false;
  return new Promise((res, rej) => {
    Permissions.check("camera")
      .then((response) => {
        console.log("res check camera dsddd", response);
        if (response === "authorized" ||response=== "restricted") {
          checkCamera = true;
        }
        res(checkCamera);
      })
      .catch(() => rej(false));
  });
};
