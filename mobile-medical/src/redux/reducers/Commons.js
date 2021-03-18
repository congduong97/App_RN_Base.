import * as types from "../actions/actionTypes";
import models from "../../models";

const initialState = {
  isShowLoading: null,
  isFinishedSyncData: null,
  actionBookType: null,
};

export default function CommonsReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOADING.LOADING: {
      return Object.assign({}, state, {
        isShowLoading: action.isShow,
      });
    }

    case types.LOADING.SHOW: {
      return Object.assign({}, state, {
        isShowLoading: true,
      });
    }

    case types.LOADING.HIDE: {
      return Object.assign({}, state, {
        isShowLoading: false,
      });
    }

    case types.SYNC_APP_SUCCESS: {
      return Object.assign({}, state, {
        isFinishedSyncData: action.data,
      });
    }

    case types.ACTION_BOOK_TYPE: {
      return Object.assign({}, state, {
        actionBookType: action.data,
      });
    }

    default:
      return state;
  }
}
