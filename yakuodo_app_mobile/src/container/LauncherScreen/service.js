const listeners = {};
let screenCurrents = null;
function broadcast() {
  // Object.keys(listeners).forEach(k => listeners[k]());
  if (listeners['UpdateScreen']) {
    listeners['UpdateScreen']()
  }
  if (screenCurrents && screenCurrents.type == 'UPDATE_APP') {
    if (listeners['SERCURITY']) {
      listeners['SERCURITY']()
    }
  }


}
function reloadData() {
  if (listeners['SLIDER']) {
    listeners['SLIDER']()
  }
  if (listeners['SERCURITY']) {
    listeners['SERCURITY']()
  }
  if (listeners['BANNER']) {
    listeners['BANNER']()
  }
  if (listeners['DRAWER']) {
    listeners['DRAWER']()
  }
  if (listeners['LIST_MENU']) {
    listeners['LIST_MENU']()
  }
  if (listeners['HEADER']) {
    listeners['HEADER']()
  }
  if (listeners['BOTTOM_MENU']) {
    listeners['BOTTOM_MENU']()
  }
}

export const CheckDataApp = {
  get: () => screenCurrents,
  set: user => {
    screenCurrents = user;
    broadcast();
  },
  reloadDataApp: () => {
    reloadData()
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(screenCurrents);
  },
  unChange: key => {
    delete listeners[key];
  }
};
