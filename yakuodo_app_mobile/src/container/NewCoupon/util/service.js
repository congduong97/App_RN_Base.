// const listennerCouponAll = {};
// let listCoupon = [];
// let listDataListCouponSelect = [];

// function broadcastlistenercoupnall() {
//   Object.keys(listennerCouponAll).forEach(k => listennerCouponAll[k]());
// }
// export const ServiceCouponAll = {
//   get: () => listCoupon,
//   getCouponSelect: () => listDataListCouponSelect,
//   setListCouponAll: data => {
//     listCoupon = [...listCoupon, ...data];
//     broadcastlistenercoupnall();
//   },

//   setActiveButtonUseCoupon: data => {
//     listDataListCouponSelect.push(data);
//     broadcastlistenercoupnall();
//   },

//   setDataEmpty: data => {
//     listDataListCouponSelect = [];
//     broadcastlistenercoupnall();
//   },
//   removeActiveButtonUseCoupon: data => {
//     for (let i = 0; i < listDataListCouponSelect.length; i++) {
//       if (listDataListCouponSelect[i].id === data.id) {
//         listDataListCouponSelect.splice(i, 1);
//       }
//     }
//     broadcastlistenercoupnall();
//   },

//   onChangeListSelectedCoupon: (key, cb) => {
//     listennerCouponAll[key] = () => cb(listDataListCouponSelect);
//   },

//   onChange: (key, cb) => {
//     listennerCouponAll[key] = () => cb(listCoupon);
//   },

//   unChange: key => {
//     if (listennerCouponAll[key]) {
//       delete listennerCouponAll[key];
//     }
//   },
// };

// const listennerCouponSelectUse = {};
// let dataCouponSlect = [];
// function broadcastlistenercoupondeletecouponuse() {
//   Object.keys(listennerCouponSelectUse).forEach(k =>
//     listennerCouponSelectUse[k](),
//   );
// }
// export const ServiceDeleteCouponWhenUse = {
//   get: () => dataCouponSlect,
//   set: data => {
//     dataCouponSlect = data;
//     broadcastlistenercoupondeletecouponuse();
//   },
//   onChange: (key, cb) => {
//     listennerCouponSelectUse[key] = () => cb(dataCouponSlect);
//   },

//   unChange: key => {
//     if (listennerCouponSelectUse[key]) {
//       delete listennerCouponSelectUse[key];
//     }
//   },
// };

export function countIime(time, selected) {
  const minutes = 1000 * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;

  const d = new Date();
  const t = new Date(time).getTime() - d.getTime();
  let y;

  if (selected === 'days') {
    y = Math.round(t / days);
  } else {
    y = Math.round(t / minutes);
  }
  return y;
}
