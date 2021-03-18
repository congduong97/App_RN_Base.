import * as types from '../actions/actionTypes';
import models from '../../models';
import {mergeByProperty, deepCopyObject} from '../../commons/utils';

const initialState = {
  resultSimSearch: {listSimData: [], pageNext: 1},
};

export default function SimReducer(state = initialState, action) {
  switch (action.type) {
    case types.SIM_SEARCH.RESPONSE: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let listSimData = action.data.listSimData;
      if (!isReloadData) {
        listSimData = deepCopyObject(state.resultSimSearch.listSimData);
        mergeByProperty(listSimData, action.data.listSimData, 'id');
      }
      let pageNext = Math.floor(listSimData.length / sizePage);
      let isFinished = totalRecords === listSimData.length;
      return Object.assign({}, state, {
        resultSimSearch: {
          isRequestDone: true,
          listSimData: listSimData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }
    case types.RESET_SEARCH_SIM: {
      return Object.assign({}, state, {
        resultSimSearch: {
          isRequestDone: false,
          // listSimData: [],
          // isFinished: false,
          // totalRecords: 0,
          // pageNext: 1,
        },
      });
    }
    case types.SIGN_OUT: {
      return Object.assign({}, state, {
        resultSimSearch: {listSimData: [], pageNext: 1},
      });
    }
    default:
      return state;
  }
}
