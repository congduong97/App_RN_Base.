import { STRING } from './string';
// import console = require('console');

const emailFormatter = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
        return false;
    }

    return true;
};


const checkEmailConfirm = (pass, passConfirm, requireEmailConfirm) => {
    if (!pass && !requireEmailConfirm) {
        return { error: false, titleError: '' };
    }
    if (pass !== passConfirm) {
        return { error: true, titleError: STRING.error_email_confirm };
    }
    return { error: false, titleError: '' };
};
const checkDefault = (text, noByEmpty) => {
    if (noByEmpty && !text) {
        return { error: true, titleError: STRING.no_by_empty };
    }
    return { error: false, titleError: '' };
};
const emailFormat = (email, require) => {
    const format = emailFormatter(email);
    if (!email && !require) {
        return { error: false, titleError: '' };
    }
    if (format) {
        return { error: false, titleError: '' };
    }
    return { error: true, titleError: STRING.error_not_type_email };
};
const zipCodeNumber = (zipCode, length, requireZipcode) => {
    if ((!zipCode || zipCode.length !== length || parseInt(Number.isInteger(zipCode))) && requireZipcode) {
        return { error: true, titleError: '' };
    }
    return { error: false, titleError: '' };
};

const Validate = {
    emailFormat,
    checkEmailConfirm,
    zipCodeNumber,
    checkDefault,

};
export { Validate };
