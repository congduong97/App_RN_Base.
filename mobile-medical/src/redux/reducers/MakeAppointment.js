import * as types from "../actions/actionTypes";
import models from "../../models";
import { deepCopyObject, mergeByProperty, convertToArray } from "../../commons";

const initialState = {
  makeAppointData: {},
  isShowLoading: false,
  medicalSpecial: [],
};

export default function MakeAppointmentReducer(state = initialState, action) {
  switch (action.type) {
    case types.SAVE_MAKE_APPOINT_DATA: {
      let makeAppointData = { ...state.makeAppointData, ...action.data };
      return Object.assign({}, state, {
        makeAppointData,
      });
    }
    case types.RESET_MAKE_APPOINT_DATA: {
      return Object.assign({}, state, {
        makeAppointData: {},
      });
    }
    case types.MEDICEL_SPECIALIZATION_DATA: {
      return Object.assign({}, state, {
        medicalSpecial: action.data,
      });
    }

    default:
      return state;
  }
}
