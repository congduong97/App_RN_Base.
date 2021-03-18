import VersionCheck from 'react-native-version-check';
import {Alert, Linking, Platform} from 'react-native';
import axios from 'axios';
import constants from '../constants';
import {windowSize} from './devices';
import {validateEmail} from './validate';
export const checkUpdate = (cb) => {
  const storeURL = 'http://itunes.apple.com/lookup?bundleId=Sim.SimTD';
  const playStore =
    'https://play.google.com/store/apps/details?id=com.zamio.simthanhdat&hl=en';
  const currentVersion = VersionCheck.getCurrentVersion();

  if (Platform.OS === 'ios') {
    axios.get(storeURL).then((res) => {
      if (res.data?.resultCount) {
        const lastVersion = res.data.results[0] && res.data.results[0].version;
        if (lastVersion > currentVersion) {
          cb();
        }
      }
    });
  } else {
    axios.get(playStore).then((res) => {
      if (res.data) {
        const text = res.data;
        const regex = /Current Version<\/div><span class="htlgb"><div class="IQ1z0d"><span class="htlgb"+>([\d.]+)<\/span>/g;
        const match = text.match(regex);
        const lastVersion = match[0].replace(
          /Current Version<\/div><span class="htlgb"><div class="IQ1z0d"><span class="htlgb"+>|<\/span>/g,
          '',
        );
        if (lastVersion > currentVersion) cb();
      }
    });
  }
};

export const formatDataWithNumColumns = (data, numColums) => {
  let emptyData = new Array(numColums - (data.length % numColums)).fill({
    id: Math.random().toString(),
    name: Math.random().toString(),
  });
  data = data.concat(emptyData);
  return data;
};

export const handleClickPhoneNumber = (phoneNumber) => {
  let linkingPhone = phoneNumber;
  if (Platform.OS !== 'android') {
    linkingPhone = `telprompt:${phoneNumber}`;
  } else {
    linkingPhone = `tel:${phoneNumber}`;
  }
  Alert.alert(
    'Xác nhận',
    'Gọi đến số điện thoại ' + phoneNumber,
    [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: () =>
          Linking.canOpenURL(linkingPhone)
            .then((supported) => {
              if (!supported) {
                Alert.alert('Số điện thoại không có sẵn.');
              } else {
                return Linking.openURL(linkingPhone);
              }
            })
            .catch((err) => console.log(err)),
      },
    ],
    {cancelable: false},
  );
};

export const handleClickEmail = (email) => {
  let linkingEmail = '';
  let subject = 'Sim Thành Đạt';
  let body = 'Tôi muốn biết thêm thông tin chi tiết về ...';
  Alert.alert(
    'Xác nhận',
    'Bạn muốn gửi email tới: ' + email,
    [
      {
        text: 'Không',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Có',
        onPress: () => {
          try {
            let check = validateEmail(email);
            linkingEmail = `mailto:${email}?subject=${subject}&body=${body}`;
            if (check) {
              Linking.openURL(linkingEmail);
            } else {
              Alert.alert(`Email ${email} không hợp lệ.`);
            }
          } catch (error) {
            console.log(error);
          }
        },
      },
    ],
    {cancelable: false},
  );
};

export const heightSheet = (dataSheet, offset = 30) => {
  let height =
    (dataSheet.length + 3) * constants.heightDefault < windowSize.height
      ? (dataSheet.length + 3) * constants.heightDefault + constants.margin15
      : windowSize.height - offset;
  return height;
};

export function convertToArray(objectsArray) {
  let copyOfJsonArray = Array.from(objectsArray);
  let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
  return jsonArray;
}

export function deepCopyObject(objectRaw) {
  if (!objectRaw) {
    return '';
  }
  if (Array.isArray(objectRaw)) {
    let objectArray = Array.from(objectRaw);
    return JSON.parse(JSON.stringify(objectArray));
  }
  return JSON.parse(JSON.stringify(objectRaw));
}

export const mergeByProperty = (target, source, prop) => {
  if (!target) {
    target = [];
  }
  source.forEach((sourceElement) => {
    let targetElement = target.find(
      (item) => sourceElement[prop] === item[prop],
    );
    targetElement
      ? Object.assign(targetElement, sourceElement)
      : target.push(sourceElement);
  });
  return target;
};

export const groupBy = (array, key) => {
  if (!array) return [];
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
