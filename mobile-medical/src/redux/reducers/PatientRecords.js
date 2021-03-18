import * as types from "../actions/actionTypes";
import models from "../../models";
import { deepCopyObject, mergeByProperty, convertToArray } from "../../commons";

const initialState = {
  patientRecords: { patientRecordsData: [], pageNext: 1, totalRecords: 0 },
};

export default function PatientRecordsReducer(state = initialState, action) {
  switch (action.type) {
    case types.RESPONSE_PATIENT_RECORDS: {
      models.savePatientRecords(action.data);
      return Object.assign({}, state);
    }

    case types.RESPONSE_SEARCH_PATIENT_RECORDS: {
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let responseData = action.data.patientRecordsData;
      let patientRecordsData = deepCopyObject(
        state.patientRecords.patientRecordsData
      );
      mergeByProperty(patientRecordsData, responseData, "id");
      let pageNext = Math.floor(patientRecordsData.length / sizePage);
      let isFinished = totalRecords === patientRecordsData.length;
      console.log("patientRecordsData", patientRecordsData);
      return Object.assign({}, state, {
        patientRecords: {
          isRequestDone: true,
          patientRecordsData,
          totalRecords,
          pageNext,
          isFinished,
        },
      });
    }

    default:
      return state;
  }
}
