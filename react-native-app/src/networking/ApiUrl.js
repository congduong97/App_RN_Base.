import {Dimension} from '../commons/constants';
export const BASE_URL = 'http://192.168.2.100:6500';
export const IMAGE_BASE_URL = 'http://192.168.2.100:6500';

// export const BASE_URL = 'http://simthanhdat.vn/';
// export const IMAGE_BASE_URL = 'http://simthanhdat.vn/';

export const SIGN_IN = 'oauth/token';
export const SIGN_UP = 'api/affiliate/register';
export const REQUEST_PROFILE_USER = 'api/me';
export const REQUEST_CHANGE_PASSWORD = 'api/change-password';
export const GET_SIM_CATEGORIES = 'api/public/category';
export const GET_PROVINCES = 'api/province';
export const GET_DISTRICTS = 'api/district/all';
export const GET_WARDS = 'api/ward/all';
export const UPLOAD_IMAGE = 'api/file-collection/upload/image/sim/owner'; //upload image
export const GET_LIST_IMAGE = 'api/file-collection'; // get list image
export const VIEW_IMAGE = 'api/files/public/image'; // preview image
///////
export const REQUEST_SIM_SEARCH_MOBILE = 'api/public/mobile/search';
export const REQUEST_SIM_FENGSHUI = 'api/web/search-theo-menh'; ///tim sim theo menh
export const REQUEST_SIM_SEARCH_NONE_AUTHENT = 'api/web/search';
export const REQUEST_SIM_SEARCH_AUTHENT = 'api/search';
export const REQUEST_SIM_FENG_SHUI_SEARCH = 'api/web/search-theo-menh';
export const REQUEST_SIM_AGENCY_SEARCH = 'agency/my-sims';
/////////Order
export const REQUEST_MY_ORDER_BY_STATUS = `api/agency/orders`;
export const REQUEST_AGENCY_ADD_SIM = 'api/customer/add-to-cart'; //DL Them sim vao cart
export const REQUEST_CTV_ADD_SIM = 'api/affiliate/add-to-cart'; //CTV Them sim vao cart
/////
export const REQUEST_DRAFT_CARTS = 'api/affiliate/draft-carts'; // lay danh sach gio hang
export const REQUEST_AGENCY_CREATE_CART = 'api/customer/new-cart'; // Dai lý tao
export const REQUEST_COLLABORER_CREATE_CART = 'api/affiliate/new-cart'; // CTV tao
export const REQUEST_ORDER_DETAIL = (reservationId) =>
  `api/reservation/${reservationId}`; // CTV tao
export const REQUEST_CART_DETAIL = (cartId) => `api/affiliate/cart/${cartId}`; // CTV tao
export const REQUEST_CANCEL_CART = `api/affiliate/cancel-cart`; // Xoa gio hang
export const REQUEST_CANCEL_ORDER = `api/agency/cancel-order`; //Dai ly Huy Dat hang
export const REQUEST_PLACE_ORDER = `api/affiliate/place-order`; // Dat hang
export const REQUEST_APPROVE_ORDER = `api/agency/approve-order`; //Dai ly Đồng ý đon hàng
export const REQUEST_COMPLETED_ORDER = `api/affiliate/pay-cart`; //Hoan tat
export const REQUEST_REMOVE_SIM = (cartId) =>
  `api/affiliate/cart/${cartId}/remove-sim`; //Bo sim ra khoi gio hang
/////

export const REQUEST_NOTIFICAITONS = 'api/notification/getNotifications'; //
export const REQUEST_READ_ALL_NOTIFI = 'api/notification/readAll'; //
export const REQUEST_CHANGE_STATUS_NOTIFI = (params) =>
  `api/notification/changeStatus?id= ${params.id}&status=${params.status}`; //
