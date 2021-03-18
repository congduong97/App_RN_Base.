import AsyncStorage from "@react-native-community/async-storage";
const changeObject = {};
const keyAsyncStorage = "qrCodeScanner";
let ojbRegisterQR = {};
let ojbRegisterQrDTOUpdate = {};
function broadcast() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k]()
  );
}
const ServicesDataDto = {
  set: (dataApiHandleQRCode) => {
    ojbRegisterQR = dataApiHandleQRCode;
    console.log("%c Cục to bự = ", "color:red", ojbRegisterQR);
    broadcast();
  },
  setLocal: (dataApiHandleQRCode) => {
    saveDataScanner(dataApiHandleQRCode);
  },
  get: () => {
    return ojbRegisterQR;
  },
  getOjbDtoUpdate: () => {
    return ojbRegisterQrDTOUpdate;
  },
  getLocal: async () => {
    let dataLocal = {};
    await AsyncStorage.getItem(keyAsyncStorage).then((res) => {
      if (res) {
        dataLocal = JSON.parse(res);
        ojbRegisterQrDTOUpdate = dataLocal;
      }
    });
    return dataLocal;
  },
  updateOjbDTO: (ojbDtoUpdate) => {
    ojbRegisterQrDTOUpdate = ojbDtoUpdate;
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(ojbRegisterQR);
  },
  updatePropsOjb: (keyOjb, propsNeedUpdate) => {
    ojbRegisterQR[keyOjb] = propsNeedUpdate;
  },
  remove: (key) => {
    delete changeObject[key];
  },
};

const saveDataScanner = async (dataApiHandleQRCode) => {
  AsyncStorage.setItem(keyAsyncStorage, JSON.stringify(dataApiHandleQRCode));
};
export default ServicesDataDto;
