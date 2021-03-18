import * as types from "./actionTypes";

export function responseHealthQuestionList(data) {
  return {
    type: types.RESPONSE_HEALTH_QUESTION_LIST,
    data: data,
  };
}

export function responseHealthDeclarationList(data) {
  return {
    type: types.RESPONSE_HEALTH_DECLARATION_LIST,
    data: data
  }
}