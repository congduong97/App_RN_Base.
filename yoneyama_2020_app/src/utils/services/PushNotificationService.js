import {isIos} from '../constants';

const changeObject = {};
let dataStored = {};
let dataContainer = {};

function broadcast() {
  Object.keys(changeObject).forEach((k) => changeObject[k]());
}

const PushNotificationService = {
  set: async (notiData) => {
    dataContainer = notiData;
    dataStored = isIos ? notiData.data.data : notiData.data;
  },
  setAndBroadcast: async (notiData) => {
    dataContainer = notiData;
    dataStored = isIos ? notiData.data.data : notiData.data;
    broadcast();
  },

  onChange: (key, cb) => {
    changeObject[key] = () => cb(dataStored, dataContainer);
  },
};

export {PushNotificationService};
