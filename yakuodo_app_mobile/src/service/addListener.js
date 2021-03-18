import UseChange from './UserChange';
import {Api} from '../service';
import {managerAcount} from '../const/System';

export const getUserInfo = async defaultResponse => {
  try {
    let response;
    if (defaultResponse) {
      response = defaultResponse;
    } else {
      response = await Api.getInformationMyPage();
    }
    if (response.code == 200 && response.res.status.code == 1000) {
      const {point, birthday, gender, phone} = response.res.data;
      UseChange.set(response.res.data);
      // managerAcount.mile = mile;
      managerAcount.gender = gender == 1 ? 'Men' : 'Woman';
      managerAcount.birthday = birthday;
      managerAcount.point = point;
      if (phone) {
        managerAcount.phoneNumber = phone;
      }
      // ;

      return {status: true, code: 200};
    }
    return {status: false, code: response.code};
  } catch (e) {
    return {status: false, code: 0};
  }
};
