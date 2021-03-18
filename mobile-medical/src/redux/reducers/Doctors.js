import * as types from "../actions/actionTypes";
import { mergeByProperty, deepCopyObject } from "../../commons/utils";

const initialState = {
    resultDoctor: { doctorsData: [], pageNext: 1 },
    topics: [],
};

export default function DoctorReducer(state = initialState, action) {
    switch (action.type) {
        case types.RESPONSE_GET_DOCTOR_RESET: {
            return Object.assign({}, state, {
                resultDoctor: { doctorsData: [], pageNext: 1 },
                topics: [],
            });
        }
        case types.RESPONSE_GET_DOCTOR: {
            let isReloadData = action.data.isReloadData;
            let totalRecords = action.data.totalRecords;
            let sizePage = action.data.sizePage;
            let doctorsData = action.data.doctorsData;
            console.log("totalRecords:    ", totalRecords)
            if (!isReloadData) {
                doctorsData = deepCopyObject(state.resultDoctor.doctorsData);
                mergeByProperty(doctorsData, action.data.doctorsData, "id");
            }
            let pageNext = Math.floor(doctorsData.length / sizePage);
            let isFinished = totalRecords < sizePage;
            console.log("sizePage:    ", sizePage)
            return Object.assign({}, state, {
                resultDoctor: {
                    isRequestDone: true,
                    doctorsData,
                    isFinished,
                    totalRecords,
                    pageNext,
                },
            });
        }
        case "ACCOUNT_SIGN_OUT": {
            return Object.assign({}, state, {
                resultDoctor: { doctorsData: [], pageNext: 1 },
                topics: [],
            });
        }
        default:
            return state;
    }
}
