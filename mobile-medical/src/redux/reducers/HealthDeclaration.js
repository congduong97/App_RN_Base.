import * as types from "../actions/actionTypes";
import { mergeByProperty, deepCopyObject } from "../../commons/utils";

const initialState = {
  resultHealthDecalarations: [],
  pageNext: 1
};

export default function HealthDeclarationReducer(state = initialState, action) {
  switch (action.type) {
    case types.RESPONSE_HEALTH_DECLARATION_LIST: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let healthDeclarationData = action.data.healthDeclarationData;
      if (!isReloadData) {
        healthDeclarationData = deepCopyObject(
          state.resultHealthDecalarations.healthDeclarationData
        );
        mergeByProperty(healthDeclarationData, action.data.healthDeclarationData, "id");
      }
      let pageNext = Math.floor(healthDeclarationData.length / sizePage);
      let isFinished = (Number(totalRecords) === healthDeclarationData.length);
      return Object.assign({}, state, {
        resultHealthDecalarations: {
          isRequestDone: true,
          healthDeclarationData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }
    default:
      return state;
  }
}
