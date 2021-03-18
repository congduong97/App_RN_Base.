let listCouponSelect = [];
let callBackReloadCoupon = [];
let listCouponUse = [];
let listCallbackCouponChange = [];
let callBackButtonCouponScreen;
let callBackSelectScreen;
let reloadCouponScreen;
let listReloadListCoupon = {};

let configCoupon = {};
let listCoupon = [];
let isAddPlusCoupon = false;

function updateCouponChange(idCoupon) {
  listCallbackCouponChange.forEach(item => {
    if (item.idCoupon === idCoupon) {
      item.callBack();
    }
  });
  callBackButtonCouponScreen();
}

function reloadCouponsUse(coupons) {
  coupons.forEach(coupon => {
    listCouponUse.forEach(item => {
      if (item.idCoupon === coupon.id) {
        item.callBack();
      }
    });
  });
}

export const couponService = {
  getIsAddPlusCoupon: () => {
    return isAddPlusCoupon;
  },
  setIsAddPlusCoupon: boolen => {
    isAddPlusCoupon = boolen;
  },
  setConfig: config => {
    configCoupon = {
      limitTime: config.limitTime,
      note: config.note
    };
  },

  getConfig: () => {
    return configCoupon;
  },
  setCoupon: (coupons, time) => {
    listCoupon = [...coupons];
    if (time == 1) {
      reloadCouponScreen();
    } else {
      //reload all tab of coupon screen
      Object.keys(listReloadListCoupon).forEach(key => {
        listReloadListCoupon[key]();
      });
    }
  },

  useCoupon: coupons => {
    // listCouponSelect = [];
    coupons.forEach(coupon => {
      //remove used item in list selected coupon
      const couponSelectedIndex = listCouponSelect.findIndex(
        item => item.id === coupon.id
      );
      if (couponSelectedIndex > -1) {
        listCouponSelect.splice(couponSelectedIndex, 1);
      }

      updateCouponChange(coupon.id);
      let indexCouponChange = listCoupon.findIndex(
        item => item.id === coupon.id
      );
      if (listCoupon[indexCouponChange].usagePolicy === "COUNTLESS_TIME") {
        listCoupon[indexCouponChange].usedCountlessTime = true;
      }
      listCoupon[indexCouponChange].countDownStart = new Date();
      listCoupon[indexCouponChange].countDown = configCoupon.limitTime * 60000;
    });
    reloadCouponsUse(coupons);
  },
  //list coupon selected
  getListCoupon: () => {
    return listCouponSelect;
  },
  clearListCoupon: () => {
    listCoupon = [];
  },
  clearCouponSelected: () => {
    listCouponSelect = [];
  },
  addCoupon: coupon => {
    listCouponSelect.push(coupon);
    updateCouponChange(coupon.id);
  },

  removeCoupon: (coupon, from = "") => {
    listCouponSelect = listCouponSelect.filter(item => item.id !== coupon.id);
    updateCouponChange(coupon.id);
    if (from === "select") {
      callBackSelectScreen();
    }
  },
  /**
   * type: categoryId
   */
  getCoupon: type => {
    if (type === "all") return listCoupon;
    else {
      //only normal coupon can display by category
      return listCoupon.filter(item => item.categoryId == type);
    }
  },

  regisCouponUse: (idCoupon, callBack) => {
    listCouponUse.push({ idCoupon, callBack });
  },
  //
  regisCouponChange: (idCoupon, callBack) => {
    listCallbackCouponChange.push({ idCoupon, callBack });
  },
  regisButtonCouponScreen: callBack => {
    callBackButtonCouponScreen = callBack;
  },
  regisSelectScreen: callBack => {
    callBackSelectScreen = callBack;
  },
  registerReloadCouponScreen: cb => {
    reloadCouponScreen = cb;
  },
  registerReloadListCoupon: (cb, type) => {
    listReloadListCoupon[type] = cb;
  },
  removeExpiredCoupon: couponIds => {
    if (couponIds && Array.isArray(couponIds) && couponIds.length > 0) {
      const ids = couponIds.map(id => parseInt(id, 10));
      //remove selected item
      if (listCouponSelect && Array.isArray(listCouponSelect)) {
        listCouponSelect = listCouponSelect.filter(item => {
          //remove expired coupon in listCouponSelect
          if (ids.includes(parseInt(item.id, 10))) {
            return false;
          }
          return true;
        });
      }
      if (listCoupon && Array.isArray(listCoupon)) {
        listCoupon = listCoupon.filter(item => {
          //remove expired coupon in listCoupon
          if (ids.includes(parseInt(item.id, 10))) {
            return false;
          }
          return true;
        });
      }

      Object.keys(listReloadListCoupon).forEach(key => {
        listReloadListCoupon[key]();
      });
    }
  }
};
//when api coupon add poin call success
let menuCouponAddPointHasNewListener = {};

export const MenuCouponAddPointHasNew = {
  set: () => {
    Object.keys(menuCouponAddPointHasNewListener).forEach(k =>
      menuCouponAddPointHasNewListener[k]()
    );
  },
  onChange: (key, cb) => {
    menuCouponAddPointHasNewListener[key] = () => cb();
  }
};
