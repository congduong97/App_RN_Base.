const changeObject = {};
let ojbPointAndMoney = {
  money: 0,
  point: 0,
};
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
const ServicesUpdatePointAndMoneyHome = {
  get: () => ojbPointAndMoney,
  set: (data) => {
    ojbPointAndMoney = data;
    broadcast();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(ojbPointAndMoney);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};
export default ServicesUpdatePointAndMoneyHome;
