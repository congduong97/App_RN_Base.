const changeObject = {};
let eventGetMaintain = "";
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k]()
  );
}
const ServicesUpdateComponent = {
  get: () => eventGetMaintain,
  set: (event) => {
    eventGetMaintain = event;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(eventGetMaintain);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesUpdateComponent;
