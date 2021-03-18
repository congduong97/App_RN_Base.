const changeObject = {};
let numberChangeIconApp = 0;
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
const ServicesChangeIconBagger = {
  get: () => numberChangeIconApp,
  set: (data) => {
    numberChangeIconApp = data;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(numberChangeIconApp);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesChangeIconBagger;
