import * as types from './actionTypes';
import * as AppNavigate from '../../navigations/AppNavigate';
import * as CommonActions from './Commons';
import * as AccountActions from './Account';
import * as SimActions from './sim';
import * as OrderActions from './order';
import * as NotificationsActions from './notifications';

export {types};

const actions = {
  ...AppNavigate,
  ...CommonActions,
  ...AccountActions,
  ...SimActions,
  ...OrderActions,
  ...NotificationsActions,
};

export default actions;
