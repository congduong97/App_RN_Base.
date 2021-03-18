import * as types from '../actions/actionTypes';
import models from '../../models';

const initialState = {
  isLoginSuccess: null,
  isSignOutSuccess: null,
};

export default function AccountReducer(state = initialState, action) {
  switch (action.type) {
    case types.SIGN_IN.SUCCESS: {
      models.handleLogin(action.data);
      return Object.assign({}, state, {
        isLoginSuccess: true,
        isSignOutSuccess: false,
      });
    }
    case types.GET_ACCOUNT_INFO.SUCCESS: {
      models.saveUserInfoData(action.data);
      return Object.assign({}, state, {
        isLoginSuccess: true,
      });
    }
    case types.SIGN_OUT: {
      models.handleSignOut();
      return Object.assign({}, state, {
        isSignOutSuccess: true,
        isLoginSuccess: false,
      });
    }
    default:
      return state;
  }
}
