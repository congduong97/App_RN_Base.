const listeners = {};
let couponDelete = 0;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => couponDelete,
  set: count => {
    // console.log('SET-COUNT', count);
    couponDelete = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(couponDelete);
  },
  unChange: key => {
    delete listeners[key];
  }
};
