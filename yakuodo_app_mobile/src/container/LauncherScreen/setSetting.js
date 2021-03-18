import AsyncStorage from '@react-native-community/async-storage';
import { managerAcount, APP, keyAsyncStorage,stateSercurity } from '../../const/System';
import { getUserInfo } from '../../service/addListener';

export const setSetting = async () => {
    const res = await AsyncStorage.getItem(keyAsyncStorage.managerAccount);
    const account = JSON.parse(res);
    if (account) {
      managerAcount.userId = account.userId;
      managerAcount.memberCode = account.memberCode;
      managerAcount.accessToken = account.accessToken;
      managerAcount.refreshToken = account.refreshToken;
      managerAcount.gender = account.gender;
      managerAcount.birthday = account.birthday;
      managerAcount.enablePasswordOppenApp = account.enablePasswordOppenApp;
      managerAcount.enablePasswordMyPage = account.enablePasswordMyPage;
      managerAcount.passwordApp = account.passwordApp;
      managerAcount.numberErrorPass  = account.numberErrorPass
      managerAcount.timeErrorPass = account.timeErrorPass
      managerAcount.pinCode = account.pinCode
      managerAcount.phoneNumber = account.phoneNumber
      managerAcount.validateOtp = account.validateOtp
      managerAcount.memberCodeInBlackList = account.memberCodeInBlackList
      managerAcount.messengerBackList = account.messengerBackList
      await getUserInfo()
      await AsyncStorage.setItem(keyAsyncStorage.managerAccount,JSON.stringify(managerAcount))
    }
    const resSercurity = await AsyncStorage.getItem(keyAsyncStorage.stateSercurity)
    if(resSercurity){
      const {onSecurity,onSecurityIOS,onSendOTPByEmailAndroid,onSendOTPByEmailIOS,onSendOTPByEmail,maxNumberOfConsecutiveSmsByPhone,namespace} = JSON.parse(resSercurity)
      stateSercurity.onSecurity =  onSecurity;
      stateSercurity.onSendOTPByEmail =  onSendOTPByEmail;
      stateSercurity.onSecurityIOS = onSecurityIOS
      stateSercurity.onSendOTPByEmailAndroid = onSendOTPByEmailAndroid
      stateSercurity.onSendOTPByEmailIOS = onSendOTPByEmailIOS
      stateSercurity.maxNumberOfConsecutiveSmsByPhone = maxNumberOfConsecutiveSmsByPhone
      stateSercurity.namespace = namespace
    }

     AsyncStorage.getItem('mobileApp').then(result => {
      if (result != null) {
          APP.IMAGE_LOGO = JSON.parse(result).logo;
      } 
  }).catch(err => {
  });
};

