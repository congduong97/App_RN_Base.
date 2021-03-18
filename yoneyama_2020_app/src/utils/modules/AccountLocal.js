import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStoreKey} from '../constants/System';

const AccountLocal = {
  save: async (account) => {
    //account: Object
    const accountJson = JSON.stringify(account);
    try {
      const result = await AsyncStorage.setItem(
        AsyncStoreKey.account,
        accountJson,
      );
      return result;
    } catch (error) {
      return error;
    }
  },

  remove: () => {
    AsyncStorage.removeItem(AsyncStoreKey.account);
  },

  get: async () => {
    try {
      const result = await AsyncStorage.getItem(AsyncStoreKey.account);

      if (result) {
        const account = JSON.parse(result);
        return account;
      }
    } catch (error) {
      return null;
    }
  },
};

const InforLocal = {
  save: async (infor) => {
    //account: Object
    const inforJSON = JSON.stringify(infor);
    try {
      const result = await AsyncStorage.setItem(AsyncStoreKey.info, inforJSON);
      return result;
    } catch (error) {
      return error;
    }
  },

  remove: () => {
    AsyncStorage.removeItem(AsyncStoreKey.info);
  },

  get: async () => {
    try {
      const result = await AsyncStorage.getItem(AsyncStoreKey.info);

      if (result) {
        const information = JSON.parse(result);
        return information;
      }
    } catch (error) {
      return error;
    }
  },
};
export {AccountLocal, InforLocal};
