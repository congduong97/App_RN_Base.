import RN from 'react-native'
const PARSER_IBEACON = 'm:0-3=4c000215,i:4-19,i:20-21,i:22-23,p:24-24';
const PARSER_ESTIMOTE = 'm:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24';
const PARSER_ALTBEACON = 'm:2-3=beac,i:4-19,i:20-21,i:22-23,p:24-24,d:25-25';
const PARSER_EDDYSTONE_TLM = 'x,s:0-1=feaa,m:2-2=20,d:3-3,d:4-5,d:6-7,d:8-11,d:12-15';
const PARSER_EDDYSTONE_UID = 's:0-1=feaa,m:2-2=00,p:3-3:-41,i:4-13,i:14-19';
const PARSER_EDDYSTONE_URL = 's:0-1=feaa,m:2-2=10,p:3-3:-41,i:4-20v';

const transmissionSupport = [
  'SUPPORTED',
  'NOT_SUPPORTED_MIN_SDK',
  'NOT_SUPPORTED_BLE',
  'DEPRECATED_NOT_SUPPORTED_MULTIPLE_ADVERTISEMENTS',
  'NOT_SUPPORTED_CANNOT_GET_ADVERTISER',
  'NOT_SUPPORTED_CANNOT_GET_ADVERTISER_MULTIPLE_ADVERTISEMENTS',
];

// #region instanciation and constants
const BeaconsManager = RN.NativeModules.RNiBeacon;
const BeaconsEventEmitter = RN.DeviceEventEmitter;

const ARMA_RSSI_FILTER = BeaconsManager && BeaconsManager.ARMA_RSSI_FILTER || undefined;
const RUNNING_AVG_RSSI_FILTER = BeaconsManager && BeaconsManager.RUNNING_AVG_RSSI_FILTER || undefined;
// #endregion

function setHardwareEqualityEnforced(flag) {
  BeaconsManager.setHardwareEqualityEnforced(flag);
}

// #region iBeacon
/**
 * set beacon layout for iBeacon
 *
 */
function detectIBeacons() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_IBEACON, resolve, reject);
  });
}

/**
 * same as detectIBeacons (intoduced in v1.1.0)
 * adds iBeacon parser to detect them
 *
 */
function addIBeaconsDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_IBEACON, resolve, reject);
  });
}

/**
 * removes iBeacon parser to stop detecting them
 *
 */
function removeIBeaconsDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_IBEACON, resolve, reject);
  });
}
// #enregion

// #region altBeacon
/**
 * set beacon layout for alBeacon
 *
 */
function detectAltBeacons() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_ALTBEACON, resolve, reject);
  });
}

function addAltBeaconsDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_ALTBEACON, resolve, reject);
  });
}

function removeAltBeaconsDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_ALTBEACON, resolve, reject);
  });
}
// #endregion

// #region estimote
/**
 * set beacon layout for estimote
 *
 */
function detectEstimotes() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_ESTIMOTE, resolve, reject);
  });
}

function addEstimotesDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_ESTIMOTE, resolve, reject);
  });
}

function removeEstimotesDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_ESTIMOTE, resolve, reject);
  });
}
// #endregion

// #region eddystone UID
/**
 * set beacon layout for eddystone UID
 *
 */
function detectEddystoneUID() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_UID, resolve, reject);
  });
}

/**
 * same as detectEddystoneUID (intoduced in v1.1.0)
 * adds EddystoneUID parser to detect them
 *
 */
function addEddystoneUIDDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_UID, resolve, reject);
  });
}

/**
 * removes EddystoneUID parser to stop detecting them
 *
 */
function removeEddystoneUIDDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_EDDYSTONE_UID, resolve, reject);
  });
}
// #endregion

// #region eddystone URL
/**
 * set beacon layout for eddystone URL
 *
 */
function detectEddystoneURL() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_URL, resolve, reject);
  });
}

function addEddystoneURLDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_URL, resolve, reject);
  });
}

function removeEddystoneURLDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_EDDYSTONE_URL, resolve, reject);
  });
}
// #endregion

// #region eddystone TLM
/**
 * set beacon layout for eddystone TLM
 *
 */
function detectEddystoneTLM() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_TLM, resolve, reject);
  });
}

function addEddystoneTLMDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(PARSER_EDDYSTONE_TLM, resolve, reject);
  });
}

function removeEddystoneTLMDetection() {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(PARSER_EDDYSTONE_TLM, resolve, reject);
  });
}
// #endregion

// #region custom beacon (set your parser)
/**
 * set beacon for custom layout
 *
 */
function detectCustomBeaconLayout(parser) {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(parser, resolve, reject);
  });
}

function addCustomBeaconLayoutDetection(parser) {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParser(parser, resolve, reject);
  });
}

function removeCustomBeaconLayoutDetection(parser) {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParser(parser, resolve, reject);
  });
}
// #endregion

// #region add remove multiple parsers in a row
function addParsersListToDetection(parsers) {
  return new Promise((resolve, reject) => {
    BeaconsManager.addParsersListToDetection(parsers, resolve, reject);
  });
}

function removeParsersListToDetection(parsers) {
  return new Promise((resolve, reject) => {
    BeaconsManager.removeParsersListToDetection(parsers, resolve, reject);
  });
}
// #endregion

function setBackgroundScanPeriod(period) {
  BeaconsManager.setBackgroundScanPeriod(period);
}

function setBackgroundBetweenScanPeriod(period) {
  BeaconsManager.setBackgroundBetweenScanPeriod(period);
}

function setForegroundScanPeriod(period) {
  BeaconsManager.setForegroundScanPeriod(period);
}

function setRssiFilter(filterType, avgModifier) {
  BeaconsManager.setRssiFilter(filterType, avgModifier);
}

