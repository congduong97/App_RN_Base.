const listeners = {};
let userInfo = null;
function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export const ServiveModal = {
  get: () => userInfo,
  set: user => {
    userInfo = user;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(userInfo);
  },
  unChange: key => {
    delete listeners[key];
  },
};

const listenerdeeplink = {};
let dataDeepLink = {
  detailId: '',
  keySeach: '',
  nameFunction: '',
  referralCode: '',
};
function broadcastdeeplink() {
  Object.keys(listenerdeeplink).forEach(k => listenerdeeplink[k]());
}
export const serviceDeeplink = {
  get: () => dataDeepLink,
  set: data => {
    // console.log('vao set');
    dataDeepLink = data;
    broadcastdeeplink();
  },
  onChange: (key, cb) => {
    listenerdeeplink[key] = () => cb(dataDeepLink);
  },
  unChange: key => {
    delete listenerdeeplink[key];
  },
};

const listenerdeeplinkintro = {};
let dataDeepLinkIntro = {
  referralCode: '',
};
function broadcastdeeplinkreferralCoupon() {
  Object.keys(listenerdeeplinkintro).forEach(k => listenerdeeplinkintro[k]());
}
export const serviceDeeplinkReferralCoupon = {
  get: () => dataDeepLinkIntro,
  set: data => {
    dataDeepLinkIntro = data;
    broadcastdeeplinkreferralCoupon();
  },
  onChange: (key, cb) => {
    listenerdeeplinkintro[key] = () => cb(dataDeepLinkIntro);
  },
  unChange: key => {
    if (listenerdeeplinkintro[key]) {
      delete listenerdeeplinkintro[key];
    }
  },
};
