import { STRING } from '../../const/String';
import { checkEmail, checkPassWord } from '..';
import { Api } from '../../service';

const emailFormatter = (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
        return false;
    }

    return true;
};
const zipCodeFormatter = (zipCode) => {
    if (zipCode === '' || zipCode == null || zipCode === undefined) {
        return { error: true, titleError: STRING.type_zip_code };
    }
    const reg = /(^\d{3}-\d{4}$)/;
    if (reg.test(zipCode)) {
        return { error: false, titleError: '' };
    }

    return { error: true, titleError: STRING.type_zip_code };
};
const checkPass = (pass) => {
    if (pass === '' || pass == null || pass === undefined) {
        return { error: true, titleError: STRING.type_password };
    }
    if (pass.length < 8) {
        return { error: true, titleError: STRING.type_password };
    }
    
    if (!checkPassWord(pass)) {
        return { error: true, titleError: STRING.type_password };
    }
    return { error: false, titleError: '' };
};
const checkUser = (user) => {
    if (user.length < 1) {
        return { error: true, titleError: STRING.no_by_empty };
    }
    return { error: false, titleError: '' };
};
const checkZipCode = (zipcode, noByEmpty) => {
    // console.log('zipcode', zipcode, 'noByEmpty', noByEmpty);
    if (zipcode.length < 7 && noByEmpty == true) {
        return { error: true, titleError: STRING.zip_code_has_minimum_7_number };
    }
    return { error: false, titleError: '' };
};
const checkSubEmail = (subEmail, email) => {
    const check = checkEmail(subEmail);


    if (check) {
        if (email === subEmail) {
            return { error: true, titleError: STRING.email_and_sub_email_can_not_be_duplicated };
        }
        return { error: false, titleError: '' };
    }
    return { error: true, titleError: STRING.error_not_type_email };
};
const checkPassConfirm = (pass, passConfirm) => {
    if (pass != passConfirm) {
        return { error: true, titleError: STRING.error_password_confirm };
    }
    return { error: false, titleError: '' };
};
const checkDefault = (text, noByEmpty) => {
    if (noByEmpty && text.length < 1) {
        return { error: true, titleError: STRING.no_by_empty };
    }
    return { error: false, titleError: '' };
};
const Validate = {
    emailFormat: emailFormatter,
    user: checkUser,
    pass: checkPass,
    zipCode: zipCodeFormatter,
    subEmail: checkSubEmail,
    passConfirm: checkPassConfirm,
    defaults: checkDefault,
    email: async (email, login) => {
        const format = emailFormatter(email);
        if (format) {
            try {
                const resultEmail = await Api.checkEmail(email);
                if (resultEmail.code === 200 && resultEmail.res.status.code === 1000) {
                    const { data } = resultEmail.res;
                    if (login) {
                        if (!data) {
                            return { error: true, titleError: STRING.email_not_already_exits };
                        }
                        return { error: false, titleError: '' };
                    }
                    if (data) {
                        return { error: true, titleError: STRING.email_already_exits };
                    }
                    return { error: false, titleError: '' };
                }
                return { error: false, titleError: '' };
            } catch (err) {
                return { error: false, titleError: '' };
            }
        } else return { error: true, titleError: STRING.error_not_type_email };
    }
};
export { Validate };
