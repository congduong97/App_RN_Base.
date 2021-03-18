const listListtenEvent = {};
let eventRegisAccount = null;
function broadcast() {
  Object.keys(listListtenEvent).forEach(
    (k) => listListtenEvent[k] && listListtenEvent[k](eventRegisAccount),
  );
}

const ServicesCheckValidateForm = {
  get: () => eventRegisAccount,
  set: (data) => {
    eventRegisAccount = data;
    broadcast();
  },
  onChange: (key, callBack) => {
    listListtenEvent[key] = () => callBack(eventRegisAccount);
  },
  removeKey: (key) => {
    delete listListtenEvent[key];
  },
};

export {ServicesCheckValidateForm};
