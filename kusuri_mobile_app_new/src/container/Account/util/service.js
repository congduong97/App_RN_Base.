const listeners = {};
let drawerControl = false;

function broadcast() {
  if (listeners[`InputLogin${drawerControl.index}${drawerControl.nameScreen}`]) {
    listeners[`InputLogin${drawerControl.index}${drawerControl.nameScreen}`]()
  }
  // Object.keys(listeners).forEach(k => listeners[k]());
}

export const HandleInput = {
  get: () => drawerControl,
  set: count => {
    // console.log('SET-COUNT', count);
    drawerControl = count;
    broadcast();
  },
  onChange: (key, cb) => {
    listeners[key] = () => cb(drawerControl);
  },
  unChange: key => {
    delete listeners[key];
  }
};
import { managerAccount } from '../../../const/System'
import AsyncStorage from '@react-native-community/async-storage';
import { Api } from '../util/api'
import { keyAsyncStorage } from '../../../const/System'
// import console = require('console');
export const getNewInfoAccount = async () => {
  const getAccountInfoOnly = await AsyncStorage.getItem('getAccountInfoOnly')

  try {
    if (managerAccount.userId) {


      if (!getAccountInfoOnly) {
        const response = await Api.pushSign(managerAccount.memberCode, managerAccount.password);



        if (response.code === 200) {


          const { username, userId, accessToken, refreshToken, memberDto } = response.res;
          managerAccount.accessToken = accessToken;
          managerAccount.refreshToken = refreshToken;
          managerAccount.phoneNumber = memberDto.phone;
          managerAccount.birthday = memberDto.birthday;
          AsyncStorage.setItem(keyAsyncStorage.managerAccount, JSON.stringify(managerAccount));
          AsyncStorage.setItem('getAccountInfoOnly', 'getAccountInfoOnly')
          return true
        } else {
          return true

        }

      } {

          return true

      }




    } else {
      AsyncStorage.setItem('getAccountInfoOnly', 'getAccountInfoOnly')
      return true

    }


  } catch (error) {
    if (getAccountInfoOnly) {
      return true
    } else {
      return false
    }

  }


}



const changeObject = {};
let eventAction = '';
function broadcasts() {
  Object.keys(changeObject).forEach(
    (k) => changeObject[k] && changeObject[k](),
  );
}
export const ServiceActiveFocusPhoneInLoginByPhone = {
  get: () => eventAction,
  set: (eventListened) => {
    eventAction = eventListened;
    broadcasts();
  },
  onChange: (key, cb) => {
    changeObject[key] = () => cb(eventAction);
  },
  remove: (key) => {
    delete changeObject[key];
  },
};