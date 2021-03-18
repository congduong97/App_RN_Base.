import RN from 'react-native'
const EddyStoneScannerManager = RN.NativeModules.EddyStoneScanner;
const EddyStoneScannerEmitter = EddyStoneScannerManager && new RN.NativeEventEmitter(EddyStoneScannerManager) || undefined;

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

checkBluetoothPermission = async ()=> {
  let status = 0;
  try {
    status = await EddyStoneScannerManager.checkBluetoothPermission();
  } catch (error) {
    
  }
  return status;
}

export default {
  EddyStoneScannerEmitter,
  startScanEddyStone,
  stopScanEddyStone,
  checkBluetoothPermission,
}
