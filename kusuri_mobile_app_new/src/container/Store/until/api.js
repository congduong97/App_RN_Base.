import { URL, DEVICE_ID, URLShop, APP_ID } from "../../../const/System";
import { fetchApiMethodGet } from "../../../service";
const getsearchStoreNearest = async (latitude, longitude, memberCode) =>
  await fetchApiMethodGet(
    `${URLShop}/store/searchStoreNearest?latitude=${latitude}&longitude=${longitude}&memberCode=${memberCode}`
  );
const getListCities = async (page, size) =>
  await fetchApiMethodGet(
    `${URLShop}/address/city/listCities?page=${page}&size=${size}`
  );
const getListDistricts = async (cityId, page, size) =>
  await fetchApiMethodGet(
    `${URLShop}/address/district/listDistricts?cityId=${cityId}&page=${page}&size=${size}`
  );
// const getStoreByNameOrAddress = async (memberCode, page, searchword, size) => await fetchApiMethodGet(`${URLShop}/store/getStoreByNameOrAddress?{memberCode=${memberCode}?memberCode=${memberCode} :''}&page=${page}&{searchword=${searchword}?searchword=${searchword}:''}&size=${size}`)
const getStoreByNameOrAddress = async (memberCode, page, searchword, size) =>
  await fetchApiMethodGet(
    `${URLShop}/store/getStoreByNameOrAddress?memberCode=${memberCode}&page=${page}&searchword=${searchword}&size=${size}`
  );
// const getStoreByCityAndDistrictAndClosedTimeAndTagId = async (cityId, closedTime, districtId, listTags, memberCode, openTime, page, searchWord, size) => await fetchApiMethodGet(`${URLShop}/store/getStoreByCityAndDistrictAndCloseTimeAndTagId?{cityId=${cityId}?cityId=${cityId}:''}&{closeTime=${closedTime}?closeTime=${closedTime}:''}&{districtId=${districtId}?districtId=${districtId}:''}&{listTags=${listTags}?listTags=${listTags}:''}&{memberCode=${memberCode}?memberCode=${memberCode}:''}&{openTime=${openTime}?openTime=${openTime}:''}&page=${page}&{searchword=${searchWord}?searchword=${searchWord}:}&size=${size}`)
const getStoreByCityAndDistrictAndClosedTimeAndTagId = async (
  cityId,
  closeTime,
  districtId,
  listTags,
  memberCode,
  openTime,
  page,
  searchword,
  size
) =>
  await fetchApiMethodGet(
    `${URLShop}/store/getStoreByCityAndDistrictAndCloseTimeAndTagId?cityId=${cityId}&closeTime=${closeTime}&districtId=${districtId}&listTags=${listTags}&memberCode=${memberCode}&openTime=${openTime}&page=${page}&searchword=${searchword}&size=${size}`
  );
const getListStoreBookmarked = async memberCode =>
  await fetchApiMethodGet(
    `${URLShop}/store/getListStoreBookmarked?memberCode=${memberCode}`
  );
const setBookmarked = async (memberCode, storeCode) =>
  await fetchApiMethodGet(
    `${URLShop}/store/setBookmarked?appId=${APP_ID}&memberCode=${memberCode}&storeCode=${storeCode}`
  );
const getDetailStore = async (memberCode, storeCode) =>
  await fetchApiMethodGet(
    `${URLShop}/store/getDetailStore?memberCode=${memberCode}&storeCode=${storeCode}`
  );

const getListTag = async () => await fetchApiMethodGet(`${URLShop}/tag/list`);
const getListOpenTime = async () =>
  fetchApiMethodGet(`${URLShop}/time/listOpenTime`);
const getListClosedTime = async () =>
  fetchApiMethodGet(`${URLShop}/time/listCloseTime`);

const getCataLogStore = async storeId =>
  fetchApiMethodGet(
    `${URLShop}/{appId}/catalog/getByStoreId?storeId=${storeId}`
  );

const checkHasCatalog = async () =>
  await fetchApiMethodGet(`${URLShop}/store/hasStoreCatalog`);

export const Api = {
  checkHasCatalog,
  getsearchStoreNearest,
  getListCities,
  getListDistricts,
  getStoreByNameOrAddress,
  getStoreByCityAndDistrictAndClosedTimeAndTagId,
  getListStoreBookmarked,
  setBookmarked,
  getDetailStore,
  getListOpenTime,
  getListClosedTime,
  getCataLogStore,
  getListTag
};
