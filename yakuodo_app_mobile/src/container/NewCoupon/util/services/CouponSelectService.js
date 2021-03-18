const listennerCouponSlectUse = {};

const listennerUseCoupon = {};

let data = {};
let checkCoupon = {};
let listDataUseCoupon = [];
let listDataUseCouponSlect = [];
const findIndex = data =>
  listDataUseCoupon.findIndex(item => {
    return item.id === data.id;
  });

function broadcastList() {
  Object.keys(listennerCouponSlectUse).forEach(k =>
    listennerCouponSlectUse[k](),
  );
}

function broadcastUseCoupon() {
  Object.keys(listennerUseCoupon).forEach(k => listennerUseCoupon[k]());
}
export const CouponSelectService = {
  get: () => data,
  getList: () => listDataUseCoupon,
  // getCheck: () => checkCoupon,
  set: newData => {
    data = newData;
    const couponUseIndex = findIndex(newData);
    //remove all selected coupon
    if (newData.usedInScreen === 'ItemDetailCoupon') {
      console.log('oeee');
      listDataUseCoupon = [];
      broadcastList();
      return;
    }
    if (newData.isSelectCoupon && couponUseIndex < 0) {
      listDataUseCoupon.push(newData);
    } else if (!newData.isSelectCoupon && couponUseIndex > -1) {
      listDataUseCoupon.splice(couponUseIndex, 1);
    } else if (newData.useCoupon) {
      listDataUseCoupon = [];
    }
    broadcastList();
  },
  setCouponUse: newData => {
    listDataUseCouponSlect = [...newData];
    // checkCoupon = newData;
    broadcastUseCoupon();
  },

  onChangeUseCoupon: (key, cb) => {
    listennerUseCoupon[key] = () => cb(listDataUseCouponSlect);
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
