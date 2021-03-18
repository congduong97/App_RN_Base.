import { } from 'react-native';
import { APP, keyAsyncStorage, managerAccount, menuInApp } from '../../../const/System';
// import console = require('console');
import AsyncStorage from '@react-native-community/async-storage';


export const getUserInfor = async () => {
  const res = await AsyncStorage.getItem(keyAsyncStorage.managerAccount)
  const resUsingSms= await AsyncStorage.getItem(keyAsyncStorage.usingSms)
  if(resUsingSms){
    if(resUsingSms=='true'){
      managerAccount.usingSms= true

    }
    if(resUsingSms=='false'){
      managerAccount.usingSms= false

    }
  }
  if (res) {
    const resToObject = JSON.parse(res);
    const { username, password, refreshToken, userId, userNameWebView, passwordWebView, point, money, memberCode, accessToken, birthday, phoneNumber, passwordApp, enablePasswordOppenApp, enablePasswordMyPage, validatePhoneNumberSuccess ,needValidateBirthDay,needAddBirthDay,memberCodeInBlackList} = resToObject;
    managerAccount.accessToken = accessToken;
    managerAccount.username = username;
    managerAccount.birthday = birthday;
    managerAccount.phoneNumber = phoneNumber;
    managerAccount.memberCode = memberCode;
    managerAccount.refreshToken = refreshToken;
    managerAccount.point = point;
    managerAccount.money = money;
    managerAccount.password = password;
    managerAccount.userId = userId;
    managerAccount.userNameWebView = userNameWebView;
    managerAccount.passwordWebView = passwordWebView;
    managerAccount.passwordApp = passwordApp;
    managerAccount.enablePasswordOppenApp = enablePasswordOppenApp;
    managerAccount.enablePasswordMyPage = enablePasswordMyPage;
    managerAccount.validatePhoneNumberSuccess = validatePhoneNumberSuccess
    managerAccount.needValidateBirthDay = needValidateBirthDay
    managerAccount.needAddBirthDay = needAddBirthDay
    managerAccount.memberCodeInBlackList= memberCodeInBlackList

  }
}
export const setSetting = async () => {
  await AsyncStorage.getItem(keyAsyncStorage.mobileApp).then(result => {
    if (result != null) {
      APP.IMAGE_LOGO = JSON.parse(result).logo;
    }
  });
  await getUserInfor()
};
