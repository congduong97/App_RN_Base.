import * as types from '../actions/actionTypes';
import models from '../../models';
import {Dimension} from '../../commons/constants';
import {mergeByProperty, deepCopyObject} from '../../commons/utils';
import {OrderStatusRequest} from '../../models/ConfigsData';

const initialState = {
  ordersDraftData: {ordersData: [], pageNext: 1},
  ordersNewData: {ordersData: [], pageNext: 1},
  ordersDonedData: {ordersData: [], pageNext: 1},
  ordersCanceledData: {ordersData: [], pageNext: 1},
  isCreatedSucces: null,
  totalOrderCarts: null,
};

export default function OrderReducer(state = initialState, action) {
  switch (action.type) {
    case types.MY_ORDER_BY_STATUS.RESPONSE: {
      let isReloadData = action.data.isReloadData;
      let totalRecords = action.data.totalRecords;
      let statusOrder = action.data.statusOrder;
      let ordersData = action.data.ordersData;
      let sizePage = action.data.sizePage;
      if (statusOrder === OrderStatusRequest.DRAFT_CART) {
        let orderDraft = ordersData;
        if (!isReloadData) {
          orderDraft = deepCopyObject(state.ordersDraftData.ordersData);
          mergeByProperty(orderDraft, ordersData, 'id');
        }
        let pageNext = Math.floor(orderDraft.length / sizePage);
        let isFinished = totalRecords === orderDraft.length;
        let totalOrderCart =
          totalRecords > 0 ? (totalRecords > 99 ? '99+' : totalRecords) : null;
        return Object.assign({}, state, {
          totalOrderCarts: totalOrderCart,
          ordersDraftData: {
            isRequestDone: true,
            ordersData: orderDraft,
            isFinished,
            totalRecords,
            pageNext,
          },
        });
      } else if (statusOrder === OrderStatusRequest.NEW) {
        let orderNew = ordersData;
        if (!isReloadData) {
          orderNew = deepCopyObject(state.ordersNewData.ordersData);
          mergeByProperty(orderNew, ordersData, 'id');
        }
        let pageNext = Math.floor(orderNew.length / sizePage);
        let isFinished = totalRecords === orderNew.length;
        return Object.assign({}, state, {
          ordersNewData: {
            isRequestDone: true,
            ordersData: orderNew,
            isFinished,
            totalRecords,
            pageNext,
          },
        });
      } else if (statusOrder === OrderStatusRequest.DONE) {
        let orderDoned = ordersData;
        if (!isReloadData) {
          orderDoned = deepCopyObject(state.ordersDonedData.ordersData);
          mergeByProperty(orderDoned, ordersData, 'id');
        }
        let pageNext = Math.floor(orderDoned.length / sizePage);
        let isFinished = totalRecords === orderDoned.length;
        return Object.assign({}, state, {
          ordersDonedData: {
            isRequestDone: true,
            ordersData: orderDoned,
            isFinished,
            totalRecords,
            pageNext,
          },
        });
      } else if (statusOrder === OrderStatusRequest.CANCELLED) {
        let orderCanceled = ordersData;
        if (!isReloadData) {
          orderCanceled = deepCopyObject(state.ordersCanceledData.ordersData);
          mergeByProperty(orderCanceled, ordersData, 'id');
        }
        let pageNext = Math.floor(orderCanceled.length / sizePage);
        let isFinished = totalRecords === orderCanceled.length;
        return Object.assign({}, state, {
          ordersCanceledData: {
            isRequestDone: true,
            ordersData: orderCanceled,
            isFinished,
            totalRecords,
            pageNext,
          },
        });
      }
    }
    case types.CREATED_NEW_CART.RESPONSE: {
      return Object.assign({}, state, {
        isCreatedSucces: action.data,
      });
    }
    case types.SIGN_OUT: {
      return Object.assign({}, state, {
        ordersDraftData: {ordersData: [], pageNext: 1},
        ordersNewData: {ordersData: [], pageNext: 1},
        ordersDonedData: {ordersData: [], pageNext: 1},
        ordersCanceledData: {ordersData: [], pageNext: 1},
        isCreatedSucces: null,
        totalOrderCarts: null,
      });
    }
    default:
      return state;
  }
}
