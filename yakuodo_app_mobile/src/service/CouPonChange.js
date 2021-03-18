const listeners = {};
let dataSaver = 0;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => dataSaver,
  set: count => {
    // console.log('SET-COUNT', count);
    dataSaver = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(dataSaver);
  },
  unChange: key => {
    delete listeners[key];
  }
};
