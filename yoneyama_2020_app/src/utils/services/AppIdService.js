import {APP_ID1, AsyncStoreKey, APP_ID2} from '../constants';
import AsyncStorage from '@react-native-community/async-storage';

const changeList = {};

let appId = null;

function broadcastList() {
  Object.keys(changeList).forEach((k) => changeList[k]());
}

const AppIdService = {
  init: async (newAppId = APP_ID1) => {
    appId = newAppId;
  },
  get: () => appId,

  update: async (newAppId) => {
    appId = newAppId;
    await AsyncStorage.setItem(AsyncStoreKey.appId, newAppId);
    broadcastList();
  },

  onChange: (key, cb) => {
    changeList[key] = () => cb(appId);
  },

  deleteKey: (key) => {
    if (changeList[key]) {
      delete changeList[key];
    }
  },
};

export {AppIdService};
