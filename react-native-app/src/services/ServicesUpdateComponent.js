const changeObject = {};
let event = '';
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
const ServicesUpdateComponent = {
  get: () => event,
  set: (active) => {
    event = active;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(event);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesUpdateComponent;
