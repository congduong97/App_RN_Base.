const listeners = {};
let drawerControl = false;

function broadcast() {
  if (listeners[`InputLogin${drawerControl.index}${drawerControl.nameScreen}`]) {
    listeners[`InputLogin${drawerControl.index}${drawerControl.nameScreen}`]()
  }
  // Object.keys(listeners).forEach(k => listeners[k]());
}

export const HandleInput = {
  get: () => drawerControl,
  set: count => {
    // console.log('SET-COUNT', count);
    drawerControl = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(drawerControl);
  },
  unChange: key => {
    delete listeners[key];
  }
};
