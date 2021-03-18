import moment from 'moment';
const zone = moment().utcOffset();
import numeral from 'numeral';
import {deviceLanguage} from './devices';
export const FORMAT_SERVER = 'YYYY/MM/DD HH:mm:ss';
export const FORMAT_DD_MM_YYY_HH_MM_SS = 'DD/MM/YYYY HH:mm:ss';
export const FORMAT_HH_MM_SS_DD_MM_YYY = 'HH:mm:ss DD/MM/YYYY';
export const FORMAT_HH_MM_DD_MM_YYY = 'HH:mm DD/MM/YYYY';
export const FORMAT_DD_MM_YYYY = 'DD/MM/YYYY';
export const FORMAT_YYYY_MM_DD = 'YYYY-MM-DD';
export const FORMAT_DDMMYYYY = 'DD-MM-YYYY';

export const formatCurrency = (number) =>
  `${numeral(number || 0)
    .format('0,0')
    .replace(/,/g, ',')} ₫`;

export const formatCurrencyToCopy = (number) =>
  `${numeral(number / 1000 || 0)
    .format('0')
    .replace(/,/g, ',')}k`;


export const formatCopyInUnitK = (number) =>
  `${numeral(number / 1000)
    .format('0,0')
    .replace(/,/g, ',')}k`;

export const formatCurrencyWithoutUnit = (number) =>
  `${numeral(number || 0)
    .format('0,0')
    .replace(/,/g, ',')}`;

export const formatMoney = (money) => `${money / 1000}K`;

export const fromDateFormat = (date1, date2 = moment()) => {
  moment.locale(deviceLanguage.substring(0, 2));
  date1 = moment(new Date(date1));
  let diffDays = getDiffDays(date1);

  let dateFormat = date1.subtract(diffDays, 'days').calendar();

  return dateFormat;
};

export const getDiffDays = (date1, date2 = moment()) => {
  date1 = moment(new Date(date1));
  let diffDays = date2.diff(date1, 'days');
  return diffDays;
};

export const convertTimeDate = (valueDate, format) => {
  if (!valueDate) return '';
  return moment(valueDate, FORMAT_SERVER)
    .utcOffset(zone * 2)
    .format(format);
};

export const convertTimeDateFromToFormat = (valueDate, formatFrom, formatTo) => {
  if (!valueDate) return '';
  return moment(valueDate, formatFrom)
    .utcOffset(zone * 2)
    .format(formatTo);
};


export const convertTimeDateFormatVN = (valueDate) => {
  if (!valueDate) return '';
  return convertTimeDate(valueDate, FORMAT_DD_MM_YYY_HH_MM_SS);
};

export const concatenateString = (characterSepara, ...strings) => {
  let resultString = '';
  characterSepara = characterSepara ? characterSepara : ',';
  if (!strings) return resultString;
  if (strings && strings.length > 0) {
    strings.forEach((item) => {
      if (item) {
        resultString += `${item}${characterSepara}`;
      }
    });

    resultString = resultString.substring(0, resultString.length - 2);
  }
  return resultString;
};


