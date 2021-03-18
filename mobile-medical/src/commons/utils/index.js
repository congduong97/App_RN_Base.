import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  scale,
  windowSize,
  navBarHeight,
  ratioW,
  scaleTemplate,
  ratioWTemplate,
  ratioH,
  ratio,
  deviceLanguage,
  verticalScale,
  widthPercent,
  heightSheet,
} from "./Devices";
import {
  validatePhone,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateImageUri,
  isValidPhoneNumber,
  comparePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberToInternational,
  formatPhoneNumberToNational,
  getPhoneNumber,
} from "./Validate";

import {
  formatCurrency,
  formatCopyInUnitK,
  formatCurrencyWithoutUnit,
  formatMoney,
  fromDateFormat,
  getDiffDays,
  convertTimeDate,
  convertTimeDateFormatVN,
  convertStringToFormatServer,
  convertGetDateTime,
  convertTimeDateVN,
  getHourseWork,
  hmsToSecondsOnly,
} from "./DateTime";
import { concatenateString, fontsPercentage, fontsValue } from "./Format";

function convertToArray(objectsArray) {
  let copyOfJsonArray = Array.from(objectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

function deepCopyObject(objectRaw) {
  if (!objectRaw) {
    return "";
  }
  if (Array.isArray(objectRaw)) {
    let objectArray = Array.from(objectRaw);
    return JSON.parse(JSON.stringify(objectArray));
  }
  return JSON.parse(JSON.stringify(objectRaw));
}

const mergeByProperty = (target, source, prop) => {
  if (!target) {
    target = [];
  }
  source.forEach((sourceElement) => {
    let targetElement = target.find(
      (item) => sourceElement[prop] === item[prop]
    );
    targetElement
      ? Object.assign(targetElement, sourceElement)
      : target.push(sourceElement);
  });
  return target;
};

const groupBy = (array, key) => {
  if (!array) return [];
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  scale,
  windowSize,
  navBarHeight,
  ratioW,
  scaleTemplate,
  ratioWTemplate,
  ratioH,
  ratio,
  deviceLanguage,
  verticalScale,
  widthPercent,
  ////
  validatePhone,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateImageUri,
  isValidPhoneNumber,
  comparePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberToInternational,
  formatPhoneNumberToNational,
  getPhoneNumber,
  ///
  heightSheet,
  convertToArray,
  deepCopyObject,
  mergeByProperty,
  groupBy,
  ///
  formatCurrency,
  formatCopyInUnitK,
  formatCurrencyWithoutUnit,
  formatMoney,
  fromDateFormat,
  getDiffDays,
  convertTimeDate,
  convertTimeDateFormatVN,
  convertStringToFormatServer,
  convertGetDateTime,
  convertTimeDateVN,
  getHourseWork,
  hmsToSecondsOnly,
  ///
  concatenateString,
  fontsPercentage,
  fontsValue,
};
