const changeEvent = {};
let event = "";
function broadcast() {
  Object.keys(changeEvent).forEach((k) => changeEvent[k] && changeEvent[k]());
}
const ServicesRenderQuestionRecords = {
  get: () => event,
  set: (event) => {
    event = event;
    broadcast();
  },
  onChange: (key, cb) => {
    changeEvent[key] = () => cb(event);
  },
  remove: (key) => {
    delete changeEvent[key];
  },
};
export default ServicesRenderQuestionRecords;
