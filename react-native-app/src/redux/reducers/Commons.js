import * as types from '../actions/actionTypes';
import models from '../../models';

const initialState = {
  isShowLoading: null,
  isFinishedSyncData: null,
  simCategories: [],
  totalNotifiUnread: 0,
  listSimCopied: [],
  // dataNotification: null,
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

    case types.SYNC_APP.SUCCESS: {
      return Object.assign({}, state, {
        isFinishedSyncData: action.data,
      });
    }
    case types.SIM_CATEGORIES.SAVE: {
      models.saveCategoriesData(action.data);
      return Object.assign({}, state, {
        simCategories: action.data,
      });
    }
    case types.SIM_COPY.COPY: {
      return Object.assign({}, state, {
        listSimCopied: action.data,
      });
    }
    case types.SIM_COPY.RESET: {
      return Object.assign({}, state, {
        listSimCopied: [],
      });
    }
    case types.SAVE_PROVINCES: {
      models.saveCategoriesData(action.data);
      return Object.assign({}, state, {
        listSimCopied: [],
      });
    }
    case types.SIGN_OUT: {
      return Object.assign({}, state, {
        isShowLoading: null,
        isFinishedSyncData: null,
        simCategories: [],
        totalNotifiUnread: 0,
        listSimCopied: [],
      });
    }

    default:
      return state;
  }
}
