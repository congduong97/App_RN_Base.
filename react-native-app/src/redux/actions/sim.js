import * as types from './actionTypes';

export function responseSimSearch(data) {
  return {
    type: types.SIM_SEARCH.RESPONSE,
    data: data,
  };
}

export function resetSearchSim(data) {
  return {
    type: types.RESET_SEARCH_SIM,
    data: data,
  };
}
