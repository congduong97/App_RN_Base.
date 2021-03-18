import {Icon, Color} from '../commons/constants';

export const NotifiType = {
  don_moi: 'don_moi',
  don_dong_y: 'don_dong_y',
  don_huy: 'don_huy',
  don_hoan_tat: 'don_hoan_tat',
};

export const RoleUser = {
  Admin: {
    id: 1,
    code: 'ROLE_ADMIN',
    name: 'Quản trị viên',
    shortName: 'QTV',
  },
  Collaborator: {
    id: 2,
    code: 'ROLE_AFFILIATE',
    name: 'Cộng tác viên',
    shortName: 'CTV',
  },
  Agency: {
    id: 3,
    code: 'ROLE_AGENCY',
    name: 'Đại lý',
    shortName: 'ĐL',
  },
  Guest: {
    id: 4,
    code: 'GUEST',
    name: 'Khách',
    shortName: 'Khách',
  },
};

export const SourceOrder = {
  Affiliate: {id: 1, code: 'affiliate', name: 'CTV'},
  Website: {id: 1, code: 'website', name: 'Website'},
  Unknown: {id: 1, code: 'unknown', name: 'Khác'},
};

export const RequiredSources = {
  website: 'Website',
  affiliate: 'CTV',
  unknown: 'Ngoài hệ thống',
};

export const FirstNumbersTelco = ['03', '05', '07', '08', '09'];
export const NotContainNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const TelcoIcon = {
  1: Icon.viettel,
  2: Icon.vinaphone,
  3: Icon.mobi,
  4: Icon.vietnammobile,
};

export const PaymentPackage = {
  TT: 'Trả trước',
  TS: 'Trả sau',
  KIT: 'KIT',
};

export const PaymentPackagesPicker = [
  {
    id: null,
    name: 'Tất Cả',
  },
  {
    id: 'TT',
    name: 'Trả trước',
  },
  {
    id: 'TS',
    name: 'Trả sau',
  },
  {
    id: 'KIT',
    name: 'KIT',
  },
];

export const ColorsImgeSim = [
  'Blue',
  'Red',
  'Green',
  'Black',
  'Brown',
  'Teal',
  'Silver',
  'Purple',
  'Gray',
  'Orange',
  'White',
];

export const PriceFromData = [
  {id: 1, value: null, name: 'Tất cả'},
  {id: 2, value: 0, name: '0'},
  {id: 3, value: 500000, name: '500K'},
  {id: 4, value: 1000000, name: '1 Triệu'},
  {id: 5, value: 3000000, name: '3 Triệu'},
  {id: 6, value: 5000000, name: '5 Triệu'},
  {id: 7, value: 10000000, name: '10 Triệu'},
  {id: 8, value: 20000000, name: '20 Triệu'},
  {id: 9, value: 50000000, name: '50 Triệu'},
  {id: 10, value: 80000000, name: '80 Triệu'},
  {id: 11, value: 100000000, name: '100 Triệu'},
  {id: 12, value: 200000000, name: '200 Triệu'},
  {id: 13, value: 300000000, name: '300 Triệu'},
  {id: 14, value: 500000000, name: '500 Triệu'},
];

export const PriceToData = [
  {id: 1, value: null, name: 'Tất cả'},
  {id: 2, value: 500000, name: '500K'},
  {id: 3, value: 1000000, name: '1 Triệu'},
  {id: 4, value: 3000000, name: '3 Triệu'},
  {id: 5, value: 5000000, name: '5 Triệu'},
  {id: 6, value: 10000000, name: '10 Triệu'},
  {id: 7, value: 20000000, name: '20 Triệu'},
  {id: 8, value: 50000000, name: '50 Triệu'},
  {id: 9, value: 80000000, name: '80 Triệu'},
  {id: 10, value: 100000000, name: '100 Triệu'},
  {id: 11, value: 200000000, name: '200 Triệu'},
  {id: 12, value: 300000000, name: '300 Triệu'},
  {id: 13, value: 500000000, name: '500 Triệu'},
  {id: 14, value: 1000000000, name: '1 Tỉ'},
];

const PriceRange = [
  {id: 1, name: '< 500 nghìn', priceFrom: 0, priceTo: 500000},
  {id: 2, name: '500 - 1 triệu', priceFrom: 500000, priceTo: 1000000},
  {id: 3, name: '1 - 3 triệu', priceFrom: 1000000, priceTo: 3000000},
  {id: 4, name: '3 - 5 triệu', priceFrom: 3000000, priceTo: 5000000},
  {id: 5, name: '5 - 10 triệu', priceFrom: 5000000, priceTo: 1.0e7},
  {id: 6, name: '10 - 20 triệu', priceFrom: 1.0e7, priceTo: 2.0e7},
  {id: 7, name: '20 - 50 triệu', priceFrom: 2.0e7, priceTo: 5.0e7},
  {id: 8, name: '50 - 100 triệu', priceFrom: 5.0e7, priceTo: 1.0e8},
  {id: 9, name: '> 100 triệu', priceFrom: 1.0e8, priceTo: 1.0e9},
];

