const listennerCouponUser = {};
let data = {};
let listDataUseCoupon = [];

function broadcastList() {
  Object.keys(listennerCouponUser).forEach(k => listennerCouponSlectUse[k]());
}
export const CouponSelectService = {
  get: () => data,
  getList: () => listDataUseCoupon,
  set: newData => {
    data = newData;
    if (newData.isSelectCoupon && findIndex(newData) < 0) {
      listDataUseCoupon.push(newData);
    }
    if (!newData.isSelectCoupon && findIndex(newData) > -1) {
      listDataUseCoupon.splice(findIndex, 1);
    }
    broadcastList();
  },

  onChange: (key, cb) => {
    listennerCouponSlectUse[key] = () => cb(data, listDataUseCoupon);
  },

  unChange: key => {
    if (listennerCouponSlectUse[key]) {
      delete listennerCouponSlectUse[key];
    }
  },
};
