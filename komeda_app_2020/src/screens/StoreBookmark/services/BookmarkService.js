const changeObject = {};

let data = {};

function broadcast() {
  Object.keys(changeObject).forEach((k) => changeObject[k]());
}

const BookmarkService = {
  get: () => data,
  set: async (newData) => {
    data = {...newData};
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(data);
  },
  deleteKey: (key) => {
    if (changeObject[key]) {
      delete changeObject[key];
    }
  },
};

export {BookmarkService};
