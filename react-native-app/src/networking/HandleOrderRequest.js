import API from '../../networking';
import {Alert} from 'react-native';
import {OrderStatusRequest} from '../../models/ConfigsData';
import {Dimension} from '../../commons/constants';

export const ActionsRequest = {
  NextOrderDetail: 'Next-OrderDetail',
  NextOrderDetailCustomer: 'TypeCustomer',
  NextOrderDetailOrderer: 'Orderer',
  NextCartDetail: 'Next-CartDetail',
  AddSimToCart: 'AddSimToCart',
  CancelCart: 'CancelCart',
  CancelOrder: 'CancelOrder',
  CreateCart: 'CreateCart',
  PlaceOrder: 'PlaceOrder',
  ApproveOrder: 'ApproveOrder',
  CompletedOrder: 'CompletedOrder',
  RemoveSIM: 'RemoveSIM',
};

export const handleRequestAPI = async (
  {dispatch, action, cartId, orderId, simAlias, simId},
  requestCartDetail,
) => {
  if (action === ActionsRequest.CancelCart) {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn Huỷ giỏ hàng này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            handleCancelCart(dispatch, cartId, requestCartDetail);
          },
        },
      ],
      {cancelable: false},
    );
  } else if (action === ActionsRequest.CancelOrder) {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn Huỷ đơn hàng này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            handleCancelOrder(dispatch, orderId, requestCartDetail);
          },
        },
      ],
      {cancelable: false},
    );
  } else if (action === ActionsRequest.PlaceOrder) {
    // Dat hang
    let isSuccess = await API.requestPlaceOrder(dispatch, {cartId});
    if (isSuccess) {
      requestCartDetail && requestCartDetail();
      handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART);
      handleRequestOrder(dispatch, OrderStatusRequest.NEW);
    }
  } else if (action === ActionsRequest.ApproveOrder) {
    //Dai ly dong ý
    let isSuccess = await API.requestApproveOrder(dispatch, {orderId});
    if (isSuccess) {
      requestCartDetail && requestCartDetail();
      handleRequestOrder(dispatch, OrderStatusRequest.NEW);
    }
  } else if (action === ActionsRequest.CompletedOrder) {
    // Hoan tat
    let isSuccess = await API.requestCompletedOrder(dispatch, {cartId});
    if (isSuccess) {
      requestCartDetail && requestCartDetail();
      handleRequestOrder(dispatch, OrderStatusRequest.NEW);
      handleRequestOrder(dispatch, OrderStatusRequest.DONE);
    }
  } else if (action === ActionsRequest.RemoveSIM) {
    // Bo sim khoi gio hang
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn bỏ sim ${simAlias} ra khỏi giỏ hàng này?`,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đồng ý',
          onPress: () => {
            handleRemoveSim(dispatch, cartId, simId, requestCartDetail);
          },
        },
      ],
      {cancelable: false},
    );
  }
};

/**
 * Xu ly bo sim ra khoi gio hang
 * @param {*} dispatch
 * @param {*} cartId
 * @param {*} simId
 * @param {*} requestCartDetail
 */
export const handleRemoveSim = async (
  dispatch,
  cartId,
  simId,
  requestCartDetail,
) => {
  let isSuccess = await API.requestRemoveSimFormCart(dispatch, {cartId, simId});
  if (isSuccess) {
    requestCartDetail && requestCartDetail();
    handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART);
    handleRequestOrder(dispatch, OrderStatusRequest.NEW);
  }
};

/**
 * Xu ly huy gio hang
 * @param {*} dispatch
 * @param {*} cartId
 * @param {*} requestCartDetail
 */
const handleCancelCart = async (dispatch, cartId, requestCartDetail) => {
  let isSuccess = await API.requestCancelCart(dispatch, {cartId});
  if (isSuccess) {
    requestCartDetail && requestCartDetail();
    handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART);
    handleRequestOrder(dispatch, OrderStatusRequest.CANCELLED);
  }
};

/**
 * Xu ly Dai ly huy don hang
 * @param {*} dispatch
 * @param {*} orderId
 * @param {*} requestCartDetail
 */
const handleCancelOrder = async (dispatch, orderId, requestCartDetail) => {
  let isSuccess = await API.requestCancelOrder(dispatch, {orderId});
  if (isSuccess) {
    requestCartDetail && requestCartDetail();
    handleRequestOrder(dispatch, OrderStatusRequest.NEW);
    handleRequestOrder(dispatch, OrderStatusRequest.CANCELLED);
  }
};

const handleRequestOrder = async (dispatch, status) => {
  let params = {
    isReloadData: true,
    status: status,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  };
  API.requestMyOrderByStatus(dispatch, params);
};

export const requestAddSimToCart = async (dispatch, params) => {
  await API.requestAddSimToCart(dispatch, params);
  handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART);
};
