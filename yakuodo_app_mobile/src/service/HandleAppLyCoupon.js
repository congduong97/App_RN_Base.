const listeners = {};
let couponAppLy = null;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => couponAppLy,
  set: count => {
    couponAppLy = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(couponAppLy);
  },
  unChange: key => {
    delete listeners[key];
  }
};
