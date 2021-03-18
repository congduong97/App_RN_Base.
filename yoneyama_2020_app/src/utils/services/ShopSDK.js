import {RNShopSdkBanner} from 'react-native-shop-sdk';
import {AccountService} from './AccountService';

const ShopSdk = {
  init: () => {
    RNShopSdkBanner.init();
  },
  collectDeviceInfo: () => {
    const account = AccountService.getAccount();
    let genderUser = '';
    if (account.gender !== null && account.gender !== undefined) {
      genderUser = account.gender;
    }

    RNShopSdkBanner.collectDeviceInfoWithContainsLocation(
      false,
      `${account.memberCode || ''}`,
      '',
      '',
      `${account.birthday || ''}`,
      `${genderUser}`,
      '',
      '',
      () => {},
    );
  },
};
export {ShopSdk};
