import { StackActions, NavigationActions } from 'react-navigation';
import { STRING } from '../const/String';
export const getTimeFomartDDMMYY = (time) => {
  if (!time) {
    return '';
  }
  const date = new Date(time);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

export const pushResetScreen = (navigation, screen, params) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: screen, params })]
  });
  navigation.dispatch(resetAction);
};

export const getIDCookie = link => {
  let video_id = link.split('JSESSIONID=')[1];
  const ampersandPosition = video_id.indexOf(';');
  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }
  return video_id;
};
export const getNameUse = (name) => {
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
