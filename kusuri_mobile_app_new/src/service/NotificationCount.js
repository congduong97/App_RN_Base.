const listeners = {};
let notificationCount = 0;

function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => notificationCount,
  set: count => {
    // console.log('SET-COUNT', count);
    notificationCount = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(notificationCount);
  },
  unChange: key => {
    delete listeners[key];
  }
};
