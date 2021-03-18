import * as ApiUrl from './../../networking/ApiUrl';
import phoneGoogle from 'google-libphonenumber';
const PNF = phoneGoogle.PhoneNumberFormat;
const phoneUtil = phoneGoogle.PhoneNumberUtil.getInstance();
import Toast from 'react-native-simple-toast';
import Icon from '../../commons/constants/Icon';

const validatePhone = (phone) => {
  const regEx = /^0[0-9]{9}$/;
  return regEx.test(phone);
};
const validateEmail = (email) => {
  var regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  const re = /([(a-zA-Z)?(0-9)?]{6,})/;
  return re.test(password.trim());
};

function validatePhoneNumber(phoneNumber) {
  if (phoneNumber && phoneNumber.charAt(0) !== '0') {
    phoneNumber = '0'.concat(phoneNumber);
  }
  var phoneno = /(09|08|07|05|03|02)+([0-9]{8,9})\b/g;
  if (phoneNumber) {
    var phone = phoneNumber.trim();
    if (phone != '') {
      if (phone.match(phoneno)) {
        return true;
      }
    }
  }
  return false;
}

const validateImageUri1 = (url) => {
  if (url && typeof url === 'string') {
    return url.includes('http') ? url : ApiUrl.IMAGE_BASE_URL + url;
  }
  return null;
};

const isImageType = (url) => {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
};

const validateImageUri = (url, imageDefault = Icon.avatarDefault) => {
  if (url && typeof url === 'string' && isImageType(url)) {
    return url.includes('http')
      ? {uri: url}
      : {uri: ApiUrl.IMAGE_BASE_URL + url};
  }
  return imageDefault;
};

export function comparePhoneNumber(
  phoneNumber1,
  phoneNumber2,
  regionCode = 'VN',
) {
  if (!isValidPhoneNumber(phoneNumber1) || !isValidPhoneNumber(phoneNumber2)) {
    return false;
  }
  const number1 = phoneUtil.parseAndKeepRawInput(phoneNumber1, regionCode);
  const number2 = phoneUtil.parseAndKeepRawInput(phoneNumber2, regionCode);
  return number1.getNationalNumber() === number2.getNationalNumber();
}

const isValidPhoneNumber = (phoneNumber, regionCode = 'VN') => {
  try {
    return !phoneNumber
      ? false
      : phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, regionCode));
  } catch (error) {
    return false;
  }
};

export function getPhoneNumber(phoneNumber, regionCode = 'VN') {
  if (!isValidPhoneNumber(phoneNumber, regionCode)) {
    Toast.showWithGravity(
      `Số diện thoại ${phoneNumber} không tồn tại. Kiểm tra lại.`,
      Toast.LONG,
      Toast.CENTER,
    );
    return phoneNumber;
  }
  let prefix = '';
  if (regionCode === 'VN') {
    prefix = '0';
  }
  return (
    prefix +
    phoneUtil.parseAndKeepRawInput(phoneNumber, regionCode).getNationalNumber()
  );
}

/**
 *
 * @param {format theo quoc gia hien tai} phoneNumber
 */
export function formatPhoneNumberToNational(phoneNumber) {
  return formatPhoneNumber(phoneNumber, PNF.NATIONAL);
}

/**
 * Format theo dinh dang quoc te
 * @param {*} phoneNumber
 */
export function formatPhoneNumberToInternational(phoneNumber) {
  return formatPhoneNumber(phoneNumber, PNF.INTERNATIONAL);
}

/**
 * Format so dien thoai
 * @param {*} phoneNumber
 * @param {*} format
 */
export function formatPhoneNumber(phoneNumber, format, regionCode = 'VN') {
  if (!isValidPhoneNumber(phoneNumber)) {
    Toast.showWithGravity(
      `Số diện thoại ${phoneNumber} không tồn tại. Kiểm tra lại.`,
      Toast.LONG,
      Toast.CENTER,
    );
    return;
  }
  return phoneUtil.format(phoneUtil.parse(phoneNumber, regionCode), format);
}

export {
  validatePhone,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateImageUri,
  isValidPhoneNumber,
  isImageType,
};
