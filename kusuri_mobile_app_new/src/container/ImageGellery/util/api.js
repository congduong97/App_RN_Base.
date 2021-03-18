import { fetchApiMethodGetNotUseToken } from '../../../service';
import { URL } from '../../../const/System';

const getImageGellery = async (size, page) => await fetchApiMethodGetNotUseToken(`${URL}/imageGallery/list?page=${page}&size=${size}`);

export const Api = {
    getImageGellery
    
};
