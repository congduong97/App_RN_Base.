import actions from '../redux/actions';
import {Dimension} from '../commons/constants';
import Toast from 'react-native-simple-toast';
import {
  REQUEST_MY_ORDER_BY_STATUS,
  REQUEST_DRAFT_CARTS,
  REQUEST_AGENCY_CREATE_CART,
  REQUEST_COLLABORER_CREATE_CART,
  REQUEST_ORDER_DETAIL,
  REQUEST_CART_DETAIL,
  REQUEST_CANCEL_CART,
  REQUEST_CANCEL_ORDER,
  REQUEST_PLACE_ORDER,
  REQUEST_APPROVE_ORDER,
  REQUEST_COMPLETED_ORDER,
  REQUEST_REMOVE_SIM,
  REQUEST_CTV_ADD_SIM,
  REQUEST_AGENCY_ADD_SIM,
  UPLOAD_IMAGE,
  GET_LIST_IMAGE,
} from './ApiUrl';
import {post, get, isSuccess} from './ApiHelper';
import {OrderStatusRequest} from '../models/ConfigsData';
import models from '../models';

export async function requestMyOrderByStatus(dispatch, params) {
  dispatch(actions.showLoading());
  let urlRequest =
    params.status === OrderStatusRequest.DRAFT_CART
      ? REQUEST_DRAFT_CARTS
      : REQUEST_MY_ORDER_BY_STATUS;
  let responsesData = await get(
    urlRequest,
    params,
    dispatch,
    'Lỗi khi lấy danh sách Đơn hàng',
  );
  let ordersData = responsesData?.data || [];
  let totalRecords = responsesData?.pagination?.totalRecords || 0;
  await dispatch(
    actions.responseOrdersByStatus({
      ordersData,
      totalRecords,
      isReloadData: params.isReloadData,
      statusOrder: params.status,
      currentPage: params.page,
      sizePage: params.size,
    }),
  );
  return responsesData;
}

async function requestCreateCart(dispatch, params, isQuickOrder) {
  dispatch(actions.showLoading());
  let urlRequest = REQUEST_COLLABORER_CREATE_CART;
  if (models.isRoleAgency()) {
    urlRequest = REQUEST_AGENCY_CREATE_CART;
  }
  console.log('params', params);
  let responsesData = await post(
    urlRequest,
    params,
    dispatch,
    'Lỗi khi lấy Tạo Giỏ hàng',
  );
  console.log('responsesData', responsesData?.data);
  if (isQuickOrder) {
    let cartId = responsesData?.data.cartId;
    console.log('cartId3', cartId);
    await requestPlaceOrder(dispatch, {cartId});
    await handleRequestOrder(dispatch, OrderStatusRequest.NEW);
  } else {
    handleRequestOrder(dispatch, OrderStatusRequest.DRAFT_CART);
  }
  await dispatch(actions.responseCreatedCart(true));
  return responsesData?.data;
}

export async function requestOrderDetail(dispatch, reservationId) {
  dispatch(actions.showLoading());
  let responses = await get(
    REQUEST_ORDER_DETAIL(reservationId),
    {},
    dispatch,
    'Lỗi khi lấy thông tin chi tiết đơn hàng',
  );
  return responses?.data;
}
export async function requestCartDetail(dispatch, cartId) {
  dispatch(actions.showLoading());
  let responses = await get(
    REQUEST_CART_DETAIL(cartId),
    {},
    dispatch,
    'Lỗi khi lấy thông tin chi tiết giỏ hàng',
  );

  return responses?.data;
}
export async function requestCancelCart(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_CANCEL_CART,
    params,
    dispatch,
    'Lỗi khi Huỷ giỏ hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Huỷ giỏ hàng thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}
export async function requestCancelOrder(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_CANCEL_ORDER,
    params,
    dispatch,
    'Lỗi khi huỷ đơn hang',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Huỷ đơn hàng thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}

export async function requestPlaceOrder(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_PLACE_ORDER,
    params,
    dispatch,
    'Lỗi khi thực hiện đặt hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Đặt hàng thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}

/**
 * Dai ly thuc hien dong ý don hang cua CTV da dat
 * Sau do lay lai danh sach don cho
 * @param {*} dispatch
 * @param {orderId} params
 */
export async function requestApproveOrder(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_APPROVE_ORDER,
    params,
    dispatch,
    'Lỗi khi thực hiện đồng ý đơn hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Thực hiện thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}
export async function requestCompletedOrder(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_COMPLETED_ORDER,
    params,
    dispatch,
    'Lỗi khi thực hiện hoàn tất đơn hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Thực hiện thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}

export async function requestRemoveSimFormCart(dispatch, params) {
  dispatch(actions.showLoading());
  let responses = await post(
    REQUEST_REMOVE_SIM(params.cartId),
    {simId: params.simId},
    dispatch,
    'Lỗi khi thực hiện bỏ SIM ra khỏi giỏ hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(`Thực hiện thành công.`, Toast.LONG, Toast.CENTER);
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}

export async function requestAddSimToCart(dispatch, params) {
  dispatch(actions.showLoading());
  let urlRequest = REQUEST_CTV_ADD_SIM;
  if (models.isRoleAgency()) {
    urlRequest = REQUEST_AGENCY_ADD_SIM;
  }
  let responses = await post(
    urlRequest,
    params,
    dispatch,
    'Lỗi khi thực hiện thêm SIM vào giỏ hàng',
  );
  if (isSuccess(responses?.status)) {
    Toast.showWithGravity(
      `Thực hiện thêm SIM vào giỏ hàng thành công.`,
      Toast.LONG,
      Toast.CENTER,
    );
    return true;
  }
  Toast.showWithGravity(`Có lỗi xảy ra.`, Toast.LONG, Toast.CENTER);
  return false;
}

export async function requestUploadImage(dispatch, formDataImgUpload) {
  try {
    return await post(
      UPLOAD_IMAGE,
      formDataImgUpload,
      dispatch,
      'Lỗi khi upload ảnh',
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          body: formDataImgUpload,
        },
      },
    );
  } catch (error) {}
}

export async function requestPreviewImage(dispatch, params) {
  dispatch(actions.showLoading());
  let res = await get(
    GET_LIST_IMAGE,
    {reservationId: params},
    dispatch,
    'Lỗi không lấy được danh sách image',
  );
  dispatch(actions.hideLoading());
  return res;
}

export default {
  requestMyOrderByStatus, // lay danh sach don hang theo trang thai
  requestOrderDetail, // chi tiet don hang
  requestCreateCart, // tao moi gio hang
  requestCartDetail, // chi tiet gio hang
  requestPlaceOrder, // dat hang
  requestCancelCart, //HUy gio hang
  requestCancelOrder, //DL huy don hang
  requestApproveOrder, // Dong ý nhan don hang
  requestCompletedOrder, // Hoan tat
  requestRemoveSimFormCart, // Hoan tat
  requestAddSimToCart, // Them sim vao gio hang
  requestUploadImage, //Upload image of order
  requestPreviewImage, // Download image
};

export const handleRequestOrder = async (dispatch, status) => {
  let params = {
    isReloadData: true,
    status: status,
    page: 0,
    size: Dimension.NUMBER_ITEM_PAGE_DEFAULT,
  };
  requestMyOrderByStatus(dispatch, params);
};
