import {StackActions, NavigationActions} from 'react-navigation';
import {STRING} from '../const/String';
import {Api} from '../service';

export const pushResetScreen = (navigation, screen, params) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName: screen, params})],
  });
  navigation.dispatch(resetAction);
};
export function getParams(name, url) {
  if (!name || !url) {
    return false;
  }
  console.log('name', name);
  console.log('url2313123123');
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regexS = `[\\?&]${name}=([^&#]*)`;
  const regex = new RegExp(regexS);
  const results = regex.exec(url);
  console.log('results', results);
  return results == null ? null : results[1];
}
export function compareTwoStrings(first, second) {
  first = first.replace(/\s+/g, '');
  second = second.replace(/\s+/g, '');
  if (!first.length && !second.length) {
    return 1;
  } // if both are empty strings
  if (!first.length || !second.length) {
    return 0;
  } // if only one is empty string
  if (first === second) {
    return 1;
  } // identical
  if (first.length === 1 && second.length === 1) {
    return 0;
  } // both are 1-letter strings
  if (first.length < 2 || second.length < 2) {
    return 0;
  } // if either is a 1-letter string

  const firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substr(i, 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;

    firstBigrams.set(bigram, count);
  }

  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substr(i, 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;

    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  return (2.0 * intersectionSize) / (first.length + second.length - 2);
}
export const getNumberBarcode = numbers => {
  let arr = numbers.split('');

  arr = arr.map((item, index) => {
    if (index % 2 == 0) {
      return parseInt(item) * 3;
    }
    return parseInt(item);
  });
  let sum = 0;
  arr.map(item => {
    sum += item;
  });
  const numberP = 10 - (sum % 10);
  return `${numbers}0${numberP}`;
};
export const getImageWithLinkYouTube = link => {
  if (link) {
    let video_id = link.split('v=')[1];
    const ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition !== -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    return `https://img.youtube.com/vi/${video_id}/hqdefault.jpg`;
  }
};

export const getIDWithLinkYouTube = link => {
  // console.log('linklink', link);
  let video_id = link.split('v=')[1];
  const ampersandPosition = video_id.indexOf('&');
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
};
export const getIDCookie = link => {
  let video_id = link.split('JSESSIONID=')[1];
  const ampersandPosition = video_id.indexOf(';');
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
};
export const getNameUse = name => {
  switch (name) {
    case 'ONCE_TIME_PER_DAY':
      return STRING.once_time_per_day;
    case 'ONCE_TIME':
      return STRING.only_used_once;
    case 'COUNTLESS_TIME':
      return STRING.countless_time;
    default:
      return '';
  }
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  //Radius of the earth in:  1.609344 miles,  6371 km  | var R = (6371 / 1.609344);
  const R = 6371; // Radius of earth in Miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  const n = parseFloat(d);
  d = Math.round(n * 100) / 100;

  return d;
};
export const convertRank = value => {
  // console.log('rank', value);
  switch (value) {
    case 0:
      return '新規会員';
    case 1:
      return 'ブロンズ';
    case 2:
      return 'シルバー';
    case 3:
      return 'ゴールド';
    case 5:
      return '社員優待';
    default:
      return '';
  }
};

function toRad(Value) {
  return (Value * Math.PI) / 180;
}
export function countIime(time, selected) {
  const minutes = 1000 * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;

  const d = new Date();
  const t = new Date(time).getTime() - d.getTime();
  let y;

  if (selected === 'days') {
    y = Math.round(t / days);
  } else {
    y = Math.round(t / minutes);
  }
  return y;
}

export const checkPassWord = check => {
  const lowerCaseLetters = /[a-z]/g;
  const numbers = /[0-9]/g;
  let checkError = false;
  if (check.match(lowerCaseLetters) == null) {
    checkError = true;
  }

  if (check.match(numbers) == null) {
    checkError = true;
  }
  if (check.length < 8) {
    checkError = true;
  }
  if (checkError) {
    return false;
  }
  // this.setState({ colorPassword: false, titleErrorPass: '' })
  return true;
};
export const getTimeFomartDDMMYY = time => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};
