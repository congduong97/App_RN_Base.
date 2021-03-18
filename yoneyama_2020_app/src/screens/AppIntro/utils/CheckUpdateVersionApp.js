//Library:
import AsyncStorage from '@react-native-community/async-storage';

//Setup:
import {
  isIos,
  versionApp,
  VERSION_PLAFORM,
  AsyncStoreKey,
} from '../../../utils';

//Kiểm tra version App:
const CheckUpdateVersionApp = async (response) => {
  const versionUpdateSkip = await AsyncStorage.getItem(
    AsyncStoreKey.versionUpdateSkip,
  );
  const checkPressSkipUpdateVersion = await AsyncStorage.getItem(
    AsyncStoreKey.onPressSkipUpdateVersion,
  );
  const result = {
    needUpdate: false,
    messenge: '',
    linkUpdateStore: '',
    shouldUpdate: '',
    versionAppInStore: '',
  };
  //Version hiện tại của hệ điều hành IOS đang dùng VD : IOS 13.3
  const versionPlaform = parseFloat(VERSION_PLAFORM.replace(/\./g, ''));
  const versionInDevice = parseFloat(versionApp.replace(/\./g, ''));
  // Nếu mà versin dưới App mà > version vừa bỏ qua thì phải update lại version đã bỏ qua bằng version versionPlaform
  if (
    versionUpdateSkip &&
    versionInDevice > versionUpdateSkip &&
    checkPressSkipUpdateVersion == 'SKIP_VERSION_USING_APP'
  ) {
    if (
      `${versionInDevice}`.length == 3 &&
      `${versionUpdateSkip}`.length == 2 &&
      versionInDevice > versionUpdateSkip
    ) {
      AsyncStorage.setItem(
        AsyncStoreKey.versionUpdateSkip,
        `${versionInDevice}`.slice(0, 2),
      );
    } else {
      AsyncStorage.setItem(
        AsyncStoreKey.versionUpdateSkip,
        `${versionInDevice}`,
      );
    }
  }
  //Kiểm tra đối với hệ điều hành IOS
  if (isIos) {
    const statusUpdate = response.data.statusIos;
    const messenge = response.data.messageIos;
    const {linkIos} = response.data;
    //Version nhỏ nhất có thể tiếp tục xử dụng app:
    const versionMinIOS = parseFloat(response.data.osIos.replace(/\./g, ''));
    //Version hiện tại trên AppStore:
    const versionInStore = parseFloat(
      response.data.versionIos.replace(/\./g, ''),
    );
    //Version app hiện tại được build trong app:
    let lengthVersionInDevice = `${versionInDevice}`.length;
    let lengthversionInStore = `${versionInStore}`.length;
    let lengthVersionPlaformIOS = `${versionPlaform}`.length;
    //Kiểm tra với điều kiện server lưu là 1.x và app lưu là 1.x.x:
    if (lengthVersionInDevice == 3) {
      let versionInDevecesConvert =
        lengthversionInStore == 2
          ? `${versionInDevice}`.slice(0, 2)
          : `${versionInDevice}`;
      let versionMinIOSConvert =
        lengthVersionPlaformIOS == 1
          ? `${versionMinIOS}`.slice(0, 1)
          : `${versionMinIOS}`;
      //Kiểm tra version dưới máy có thể là 1 hoặc là 2 số: 9 hoặc 9.0 với version trên AppStore:
      //Case bắt buộc phải update App:
      if (
        versionInDevecesConvert < versionInStore &&
        versionPlaform >= versionMinIOSConvert &&
        statusUpdate
      ) {
        result.needUpdate = true;
        result.shouldUpdate = 'COMPULSORY_UPDATE';
        result.messenge = messenge;
        result.linkUpdateStore = linkIos;
        result.versionAppInStore = versionInStore;
      } else {
        //Case dùng app bình thường hoặc vừa update App trên Store:
        if (
          versionInDevecesConvert == versionInStore &&
          versionPlaform >= versionMinIOSConvert &&
          !statusUpdate
        ) {
          AsyncStorage.setItem(
            AsyncStoreKey.onPressSkipUpdateVersion,
            'IN_USE_APP',
          );
          AsyncStorage.setItem(
            AsyncStoreKey.versionUpdateSkip,
            `${versionInStore}`,
          );
          result.needUpdate = false;
          result.shouldUpdate = 'NO_UPDATE';
          result.messenge = messenge;
          result.linkUpdateStore = linkIos;
          result.versionAppInStore = versionInStore;
        }
        //Case nên update App lần đầu khi có version mới và không bắt buộc:
        if (
          versionInDevecesConvert < versionInStore &&
          versionPlaform >= versionMinIOSConvert &&
          !statusUpdate
        ) {
          result.needUpdate = false;
          result.shouldUpdate = 'SHOULD_UPDATE_APP';
          result.messenge = messenge;
          result.linkUpdateStore = linkIos;
          result.versionAppInStore = versionInStore;
        }
        //Case bỏ qua update App 1 lần rồi và chưa có bản update version nào mới hơn:
        if (
          versionUpdateSkip &&
          checkPressSkipUpdateVersion == 'SKIP_VERSION_USING_APP' &&
          versionInDevecesConvert < versionInStore &&
          versionInStore == versionUpdateSkip &&
          versionPlaform >= versionMinIOSConvert &&
          !statusUpdate
        ) {
          result.needUpdate = false;
          result.shouldUpdate = 'NO_UPDATE';
          result.messenge = messenge;
          result.linkUpdateStore = linkIos;
          result.versionAppInStore = versionInStore;
        }
        //Case đã bỏ qua update App 1 lần rồi và tiếp tục có bản update nữa với version cao hơn nhưng cũng không bắt buộc update:
        if (
          versionUpdateSkip &&
          checkPressSkipUpdateVersion == 'SKIP_VERSION_USING_APP' &&
          versionInDevecesConvert < versionInStore &&
          versionInStore > versionUpdateSkip &&
          versionPlaform >= versionMinIOSConvert &&
          !statusUpdate
        ) {
          AsyncStorage.setItem(
            AsyncStoreKey.onPressSkipUpdateVersion,
            'IN_USE_APP',
          );
          AsyncStorage.setItem(
            AsyncStoreKey.versionUpdateSkip,
            `${versionInStore}`,
          );
          result.needUpdate = false;
          result.shouldUpdate = 'SHOULD_UPDATE_APP';
          result.messenge = messenge;
          result.linkUpdateStore = linkIos;
          result.versionAppInStore = versionInStore;
        }
      }
    }
  }
  //Kiểm tra đối với hệ điều hành Android
  else {
    const statusUpdate = response.data.statusAndroid;
    const messenge = response.data.messageAndroid;
    const {linkAndroid} = response.data;
    //Version nhỏ nhất có thể tiếp tục xử dụng app:
    const versionMinAndroid = parseFloat(
      response.data.osAndroid.replace(/\./g, ''),
    );
    //Version hiện tại trên AppStore:
    const versionInStore = parseFloat(
      response.data.versionAndroid.replace(/\./g, ''),
    );
    //Version app hiện tại được build trong app:
    let lengthVersionInDevice = `${versionInDevice}`.length;
    let lengthversionInStore = `${versionInStore}`.length;
    let lengthVersionPlaformAndroid = `${versionPlaform}`.length;
    //Kiểm tra với điều kiện server lưu là 1.x và app lưu là 1.x.x hoặc là 1.x.x vs 1.x.x
    if (lengthVersionInDevice == 3) {
      let versionInDevecesConvert =
        lengthversionInStore == 2
          ? `${versionInDevice}`.slice(0, 2)
          : `${versionInDevice}`;
      let versionMinAndroidConvert =
        lengthVersionPlaformAndroid == 1
          ? `${versionMinAndroid}`.slice(0, 1)
          : `${versionMinAndroid}`;
      //Case bắt buộc phải update App:
      if (
        versionInDevecesConvert < versionInStore &&
        versionPlaform >= versionMinAndroidConvert &&
        statusUpdate
      ) {
        result.needUpdate = true;
        result.shouldUpdate = 'COMPULSORY_UPDATE';
        result.messenge = messenge;
        result.linkUpdateStore = linkAndroid;
        result.versionAppInStore = versionInStore;
      } else {
        //Case dùng app bình thường hoặc vừa update App trên Store:
        if (
          versionInDevecesConvert == versionInStore &&
          versionPlaform >= versionMinAndroidConvert &&
          !statusUpdate
        ) {
          AsyncStorage.setItem(
            AsyncStoreKey.onPressSkipUpdateVersion,
            'IN_USE_APP',
          );
          AsyncStorage.setItem(
            AsyncStoreKey.versionUpdateSkip,
            `${versionInStore}`,
          );
          result.needUpdate = false;
          result.shouldUpdate = 'NO_UPDATE';
          result.messenge = messenge;
          result.linkUpdateStore = linkAndroid;
          result.versionAppInStore = versionInStore;
        }
        //Case nên update App lần đầu khi có version mới và không bắt buộc:
        if (
          versionInDevecesConvert < versionInStore &&
          versionPlaform >= versionMinAndroidConvert &&
          !statusUpdate
        ) {
          result.needUpdate = false;
          result.shouldUpdate = 'SHOULD_UPDATE_APP';
          result.messenge = messenge;
          result.linkUpdateStore = linkAndroid;
          result.versionAppInStore = versionInStore;
        }
        //Case bỏ qua update App 1 lần rồi và chưa có bản update version nào mới hơn:
        if (
          versionUpdateSkip &&
          checkPressSkipUpdateVersion == 'SKIP_VERSION_USING_APP' &&
          versionInDevecesConvert < versionInStore &&
          versionInStore == versionUpdateSkip &&
          versionPlaform >= versionMinAndroidConvert &&
          !statusUpdate
        ) {
          result.needUpdate = false;
          result.shouldUpdate = 'NO_UPDATE';
          result.messenge = messenge;
          result.linkUpdateStore = linkAndroid;
          result.versionAppInStore = versionInStore;
        }
        //Case đã bỏ qua update App 1 lần rồi và tiếp tục có bản update nữa với version cao hơn nhưng cũng không bắt buộc update:
        if (
          versionUpdateSkip &&
          checkPressSkipUpdateVersion == 'SKIP_VERSION_USING_APP' &&
          versionInDevecesConvert < versionInStore &&
          versionInStore > versionUpdateSkip &&
          versionPlaform >= versionMinAndroidConvert &&
          !statusUpdate
        ) {
          AsyncStorage.setItem(
            AsyncStoreKey.onPressSkipUpdateVersion,
            'IN_USE_APP',
          );
          AsyncStorage.setItem(
            AsyncStoreKey.versionUpdateSkip,
            `${versionInStore}`,
          );
          result.needUpdate = false;
          result.shouldUpdate = 'SHOULD_UPDATE_APP';
          result.messenge = messenge;
          result.linkUpdateStore = linkAndroid;
          result.versionAppInStore = versionInStore;
        }
      }
    }
  }
  return result;
};
export {CheckUpdateVersionApp};
