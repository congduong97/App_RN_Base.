import Permissions from "react-native-permissions";
import { managerAccount } from "../../../const/System";
import { STRING } from "../../../const/String";
import { Alert } from "react-native";
import { checkPermissionsWhenInUse } from "../../../util/module/checkPremissionsLocation";

export const checkPermissionNotification = () => {
  Permissions.check("notification", { type: ["alert", "badge"] }).then(
    response => {
      // console.log('responsePremi', response);
      // if (response === 'denied') {
      //   Alert.alert(
      //     STRING.notification,
      //     STRING.need_enable_notification,
      //     [{ text: STRING.cancel }, { text: STRING.ok, onPress: () => Permissions.openSettings() }],
      //     { cancelable: false }
      //   );
      // }
      if (response !== "authorized") {
        Permissions.request("notification", { type: ["alert", "badge"] });
      }
    }
  );
};
export const checkLocationAddSDK = async () => {
  const location = await checkPermissionsWhenInUse();
  if (location) {
    // alert('call true');
    // RNShopSdkBanner.collectDeviceInfoWithContainsLocation(true, `${managerAccount.userId || ''}`, `${managerAccount.name || ''}`, `${managerAccount.zipCode || ''}`, `${managerAccount.birthday || ''}`, `${managerAccount.gender || ''}`, '', '', () => { });
  } else {
    // alert('call flase');
    // RNShopSdkBanner.collectDeviceInfoWithContainsLocation(true, `${managerAccount.userId || ''}`, `${managerAccount.name || ''}`, `${managerAccount.zipCode || ''}`, `${managerAccount.birthday || ''}`, `${managerAccount.gender || ''}`, '', '', () => { });
  }
};