export const OrderStatusRequest = {
  DRAFT_CART: 'processing',
  NEW: 'new',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export const ApprovalStatus = {
  active: 'active',
  sold: 'sold',
  cancelled: 'cancelled',
  processing: 'processing',
};

export const CodeStatusOrder = {
  processing: 1,
  waitting: 2,
  waitDone: 3,
  done: 4,
  canceled: 4,
};

/////////// Thong tin trang thai gio hang
export const CartStatus = {
  waitOrder: {
    statusCode: 'waitOrder',
    statusName: 'Chờ đặt hàng',
    statusColor: Color.waitOrder,
  },
  processing: {
    statusCode: 'processing',
    statusName: 'Chờ phản hồi',
    statusColor: Color.cartProcessing,
  },
  waitApproval: {
    statusCode: 'waitApproval',
    statusName: 'Chờ duyệt',
    statusColor: Color.cartProcessing,
  },
  waitDone: {
    statusCode: 'waitDone',
    statusName: 'Chờ hoàn tất',
    statusColor: Color.cartWaitDone,
  },
  done: {
    statusCode: 'done',
    statusName: 'Đã hoàn thành',
    statusColor: Color.cartDone,
  },

  cancelled: {
    statusCode: 'cancelled',
    statusName: 'Đã huỷ',
    statusColor: Color.cartCanceled,
  },
  unknown: {
    statusCode: 'unknown',
    statusName: 'Không Xác định',
    statusColor: Color.colorText,
  },
};

export const configCartStatus = (status, orderStatus, typeStatus) => {
  if (typeStatus === OrderStatusRequest.DONE) {
    return CartStatus.done;
  } else if (typeStatus === OrderStatusRequest.CANCELLED) {
    return CartStatus.cancelled;
  } else {
    switch (status) {
      case CartStatus.processing.statusCode: {
        if (!orderStatus || orderStatus === OrdersStatus.new) {
          return CartStatus.waitOrder;
        } else if (orderStatus === OrdersStatus.placed) {
          return CartStatus.waitApproval;
        } else if (orderStatus === OrdersStatus.readyToPay) {
          return CartStatus.waitDone;
        }
        return CartStatus.processing;
      }
      case CartStatus.done.statusCode: {
        return CartStatus.done;
      }
      case CartStatus.cancelled.statusCode: {
        return CartStatus.cancelled;
      }
      default: {
        return CartStatus.unknown;
      }
    }
  }
};

export const OrdersStatus = {
  new: 'new',
  readyToPay: 'readyToPay',
  placed: 'placed',
  cancelled: 'cancelled',
};

/////////// Thong tin trang thai don hang

/// Dai ly tra loi ve viec giu sim
export const AgencyResponse = {
  // tuong duong voi truong agencyResponse
  returnMoney: {id: -2, code: 'returnMoney'},
  notAvailable: {id: -1, code: 'simNotAvailable'},
  notYet: {id: 0, code: 'new'},
  ok: {id: 1, code: 'ok'},
};

////Trang thai giu sim
export const SimHoldStatus = {
  // Tuong duong voi truong statusText và status
  canceled: {id: -1, name: 'canceled'}, // đã huy
  active: {id: 0, name: 'active'}, //Kha thi
  expired: {id: 1, name: 'expired'}, // dã het han
  sold: {id: 2, name: 'sold'}, // Da ban
};
// Trang thai gui lenh dat hang
export const CommandSubmitStatus = {
  // tipmg dipmg voi truong OrderStatus
  cancelled: {id: -1, name: 'CTV Huỷ'},
  new: {id: 0, name: 'Vừa tạo mới'},
  placed: {id: 1, name: 'CTV đặt hàng'},
  agencyCancelled: {id: -2, name: 'Đại lý huỷ'},
};

export const OrderStatusObject = {
  holding: {
    statusCode: 'holding',
    statusName: 'Đang giữ',
    statusColor: Color.holdingOrder,
  },
  processing: {
    statusCode: 'processing',
    statusName: 'Chờ phản hồi',
    statusColor: Color.processingOrder,
  },
  waitApproval: {
    statusCode: 'waitApproval',
    statusName: 'Chờ duyệt',
    statusColor: Color.processingOrder,
  },
  waitDone: {
    statusCode: 'waitDone',
    statusName: 'Chờ hoàn tất',
    statusColor: Color.cartWaitDone,
  },
  done: {
    statusCode: 'done',
    statusName: 'Đã hoàn thành',
    statusColor: Color.doneOrder,
  },

  cancelled: {
    statusCode: 'cancelled',
    statusName: 'CTV huỷ',
    statusColor: Color.CTVCanceled,
  },

  agencyCancelled: {
    statusCode: 'agencyCancelled',
    statusName: 'Đại lý huỷ',
    statusColor: Color.agencyCanceled,
  },

  expired: {
    statusCode: '∫',
    statusName: 'Đã hết hạn',
    statusColor: Color.CTVCanceled,
  },

  unknown: {
    statusCode: 'unknown',
    statusName: 'Không Xác định',
    statusColor: Color.colorText,
  },
};

export const configOrderStatus = (status, agencyResponse, orderStatus) => {
  switch (status) {
    case SimHoldStatus.active.id: {
      if (agencyResponse === AgencyResponse.ok.code) {
        return OrderStatusObject.waitDone;
      } else if (agencyResponse === AgencyResponse.notYet.code) {
        if (orderStatus === CommandSubmitStatus.new.id) {
          return OrderStatusObject.holding;
        }
        return OrderStatusObject.waitApproval;
      }
      return OrderStatusObject.processing;
    }
    case SimHoldStatus.sold.id: {
      return OrderStatusObject.done;
    }

    case SimHoldStatus.canceled.id: {
      if (
        agencyResponse === AgencyResponse.notYet.code ||
        agencyResponse === AgencyResponse.ok.code
      ) {
        return OrderStatusObject.cancelled;
      }
      return OrderStatusObject.agencyCancelled;
    }
    case SimHoldStatus.expired.id: {
      return OrderStatusObject.expired;
    }
    default: {
      return OrderStatusObject.unknown;
    }
  }
};
