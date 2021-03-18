const changeObject = {};
let showBottom = true;
let currentScreen = null;
function broadcast(key) {
  Object.keys(changeObject).forEach((k) => {
    if (k === key) {
      changeObject[k]();
    }
  });
}

const BottomService = {
  get: () => showBottom,
  set: async (data) => {
    showBottom = data;
  },

  setDisplay: async (data) => {
    showBottom = data;
    broadcast('set-bottom');
  },
  setActiveItem: (data) => {
    currentScreen = data;
    broadcast('active-bottom');
  },

  onChange: (key, cb) => {
    changeObject[key] = () => cb(showBottom);
  },
  onChangeScreen: (key, cb) => {
    changeObject[key] = () => cb(currentScreen);
  },

  deleteKey: (key) => {
    if (changeObject[key]) {
      delete changeObject[key];
    }
  },
};

export {BottomService};
