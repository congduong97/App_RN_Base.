import {STRINGS} from '../resources';
const toASCII = (chars) => {
  var ascii = '';
  for (var i = 0, l = chars.length; i < l; i++) {
    var c = chars[i].charCodeAt(0);
    // console.log(c, 'old c');
    if (
      c == 0x30fc ||
      c == 0x2212 ||
      c == 0x2010 ||
      c == 0x2014 ||
      c == 0x2015
    ) {
      c = 0x2d; // dau -
    }
    if (c == 0x2019) {
      c = 0x27; // dau '
    }
    if (c == 0x3002) {
      c = 0x2e; // dau .
    }
    // make sure we only convert half-full width char
    if (c >= 0xff00 && c <= 0xffef) {
      if (c == 0xff70 || c == 0xffda) {
        c = 0x2d; // dau -
      } else if (c == 0xff61) {
        c = 0x2e; // dau .
      } else {
        c = 0xff & (c + 0x20);
      }
    }
    // console.log(c, 'new c');
    ascii += String.fromCharCode(c);
  }

  return ascii;
};
/* eslint-disable eqeqeq */
const Validate = {
  email: (email) => {
    let status = false;
    let message = null;
    const re = /^([^<>()\\[\]\,;:\s@"]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length === 0 || !re.test(toASCII(email))) {
      status = false;
      message = 'メールアドレスが正しくありません。';
    } else {
      status = true;
      message = null;
    }
    return {status, message};
  },

  //Validate pass:
  password: (password) => {
    let status = false;
    let message = null;
    // const re = /(?=.*[0-9])(?=.*[a-zA-Z])/;
    const re = /^[A-Za-z0-9]*(?=.*[0-9])(?=.*[a-zA-Z])[A-Za-z0-9]*$/;
    // const re1 = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (password.length < 8 || password.length > 32) {
      status = false;
      message = 'パスワードは8文字以上32文字以内で入力してください。';
    } else if (!re.test(password)) {
      status = false;
      message = 'パスワードは英数それぞれ1文字以上含め入力してください。';
    } else {
      status = true;
      message = null;
    }
    return {status, message};
  },

  emptyContentOnly: (text) => {
    let status = false;
    let content = null;
    if (text.length === 0) {
      status = false;
      content = `${STRINGS.this_field_is_required}`;
    } else {
      status = true;
      content = null;
    }
    return {status, content};
  },

  numberContent: (text) => {
    let status = false;
    let content = null;
    const re = /^\d*$/;
    if (text.length === 0) {
      status = false;
      content = `${STRINGS.this_field_is_required}`;
    } else if (!re.test(text)) {
      status = false;
      content = STRINGS.only_contain_number;
    } else {
      status = true;
      content = null;
    }
    return {status, content};
  },

  sameContent: (text1, text2, field) => {
    let status = false;
    let content = null;

    if (text2 === null || text2.length === 0) {
      status = false;
      content = STRINGS.this_field_is_required;
      return {status, content};
    }
    if (text1 === '' || text1 === null) {
      status = false;
      content = `${field}`;
    } else if (text1 === text2) {
      status = true;
      content = null;
    } else if (text1 !== text2) {
      status = false;
      content = `${field}`;
    }
    return {status, content};
  },

  phoneNumber: (phone) => {
    let status = false;
    let content = null;
    const re = /^([0-9]{11})$/;
    if (phone === null || phone.length === 0) {
      status = false;
      content = STRINGS.this_field_is_required;
    } else if (!re.test(phone)) {
      status = false;
      content = STRINGS.phone_number_contain_10_numbers_and_only_numbers;
    } else {
      status = true;
      content = null;
    }
    return {status, content};
  },

  zipCode: (text) => {
    let status = false;
    let content = null;
    const re = /^([0-9]{7})$/;
    if (text.length === 0) {
      status = false;
      content = STRINGS.this_field_is_required;
    } else if (!re.test(text)) {
      status = false;
      content = STRINGS.validate_zip_code_strings;
    } else {
      status = true;
      content = null;
    }
    return {status, content};
  },
};

export {Validate, toASCII};
