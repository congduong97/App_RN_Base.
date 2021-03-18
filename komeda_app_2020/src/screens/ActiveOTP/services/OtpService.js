import {AsyncStoreKey} from '../../../utils';
import AsyncStorage from '@react-native-community/async-storage';

const changeObject = {};
let listMail = {};
let dataStored = {};

function broadcast() {
  Object.keys(changeObject).forEach((k) => changeObject[k]());
}

const OtpService = {
  initBlackList: async () => {
    try {
      const result = await AsyncStorage.getItem(AsyncStoreKey.black_mail);
      if (result) {
        listMail = JSON.parse(result);
      }
    } catch (error) {}
  },
  get: () => listMail,
  getCountOtp: (key) => {
    if (key in dataStored) {
      return dataStored[key];
    }
    return 0;
  },

  updateBlackList: async ({email, timeEnd}) => {
    listMail[email] = timeEnd;
    try {
      await AsyncStorage.setItem(
        AsyncStoreKey.black_mail,
        JSON.stringify(listMail),
      );
    } catch (error) {
      return error;
    }
  },
  updateCount: (key, count = 1) => {
    dataStored[key] = dataStored[key] + count;
  },
  initCount: (key) => {
    if (key in dataStored) {
      return;
    } else {
      dataStored[key] = 0;
    }
  },

  removeCount: (key) => {
    dataStored[key] = 0;
  },

  remove: async (key) => {
    delete listMail[key];
    try {
      await AsyncStorage.setItem(
        AsyncStoreKey.black_mail,
        JSON.stringify(listMail),
      );
    } catch (error) {
      return error;
    }
  },
};

export {OtpService};
