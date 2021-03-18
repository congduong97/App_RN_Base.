const listListtenEvent = {};
let eventUpdate = null;
function broadcast() {
  Object.keys(listListtenEvent).forEach(
    (k) => listListtenEvent[k] && listListtenEvent[k](eventUpdate),
  );
}

const ServicesActiveUpdateInfo = {
  get: () => eventUpdate,
  set: (data) => {
    eventUpdate = data;
    broadcast();
  },
  onChange: (key, callBack) => {
    listListtenEvent[key] = () => callBack(eventUpdate);
  },
  removeKey: (key) => {
    delete listListtenEvent[key];
  },
};

export {ServicesActiveUpdateInfo};
