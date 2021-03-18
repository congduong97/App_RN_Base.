import * as types from "../actions/actionTypes";
import models from "../../models";
import { deepCopyObject, mergeByProperty, convertToArray } from "../../commons";

const initialState = {
  medicalSpecial: [],
  heathFaciProcessFeeb: [],
  resultHeathFaclitiesData: { heathFaclitiesData: [], pageNext: 1 },
};

export default function HeathFacilitiesReducer(state = initialState, action) {
  switch (action.type) {
    case types.SAVE_HEATH_FACILITIES_DATA: {
      models.saveHeathFacilities(action.data);
      return Object.assign({}, state);
    }
    case types.MEDICEL_SPECIALIZATION_DATA: {
      return Object.assign({}, state, {
        medicalSpecial: action.data,
      });
    }
    case types.MEDICEL_PROCESS_FEEDBACK_DATA: {
      return Object.assign({}, state, {
        heathFaciProcessFeeb: action.data,
      });
    }
    case types.RESPONSE_HEATH_FACLITIES_SEARCH_LOAD_MODE: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let heathFaclitiesData = action.data.heathFaclitiesData;
      console.log("totalRecords:    ", totalRecords)
      if (!isReloadData) {
        heathFaclitiesData = deepCopyObject(state.resultHeathFaclitiesData.heathFaclitiesData);
        mergeByProperty(heathFaclitiesData, action.data.heathFaclitiesData, "id");
      }
      let pageNext = Math.floor(heathFaclitiesData.length / sizePage);
      let isFinished = totalRecords < sizePage;
      console.log("sizePage:∂    ", sizePage)
      return Object.assign({}, state, {
        resultHeathFaclitiesData: {
          isRequestDone: true,
          heathFaclitiesData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }
    case types.RESPONSE_HEATH_FACLITIES_SEARCH_LOAD_MODE_RESET: {
      return Object.assign({}, state, {
        resultHeathFaclitiesData: { heathFaclitiesData: [], pageNext: 1 },
        topics: [],
      });
    }

    default:
      return state;
  }
}