function getRangedRegions() {
  return new Promise((resolve, reject) => {
    BeaconsManager.getRangedRegions(resolve);
  });
}

/**
 * get monitored regions
 *
 * @returns {Promise<Array<BeaconRegion>>} promise resolve to an array of monitored regions
 */
function getMonitoredRegions() {
  return new Promise((resolve, reject) => {
    BeaconsManager.getMonitoredRegions(resolve);
  });
}

/**
 * check if beacon support transmission
 *
 * @returns {Promise<number>} promise resolve to an integer
 */
function checkTransmissionSupported() {
  return new Promise((resolve, reject) => {
    BeaconsManager.checkTransmissionSupported(status =>
      resolve(transmissionSupport[status]),
    );
  });
}

/**
 * start monitoring for a region
 *
 * @param {Object: BeaconRegion} region region to monitor (identifier + uuid -> major and minor are optional)
 * @returns {Promise<any>} promise resolves to void or error
 */
function startMonitoringForRegion(region) {
  return new Promise((resolve, reject) => {
    // NOTE: major and minor are optional values: if user don't assign them we have to send a null value (not undefined):
    BeaconsManager.startMonitoring(
      region.identifier,
      region.uuid,
      region.minor ? region.minor : -1,
      region.major ? region.major : -1,
      resolve,
      reject,
    );
  });
}

/**
 * stops monittorings for a region
 *
 * @param {BeaconRegion} region region (see BeaconRegion type)
 * @returns {Promise<any>} promise resolves to void or error
 */
function stopMonitoringForRegion(region) {
  return new Promise((resolve, reject) => {
    BeaconsManager.stopMonitoring(
      region.identifier,
      region.uuid,
      region.minor ? region.minor : -1,
      region.major ? region.major : -1,
      resolve,
      reject,
    );
  });
}

/**
 * start ranging a region (with optional UUID)
 *
 * @param {String | BeaconRegion} regionId if string or region: BeaconRegion object
 * @param {String} [beaconsUUID] optional UUID
 * @returns {Promise<any>} promise resolves to void or error
 */
function startRangingBeaconsInRegion(
  region,
  beaconsUUID = null
){
  if (typeof region === 'object') {
    return new Promise((resolve, reject) => {
      BeaconsManager.startRanging(
        // $FlowIgnore
        region.identifier,
        // $FlowIgnore
        region.uuid,
        resolve,
        reject,
      );
    });
  }
  return new Promise((resolve, reject) => {
    BeaconsManager.startRanging(region, beaconsUUID, resolve, reject);
  });
}

/**
 * Stops the range scan for beacons
 *
 * @param {String | BeaconRegion} regionId if string or region: BeaconRegion object
 * @param {string} beaconsUUID optional UUID within the specified region
 * @returns {Promise<any>} promise: resolves to void when successful
 */
function stopRangingBeaconsInRegion(
  region,
  beaconsUUID = null
) {
  if (typeof region === 'object') {
    return new Promise((resolve, reject) => {
      BeaconsManager.stopRanging(
        // $FlowIgnore
        region.identifier,
        // $FlowIgnore
        region.uuid,
        resolve,
        reject,
      );
    });
  }
  return new Promise((resolve, reject) => {
    // $FlowIgnore
    BeaconsManager.stopRanging(region, beaconsUUID, resolve, reject);
  });
}

/**
 * Retrieves the state of a region asynchronously.
 *
 * @param {BeaconRegion} region region (identifier + uuid -> major and minor are optional)
 */
function requestStateForRegion(region) {
  BeaconsManager.requestStateForRegion(
    region.identifier,
    region.uuid,
    region.minor ? region.minor : -1,
    region.major ? region.major : -1,
  );
}

export default {
  // parsers constants
  PARSER_IBEACON,
  PARSER_ESTIMOTE,
  PARSER_ALTBEACON,
  PARSER_EDDYSTONE_TLM,
  PARSER_EDDYSTONE_UID,
  PARSER_EDDYSTONE_URL,

  BeaconsEventEmitter,
  setHardwareEqualityEnforced,
  // iBeacons:
  detectIBeacons,
  addIBeaconsDetection,
  removeIBeaconsDetection,
  // alt beacons:
  detectAltBeacons,
  addAltBeaconsDetection,
  removeAltBeaconsDetection,
  // Estimotes beacon:
  detectEstimotes,
  addEstimotesDetection,
  removeEstimotesDetection,
  // Eddystone UID beacons:
  detectEddystoneUID,
  addEddystoneUIDDetection,
  removeEddystoneUIDDetection,
  // Eddystone TLM beacons:
  detectEddystoneTLM,
  addEddystoneTLMDetection,
  removeEddystoneTLMDetection,
  // Eddystone URL beacons:
  detectEddystoneURL,
  addEddystoneURLDetection,
  removeEddystoneURLDetection,
  // custom layout beacons (NOTE: create 'valid UUID' with websites like, for instance, this one: https://openuuid.net):
  detectCustomBeaconLayout,
  addCustomBeaconLayoutDetection,
  removeCustomBeaconLayoutDetection,

  addParsersListToDetection,
  removeParsersListToDetection,

  setBackgroundScanPeriod,
  setBackgroundBetweenScanPeriod,
  setForegroundScanPeriod,
  setRssiFilter,
  checkTransmissionSupported,
  getRangedRegions,
  ARMA_RSSI_FILTER,
  RUNNING_AVG_RSSI_FILTER,

  getMonitoredRegions,

  // common with iOS:
  startMonitoringForRegion,
  startRangingBeaconsInRegion,
  stopMonitoringForRegion,
  stopRangingBeaconsInRegion,
  requestStateForRegion,
};