import networking, {instance, requestALl, post, get} from './ApiHelper';

import * as ApiUrl from './ApiUrl';
import CommonsAPI from './Commons';
import AccountAPI from './Account';
import SimAPI from './Sim';
import OrderAPI from './Order';
import NotificationsAPI from './Notifications';

export {ApiUrl, instance, requestALl, post, get};

export default {
  instance,
  requestALl,
  post,
  get,
  ...CommonsAPI,
  ...AccountAPI,
  ...SimAPI,
  ...OrderAPI,
  ...NotificationsAPI,
};
