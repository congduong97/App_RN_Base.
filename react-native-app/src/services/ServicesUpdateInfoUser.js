const changeObject = {};
let infoUserUpdate = '';
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
const ServicesUpdateInfoUser = {
  get: () => infoUserUpdate,
  set: (ojbUpdate) => {
    infoUserUpdate = ojbUpdate;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(infoUserUpdate);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesUpdateInfoUser;
