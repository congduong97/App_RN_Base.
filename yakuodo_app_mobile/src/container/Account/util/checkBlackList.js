import {Api} from './api';
import {
  managerAcount,
  keyAsyncStorage,
  stateSercurity,
} from '../../../const/System';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../../../service/NavigationService';
import {ServiveModal} from '../../HomeScreen/util/service';

export const checkBlackList = async memberCodeLogin => {
  const responseBlackList = await Api.checkBlacklistMember(memberCodeLogin);
  // console.log('responseBlackList', responseBlackList);
  // console.log('memberCodeLogin', memberCodeLogin);
  if (memberCodeLogin) {
    if (
      responseBlackList.code == 200 &&
      responseBlackList.res.status.code == 1030 &&
      stateSercurity.onSecurity
    ) {
      // console.log('responseBlackList responseBlackList3');
      managerAcount.memberCodeInBlackList = true;
      managerAcount.messengerBackList = responseBlackList.res.data;
      ServiveModal.set({type: 'BLACK_LIST'});
      return true;
    }
    return false;
  }

  if (
    responseBlackList.code == 200 &&
    responseBlackList.res.status.code == 1030
  ) {
    // console.log('responseBlackList responseBlackList3');
    managerAcount.memberCodeInBlackList = true;
    managerAcount.messengerBackList = responseBlackList.res.data;
    await AsyncStorage.setItem(
      keyAsyncStorage.managerAccount,
      JSON.stringify(managerAcount),
    );
    if (stateSercurity.onSecurity) {
      NavigationService.navigate('HOME');
      ServiveModal.set({type: 'BLACK_LIST'});
      return true;
    }
    // console.log('responseBlackList responseBlackList0');
  }
  if (
    responseBlackList.code == 200 &&
    responseBlackList.res.status.code == 1029
  ) {
    // console.log('member active');
    managerAcount.memberCodeInBlackList = false;
    await AsyncStorage.setItem(
      keyAsyncStorage.managerAccount,
      JSON.stringify(managerAcount),
    );
    ServiveModal.set({type: 'CHECK_VALIDATE_PHONE'});
    // console.log('responseBlackList responseBlackList1');
  }
  return false;
};
