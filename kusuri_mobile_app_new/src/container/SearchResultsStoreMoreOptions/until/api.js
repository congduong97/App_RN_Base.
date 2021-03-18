import { URL, DEVICE_ID, URLShop, APP_ID } from '../../../const/System';
import { fetchApiMethodGet } from '../../../service';
const getListTag = async () => await fetchApiMethodGet(`${URLShop}/tag/list`);
const getStoreByCityAndDistrictAndClosedTimeAndTagId= async(cityId,closeTime,districtId,listTags,memberCode,openTime,page,searchword,size)=> await fetchApiMethodGet(`${URLShop}/store/getStoreByCityAndDistrictAndCloseTimeAndTagId?cityId=${cityId}&closeTime=${closeTime}&districtId=${districtId}&listTags=${listTags}&memberCode=${memberCode}&openTime=${openTime}&page=${page}&searchword=${searchword}&size=${size}`)
const setBookmarked=async(memberCode,storeCode)=> await  fetchApiMethodGet(`${URLShop}/store/setBookmarked?appId=${APP_ID}&memberCode=${memberCode}&storeCode=${storeCode}`);
const getListCities = async (page, size) => await fetchApiMethodGet(`${URLShop}/address/city/listCities?page=${page}&size=${size}`);
const getListDistricts = async (cityId, page, size) => await fetchApiMethodGet(`${URLShop}/address/district/listDistricts?cityId=${cityId}&page=${page}&size=${size}`);
const getCataLogStore=async(storeId)=>fetchApiMethodGet(`${URLShop}/{appId}/catalog/getByStoreId?storeId=${storeId}`);
const getListOpenTime = async () => fetchApiMethodGet(`${URLShop}/time/listOpenTime`)
const getListClosedTime = async () => fetchApiMethodGet(`${URLShop}/time/listCloseTime`)
export const Api = {
    getListTag,
    getListCities,
    getListDistricts,
    getStoreByCityAndDistrictAndClosedTimeAndTagId,
    setBookmarked,
    getCataLogStore,
    getListOpenTime,
    getListClosedTime
  
};
