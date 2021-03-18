import RN from 'react-native'
const EddyStoneScannerManager = RN.NativeModules.EddyStoneScanner;
const EddyStoneScannerEmitter = RN.DeviceEventEmitter;

function startScanEddyStone() {
  return new Promise((res, rej) => {
    try {
      EddyStoneScannerManager.startScanning()
      res()
    } catch (error) {
      rej()
    }
  })
}

function stopScanEddyStone() {
  return new Promise((res, rej) => {
    try {
      EddyStoneScannerManager.stopScanning();
      res()
    } catch (error) {
      rej()
    }
  })
}

function setUp(url, accessToken, deviceId, namespace, memberCode) {
  EddyStoneScannerManager.setUp(url, accessToken, deviceId, namespace, memberCode);
}

function setShowAdvPopupState(state) {
  EddyStoneScannerManager.setShowAdvPopupState(state);
}

async function isShowAdvPopup() {
  let isShow = "";
  try {
    const data = await EddyStoneScannerManager.isShowAdvPopup();
    if (data) {
      isShow = data.isShowListAdvertisement;
    }
  } catch (error) {
    
  }
  return isShow;
}

export default {
  EddyStoneScannerEmitter,
  startScanEddyStone,
  stopScanEddyStone,
  setUp,
  setShowAdvPopupState,
  isShowAdvPopup,
}
