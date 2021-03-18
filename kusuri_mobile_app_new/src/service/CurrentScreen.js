const listeners = {};
let screenCurrents = null;
function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => screenCurrents,
  set: user => {
    screenCurrents = user;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(screenCurrents);
  },
  unChange: key => {
    delete listeners[key];
  }
};
