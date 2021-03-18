import {STRINGS} from '../resource';

/* eslint-disable eqeqeq */
const Validate = {
  email: (email) => {
    let status = false;
    let message = null;
    const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length === 0 || !re.test(email)) {
      status = false;
      message = '無効なメールアドレスです';
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
    const re = /(?=.*[0-9])(?=.*[a-zA-Z])/;
    // const re1 = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if ((password && password.length < 8) || password.length > 32) {
      status = false;
      message = '8文字以上32文字以内で入力してください。';
    } else if (
      !re.test(password)
      //Không cho nhập kí tự đặc biệt.
      // || re1.test(password)
    ) {
      status = false;
      message = '数字、英字をそれぞれ1文字以上含めてください。';
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

export {Validate};
