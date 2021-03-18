import {isIos} from '../constants';

const changeObject = {};
let dataContainer = {};

let countNewNotification = 0;
function broadcast() {
  Object.keys(changeObject).forEach((k) => changeObject[k]());
}

const PushNotificationService = {
  set: async (notiData) => {
    countNewNotification = notiData;
   
  },

  onChange: (key, cb) => {
    changeObject[key] = () => cb(countNewNotification);
  },
  setCountNewNotification: (count) => {
    countNewNotification = count;
    broadcast()
  },

  getCountNewNotification: () => {
    return countNewNotification;
  },
};

export {PushNotificationService};
