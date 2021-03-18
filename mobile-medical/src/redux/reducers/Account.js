import * as types from "../actions/actionTypes";
import models from "../../models";

const initialState = {
  isLoginSuccess: null,
  isSignOutSuccess: null,
};

export default function AccountReducer(state = initialState, action) {
  switch (action.type) {
    case types.ACCOUNT.AUTHENTICATION: {
      models.handleLogin(action.data);
      return Object.assign({}, state, {
        isLoginSuccess: true,
        isSignOutSuccess: false,
      });
    }

    case types.ACCOUNT.SIGN_OUT: {
      console.log("Vao logout");
      models.handleSignOut();
      return Object.assign({}, state, {
        isSignOutSuccess: true,
        isLoginSuccess: false,
      });
    }
    case types.ACCOUNT.ACCOUNT_INFO: {
      models.saveUserInfoData(action.data);
      return Object.assign({}, state, {
        isLoginSuccess: true,
      });
    }

    default:
      return state;
  }
}
