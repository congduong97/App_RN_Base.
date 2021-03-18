import phoneGoogle from "google-libphonenumber";
import { IMAGE_BASE_URL } from "../../networking/ApiUrl";
const PNF = phoneGoogle.PhoneNumberFormat;
const phoneUtil = phoneGoogle.PhoneNumberUtil.getInstance();
import Toast from "react-native-simple-toast";

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
const defaultAvatar = "/img/default-avatar.jpg";
function validatePhoneNumber(phoneNumber) {
  if (phoneNumber && phoneNumber.charAt(0) !== "0") {
    phoneNumber = "0".concat(phoneNumber);
  }
  var phoneno = /(09|08|07|05|03|02)+([0-9]{8,9})\b/g;
  if (phoneNumber) {
    var phone = phoneNumber.trim();
    if (phone != "") {
      if (phone.match(phoneno)) {
        return true;
      }
    }
  }
  return false;
}
function comparePhoneNumber(phoneNumber1, phoneNumber2, regionCode = "VN") {
  if (!isValidPhoneNumber(phoneNumber1) || !isValidPhoneNumber(phoneNumber2)) {
    return false;
  }
  const number1 = phoneUtil.parseAndKeepRawInput(phoneNumber1, regionCode);
  const number2 = phoneUtil.parseAndKeepRawInput(phoneNumber2, regionCode);
  return number1.getNationalNumber() === number2.getNationalNumber();
}

const isValidPhoneNumber = (phoneNumber, regionCode = "VN") => {
  try {
    return !phoneNumber
      ? false
      : phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber, regionCode));
  } catch (error) {
    return false;
  }
};

function getPhoneNumber(phoneNumber, regionCode = "VN") {
  if (!isValidPhoneNumber(phoneNumber, regionCode)) {
    Toast.showWithGravity(
      `Số diện thoại ${phoneNumber} không tồn tại. Kiểm tra lại.`,
      Toast.LONG,
      Toast.CENTER
    );
    return phoneNumber;
  }
  let prefix = "";
  if (regionCode === "VN") {
    prefix = "0";
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
function formatPhoneNumberToNational(phoneNumber) {
  return formatPhoneNumber(phoneNumber, PNF.NATIONAL);
}

/**
 * Format theo dinh dang quoc te
 * @param {*} phoneNumber
 */
function formatPhoneNumberToInternational(phoneNumber) {
  return formatPhoneNumber(phoneNumber, PNF.INTERNATIONAL);
}

/**
 * Format so dien thoai
 * @param {*} phoneNumber
 * @param {*} format
 */
function formatPhoneNumber(phoneNumber, format, regionCode = "VN") {
  if (!isValidPhoneNumber(phoneNumber)) {
    Toast.showWithGravity(
      `Số diện thoại ${phoneNumber} không tồn tại. Kiểm tra lại.`,
      Toast.LONG,
      Toast.CENTER
    );
    return;
  }
  return phoneUtil.format(phoneUtil.parse(phoneNumber, regionCode), format);
}
function checkURL(url) {
  return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

const validateImageUri = (url, imageDefault) => {
  if (url && typeof url === "string" && checkURL(url)) {
    return url.includes("http") ? { uri: url } : { uri: IMAGE_BASE_URL + url };
  }
  return imageDefault;
};

const eraseCharacterVietnameseToLowerCase = (str) => {
  str = str.trim()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ|Ì|Í|Ị|Ỉ|Ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ|Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "y");
  str = str.replace(/đ|Đ/g, "d");
  // Combining Diacritical Marks
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // huyền, sắc, hỏi, ngã, nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); //mũ â (ê), mũ ă, mũ ơ (ư)
  return str.toLowerCase();
}

export {
  validatePhone,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  isValidPhoneNumber,
  comparePhoneNumber,
  formatPhoneNumber,
  formatPhoneNumberToInternational,
  formatPhoneNumberToNational,
  getPhoneNumber,
  validateImageUri,
  eraseCharacterVietnameseToLowerCase,
};
