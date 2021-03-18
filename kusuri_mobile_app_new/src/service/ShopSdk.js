import { RNShopSdkBanner } from "react-native-shop-sdk";
import { managerAccount } from "../const/System";

const ShopSdk = {
  init: () => {
    RNShopSdkBanner.init();
  },
  collectDeviceInfo: () => {
    RNShopSdkBanner.collectDeviceInfoWithContainsLocation(
      false,
      `${managerAccount.memberCode || ""}`,
      "",
      "",
      `${managerAccount.birthday || ""}`,
      `${managerAccount.gender || ""}`,
      "",
      "",
      () => {}
    );
  }
};
export { ShopSdk };
