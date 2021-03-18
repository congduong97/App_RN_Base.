const listeners = {};
let userInfo = null;
function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
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
  }
};
