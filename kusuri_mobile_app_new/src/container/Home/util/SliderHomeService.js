const changeObject = {};
let pKikakuId = null;
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k]()
  );
}
const SliderHomeService = {
  get: () => pKikakuId,
  setId: (id) => {
    pKikakuId = id;
  },
  updateItem: () => {
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(pKikakuId);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default SliderHomeService;
