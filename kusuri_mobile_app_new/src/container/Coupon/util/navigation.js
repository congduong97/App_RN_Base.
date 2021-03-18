import CouponAddPointScreen from "../screen/CouponAddPointScreen";
import CouponScreen from "../screen/CouponScreen";
import DetailCoupon from "../screen/DetailCoupon";
import CouponsSelect from "../screen/CouponsSelect";

export const CouponStack = {
  NEW_COUPON: {
    screen: CouponScreen,
  },
  GET_S_COUPON: {
    screen: CouponAddPointScreen,
  },
  DetailCoupon: {
    screen: DetailCoupon,
  },
};

export const CouponNoBottomStack = {
  CouponsSelect: {
    screen: CouponsSelect,
  },
};
