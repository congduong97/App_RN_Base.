const listeners = {};
let networkStatus = false;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => networkStatus,
  set: status => {
    // console.log('SET-COUNT', count);
    networkStatus = status;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(networkStatus);
  },
  unChange: key => {
    delete listeners[key];
  }
};
