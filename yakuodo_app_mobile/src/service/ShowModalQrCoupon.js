const listeners = {};
let stateModal = null;
function broadcast() {
  Object.keys(listeners).forEach(k => listeners[k]());
}

export default {
  get: () => stateModal,
  set: use => {
    stateModal = use;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(stateModal);
  },
  unChange: key => {
    delete listeners[key];
  }
};
