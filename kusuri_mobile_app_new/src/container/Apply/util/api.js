import { URL_DOMAIN, URL, DEVICE_ID } from '../../../const/System';
import { fetchApiMethodGet } from '../../../service';
const getAddressFromZipCode = async (zipCode) => {
    const response = await fetch(`${URL_DOMAIN}/getAddressFromZipCode?zip=${zipCode}`, {
        method: 'POST',
    });
    if (!response.url.includes(URL_DOMAIN)) {
        return { res, code: 500 };
    }

    // let responseGetAddressFromZipCode= ;
    const res = response.status === 200 ? await response.json() : response;
    return { res, code: response.status };
};
const getConfigFieldsApply = async (bannerId) => {
    return (await fetchApiMethodGet(`${URL}/bannerImage/getConfigFieldsApply/${bannerId}`));
}
const getApplyBanner = async (bannerId) => {
    return (await fetchApiMethodGet(`${URL}/bannerImage/applyBanner/${bannerId}`));
    

}
export const information = {
    name: '',
    gender: '',
    birthday: '',
    ipCode: '',
    city: '',
    district: '',
    homeAddress: '',
    phoneNumber: '',
    email: ''
}
const getSubmitApplyBanner = async(bannerId, information) => {
    return( await fetchApiMethodGet(`${URL}bannerImage/submitApplyBanner?bannerId=${bannerId}&deviceId=${DEVICE_ID}${information.name ?`&name=${information.name}`:''}${information.gender?`&gender=${information.gender}`:''}${information.birthday ? `&birthday=${information.birthday}` : ''}${information.zipCode ? `&zipCode=${information.zipCode}` : ''}${information.city ? ` &city=${information.city}` : ''}${information.district ? `&district=${information.district}` : ''}${information.homeAddress ? `&homeAddress=${information.homeAddress}` : ''}${information.phoneNumber ? `&phoneNumber=${information.phoneNumber}` : ''}${information.email ? `&email=${information.email}` : ''}`));
}
export const Api = {
    getConfigFieldsApply,
    getAddressFromZipCode,
    getApplyBanner,
    getSubmitApplyBanner

};
