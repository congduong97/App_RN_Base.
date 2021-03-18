import * as types from './actionTypes';

export function responseOrdersByStatus(data) {
  return {
    type: types.MY_ORDER_BY_STATUS.RESPONSE,
    data: data,
  };
}

export function responseCreatedCart(data) {
  return {
    type: types.CREATED_NEW_CART.RESPONSE,
    data: data,
  };
}
