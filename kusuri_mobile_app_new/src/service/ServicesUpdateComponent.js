const changeObject = {};
let eventGetNotiHome = '';
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
const ServicesUpdateComponent = {
  get: () => eventGetNotiHome,
  set: (event) => {
    eventGetNotiHome = event;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(eventGetNotiHome);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesUpdateComponent;
