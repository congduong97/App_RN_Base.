const changeList = {};
const changeListCouponExpired = {};
let data = {};
let couponExpired = {};
let couponExpiredArr = [];

function broadcastList() {
  Object.keys(changeList).forEach((k) => changeList[k]());
}
function broadcastListCouponExpired() {
  Object.keys(changeListCouponExpired).forEach((k) =>
    changeListCouponExpired[k](),
  );
}

const CouponService = {
  get: () => data,
  getListCouponExpired: () => couponExpiredArr,

  set: (coupon) => {
    data = {...coupon};
    broadcastList();
  },

  onChangeCoupon: (key, cb) => {
    changeList[key] = () => cb(data);
  },

  deleteKey: (key) => {
    if (changeList[key]) {
      delete changeList[key];
    }
  },

  setCouponExpired: (coupon) => {
    if (coupon.code !== couponExpired.code) {
      couponExpired = {...coupon};
      couponExpiredArr.unshift(coupon);
      broadcastListCouponExpired();
    }
  },

  onChangeCouponExpired: (key, cb) => {
    changeListCouponExpired[key] = () => cb(couponExpired);
  },

  deleteKeyCouponExpired: (key) => {
    if (changeListCouponExpired[key]) {
      delete changeListCouponExpired[key];
    }
  },
};

export {CouponService};
