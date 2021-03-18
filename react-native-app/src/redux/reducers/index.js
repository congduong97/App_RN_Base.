import {combineReducers} from 'redux';
import CommonsReducer from './Commons';
import AccountReducer from './Account';
import SimReducer from './Sim';
import OrderReducer from './Order';
import NotificationsReducer from './Notifications';

const rootReducer = combineReducers({
  CommonsReducer,
  AccountReducer,
  SimReducer,
  OrderReducer,
  NotificationsReducer,
});
export default rootReducer;
