const changeObject = {};
let index = null;

function broadcast() {
  Object.keys(changeObject).forEach((k) => changeObject[k]());
}

const QuestionService = {
  get: () => dataStored,

  setAndBroadcast: async (data) => {
    index = data;
    broadcast();
  },

  onChange: (key, cb) => {
    changeObject[key] = () => cb(index);
  },

  deleteKey: (key) => {
    if (changeObject[key]) {
      delete changeObject[key];
    }
  },
};

export {QuestionService};
