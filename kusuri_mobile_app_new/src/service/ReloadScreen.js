const listeners = {};
let screenCurrents = null;
function broadcast(screenNeedReload) {
    if(listeners[screenNeedReload]){
        listeners[screenNeedReload]()
    }
}

export default {
  get: () => screenCurrents,
  set: screenNeedReload => {
    screenCurrents = screenNeedReload;
    broadcast(screenNeedReload);
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(screenCurrents);
  },
  unChange: key => {
    delete listeners[key];
  }
};