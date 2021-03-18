import * as types from "../actions/actionTypes";
import { mergeByProperty, deepCopyObject } from "../../commons/utils";

const initialState = {
  resultFeedbacks: { feedbacksData: [], pageNext: 1 },
  topics: [],
};

export default function FeedbacksReducer(state = initialState, action) {
  switch (action.type) {
    case types.RESPONSE_GET_FEEDBACKS_RESET: {
      return Object.assign({}, state, {
        resultFeedbacks: { feedbacksData: [], pageNext: 1 },
        topics: [],
      });
    }
    case types.RESPONSE_GET_FEEDBACKS: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let sizePage = action.data.sizePage;
      let feedbacksData = action.data.feedbacksData;
      console.log("isReloadData:      ", isReloadData)
      // console.log("feedbacksData:      ", feedbacksData)
      if (!isReloadData) {
        feedbacksData = deepCopyObject(state.resultFeedbacks.feedbacksData);
        // console.log("vao day       ", feedbacksData)
        mergeByProperty(feedbacksData, action.data.feedbacksData, "id");
        // console.log("vao day 1      ", feedbacksData)
      }
      let pageNext = Math.floor(feedbacksData.length / sizePage);
      let isFinished = totalRecords === feedbacksData.length;
      return Object.assign({}, state, {
        resultFeedbacks: {
          isRequestDone: true,
          feedbacksData,
          isFinished,
          totalRecords,
          pageNext,
        },
      });
    }
    case "ACCOUNT_SIGN_OUT": {
      return Object.assign({}, state, {
        resultFeedbacks: { feedbacksData: [], pageNext: 1 },
        topics: [],
      });
    }
    default:
      return state;
  }
}
