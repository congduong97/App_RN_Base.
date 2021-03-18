import {store} from '../redux/store';

export const checkAgency = () =>
  store.getState().authReducer.roles &&
  store.getState().authReducer.roles[0] === 'ROLE_AGENCY';
