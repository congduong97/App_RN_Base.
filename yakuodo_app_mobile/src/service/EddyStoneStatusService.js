const listeners = {};
let currentStatus = 'no';
function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => currentStatus,
  set: status => {
    currentStatus = status;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(currentStatus);
  },
  unChange: key => {
    delete listeners[key];
  }
};
